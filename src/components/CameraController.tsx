import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface CameraControllerRef {
  getCameraAngles: () => { heading: number; pitch: number };
  setCameraAngles: (heading: number, pitch: number) => void;
}

interface CameraControllerProps {
  initialHeading: number;
  initialPitch: number;
  enabled?: boolean;
  locationKey: string;
  controlledHeading?: number;
  controlledPitch?: number;
  onCameraChange?: (heading: number, pitch: number) => void;
}

function getSphericalFromCamera(camera: THREE.Camera) {
  const spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position);
  const heading = THREE.MathUtils.radToDeg(spherical.theta);
  const pitch = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi);
  return { heading, pitch };
}

function setCameraFromSpherical(camera: THREE.Camera, heading: number, pitch: number) {
  const phi = THREE.MathUtils.degToRad(90 - pitch);
  const theta = THREE.MathUtils.degToRad(heading);
  const radius = 400;

  camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
  camera.position.y = radius * Math.cos(phi);
  camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
  camera.lookAt(0, 0, 0);
}

export function CameraController({
  initialHeading,
  initialPitch,
  enabled = true,
  locationKey,
  controlledHeading,
  controlledPitch,
  onCameraChange
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const lastAnglesRef = useRef({ heading: initialHeading, pitch: initialPitch });
  const isControlled = controlledHeading !== undefined && controlledPitch !== undefined;

  const updateCameraFromControlled = useCallback(() => {
    if (controlledHeading === undefined || controlledPitch === undefined) return;
    setCameraFromSpherical(camera, controlledHeading, controlledPitch);
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    lastAnglesRef.current = { heading: controlledHeading, pitch: controlledPitch };
  }, [camera, controlledHeading, controlledPitch]);

  useEffect(() => {
    setCameraFromSpherical(camera, initialHeading, initialPitch);
    lastAnglesRef.current = { heading: initialHeading, pitch: initialPitch };
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  }, [camera, initialHeading, initialPitch, locationKey]);

  useEffect(() => {
    if (isControlled) {
      updateCameraFromControlled();
    }
  }, [isControlled, controlledHeading, controlledPitch, updateCameraFromControlled]);

  useFrame(() => {
    if (isControlled || !onCameraChange || !enabled) return;

    const currentAngles = getSphericalFromCamera(camera);
    const headingDiff = Math.abs(currentAngles.heading - lastAnglesRef.current.heading);
    const pitchDiff = Math.abs(currentAngles.pitch - lastAnglesRef.current.pitch);

    if (headingDiff > 0.1 || pitchDiff > 0.1) {
      lastAnglesRef.current = currentAngles;
      onCameraChange(currentAngles.heading, currentAngles.pitch);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={enabled && !isControlled}
      rotateSpeed={-0.5}
      autoRotate={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={5 * Math.PI / 6}
      enableDamping
      dampingFactor={0.05}
    />
  );
}
