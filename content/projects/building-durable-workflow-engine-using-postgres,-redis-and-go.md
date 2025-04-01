---
title: "Building Durable Workflow Engine Using Postgres, Redis and Go"
date: 2025-01-02
draft: true
---

Let's be real - most background job systems are garbage. They work fine until your server hiccups, then poof! Your jobs vanish into the void and you're left wondering why half your data is missing. After the third time I woke up at 3 AM to fix my competitor monitoring tool because some critical scraper job had silently died, I decided enough was enough.

So I built Byrd - a workflow engine that actually survives crashes, tells you what the hell happened, and doesn't make me want to throw my laptop out the window. Here's how I did it with Go, PostgreSQL, and Redis.

## The Problem: Everything Is On Fire

My side project is a competitor monitoring tool (think Visual Ping on steroids). It checks competitors' websites, tracks changes, and generates reports. Pretty straightforward stuff.

My first implementation was classic: cron jobs, some scripts, and a prayer. It was fine until:

- Server restarts would nuke in-progress jobs
- I'd have zero visibility into what completed and what didn't
- Data would end up in these weird half-processed states
- Every new job type meant copy-pasting boilerplate garbage

After one particularly rage-inducing debugging session (spoiler: a server update took down all my scrapers and I didn't notice for TWO DAYS), I cracked open a Red Bull and decided to fix this properly.

## My Tech Stack (And Why It's Not Overkill)

I went with three core technologies:

**Go** because it's freaking amazing for concurrency. Goroutines and channels are exactly what you want when you're juggling a bunch of scrapers and analyzers. Plus, the standard library doesn't make me want to gouge my eyes out.

**PostgreSQL** because when my jobs absolutely cannot disappear, I want a database that takes data integrity as seriously as I take gaming hardware. Postgres doesn't play around.

**Redis** for the speed-critical stuff. Postgres is great but sometimes you need that in-memory goodness for things that need to be blazing fast.

## The Architecture: Surprisingly Not Complicated

I split the system into a few key components that work together:

### The Workflow Service (The Brain)

This guy knows about different types of jobs and routes them to the right place:

```go
func (ws *workflowService) Submit(ctx context.Context, workflowType models.WorkflowType) (uuid.UUID, error) {
    if !ws.live.Load() {
        return uuid.Nil, errors.New("service is not live")
    }

    exc, ok := ws.executors.Load(workflowType)
    if !ok {
        return uuid.Nil, errors.New("executor not found")
    }

    jobID, err := exc.(executor.WorkflowObserver).Submit(ctx)
    if err != nil {
        return uuid.Nil, err
    }

    return jobID, nil
}
```

Nothing fancy, but it gets the job done. Each workflow type gets registered here, and this service makes sure jobs go to the right place.

### Workflow Observers (The Watchers)

Each workflow type gets its own observer that tracks what's happening:

```go
func (e *workflowObserver) executeJob(executionContext context.Context, jobContext *models.JobContext) {
    jobUpdateCh, jobErrorCh := e.jobExecutor.Execute(executionContext, jobContext.JobState)

    for {
        select {
        case <-executionContext.Done():
            e.handleJobCancellation(jobContext)
            return
        case jobUpdate, ok := <-jobUpdateCh:
            if !ok {
                e.handleJobCompletion(executionContext, jobContext)
                return
            }
            e.handleJobUpdate(executionContext, jobContext, jobUpdate)
        case jobError, ok := <-jobErrorCh:
            if !ok {
                e.handleJobCompletion(executionContext, jobContext)
                return
            }
            e.handleJobError(jobContext, &jobError)
        }
    }
}
```

This pattern is insanely useful - the observer doesn't care about the implementation details, it just watches for updates and errors, then handles them appropriately.

### Specialized Executors (The Workers)

I created different executors for different jobs:

- **Page Executor**: Scrapes websites and updates the database
- **Report Executor**: Crunches data and generates competitor reports
- **Dispatch Executor**: Sends notifications when important stuff changes

Each one knows how to do exactly one thing well, which makes the code way cleaner than some monolithic mess.

### The Scheduler (Because Time Is A Thing)

For regular checks, I needed a solid scheduler. I built one on top of the robfig/cron library:

```go
func (s *scheduler) Schedule(cmd func(), opts ScheduleOptions) (*models.ScheduledFunc, error) {
    id := models.NewScheduleID()
    wrappedCmd := s.wrapCommand(id, cmd, opts.Hooks...)

    entryID, err := s.cron.AddFunc(opts.ScheduleSpec, wrappedCmd)
    if err != nil {
        return nil, fmt.Errorf("failed to schedule function: %w", err)
    }

    // Store state and metadata
    entry := s.cron.Entry(entryID)
    scheduledFunc := models.ScheduledFunc{
        ID:      id,
        Spec:    opts.ScheduleSpec,
        State:   models.ActiveFuncState,
        EntryID: entryID,
        NextRun: entry.Next,
    }

    s.schedules.Store(id, &scheduledFunc)
    return &scheduledFunc, nil
}
```

Nothing groundbreaking, but it reliably triggers workflows based on cron expressions and keeps track of execution history.

## The Actually Cool Part: Not Losing Your Work

Here's where things get interesting. The whole point of this exercise was to build something that doesn't lose work when things go wrong. I tackled this with two key patterns:

### Checkpointing (AKA Breadcrumbs)

As jobs run, they drop checkpoints saying exactly how far they've gotten:

```go
updates <- models.JobUpdate{
    Time:      time.Now(),
    Completed: int64(maxIndex + 1),
    Failed:    int64(len(workspaceBatch) - (maxIndex + 1)),
    NewCheckpoint: models.JobCheckpoint{
        BatchID: &workspaceBatch[maxIndex],
    },
}
```

These checkpoints get saved to Postgres. If the server crashes, when it comes back up, the jobs can pick up right where they left off. It's like adding save points to your workflow - absolute game changer.

### Compound Operations with Rollback (My Favorite Trick)

This pattern is freaking brilliant for operations that need to touch multiple systems:

```go
func (co *CompoundOperation) Execute(ctx context.Context) error {
    for _, op := range co.operations {
        if err := op.Execute(ctx); err != nil {
            // Rollback all executed operations in reverse order
            for i := len(co.executed) - 1; i >= 0; i-- {
                if rbErr := co.executed[i].Rollback(ctx); rbErr != nil {
                    return fmt.Errorf("rollback failed: %v (original error: %v)", rbErr, err)
                }
            }
            return err
        }
        co.executed = append(co.executed, op)
    }
    return nil
}
```

This ensures that if anything fails in a multi-step operation, everything gets rolled back cleanly. No more half-updated states that leave your data looking like it was hit by a truck.

## Coming Back From The Dead

When the system starts up, it automatically checks for any workflows that were running when it died:

```go
func (ws *workflowService) Recover(ctx context.Context) error {
    ws.executors.Range(func(key, value interface{}) bool {
        exc, ok := value.(executor.WorkflowObserver)
        if !ok {
            ws.logger.Error("failed to cast executor to WorkflowObserver")
            return false
        }
        if err := exc.Recover(ctx); err != nil {
            ws.logger.Error("failed to recover executor", zap.Error(err))
            // Error handling...
        }
        return true
    })
    return nil
}
```

It loads their state from Postgres and resumes from the last checkpoint. From the job's perspective, the server crash was just a brief power nap. This is seriously satisfying to watch in action.

## Not Setting Your Server On Fire

One thing many developers forget: if you don't limit how much stuff your background jobs do at once, they'll eventually melt your server. I added some basic controls:

```go
// Process a batch with controlled parallelism
completionChan := re.processBatch(executionContext, workspaceBatch, errors)

// Rate limiting between batches
elapsedTime := time.Since(batchStartTime)
if remainingTime := re.runtimeConfig.LowerBound - elapsedTime; remainingTime > 0 {
    select {
    case <-time.After(remainingTime):
    case <-executionContext.Done():
        return
    }
}
```

This lets me control exactly how aggressive my scrapers are, which keeps me from getting IP-banned or destroying my poor little VPS.

## The Results: I Sleep Through The Night Now

This workflow engine has been a game-changer for my competitor monitoring tool. Server restarts? No problem. Random crashes? Everything picks up where it left off. Need to track what happened with a job? All there in the database.

I went from waking up to dumpster fires multiple times a month to having a system that practically runs itself. I can focus on adding features instead of constantly putting out fires.

## Lessons I Had To Learn The Hard Way

Building this taught me a few things:

First, **state sync is a nightmare if you don't plan for it**. Keeping your database and memory state in sync requires careful thought about transactions and rollbacks.

Second, **recovery code needs WAY more testing than happy paths**. I found bugs in my recovery code that only showed up in super specific restart scenarios.

Third, **observability isn't optional**. Being able to see exactly what's happening with each job has saved me countless hours of head-scratching.

Finally, **rate limiting isn't just nice, it's necessary**. The first time I ran without it, I accidentally DoS'd a competitor's site (oops) and got my IP blocked.

## Was This Overkill? Nope!

Could I have used an off-the-shelf solution? Sure. But I wanted something that fit my exact needs, and I wanted to understand every part of how it works.

Plus, building this was actually fun. There's something deeply satisfying about watching your system recover gracefully from failures that would have previously ruined your day.

If you're building anything where reliability matters, consider these patterns. They've worked wonders for me, and the code isn't actually that complex once you understand the core concepts.
