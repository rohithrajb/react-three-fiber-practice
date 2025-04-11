import { Environment, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

function Wall({ rotation, position, height = 1 }) {
  return (
    <RigidBody type="fixed">
      <mesh scale={5} rotation={rotation} position={position} receiveShadow>
        <planeGeometry args={[1, height]} />
        <meshStandardMaterial color={"lightgrey"} />
      </mesh>
    </RigidBody>
  );
}

function Ball({ position, color = "red", scale = 0.3 }) {
  const ballRef = useRef();

  const { ballBounce, ballCollider } = useControls("Physics", {
    ballBounce: 1,
    ballCollider: "ball",
  });

  const [colorMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    "https://instamart-media-assets.swiggy.com/tr:w-512/DeSo/test/juggle-ball-3d/ball_textures/texture_Color.png?updatedAt=1744355950723",
    "https://instamart-media-assets.swiggy.com/tr:w-512/DeSo/test/juggle-ball-3d/ball_textures/texture_NormalDX.png?updatedAt=1744355959729",
    "https://instamart-media-assets.swiggy.com/tr:w-512/DeSo/test/juggle-ball-3d/ball_textures/texture_Roughness.png?updatedAt=1744355947535",
  ]);

  return (
    <RigidBody ref={ballRef} colliders={ballCollider} restitution={ballBounce}>
      <mesh
        scale={scale}
        position={position}
        castShadow
        onPointerDown={(contact) => {
          ballRef.current.setLinvel({
            x: -contact.normal.x * 3,
            y: 3,
            z: -contact.normal.z * 3,
          });
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial map={colorMap} roughnessMap={roughnessMap} />
      </mesh>
    </RigidBody>
  );
}

function Scene() {
  const { lightIntensity, environmentLight } = useControls("Light", {
    lightIntensity: 100,
    environmentLight: 0.4,
  });

  const { gravity, debug } = useControls("Physics", {
    debug: false,
    gravity: [0, -2, 0],
  });

  return (
    <>
      <OrbitControls
        autoRotate
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
      />
      <spotLight
        intensity={lightIntensity}
        position={[6, 1, 6]}
        color="white"
        angle={THREE.MathUtils.degToRad(50)}
        castShadow
      />
      <Physics gravity={gravity} debug={debug}>
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
        environmentIntensity={environmentLight}
      />
    </>
  );
}

export default function JuggleGame() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Leva collapsed />
      <Canvas
        frameloop="demand"
        camera={{ fov: 50, position: [-9, -2, 12] }}
        shadows
      >
        <Perf position="bottom-right" />
        <Scene />
      </Canvas>
    </div>
  );
}
