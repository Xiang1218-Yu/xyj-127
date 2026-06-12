import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { StreetViewLocation } from '@/data/locations';

interface PanoramaSphereProps {
  location: StreetViewLocation;
  locationKey?: string;
  onLoad?: () => void;
}

export function PanoramaSphere({ location, locationKey, onLoad }: PanoramaSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [loaded, setLoaded] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current && !loaded) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  useEffect(() => {
    if (!materialRef.current) return;

    setLoaded(false);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      location.panoramaUrl,
      (texture) => {
        if (!materialRef.current) return;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        materialRef.current.map = texture;
        materialRef.current.needsUpdate = true;
        materialRef.current.color.set(0xffffff);
        setLoaded(true);
        onLoad?.();
      },
      undefined,
      (err) => {
        console.warn('Failed to load panorama:', location.panoramaUrl, err);
        if (materialRef.current) {
          materialRef.current.color.set(0x00aaff);
        }
        setLoaded(true);
        onLoad?.();
      }
    );

    return () => {
      if (materialRef.current && materialRef.current.map) {
        materialRef.current.map.dispose();
        materialRef.current.map = null;
      }
    };
  }, [location.panoramaUrl, locationKey, onLoad]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        ref={materialRef}
        color={0x00aaff}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
