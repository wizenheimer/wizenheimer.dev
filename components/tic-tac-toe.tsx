import { useState, useCallback, useRef } from "react";
import { Grid3X3 } from "lucide-react";
import Draggable from "react-draggable";
import { useKeyboardShortcut } from '../hooks/keyboard-shortcuts';

interface TicTacToeProps {
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: (minimized: boolean) => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export const TicTacToe: React.FC<TicTacToeProps> = ({
  onClose,
  isMinimized,
  onMinimize,
}) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const checkWinner = useCallback((board: Board): Player | 'draw' | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameStarted(false);
  }, []);

  const makeMove = useCallback((index: number) => {
    if (board[index] || winner || !gameStarted) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, gameStarted, checkWinner]);

  useKeyboardShortcut({
    handlers: [
      {
        key: 'Escape',
        handler: () => onClose(),
        description: 'Close game'
      },
      {
        key: 'm',
        handler: () => onMinimize(!isMinimized),
        description: 'Minimize window'
      },
      {
        key: 'f',
        handler: () => setIsFullscreen(prev => !prev),
        description: 'Toggle fullscreen'
      },
      {
        key: 'p',
        handler: () => setGameStarted(prev => !prev),
        description: 'Start/pause game'
      },
      {
        key: 'r',
        handler: () => resetGame(),
        description: 'Reset game'
      },
      {
        key: '1',
        handler: () => makeMove(0),
        description: 'Move to position 1'
      },
      {
        key: '2',
        handler: () => makeMove(1),
        description: 'Move to position 2'
      },
      {
        key: '3',
        handler: () => makeMove(2),
        description: 'Move to position 3'
      },
      {
        key: '4',
        handler: () => makeMove(3),
        description: 'Move to position 4'
      },
      {
        key: '5',
        handler: () => makeMove(4),
        description: 'Move to position 5'
      },
      {
        key: '6',
        handler: () => makeMove(5),
        description: 'Move to position 6'
      },
      {
        key: '7',
        handler: () => makeMove(6),
        description: 'Move to position 7'
      },
      {
        key: '8',
        handler: () => makeMove(7),
        description: 'Move to position 8'
      },
      {
        key: '9',
        handler: () => makeMove(8),
        description: 'Move to position 9'
      }
    ]
  });

  const handleClickOutside = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (isMinimized) {
    return null;
  }

  const cellSize = isFullscreen ? 80 : 60;
  const boardSize = cellSize * 3;

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
            ${isFullscreen ? "fixed inset-4" : `w-[${boardSize + 40}px]`}
            flex flex-col
            border border-gray-300 dark:border-gray-700
            [background-color:var(--color-background-light)]
            dark:[background-color:var(--color-background-dark)]
          `}
        >
          <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-2 drag-handle cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 font-mono text-sm">
              <Grid3X3 className="w-4 h-4 text-gray-500" />
              <span>tic-tac-toe</span>
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

          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center">
              <div
                className="grid grid-cols-3 gap-1 border border-gray-300 dark:border-gray-700 p-2"
                style={{
                  width: boardSize + 16,
                  height: boardSize + 16,
                }}
              >
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => makeMove(index)}
                    disabled={!gameStarted || !!cell || !!winner}
                    className={`
                      border border-gray-300 dark:border-gray-700
                      hover:bg-gray-100 dark:hover:bg-gray-900
                      disabled:hover:bg-transparent
                      flex items-center justify-center
                      font-mono font-bold text-2xl
                      ${cell === 'X' ? 'text-gray-800 dark:text-gray-200' : ''}
                      ${cell === 'O' ? 'text-gray-800 dark:text-gray-200' : ''}
                      ${winner && !cell ? 'opacity-50' : ''}
                    `}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cell ? 'var(--color-primary)' : 'transparent',
                      color: cell ? 'white' : 'inherit'
                    }}
                  >
                    {cell}
                  </button>
                ))}
              </div>

              {(!gameStarted || winner) && (
                <div className="mt-4 text-center font-mono">
                  {!gameStarted && !winner && (
                    <>
                      <div className="text-gray-800 dark:text-gray-200">
                        press p to start
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                        use 1-9 keys or click to play
                      </div>
                    </>
                  )}
                  {winner && (
                    <>
                      <div className="text-gray-800 dark:text-gray-200">
                        {winner === 'draw' ? 'draw!' : `${winner} wins!`}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                        press r to restart
                      </div>
                    </>
                  )}
                </div>
              )}

              {gameStarted && !winner && (
                <div className="mt-4 font-mono text-sm text-gray-800 dark:text-gray-200">
                  current player: {currentPlayer}
                </div>
              )}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default TicTacToe;