import { useState, useEffect, useCallback, useRef } from "react";
import { Bird } from "lucide-react";
import Draggable from "react-draggable";
import { useKeyboardShortcut } from "../hooks/keyboard-shortcuts";

interface FlappyBirdProps {
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: (minimized: boolean) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

const BIRD_SIZE = 15;
const PIPE_WIDTH = 45;
const PIPE_GAP = 120;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 3;
const GAME_WIDTH = 450;
const GAME_HEIGHT = 300;

export const FlappyBird: React.FC<FlappyBirdProps> = ({
  onClose,
  isMinimized,
  onMinimize,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const calculateGameDimensions = useCallback(() => {
    if (isFullscreen) {
      const maxWidth = Math.min(window.innerWidth - 200, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      return { width: maxWidth, height: maxHeight };
    }
    return { width: GAME_WIDTH, height: GAME_HEIGHT };
  }, [isFullscreen]);

  const { width: gameWidth, height: gameHeight } = calculateGameDimensions();

  const getInitialBirdPosition = useCallback(
    () => ({
      x: gameWidth * 0.22, // 22% from left edge
      y: gameHeight * 0.3, // 30% from top (higher position)
    }),
    [gameWidth, gameHeight]
  );

  const [birdPosition, setBirdPosition] = useState<Position>(
    getInitialBirdPosition()
  );
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const generatePipe = useCallback(() => {
    const minHeight = 50;
    const maxHeight = gameHeight - PIPE_GAP - 50;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: gameWidth,
      height,
      passed: false,
    };
  }, [gameWidth, gameHeight]);

  const resetGame = useCallback(() => {
    setBirdPosition(getInitialBirdPosition());
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, [getInitialBirdPosition]);

  const jump = useCallback(() => {
    if (!gameStarted || gameOver) return;
    setBirdVelocity(JUMP_STRENGTH);
  }, [gameStarted, gameOver]);

  const checkCollision = useCallback(
    (bird: Position, pipes: Pipe[]) => {
      // Check ground and ceiling collision
      if (bird.y <= 0 || bird.y >= gameHeight - BIRD_SIZE) {
        return true;
      }

      // Check pipe collision
      for (const pipe of pipes) {
        if (
          bird.x + BIRD_SIZE > pipe.x &&
          bird.x < pipe.x + PIPE_WIDTH &&
          (bird.y < pipe.height || bird.y + BIRD_SIZE > pipe.height + PIPE_GAP)
        ) {
          return true;
        }
      }

      return false;
    },
    [gameHeight]
  );

  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setBirdPosition((prev) => {
      const newY = prev.y + birdVelocity;
      return { ...prev, y: newY };
    });

    setBirdVelocity((prev) => prev + GRAVITY);

    setPipes((prev) => {
      let newPipes = prev.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));

      // Remove pipes that are off screen
      newPipes = newPipes.filter((pipe) => pipe.x > -PIPE_WIDTH);

      // Add new pipe if needed
      if (
        newPipes.length === 0 ||
        newPipes[newPipes.length - 1].x < gameWidth - 200
      ) {
        newPipes.push(generatePipe());
      }

      // Check for scoring
      newPipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < birdPosition.x) {
          pipe.passed = true;
          setScore((prev) => prev + 1);
        }
      });

