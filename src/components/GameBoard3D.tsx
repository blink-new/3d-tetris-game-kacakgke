import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { GameState } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH } from '../types/tetris';

interface BlockProps {
  position: [number, number, number];
  color: string;
  isGhost?: boolean;
}

function Block({ position, color, isGhost = false }: BlockProps) {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current && !isGhost) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[0.9, 0.9, 0.9]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isGhost ? 0.1 : 0.3}
        transparent={isGhost}
        opacity={isGhost ? 0.3 : 1}
      />
    </Box>
  );
}

function GridLines() {
  const lines = [];
  
  // Vertical lines
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    for (let z = 0; z <= BOARD_DEPTH; z++) {
      lines.push(
        <line key={`v-${x}-${z}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                x - BOARD_WIDTH/2, -BOARD_HEIGHT/2, z - BOARD_DEPTH/2,
                x - BOARD_WIDTH/2, BOARD_HEIGHT/2, z - BOARD_DEPTH/2
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333" opacity={0.3} transparent />
        </line>
      );
    }
  }
  
  // Horizontal lines
  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    for (let z = 0; z <= BOARD_DEPTH; z++) {
      lines.push(
        <line key={`h-${y}-${z}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                -BOARD_WIDTH/2, y - BOARD_HEIGHT/2, z - BOARD_DEPTH/2,
                BOARD_WIDTH/2, y - BOARD_HEIGHT/2, z - BOARD_DEPTH/2
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333" opacity={0.3} transparent />
        </line>
      );
    }
  }
  
  // Depth lines
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      lines.push(
        <line key={`d-${x}-${y}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                x - BOARD_WIDTH/2, y - BOARD_HEIGHT/2, -BOARD_DEPTH/2,
                x - BOARD_WIDTH/2, y - BOARD_HEIGHT/2, BOARD_DEPTH/2
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333" opacity={0.3} transparent />
        </line>
      );
    }
  }
  
  return <group>{lines}</group>;
}

interface GameBoard3DProps {
  gameState: GameState;
}

export function GameBoard3D({ gameState }: GameBoard3DProps) {
  const blocks = [];
  
  // Render placed blocks
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let z = 0; z < BOARD_DEPTH; z++) {
        const color = gameState.board[x][y][z];
        if (color) {
          blocks.push(
            <Block
              key={`${x}-${y}-${z}`}
              position={[x - BOARD_WIDTH/2, y - BOARD_HEIGHT/2, z - BOARD_DEPTH/2]}
              color={color}
            />
          );
        }
      }
    }
  }
  
  // Render current piece
  if (gameState.currentPiece) {
    gameState.currentPiece.shape.blocks.forEach((block, index) => {
      const x = gameState.currentPiece!.position.x + block.x;
      const y = gameState.currentPiece!.position.y + block.y;
      const z = gameState.currentPiece!.position.z + block.z;
      
      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && z >= 0 && z < BOARD_DEPTH) {
        blocks.push(
          <Block
            key={`current-${index}`}
            position={[x - BOARD_WIDTH/2, y - BOARD_HEIGHT/2, z - BOARD_DEPTH/2]}
            color={gameState.currentPiece!.shape.color}
          />
        );
      }
    });
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <GridLines />
        {blocks}
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}