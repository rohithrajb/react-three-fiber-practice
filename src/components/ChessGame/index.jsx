import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import useChessStore from "./useChessStore";

function ChessBoardSquare({ position, color = "black" }) {
  const movePawn = useChessStore((state) => state.setPawnPosition);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={2}
      onClick={() => movePawn(position)}
    >
      <planeGeometry />
      <meshStandardMaterial
        color={color}
        metalness={1}
        roughness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ChessBoard({ squarePositions }) {
  return (
    <mesh>
      {squarePositions.map((position, idx) => (
        <ChessBoardSquare
          key={idx}
          position={position}
          color={position[0] * position[2] < 0 ? "black" : "white"}
        />
      ))}
    </mesh>
  );
}

function Pawn({ position }) {
  const glb = useGLTF(
    "https://instamart-media-assets.swiggy.com/DeSo/test/r3f-test/chess_pawn.glb?updatedAt=1743764599599"
  );

  return <primitive object={glb.scene} position={position} />;
}

function ChessScene({ squarePositions }) {
  const pawnPosition = useChessStore((state) => state.pawnPosition);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <OrbitControls />
        <ambientLight />
        <ChessBoard squarePositions={squarePositions} />
        <Pawn position={pawnPosition} />
        <Environment preset="dawn" background blur={0.6} />
      </Canvas>
    </div>
  );
}

export default ChessScene;