      return newPipes;
    });

    // Check collision
    if (checkCollision(birdPosition, pipes)) {
      setGameOver(true);
    }
  }, [
    gameStarted,
    gameOver,
    birdVelocity,
    birdPosition,
    pipes,
    generatePipe,
    checkCollision,
    gameWidth,
  ]);

  useKeyboardShortcut({
    handlers: [
      {
        key: "Escape",
        handler: () => onClose(),
        description: "Close game",
      },
      {
        key: "m",
        handler: () => onMinimize(!isMinimized),
        description: "Minimize window",
      },
      {
        key: "f",
        handler: () => setIsFullscreen((prev) => !prev),
        description: "Toggle fullscreen",
      },
      {
        key: " ",
        handler: () => {
          if (!gameStarted && !gameOver) {
            setGameStarted(true);
          } else if (gameOver) {
            resetGame();
          } else {
            jump();
          }
        },
        description: "Universal action (start/jump/restart)",
      },
    ],
  });

  useEffect(() => {
    if (gameStarted && !gameOver && !isMinimized) {
      const interval = setInterval(updateGame, 16); // ~60fps
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, updateGame, isMinimized]);

  // Update bird position when game dimensions change
  useEffect(() => {
    if (!gameStarted || gameOver) {
      setBirdPosition(getInitialBirdPosition());
    }
  }, [gameWidth, gameHeight, getInitialBirdPosition, gameStarted, gameOver]);

  const handleClickOutside = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleGameClick = useCallback(() => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
    } else {
      jump();
    }
  }, [gameStarted, gameOver, jump]);

  if (isMinimized) {
    return null;
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
            ${isFullscreen ? "fixed inset-4" : `w-[${gameWidth + 40}px]`}
            flex flex-col
            border border-gray-300 dark:border-gray-700
            [background-color:var(--color-background-light)]
            dark:[background-color:var(--color-background-dark)]
          `}
        >
          <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-2 drag-handle cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 font-mono text-sm">
              <Bird className="w-4 h-4 text-gray-500" />
              <span>flappy bird</span>
            </div>
            <div className="flex gap-2 font-mono">
              <button
                onClick={() => onMinimize(true)}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                -
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {isFullscreen ? "⊡" : "□"}
              </button>
              <button
                onClick={onClose}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ×
              </button>
            </div>
          </div>

          {/* Game Board and Score Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col">
              <div
                className="relative border border-gray-300 dark:border-gray-700 cursor-pointer overflow-hidden"
                style={{
                  width: gameWidth,
                  height: gameHeight,
                  backgroundColor: "var(--color-background-light)",
                }}
                onClick={handleGameClick}
              >
                {(!gameStarted || gameOver) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono z-10">
                    {!gameStarted && !gameOver && (
                      <>
                        <div className="text-gray-800 dark:text-gray-200">
                          press space to start
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mt-2">
                          space or click to jump
                        </div>
                      </>
                    )}
                    {gameOver && (
                      <>
                        <div className="text-gray-800 dark:text-gray-200">
                          game over
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mt-2">
                          press space to restart
                        </div>
                      </>
                    )}
                  </div>
                )}

                {gameStarted && (
                  <>
                    {/* Bird */}
                    <div
                      className={`absolute ${gameOver ? "opacity-20" : ""}`}
                      style={{
                        width: BIRD_SIZE,
                        height: BIRD_SIZE,
                        left: birdPosition.x,
                        top: birdPosition.y,
                        backgroundColor: "var(--color-primary)",
                      }}
                    />

                    {/* Pipes */}
                    {pipes.map((pipe, index) => (
                      <div key={index}>
                        {/* Top pipe */}
                        <div
                          className={`absolute bg-gray-800 dark:bg-gray-200 ${
                            gameOver ? "opacity-20" : ""
                          }`}
                          style={{
                            left: pipe.x,
                            top: 0,
                            width: PIPE_WIDTH,
                            height: pipe.height,
                          }}
                        />
                        {/* Bottom pipe */}
                        <div
                          className={`absolute bg-gray-800 dark:bg-gray-200 ${
                            gameOver ? "opacity-20" : ""
                          }`}
                          style={{
                            left: pipe.x,
                            top: pipe.height + PIPE_GAP,
                            width: PIPE_WIDTH,
                            height: gameHeight - pipe.height - PIPE_GAP,
                          }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Score */}
              <div className="mt-2 font-mono text-sm text-gray-800 dark:text-gray-200">
                score: {score}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default FlappyBird;
