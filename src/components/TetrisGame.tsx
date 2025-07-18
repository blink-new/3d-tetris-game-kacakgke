import { useEffect } from 'react';
import { useTetrisGame } from '../hooks/useTetrisGame';
import { GameBoard3D } from './GameBoard3D';
import { GameUI } from './GameUI';

export function TetrisGame() {
  const {
    gameState,
    movePiece,
    rotatePiece,
    dropPiece,
    startGame,
    pauseGame
  } = useTetrisGame();

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver) return;
      
      switch (event.key.toLowerCase()) {
        case 'a':
          movePiece('left');
          break;
        case 'd':
          movePiece('right');
          break;
        case 'w':
          movePiece('forward');
          break;
        case 's':
          movePiece('backward');
          break;
        case 'q':
          rotatePiece();
          break;
        case 'e':
          rotatePiece();
          break;
        case ' ':
          event.preventDefault();
          dropPiece();
          break;
        case 'p':
          pauseGame();
          break;
        case 'r':
          startGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isGameOver, movePiece, rotatePiece, dropPiece, pauseGame, startGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            3D Tetris
          </h1>
          <p className="text-gray-400">
            Use WASD to move, Q/E to rotate, Space to drop
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <div className="aspect-square lg:aspect-video bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
              <GameBoard3D gameState={gameState} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <GameUI
              gameState={gameState}
              onPause={pauseGame}
              onRestart={startGame}
            />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden mt-6">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <button
              onClick={() => movePiece('left')}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            >
              ←
            </button>
            <button
              onClick={() => movePiece('forward')}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            >
              ↑
            </button>
            <button
              onClick={() => movePiece('right')}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            >
              →
            </button>
            <button
              onClick={rotatePiece}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            >
              ↻
            </button>
            <button
              onClick={() => movePiece('backward')}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            >
              ↓
            </button>
            <button
              onClick={dropPiece}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg border border-indigo-500"
            >
              Drop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}