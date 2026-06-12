import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { PanoramaSphere } from '@/components/PanoramaSphere';
import { CameraController } from '@/components/CameraController';
import type { StreetViewLocation } from '@/data/locations';

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
      camera={{ fov: 75, near: 0.1, far: 1000 }}
      style={{ background: '#000', width: '100%', height: '100%' }}
    >
      <PanoramaSphere location={location} onLoad={onSceneReady} />
      <CameraController
        initialHeading={location.initialHeading}
        initialPitch={location.initialPitch}
        enabled={interactive}
        locationKey={location.id}
      />
      <ambientLight intensity={0.3} />
      {isNight && <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />}
    </Canvas>
  );
}
