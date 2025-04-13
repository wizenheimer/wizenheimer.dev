---
title: Introducing Rulesets - Code Reviews Should Be About Code, Not Checklists
date: 2025-12-03T02:26:05+05:30
tags: [rulesets, typescript]
---

I spent over 45 minutes reviewing a pull request that should have taken 10. The code itself wasn't complex – the problem was everything else. A vague PR title that told me nothing. Missing labels. No linked Jira ticket. Files scattered across the codebase with no apparent pattern. By the time I finished checking all our team's basic requirements, I was mentally exhausted and hadn't even evaluated the actual code quality yet. After the third "please follow our PR template" comment, I snapped.

This is a stupid problem that shouldn't exist in 2025. We brought down 75 minute build times down to 2, but somehow are still manually shepherding the PRs. I tried a few things. They all sucked. PR templates got ignored. GitHub branch protection that wouldn't work. Github marketplace apps that often turned out to be abandonware, solving exactly one tiny piece of the problem, and leaving rest unattended. Honestly, nothing worked, and I kept losing hours each week to "vibe coded PRs".

So I built Rulesets. Because every time I had to comment "could you reference the AV in your tickets" or "you're missing the required labels," or "hey, don't edit the CODEOWNERS file" a small piece of my soul died. 

Rulesets automatically enforces your team's standards on pull requests. It handles everything I was checking manually – validating PR titles, ensuring proper labels, checking file counts, validating approvals – and takes action when things aren't right. When a PR passes all checks, it can label it ready for human review or even approve and merge it automatically. I get to focus entirely on what matters: the actual code, not the checklists.

So I'm releasing Rulesets. It's open source and free for small teams. Install it, set your rules, and go back to building things. Don't let the busy work, prevent the real work from happening.