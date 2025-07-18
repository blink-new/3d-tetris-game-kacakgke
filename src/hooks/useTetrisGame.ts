import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GamePiece, TetrominoShape, Position, TETROMINOS, BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH } from '../types/tetris';

const createEmptyBoard = () => {
  return Array(BOARD_WIDTH).fill(null).map(() =>
    Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_DEPTH).fill(null)
    )
  );
};

const getRandomTetromino = (): TetrominoShape => {
  const pieces = Object.values(TETROMINOS);
  return pieces[Math.floor(Math.random() * pieces.length)];
};

const createNewPiece = (shape: TetrominoShape): GamePiece => ({
  shape,
  position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0, z: Math.floor(BOARD_DEPTH / 2) },
  rotation: 0
});

export const useTetrisGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: false
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const isValidPosition = useCallback((piece: GamePiece, board: (string | null)[][][]): boolean => {
    return piece.shape.blocks.every(block => {
      const x = piece.position.x + block.x;
      const y = piece.position.y + block.y;
      const z = piece.position.z + block.z;
      
      return (
        x >= 0 && x < BOARD_WIDTH &&
        y >= 0 && y < BOARD_HEIGHT &&
        z >= 0 && z < BOARD_DEPTH &&
        !board[x][y][z]
      );
    });
  }, []);

  const placePiece = useCallback((piece: GamePiece, board: (string | null)[][][]): (string | null)[][][] => {
    const newBoard = board.map(row => row.map(col => [...col]));
    
    piece.shape.blocks.forEach(block => {
      const x = piece.position.x + block.x;
      const y = piece.position.y + block.y;
      const z = piece.position.z + block.z;
      
      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && z >= 0 && z < BOARD_DEPTH) {
        newBoard[x][y][z] = piece.shape.color;
      }
    });
    
    return newBoard;
  }, []);

  const clearLines = useCallback((board: (string | null)[][][]): { newBoard: (string | null)[][][], linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = board.map(row => row.map(col => [...col]));
    
    // Check each horizontal layer
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      let isLineFull = true;
      
      // Check if this layer is completely filled
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let z = 0; z < BOARD_DEPTH; z++) {
          if (!newBoard[x][y][z]) {
            isLineFull = false;
            break;
          }
        }
        if (!isLineFull) break;
      }
      
      if (isLineFull) {
        linesCleared++;
        // Move all lines above down
        for (let moveY = y; moveY > 0; moveY--) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            for (let z = 0; z < BOARD_DEPTH; z++) {
              newBoard[x][moveY][z] = newBoard[x][moveY - 1][z];
            }
          }
        }
        // Clear the top line
        for (let x = 0; x < BOARD_WIDTH; x++) {
          for (let z = 0; z < BOARD_DEPTH; z++) {
            newBoard[x][0][z] = null;
          }
        }
        y++; // Check this line again
      }
    }
    
    return { newBoard, linesCleared };
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'forward' | 'backward') => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      const newPosition = { ...prev.currentPiece.position };
      
      switch (direction) {
        case 'left':
          newPosition.x -= 1;
          break;
        case 'right':
          newPosition.x += 1;
          break;
        case 'down':
          newPosition.y += 1;
          break;
        case 'forward':
          newPosition.z -= 1;
          break;
        case 'backward':
          newPosition.z += 1;
          break;
      }
      
      const newPiece = { ...prev.currentPiece, position: newPosition };
      
      if (isValidPosition(newPiece, prev.board)) {
        return { ...prev, currentPiece: newPiece };
      }
      
      // If moving down and can't move, place the piece
      if (direction === 'down') {
        const newBoard = placePiece(prev.currentPiece, prev.board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newScore = prev.score + (linesCleared * 100 * prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        const nextShape = prev.nextPiece!;
        const newCurrentPiece = createNewPiece(nextShape);
        const newNextPiece = getRandomTetromino();
        
        // Check if game is over
        const isGameOver = !isValidPosition(newCurrentPiece, clearedBoard);
        
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: isGameOver ? null : newCurrentPiece,
          nextPiece: newNextPiece,
          score: newScore,
          level: newLevel,
          lines: newLines,
          isGameOver
        };
      }
      
      return prev;
    });
  }, [isValidPosition, placePiece, clearLines]);

  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      // Simple rotation - rotate blocks around center
      const rotatedBlocks = prev.currentPiece.shape.blocks.map(block => ({
        x: -block.z,
        y: block.y,
        z: block.x
      }));
      
      const rotatedPiece = {
        ...prev.currentPiece,
        shape: {
          ...prev.currentPiece.shape,
          blocks: rotatedBlocks
        }
      };
      
      if (isValidPosition(rotatedPiece, prev.board)) {
        return { ...prev, currentPiece: rotatedPiece };
      }
      
      return prev;
    });
  }, [isValidPosition]);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      const newPiece = { ...prev.currentPiece };
      
      // Drop as far as possible
      while (isValidPosition({ ...newPiece, position: { ...newPiece.position, y: newPiece.position.y + 1 } }, prev.board)) {
        newPiece.position.y += 1;
      }
      
      return { ...prev, currentPiece: newPiece };
    });
  }, [isValidPosition]);

  const startGame = useCallback(() => {
    const newShape = getRandomTetromino();
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createNewPiece(newShape),
      nextPiece: getRandomTetromino(),
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const dropInterval = Math.max(100, 1000 - (gameState.level - 1) * 100);
    
    gameLoopRef.current = setInterval(() => {
      movePiece('down');
    }, dropInterval);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.level, gameState.isGameOver, gameState.isPaused, gameState.currentPiece, movePiece]);

  // Initialize game
  useEffect(() => {
    startGame();
  }, [startGame]);

  return {
    gameState,
    movePiece,
    rotatePiece,
    dropPiece,
    startGame,
    pauseGame
  };
};