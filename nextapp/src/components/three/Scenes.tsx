'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlowOrb({ position, scale, speed, distort }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#D4AF37"
          emissive="#6B4500"
          emissiveIntensity={0.4}
          metalness={0.95}
          roughness={0.05}
          distort={distort}
          speed={speed * 0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function GoldParticles() {
  const count = 180;
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      // Gold color variation
      col[i * 3] = 0.8 + Math.random() * 0.2;
      col[i * 3 + 1] = 0.6 + Math.random() * 0.25;
      col[i * 3 + 2] = 0.1 + Math.random() * 0.15;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.025;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.08;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function DivineTorus() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.18;
      ref.current.rotation.y = state.clock.elapsedTime * 0.28;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.6, 0.38, 180, 28, 3, 5]} />
        <meshStandardMaterial
          color="#C8A430"
          emissive="#5C3D00"
          emissiveIntensity={0.6}
          metalness={1}
          roughness={0.08}
          envMapIntensity={2.5}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 6, 6]} intensity={2.5} color="#D4AF37" />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#FFD700" />
      <pointLight position={[0, 8, 2]} intensity={1.2} color="#FFF8E1" />
      <pointLight position={[0, -6, 0]} intensity={0.4} color="#FF8C00" />

      <DivineTorus />
      <GoldParticles />

      <GlowOrb position={[4.5, 2.5, -3]} scale={0.55} speed={1.1} distort={0.45} />
      <GlowOrb position={[-4, -2, -2.5]} scale={0.38} speed={0.85} distort={0.6} />
      <GlowOrb position={[3.2, -3.5, -1]} scale={0.28} speed={1.6} distort={0.35} />
      <GlowOrb position={[-3.5, 3.2, -4]} scale={0.48} speed={1.05} distort={0.5} />

      <Stars radius={50} depth={30} count={800} factor={2.5} saturation={0} fade speed={0.4} />
      <Environment preset="night" />
    </Canvas>
  );
}

function ProductRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.18;
      ref.current.rotation.y = state.clock.elapsedTime * 0.32;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh ref={ref}>
        <torusGeometry args={[2, 0.55, 32, 100]} />
        <MeshDistortMaterial
          color="#D4AF37"
          emissive="#7A4E00"
          emissiveIntensity={0.35}
          metalness={0.95}
          roughness={0.05}
          distort={0.18}
          speed={0.8}
        />
      </mesh>
    </Float>
  );
}

export function ProductDetailScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#D4AF37" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#FFF8E1" />
      <pointLight position={[0, -5, 0]} intensity={0.6} color="#FFD700" />

      <ProductRing />
      <GoldParticles />

      <Environment preset="studio" />
    </Canvas>
  );
}
