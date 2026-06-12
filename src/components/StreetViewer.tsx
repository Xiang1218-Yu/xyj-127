import { Canvas, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { PanoramaSphere } from '@/components/PanoramaSphere';
import { CameraController } from '@/components/CameraController';
import type { StreetViewLocation } from '@/data/locations';
import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface StreetViewerRef {
  captureScreenshot: () => string | null;
}

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

interface SceneContext {
  gl: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

function SceneCapture({ onSceneReady }: { onSceneReady: (ctx: SceneContext) => void }) {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    if (gl && scene && camera) {
      onSceneReady({ gl, scene, camera });
    }
  }, [gl, scene, camera, onSceneReady]);
  
  return null;
}

interface StreetViewerProps {
  location: StreetViewLocation;
  interactive?: boolean;
  onSceneReady?: () => void;
}

const StreetViewer = forwardRef<StreetViewerRef, StreetViewerProps>(function StreetViewer({
  location,
  interactive = true,
  onSceneReady
}, ref) {
  const sceneContextRef = useRef<SceneContext | null>(null);
  const isNight = location.id.includes('night') || location.id.includes('aurora') || location.id.includes('iceland');

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    sceneContextRef.current = ctx;
  }, []);

  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      try {
        if (sceneContextRef.current) {
          const { gl, scene, camera } = sceneContextRef.current;
          gl.render(scene, camera);
          const dataUrl = gl.domElement.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 100) {
            return dataUrl;
          }
        }
        
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 100) {
            return dataUrl;
          }
        }
        
        return null;
      } catch (err) {
        console.error('Failed to capture screenshot:', err);
        return null;
      }
    }
  }), []);

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 5] }}
      style={{ background: '#111', width: '100%', height: '100%' }}
    >
      <SceneCapture onSceneReady={handleSceneReady} />
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
});

export default StreetViewer;
