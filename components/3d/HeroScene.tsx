"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Mesh } from "three";

function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return mouse;
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useMouse();
  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Big orange torus ── */
function BigTorus() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.20;
    ref.current.rotation.y = t * 0.28;
    ref.current.position.y = 0.6 + Math.sin(t * 0.6) * 0.35;
  });
  return (
    <mesh ref={ref} position={[-3.2, 0.6, -1.0]}>
      <torusGeometry args={[1.4, 0.42, 32, 80]} />
      <meshStandardMaterial
        color="#F97316"
        metalness={0.45}
        roughness={0.20}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/* ── Big green icosahedron ── */
function BigIco() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.16;
    ref.current.rotation.z = t * 0.22;
    ref.current.position.y = 0.2 + Math.sin(t * 0.5 + 1.2) * 0.30;
  });
  return (
    <mesh ref={ref} position={[3.4, 0.2, -1.2]}>
      <icosahedronGeometry args={[1.10, 0]} />
      <meshStandardMaterial
        color="#22C55E"
        metalness={0.35}
        roughness={0.25}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ── White octahedron ── */
function WhiteOcta() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.30;
    ref.current.rotation.y = t * 0.18;
    ref.current.position.y = -0.4 + Math.sin(t * 0.75 + 2) * 0.25;
  });
  return (
    <mesh ref={ref} position={[0.4, -0.8, 0.6]}>
      <octahedronGeometry args={[0.90, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.20}
        roughness={0.30}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

/* ── Small orange sphere cluster ── */
function Sparkles() {
  const positions: [number, number, number][] = [
    [-1.6, 2.0,  0.2],
    [ 1.8, 1.8, -0.4],
    [ 3.8, -0.6, 0.2],
    [-3.6, -0.4, 0.0],
    [ 0.6,  2.4, -0.8],
    [-0.8, -2.0,  0.4],
  ];
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = positions[i][1] + Math.sin(t * 0.7 + i * 1.4) * 0.18;
      m.scale.setScalar(0.8 + Math.sin(t * 1.2 + i) * 0.15);
    });
  });
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={pos}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#F97316" : "#22C55E"}
            metalness={0.6}
            roughness={0.15}
            envMapIntensity={1.0}
          />
        </mesh>
      ))}
    </>
  );
}

/* ── Thin wire ring ── */
function WireRing() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.07;
    ref.current.rotation.x = t * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0.3, -3.0]}>
      <torusGeometry args={[3.0, 0.015, 8, 100]} />
      <meshStandardMaterial color="#FED7AA" metalness={0.3} roughness={0.6} transparent opacity={0.55} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={1.6} color="#fff8f0" />
      <directionalLight position={[6, 10, 6]}  intensity={2.0} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#dcfce7" />
      <pointLight       position={[0, -4, 3]}  intensity={0.6} color="#F97316" />
      <CameraRig />
      <BigTorus />
      <BigIco />
      <WhiteOcta />
      <Sparkles />
      <WireRing />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}