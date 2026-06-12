import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraControllerProps {
  initialHeading: number;
  initialPitch: number;
  enabled?: boolean;
  locationKey: string;
}

export function CameraController({
  initialHeading,
  initialPitch,
  enabled = true,
  locationKey
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const phi = THREE.MathUtils.degToRad(90 - initialPitch);
    const theta = THREE.MathUtils.degToRad(initialHeading);
    const radius = 400;

    camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  }, [camera, initialHeading, initialPitch, locationKey]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={enabled}
      rotateSpeed={-0.5}
      autoRotate={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={5 * Math.PI / 6}
      enableDamping
      dampingFactor={0.05}
    />
  );
}
