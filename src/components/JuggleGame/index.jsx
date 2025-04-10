import { Environment, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

function Wall({ rotation, position, height = 1 }) {
  return (
    <RigidBody type="fixed">
      <mesh scale={5} rotation={rotation} position={position} receiveShadow>
        <planeGeometry args={[1, height]} />
        <meshStandardMaterial color={"grey"} />
      </mesh>
    </RigidBody>
  );
}

function Ball({ position, color = "red", scale = 0.3 }) {
  const ballRef = useRef();

  return (
    <RigidBody ref={ballRef} colliders="ball" restitution={1}>
      <mesh
        scale={scale}
        position={position}
        castShadow
        onPointerDown={(contact) => {
          ballRef.current.setLinvel({ x: -contact.normal.x, y: 3, z: 0 });
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial roughness={0.3} color={color} />
      </mesh>
    </RigidBody>
  );
}

function Scene() {
  const lightRef = useRef();

  useHelper(lightRef, THREE.SpotLightHelper, "red");
  return (
    <>
      <OrbitControls />
      <spotLight
        ref={lightRef}
        intensity={100}
        position={[6, 1, 6]}
        color="white"
        angle={THREE.MathUtils.degToRad(50)}
        castShadow
      />
      <Physics gravity={[0, -2, 0]}>
        <Ball position={[1, 2.5, 0]} scale={0.6} />
        <Ball position={[-1, 1, 0]} scale={0.9} />
        {/* floor */}
        <Wall
          rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
          position={[0, -5, 0]}
        />
        {/* roof */}
        <Wall
          rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
          position={[0, 5, 0]}
        />
        {/* wall away from camera */}
        <Wall position={[0, 0, -2.5]} height={2} />
        {/* wall near camera */}
        <Wall
          rotation={[THREE.MathUtils.degToRad(180), 0, 0]}
          position={[0, 0, 2.5]}
          height={2}
        />
        {/* wall on the left */}
        <Wall
          rotation={[0, THREE.MathUtils.degToRad(90), 0]}
          position={[-2.5, 0, 0]}
          height={2}
        />
        {/* wall on the right */}
        <Wall
          rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
          position={[2.5, 0, 0]}
          height={2}
        />
      </Physics>
      <Environment
        preset="apartment"
        background
        blur={0.2}
        environmentIntensity={0.4}
      />
    </>
  );
}

export default function JuggleGame() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 8] }} shadows>
        <Scene />
      </Canvas>
    </div>
  );
}
