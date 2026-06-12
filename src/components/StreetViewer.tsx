import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { PanoramaSphere } from '@/components/PanoramaSphere';
import { CameraController } from '@/components/CameraController';
import type { StreetViewLocation } from '@/data/locations';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DebugCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={0xff0000} />
    </mesh>
  );
}

interface StreetViewerProps {
  location: StreetViewLocation;
  interactive?: boolean;
  onSceneReady?: () => void;
}

export default function StreetViewer({
  location,
  interactive = true,
  onSceneReady
}: StreetViewerProps) {
  const isNight = location.id.includes('night') || location.id.includes('aurora') || location.id.includes('iceland');

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 5] }}
      style={{ background: '#111', width: '100%', height: '100%' }}
    >
      <PanoramaSphere location={location} locationKey={location.id} onLoad={onSceneReady} />
      <CameraController
        initialHeading={location.initialHeading}
        initialPitch={location.initialPitch}
        enabled={interactive}
        locationKey={location.id}
      />
      <DebugCube />
      <ambientLight intensity={0.3} />
      {isNight && <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />}
    </Canvas>
  );
}
