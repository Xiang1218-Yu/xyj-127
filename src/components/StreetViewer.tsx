import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { StreetViewLocation } from '@/data/locations';

interface PanoramaSphereProps {
  location: StreetViewLocation;
  onReady?: () => void;
}

function PanoramaSphere({ location, onReady }: PanoramaSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      location.panoramaUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (materialRef.current) {
          materialRef.current.map = texture;
          materialRef.current.needsUpdate = true;
        }
        setCurrentTexture(texture);
        setIsLoading(false);
        onReady?.();
      },
      undefined,
      (error) => {
        console.warn('Failed to load panorama texture, using fallback:', error);
        const canvas = document.createElement('canvas');
        canvas.width = 4096;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d')!;
        const gradient = ctx.createLinearGradient(0, 0, 0, 2048);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.3, '#16213e');
        gradient.addColorStop(0.6, '#0f3460');
        gradient.addColorStop(1, '#e94560');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 4096, 2048);
        for (let i = 0; i < 200; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * 4096,
            Math.random() * 2048,
            Math.random() * 3 + 1,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
          ctx.fill();
        }
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        fallbackTexture.colorSpace = THREE.SRGBColorSpace;
        fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
        if (materialRef.current) {
          materialRef.current.map = fallbackTexture;
          materialRef.current.needsUpdate = true;
        }
        setCurrentTexture(fallbackTexture);
        setIsLoading(false);
        onReady?.();
      }
    );
  }, [location.panoramaUrl, onReady]);

  useFrame(() => {
    if (meshRef.current && isLoading) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial ref={materialRef} side={THREE.BackSide} />
    </mesh>
  );
}

interface CameraControllerProps {
  initialHeading: number;
  initialPitch: number;
  isInteractive: boolean;
}

function CameraController({ initialHeading, initialPitch, isInteractive }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const phi = THREE.MathUtils.degToRad(90 - initialPitch);
      const theta = THREE.MathUtils.degToRad(initialHeading);
      const radius = 100;
      
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);
      initialized.current = true;
    }
  }, [camera, initialHeading, initialPitch]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={isInteractive}
      rotateSpeed={-0.5}
      autoRotate={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={5 * Math.PI / 6}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}

interface StreetViewerProps {
  location: StreetViewLocation;
  isInteractive: boolean;
  onSceneReady?: () => void;
}

export default function StreetViewer({ location, isInteractive, onSceneReady }: StreetViewerProps) {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 75, near: 0.1, far: 1000 }}
      style={{ background: '#000' }}
    >
      <PanoramaSphere location={location} onReady={onSceneReady} />
      <CameraController
        initialHeading={location.initialHeading}
        initialPitch={location.initialPitch}
        isInteractive={isInteractive}
      />
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
    </Canvas>
  );
}
