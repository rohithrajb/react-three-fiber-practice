import { OrbitControls, useGLTF, useHelper } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import styles from "./App.module.css";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

function Cube({ position, color, size }) {
  return (
    <mesh position={position} scale={size} geometry={boxGeometry} castShadow>
      {/* <boxGeometry args={size} /> */}
      <meshBasicMaterial color={color} />
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

function SpotLightWithHelper() {
  const lightRef = useRef();

  useHelper(lightRef, THREE.SpotLightHelper, "red");

  return (
    <spotLight
      ref={lightRef}
      angle={Math.PI / 7}
      intensity={400}
      color="white"
      position={[5, 30, 5]}
      castShadow
    />
  );
}

function ModelExample2() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows>
        <Model2 />
        <Cube color={"red"} position={[2, 2, 8]} />
        <OrbitControls minDistance={2} maxDistance={150} />
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

function ModelExample1() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ backgroundColor: "darkgray" }}>
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

  return (
    <>
      <div>
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
            </div>
          </>
        ) : currentScreen === 1 ? (
          <>
            {/* screen 1 */}
            <ModelExample1 />
          </>
        ) : (
          <>
            {/* screen 2 */}
            <ModelExample2 />
          </>
        )}
      </div>
    </>
  );
}

export default App;
