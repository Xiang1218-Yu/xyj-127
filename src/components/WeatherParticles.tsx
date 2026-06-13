import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { WeatherType } from '@/store/useEditorStore';

interface WeatherParticlesProps {
  weather: WeatherType;
  intensity: number;
}

interface ParticleData {
  velocity: THREE.Vector3;
  rotationSpeed: number;
  phase: number;
}

export function WeatherParticles({ weather, intensity }: WeatherParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleDataRef = useRef<ParticleData[]>([]);
  const { camera } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const { scene } = useThree();

  const particleCount = useMemo(() => {
    if (weather === 'none') return 0;
    const baseCount = weather === 'fog' ? 300 : weather === 'sand' ? 4000 : 3000;
    return Math.floor(baseCount * (0.3 + intensity * 1.2));
  }, [weather, intensity]);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleData: ParticleData[] = [];

    const radius = 350;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.2 + Math.random() * 0.8);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5 + 50;
      positions[i * 3 + 2] = r * Math.cos(phi);

      let color: THREE.Color;
      const velocity = new THREE.Vector3();

      switch (weather) {
        case 'rain': {
          color = new THREE.Color().setHSL(0.58, 0.3, 0.8 + Math.random() * 0.15);
          velocity.set(
            (Math.random() - 0.5) * 2,
            -(80 + Math.random() * 60),
            (Math.random() - 0.5) * 2
          );
          break;
        }
        case 'snow': {
          color = new THREE.Color().setHSL(0.6, 0.1, 0.9 + Math.random() * 0.1);
          velocity.set(
            (Math.random() - 0.5) * 5,
            -(5 + Math.random() * 8),
            (Math.random() - 0.5) * 5
          );
          break;
        }
        case 'fog': {
          color = new THREE.Color().setHSL(0.6, 0.05, 0.85 + Math.random() * 0.1);
          velocity.set(
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 1
          );
          break;
        }
        case 'sand': {
          const sandHue = 0.08 + Math.random() * 0.05;
          color = new THREE.Color().setHSL(sandHue, 0.5, 0.5 + Math.random() * 0.2);
          velocity.set(
            30 + Math.random() * 50,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.3) * 20
          );
          break;
        }
        default: {
          color = new THREE.Color(0xffffff);
        }
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      particleData.push({
        velocity,
        rotationSpeed: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleDataRef.current = particleData;
    return { positions, colors };
  }, [particleCount, weather]);

  useEffect(() => {
    if (weather === 'fog') {
      const fog = new THREE.FogExp2(0xc8d0d8, 0.0015 * intensity);
      scene.fog = fog;
      fogRef.current = fog;
    } else if (weather === 'sand') {
      const fog = new THREE.FogExp2(0xd4a574, 0.002 * intensity);
      scene.fog = fog;
      fogRef.current = fog;
    } else if (weather === 'rain') {
      const fog = new THREE.FogExp2(0x556677, 0.0008 * intensity);
      scene.fog = fog;
      fogRef.current = fog;
    } else {
      scene.fog = null;
      fogRef.current = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [weather, intensity, scene]);

  useFrame((state, delta) => {
    if (!pointsRef.current || weather === 'none') return;

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;
    const cameraPos = camera.position;
    const radius = 350;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const data = particleDataRef.current[i];
      if (!data) continue;

      let x = posArray[idx];
      let y = posArray[idx + 1];
      let z = posArray[idx + 2];

      switch (weather) {
        case 'rain': {
          x += data.velocity.x * delta;
          y += data.velocity.y * delta;
          z += data.velocity.z * delta;
          if (y < -50) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 0.5);
            const r = radius * (0.3 + Math.random() * 0.7);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = 150 + Math.random() * 100;
            z = r * Math.cos(phi);
          }
          break;
        }

        case 'snow': {
          const swayX = Math.sin(time * 0.8 + data.phase) * 8;
          const swayZ = Math.cos(time * 0.6 + data.phase * 1.3) * 6;
          x += (data.velocity.x + swayX) * delta;
          y += data.velocity.y * delta;
          z += (data.velocity.z + swayZ) * delta;
          if (y < -30) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 0.6);
            const r = radius * (0.3 + Math.random() * 0.7);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = 120 + Math.random() * 100;
            z = r * Math.cos(phi);
          }
          break;
        }

        case 'fog': {
          x += data.velocity.x * delta * intensity;
          y += data.velocity.y * delta * intensity;
          z += data.velocity.z * delta * intensity;
          const distFog = Math.sqrt(x * x + y * y + z * z);
          if (distFog > radius * 0.95) {
            const norm = 1 / distFog;
            x = -x * norm * radius * 0.8;
            y = -y * norm * radius * 0.4;
            z = -z * norm * radius * 0.8;
          }
          break;
        }

        case 'sand': {
          x += data.velocity.x * delta;
          y += data.velocity.y * delta + Math.sin(time * 3 + data.phase) * 5 * delta;
          z += data.velocity.z * delta;
          const dx = x - cameraPos.x;
          const dz = z - cameraPos.z;
          if (x > 250 || Math.abs(dx) > 400 || Math.abs(dz) > 400) {
            x = cameraPos.x - 300 - Math.random() * 100;
            y = (Math.random() - 0.2) * 150;
            z = cameraPos.z + (Math.random() - 0.5) * 400;
          }
          break;
        }
      }

      posArray[idx] = x;
      posArray[idx + 1] = y;
      posArray[idx + 2] = z;
    }

    posAttr.needsUpdate = true;

    if (fogRef.current) {
      fogRef.current.density = weather === 'fog' 
        ? 0.0012 * intensity 
        : weather === 'sand'
        ? 0.0018 * intensity
        : 0.0006 * intensity;
    }
  });

  if (weather === 'none' || particleCount === 0) return null;

  const baseOpacity = weather === 'fog' 
    ? 0.15 + intensity * 0.15 
    : weather === 'rain'
    ? 0.5 + intensity * 0.3
    : weather === 'sand'
    ? 0.45 + intensity * 0.35
    : 0.7 + intensity * 0.3;

  const pointSize = weather === 'fog' ? 25 : weather === 'snow' ? 2 : 1.2;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        vertexColors
        transparent
        opacity={baseOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={weather === 'fog' ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
