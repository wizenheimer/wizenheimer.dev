import React, { useState, useEffect, useCallback, useRef } from "react";
import { GitCommit } from "lucide-react";
import Draggable from "react-draggable";
import { useKeyboardShortcut } from '../hooks/keyboard-shortcuts';

interface Commit {
  id: string;
  message: string;
  repo: string;
  timestamp: Date;
}

interface GitHubRepo {
  full_name: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

interface GitHistoryProps {
  onClose?: () => void;
  isMinimized: boolean;
  onMinimize: (minimized: boolean) => void;
}

export const GitHistory: React.FC<GitHistoryProps> = ({
  onClose,
  isMinimized,
  onMinimize,
}) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsRefreshing] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCommits = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch(
          "https://api.github.com/user/repos?per_page=100",
          {
            headers: {
              Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `GitHub API responded with status ${response.status}`
          );
        }

        const repos = await response.json();

        if (!Array.isArray(repos)) {
          throw new Error("GitHub API did not return an array of repositories");
        }

        const allCommits = await Promise.all(
          repos.map(async (repo: GitHubRepo) => {
            try {
              const commitsResponse = await fetch(
                `https://api.github.com/repos/${repo.full_name}/commits?per_page=25`,
                {
                  headers: {
                    Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                  },
                }
              );

              if (!commitsResponse.ok) {
                console.warn(
                  `Failed to fetch commits for ${repo.full_name}:`,
                  await commitsResponse.json()
                );
                return [];
              }

              const commits = await commitsResponse.json();
              return commits.map((commit: GitHubCommit) => ({
                id: commit.sha,
                message: commit.commit.message,
                repo: repo.full_name,
                timestamp: new Date(commit.commit.author.date),
              }));
            } catch (error) {
              console.warn(
                `Error fetching commits for ${repo.full_name}:`,
                error
              );
              return [];
            }
          })
        );

        const flattenedCommits = allCommits
          .flat()
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 25);

        setCommits(flattenedCommits);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching commits:", err);
        setError("Failed to load commit history");
        setLoading(false);
      }
      setTimeout(() => setIsRefreshing(false), 1000);
    };

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setLastUpdated(new Date());
      setTimeout(() => setIsBlinking(false), 1000);
    }, 3000);

    fetchCommits();
    const fetchInterval = setInterval(fetchCommits, 300000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullscreen]);

  const handleClickOutside = useCallback(
    (e: React.MouseEvent) => {
      if (onClose && e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Add escape key handler
  useKeyboardShortcut({
    handlers: [
      {
        key: 'Escape',
        handler: () => {
          if (onClose) {
            onClose();
          }
        },
        description: 'Close git history'
      },
      {
        key: 'm',
        handler: () => onMinimize(!isMinimized),
        description: 'Toggle minimize window'
      },
      {
        key: 'f',
        handler: () => setIsFullscreen(prev => !prev),
        description: 'Toggle fullscreen'
      },
      {
        key: 'j',
        handler: () => {
          contentRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
        },
        description: 'Scroll down'
      },
      {
        key: 'k',
        handler: () => {
          contentRef.current?.scrollBy({ top: -100, behavior: 'smooth' });
        },
        description: 'Scroll up'
      }
    ]
  });

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setPosition({ x: 0, y: 0 }); // Reset position when toggling fullscreen
  };

  if (isMinimized) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        onClick={handleClickOutside}
      >
        <div
          className={`
            ${isFullscreen ? "fixed inset-4" : "w-[750px] h-[500px]"}
            [background-color:var(--color-background-light)]
            dark:[background-color:var(--color-background-dark)]
            flex flex-col
            border border-gray-800 dark:border-gray-200
          `}
        >
          <div className="flex items-center justify-between border-b border-gray-800 dark:border-gray-200 p-2">
            <div className="flex items-center gap-2 font-mono text-sm">
              <GitCommit className="w-4 h-4 text-gray-500" />
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-secondary)]"
              >
                git commit history
              </a>
              <span className="text-xs text-gray-500">
                (last updated: {lastUpdated.toLocaleTimeString()})
              </span>
            </div>
            <div className="flex gap-2 font-mono">
              <button
                onClick={() => onMinimize(true)}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ‒
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {isFullscreen ? "⊡" : "□"}
              </button>
              <button
                onClick={handleClose}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ×
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="mb-4 font-mono text-xs animate-pulse">
                <div className="flex items-baseline gap-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
                </div>
                <div className="mt-1 pl-4 border-l border-gray-300 dark:border-gray-700">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="w-[800px] [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] border border-gray-800 dark:border-gray-200 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-800 dark:border-gray-200 p-2">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span>error</span>
            </div>
          </div>
          <div className="p-4 font-mono text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleClickOutside}
    >
      <Draggable
        handle=".drag-handle"
        bounds="parent"
        nodeRef={nodeRef}
        position={isFullscreen ? { x: 0, y: 0 } : position}
        onDrag={(e, data) => {
          if (!isFullscreen) {
            setPosition({ x: data.x, y: data.y });
          }
        }}
      >
        <div
          ref={nodeRef}
          className={`
            ${isFullscreen ? "fixed inset-4" : "w-[750px] h-[500px]"}
            [background-color:var(--color-background-light)]
            dark:[background-color:var(--color-background-dark)]
            flex flex-col
            border border-gray-300 dark:border-gray-700
          `}
        >
          {/* Title Bar */}
          <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-2 drag-handle cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 font-mono text-sm">
              <GitCommit
                className={`w-4 h-4 ${
                  isBlinking ? "text-green-500" : "text-gray-500"
                }`}
              />
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-secondary)]"
              >
                git commit history
              </a>
              <span className="text-xs text-gray-500">
                (last updated: {lastUpdated.toLocaleTimeString()})
              </span>
            </div>
            <div className="flex gap-2 font-mono">
              <button
                onClick={() => onMinimize(true)}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ‒
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {isFullscreen ? "⊡" : "□"}
              </button>
              <button
                onClick={handleClose}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div ref={contentRef} className="flex-1 overflow-auto p-4">
            {commits.map((commit) => (
              <div key={commit.id} className="mb-4 font-mono text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[var(--color-primary)]">
                    {commit.repo}
                  </span>
                  <span className="text-gray-500">
                    {commit.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 pl-4 border-l border-gray-200 dark:border-gray-800">
                  {commit.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default GitHistory;
