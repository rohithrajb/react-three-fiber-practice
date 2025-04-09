import {
  Environment,
  OrbitControls,
  useGLTF,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./App.module.css";
import Chess from "./components/ChessGame";
import BreakoutGame from "./components/BreakoutGame";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

function Cube({ position, color, size }) {
  return (
    <mesh
      position={position}
      scale={size}
      geometry={boxGeometry}
      castShadow
      receiveShadow
    >
      {/* <boxGeometry args={size} /> */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Sphere({ position, color, scale }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[0.6, 50, 50]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Model2() {
  const gltf = useGLTF(
    "https://instamart-media-assets.swiggy.com/DeSo/test/r3f-test/statue_of_liberty2.glb?updatedAt=1743157391380"
  );

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={gltf.scene} scale={0.5} castShadow />;
}

function SpotLightWithHelper({
  position = [5, 30, 5],
  color = "white",
  intensity = 400,
  angle = Math.PI / 7,
}) {
  const lightRef = useRef();
  const emptyRef = useRef();

  useHelper(lightRef, THREE.SpotLightHelper, "red");

  useFrame((state) => {
    const x = Math.sin(state.clock.elapsedTime) * 5;

    emptyRef.current.position.x = x;
    lightRef.current.target = emptyRef.current;
    lightRef.current.position.x = x;
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        angle={angle}
        intensity={intensity}
        color={color}
        position={position}
        castShadow
      />
      <object3D ref={emptyRef} position={[0, 0, 0]} />
    </>
  );
}

function Model2Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas orthographic={true} camera={{ position: [15, 20, 30] }} shadows>
        <Model2 />
        <Cube color={"red"} position={[2, 2, 8]} />
        <OrbitControls target={[0, 10, 0]} minDistance={2} maxDistance={150} />
        <ambientLight intensity={0.8} />
        {/* <directionalLight
            color="white"
            position={[1, 0.5, 0]}
            intensity={1}
          /> */}
        <SpotLightWithHelper />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </Canvas>
    </div>
  );
}

function Model1() {
  const gltf = useGLTF(
    "https://instamart-media-assets.swiggy.com/DeSo/test/r3f-test/cat.glb?updatedAt=1742474217562"
  );

  return <primitive object={gltf.scene} />;
}

function Model1Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [5, 2, 3] }}
        style={{ backgroundColor: "darkgray" }}
      >
        <Model1 />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[1, 0.5, 0]} intensity={1} />
      </Canvas>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const boardSquares = useRef([]);

  useEffect(() => {
    if (currentScreen === 4) {
      const squaresInARow = 4;
      let rowNumber = 1;
      for (let i = -(squaresInARow - 1); i <= squaresInARow - 1; i++) {
        if (i % 2 !== 0) {
          // setting the color of the first square in the row
          let squareColor = rowNumber % 2 === 0 ? "black" : "white";
          rowNumber++;
          for (let j = -(squaresInARow - 1); j <= squaresInARow - 1; j++) {
            if (j % 2 !== 0) {
              boardSquares.current.push({
                position: [i, 0, j],
                color: squareColor,
              });
              squareColor = squareColor === "black" ? "white" : "black";
            }
          }
        }
      }
    }
  }, [currentScreen]);

  return (
    <>
      <div>
        {/* back button */}
        <div className={styles.back_button} onClick={() => setCurrentScreen(0)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M35.953 22.953H22.573L27.24 18.287C27.4362 18.0907 27.5465 17.8246 27.5465 17.547C27.5465 17.2695 27.4362 17.0033 27.24 16.807C27.0437 16.6107 26.7775 16.5005 26.5 16.5005C26.2224 16.5005 25.9562 16.6107 25.76 16.807L19.307 23.26C19.2097 23.3572 19.1326 23.4725 19.08 23.5995C19.0273 23.7265 19.0002 23.8626 19.0002 24C19.0002 24.1375 19.0273 24.2736 19.08 24.4005C19.1326 24.5275 19.2097 24.6429 19.307 24.74L25.76 31.193C25.8569 31.2906 25.9722 31.3681 26.0992 31.4209C26.2262 31.4738 26.3624 31.501 26.5 31.501C26.6375 31.501 26.7737 31.4738 26.9007 31.4209C27.0277 31.3681 27.143 31.2906 27.24 31.193C27.3372 31.0959 27.4144 30.9805 27.467 30.8535C27.5196 30.7266 27.5467 30.5905 27.5467 30.453C27.5467 30.3156 27.5196 30.1795 27.467 30.0525C27.4144 29.9255 27.3372 29.8101 27.24 29.713L22.573 25.046H35.953C36.2249 25.0376 36.4829 24.9237 36.6723 24.7283C36.8617 24.533 36.9676 24.2716 36.9676 23.9995C36.9676 23.7274 36.8617 23.466 36.6723 23.2707C36.4829 23.0754 36.2249 22.9614 35.953 22.953Z"
              fill="white"
            />
          </svg>
        </div>
        {currentScreen === 0 ? (
          <>
            {/* menu screen */}
            <div className={styles.menu_screen}>
              <button onClick={() => setCurrentScreen(1)}>
                3D Model loading
              </button>
              <button
                style={{ marginTop: "24px" }}
                onClick={() => setCurrentScreen(2)}
              >
                Model with spotlight & shadow
              </button>
              <button
                style={{ marginTop: "24px" }}
                onClick={() => setCurrentScreen(3)}
              >
                3d Shapes
              </button>
              <button
                style={{ marginTop: "24px" }}
                onClick={() => setCurrentScreen(4)}
              >
                Chess
              </button>
              <button
                style={{ marginTop: "24px" }}
                onClick={() => setCurrentScreen(5)}
              >
                Breakout game
              </button>
            </div>
          </>
        ) : currentScreen === 1 ? (
          <>
            {/* scene 1 */}
            <Model1Scene />
          </>
        ) : currentScreen === 2 ? (
          <>
            {/* scene 2 */}
            <Model2Scene />
          </>
        ) : currentScreen === 3 ? (
          <>
            {/* scene 3 */}
            <div style={{ width: "100vw", height: "100vh" }}>
              <Canvas camera={{ position: [5, 0, 0] }} shadows>
                <OrbitControls />
                <ambientLight intensity={1} />
                <SpotLightWithHelper
                  position={[2, 2.5, 1]}
                  intensity={100}
                  angle={Math.PI / 4}
                />
                <Sphere position={[-1, 0, 0]} color={"yellow"} />
                <Cube
                  position={[1, 0, 0]}
                  color={"green"}
                  size={[0.5, 0.5, 0.5]}
                />
                <Cube position={[1, 1, 0]} color={"green"} size={[1, 1, 1]} />
                <Cube position={[1, -1, 0]} color={"green"} size={[2, 2, 2]} />
                <Sphere position={[-1, 0, 0]} color={"red"} />
                <Environment preset="dawn" background blur={0.6} />
              </Canvas>
            </div>
          </>
        ) : currentScreen === 4 ? (
          <>
            {/* scene 4 */}
            <Chess boardSquares={boardSquares.current} />
          </>
        ) : (
          <>
            {/* scene 5 */}
            <BreakoutGame />
          </>
        )}
      </div>
    </>
  );
}

export default App;
