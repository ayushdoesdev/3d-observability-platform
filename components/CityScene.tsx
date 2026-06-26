'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from '@/lib/scrollState';

const BUILDING_COUNT = 400;
const CITY_SIZE = 200;

// Generate blocks globally once to avoid react-hooks/purity errors in useMemo
const { blockData, glowBlockData } = (() => {
  const blocks: { position: [number, number, number], scale: [number, number, number] }[] = [];
  const glowBlocks: { position: [number, number, number], scale: [number, number, number] }[] = [];
  
  for (let i = 0; i < BUILDING_COUNT; i++) {
    const x = (Math.random() - 0.5) * CITY_SIZE;
    const z = (Math.random() - 0.5) * CITY_SIZE;
    
    // Keep center somewhat clear for the camera path
    if (Math.abs(x) < 15 && Math.abs(z) < 50) continue;
    
    const width = 2 + Math.random() * 4;
    const depth = 2 + Math.random() * 4;
    
    // Randomly make some buildings very tall (corporate towers)
    const isTower = Math.random() > 0.9;
    const height = isTower ? 20 + Math.random() * 30 : 2 + Math.random() * 15;
    
    const pos: [number, number, number] = [x, height / 2, z];
    const scale: [number, number, number] = [width, height, depth];
    
    if (Math.random() > 0.95) {
      glowBlocks.push({ position: pos, scale });
    } else {
      blocks.push({ position: pos, scale });
    }
  }
  return { blockData: blocks, glowBlockData: glowBlocks };
})();

function CityBlocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      blockData.forEach((data, i) => {
        dummy.position.set(...data.position);
        dummy.scale.set(...data.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (glowMeshRef.current) {
      const dummy = new THREE.Object3D();
      glowBlockData.forEach((data, i) => {
        dummy.position.set(...data.position);
        dummy.scale.set(...data.scale);
        dummy.updateMatrix();
        glowMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      glowMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, blockData.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#0a0a0e" roughness={0.8} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={glowMeshRef} args={[undefined, undefined, glowBlockData.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#2a0000" emissive="#ff2a2a" emissiveIntensity={2} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[CITY_SIZE, CITY_SIZE]} />
      <meshStandardMaterial color="#050505" roughness={0.9} metalness={0.1} />
      <gridHelper args={[CITY_SIZE, CITY_SIZE / 4, '#00f0ff', '#002233']} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}

const particleCount = 1000;
const initialParticles = (() => {
  const pos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 80; // x
    pos[i * 3 + 1] = Math.random() * 2; // y
    pos[i * 3 + 2] = (Math.random() - 0.5) * CITY_SIZE; // z
  }
  return pos;
})();

function DataStreams() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += 0.5; // move along z
        if (positions[i * 3 + 2] > CITY_SIZE / 2) {
          positions[i * 3 + 2] = -CITY_SIZE / 2;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialParticles, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#00f0ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const progress = scrollState.progress;
    
    // Path definition based on scroll progress
    // Start high up looking down
    // Move down into the city
    // Fly through the city
    
    const startZ = 80;
    const endZ = -60;
    const currentZ = THREE.MathUtils.lerp(startZ, endZ, progress);
    
    const startY = 40;
    const midY = 5;
    const endY = 15;
    
    let currentY;
    if (progress < 0.3) {
      const p = progress / 0.3;
      currentY = THREE.MathUtils.lerp(startY, midY, p);
    } else {
      const p = (progress - 0.3) / 0.7;
      currentY = THREE.MathUtils.lerp(midY, endY, p);
    }
    
    const targetX = Math.sin(progress * Math.PI * 2) * 10;
    
    // Smooth camera movement
    state.camera.position.lerp(new THREE.Vector3(targetX, currentY, currentZ), 0.05);
    
    // Look ahead slightly down
    const lookAtZ = currentZ - 30;
    const lookAtY = currentY - (progress < 0.3 ? 20 : 2);
    
    const targetLookAt = new THREE.Vector3(0, lookAtY, lookAtZ);
    // Simple lookAt interpolation
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    // We can just use the camera's rotation to look at the target
    state.camera.lookAt(targetLookAt);
  });
  
  return null;
}

export default function CityScene() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 40, 80], fov: 60 }}>
        <fog attach="fog" args={['#050505', 10, 100]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[0, 10, 0]} intensity={2} color="#ff2a2a" distance={50} />
        
        <CityBlocks />
        <GridFloor />
        <DataStreams />
        <CameraRig />
      </Canvas>
    </div>
  );
}
