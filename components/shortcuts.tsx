import React, { useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import Draggable from "react-draggable";
import { useKeyboardShortcut } from '../hooks/keyboard-shortcuts';

interface ShortcutsProps {
  onClose?: () => void;
  isMinimized: boolean;
  onMinimize: (minimized: boolean) => void;
}

interface ShortcutGroup {
  name: string;
  shortcuts: {
    key: string;
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    name: "navigation",
    shortcuts: [
      { key: "j", description: "scroll down" },
      { key: "k", description: "scroll up" },
      { key: "g", description: "switch to grid view" },
      { key: "l", description: "switch to list view" },
    ]
  },
  {
    name: "windows",
    shortcuts: [
      { key: "esc", description: "close window" },
      { key: "m", description: "toggle minimize window" },
      { key: "f", description: "toggle fullscreen" },
      { key: "x", description: "show keyboard shortcuts" },
    ]
  },
  {
    name: "theme",
    shortcuts: [
      { key: "d", description: "toggle dark mode" },
      { key: "1", description: "red theme" },
      { key: "2", description: "pink theme" },
      { key: "3", description: "orange theme" },
      { key: "4", description: "yellow theme" },
      { key: "5", description: "green theme" },
      { key: "6", description: "blue theme" },
      { key: "7", description: "purple theme" },
    ]
  }
];

export const Shortcuts: React.FC<ShortcutsProps> = ({
  onClose,
  isMinimized,
  onMinimize,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcut({
    handlers: [
      {
        key: 'Escape',
        handler: () => {
          if (onClose) {
            onClose();
          }
        },
        description: 'Close shortcuts'
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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setPosition({ x: 0, y: 0 });
  };

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
            ${isFullscreen ? "fixed inset-4" : "w-[750px] h-[500px]"}
            [background-color:var(--color-background-light)]
            dark:[background-color:var(--color-background-dark)]
            flex flex-col
            border border-gray-300 dark:border-gray-700
          `}
        >
          <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-2 drag-handle cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 font-mono text-sm">
              <Keyboard className="w-4 h-4 text-gray-500" />
              <span>keyboard shortcuts</span>
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
                onClick={onClose}
                className="px-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ×
              </button>
            </div>
          </div>

          <div ref={contentRef} className="flex-1 overflow-auto p-4">
            {shortcutGroups.map((group, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h3 className="text-sm font-mono font-semibold mb-4 text-[var(--color-primary)]">
                  {group.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-mono text-xs">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                        {shortcut.key}
                      </kbd>
                      <span className="text-gray-600 dark:text-gray-400">
                        {shortcut.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default Shortcuts;