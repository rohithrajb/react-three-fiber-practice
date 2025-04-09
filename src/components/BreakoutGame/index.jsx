import {
  Environment,
  OrbitControls,
  Torus,
  useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Wall({ rotation, position }) {
  return (
    <RigidBody type="fixed">
      <mesh scale={5} rotation={rotation} position={position} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color={"grey"} />
      </mesh>
    </RigidBody>
  );
}

function Scene() {
  const lightRef = useRef(null);

  useHelper(lightRef, THREE.SpotLightHelper, "red");
  return (
    <>
      <OrbitControls />
      <spotLight ref={lightRef} color="white" castShadow />
      <Suspense>
        <Physics debug>
          <RigidBody colliders="ball">
            <mesh scale={0.3} position={[0, 2, 0]} castShadow>
              <sphereGeometry />
              <meshStandardMaterial roughness={0.3} color={"brown"} />
            </mesh>
          </RigidBody>
          <Wall
            rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
            position={[0, -2.5, 0]}
          />
          <Wall
            rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
            position={[0, 2.5, 0]}
          />
          <Wall position={[0, 0, -2.5]} />
          <Wall
            rotation={[THREE.MathUtils.degToRad(180), 0, 0]}
            position={[0, 0, 2.5]}
          />
          <Wall
            rotation={[0, THREE.MathUtils.degToRad(90), 0]}
            position={[-2.5, 0, 0]}
          />
          <Wall
            rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
            position={[2.5, 0, 0]}
          />
        </Physics>
      </Suspense>
      <Environment preset="apartment" background blur={0.2} />
    </>
  );
}

export default function BreakoutGame() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5] }} shadows>
        <Scene />
      </Canvas>
    </div>
  );
}
