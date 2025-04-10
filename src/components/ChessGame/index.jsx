import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import useChessStore from "./useChessStore";
import gsap from "gsap";
import { Perf } from "r3f-perf";

function ChessBoardSquare({ position, color = "black" }) {
  const pawnPosition = useChessStore((state) => state.pawnPosition);
  const setPawnPosition = useChessStore((state) => state.setPawnPosition);

  function movePawn(position) {
    const fromPos = { x: pawnPosition[0], z: pawnPosition[2] };
    gsap.to(fromPos, {
      x: position[0],
      z: position[2],
      duration: 0.3,
      ease: "power2.inOut",
      onUpdate: () => {
        setPawnPosition([fromPos.x, 0, fromPos.z]);
      },
    });
  }

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

function ChessBoard({ boardSquares }) {
  return (
    <mesh>
      {boardSquares.map((squareData, idx) => (
        <ChessBoardSquare
          key={idx}
          position={squareData.position}
          color={squareData.color}
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

function ChessScene({ boardSquares }) {
  const pawnPosition = useChessStore((state) => state.pawnPosition);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <Perf position="bottom-right" />
        <OrbitControls />
        <ambientLight />
        <ChessBoard boardSquares={boardSquares} />
        <Pawn position={pawnPosition} />
        <Environment preset="dawn" background blur={0.6} />
      </Canvas>
    </div>
  );
}

export default ChessScene;
