import { GameState } from '../types/tetris';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
  onRestart: () => void;
}

function NextPiecePreview({ nextPiece }: { nextPiece: any }) {
  if (!nextPiece) return null;
  
  return (
    <div className="grid grid-cols-4 gap-1 p-2">
      {Array.from({ length: 16 }, (_, i) => {
        const x = i % 4;
        const y = Math.floor(i / 4);
        const hasBlock = nextPiece.blocks.some((block: any) => block.x === x && block.y === y);
        
        return (
          <div
            key={i}
            className={`w-4 h-4 border border-gray-600 ${
              hasBlock ? 'bg-current' : 'bg-gray-800'
            }`}
            style={{ color: hasBlock ? nextPiece.color : 'transparent' }}
          />
        );
      })}
    </div>
  );
}

export function GameUI({ gameState, onPause, onRestart }: GameUIProps) {
  return (
    <div className="space-y-4">
      {/* Score Panel */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-indigo-400 text-lg">Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-white">{gameState.score.toLocaleString()}</div>
          <div className="text-sm text-gray-400">
            Level: <span className="text-amber-400 font-semibold">{gameState.level}</span>
          </div>
          <div className="text-sm text-gray-400">
            Lines: <span className="text-green-400 font-semibold">{gameState.lines}</span>
          </div>
        </CardContent>
      </Card>

      {/* Next Piece */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-indigo-400 text-lg">Next</CardTitle>
        </CardHeader>
        <CardContent>
          <NextPiecePreview nextPiece={gameState.nextPiece} />
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-indigo-400 text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button
              onClick={onPause}
              variant="outline"
              className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Restart
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <div><kbd className="bg-slate-700 px-1 rounded">WASD</kbd> Move</div>
            <div><kbd className="bg-slate-700 px-1 rounded">Q/E</kbd> Rotate</div>
            <div><kbd className="bg-slate-700 px-1 rounded">Space</kbd> Drop</div>
            <div><kbd className="bg-slate-700 px-1 rounded">P</kbd> Pause</div>
          </div>
        </CardContent>
      </Card>

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-700 max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-400 text-xl text-center">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="space-y-2">
                <div className="text-lg text-white">Final Score</div>
                <div className="text-3xl font-bold text-indigo-400">{gameState.score.toLocaleString()}</div>
                <div className="text-sm text-gray-400">
                  Level {gameState.level} • {gameState.lines} lines cleared
                </div>
              </div>
              <Button
                onClick={onRestart}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <Card className="bg-slate-900/90 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="text-2xl font-bold text-white mb-4">Paused</div>
              <Button
                onClick={onPause}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Resume Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}