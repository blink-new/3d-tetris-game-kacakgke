export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface TetrominoShape {
  blocks: Position[];
  color: string;
}

export interface GamePiece {
  shape: TetrominoShape;
  position: Position;
  rotation: number;
}

export interface GameState {
  board: (string | null)[][][];
  currentPiece: GamePiece | null;
  nextPiece: TetrominoShape | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export const TETROMINOS: { [key: string]: TetrominoShape } = {
  I: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 }
    ],
    color: '#00f5ff'
  },
  O: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 }
    ],
    color: '#ffff00'
  },
  T: {
    blocks: [
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 1, z: 0 }
    ],
    color: '#a000f0'
  },
  S: {
    blocks: [
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 }
    ],
    color: '#00f000'
  },
  Z: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 1, z: 0 }
    ],
    color: '#f00000'
  },
  J: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 1, z: 0 }
    ],
    color: '#0000f0'
  },
  L: {
    blocks: [
      { x: 2, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 1, z: 0 }
    ],
    color: '#f0a000'
  }
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BOARD_DEPTH = 10;