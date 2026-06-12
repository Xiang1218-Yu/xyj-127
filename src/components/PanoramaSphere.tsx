import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePanoramaTexture } from '@/hooks/usePanoramaTexture';
import type { StreetViewLocation } from '@/data/locations';

interface PanoramaSphereProps {
  location: StreetViewLocation;
  onLoad?: () => void;
}

export function PanoramaSphere({ location, onLoad }: PanoramaSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { texture, isLoading } = usePanoramaTexture({
    url: location.panoramaUrl,
    onLoad
  });

  useFrame((_, delta) => {
    if (meshRef.current && isLoading) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const geometry = useMemo(() => new THREE.SphereGeometry(500, 60, 40), []);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]} geometry={geometry}>
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        side={THREE.BackSide}
        transparent={false}
      />
    </mesh>
  );
}
