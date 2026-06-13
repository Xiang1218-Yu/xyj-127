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
  phase: number;
  offset: THREE.Vector3;
}

const MAX_PARTICLES = 8000;
const SHELL_RADIUS = 320;
const SHELL_MIN_RADIUS = 30;

const WEATHER_CONFIG: Record<WeatherType, {
  visibleCount: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
  baseSpeed: number;
}> = {
  none: { visibleCount: 0, minSize: 0, maxSize: 0, minOpacity: 0, maxOpacity: 0, baseSpeed: 0 },
  rain: { visibleCount: 5000, minSize: 0.6, maxSize: 1.5, minOpacity: 0.4, maxOpacity: 0.8, baseSpeed: 100 },
  snow: { visibleCount: 4000, minSize: 1.2, maxSize: 3, minOpacity: 0.6, maxOpacity: 0.95, baseSpeed: 8 },
  fog: { visibleCount: 600, minSize: 20, maxSize: 50, minOpacity: 0.08, maxOpacity: 0.25, baseSpeed: 0.5 },
  sand: { visibleCount: 6000, minSize: 0.5, maxSize: 1.4, minOpacity: 0.35, maxOpacity: 0.75, baseSpeed: 60 },
};

function getWeatherColor(weather: WeatherType, random: number): THREE.Color {
  switch (weather) {
    case 'rain':
      return new THREE.Color().setHSL(0.58, 0.25, 0.78 + random * 0.15);
    case 'snow':
      return new THREE.Color().setHSL(0.6, 0.08, 0.9 + random * 0.08);
    case 'fog':
      return new THREE.Color().setHSL(0.6, 0.05, 0.85 + random * 0.1);
    case 'sand': {
      const sandHue = 0.08 + random * 0.04;
      return new THREE.Color().setHSL(sandHue, 0.5, 0.48 + random * 0.2);
    }
    default:
      return new THREE.Color(0x000000);
  }
}

function getWorldVelocity(weather: WeatherType, random: THREE.Vector3, intensity: number): THREE.Vector3 {
  const speedMult = 0.5 + intensity * 1.2;
  switch (weather) {
    case 'rain':
      return new THREE.Vector3(
        (random.x - 0.5) * 3,
        -WEATHER_CONFIG.rain.baseSpeed * speedMult,
        (random.z - 0.5) * 3
      );
    case 'snow':
      return new THREE.Vector3(
        (random.x - 0.5) * 4,
        -WEATHER_CONFIG.snow.baseSpeed * speedMult,
        (random.z - 0.5) * 4
      );
    case 'fog':
      return new THREE.Vector3(
        (random.x - 0.5) * 0.8,
        (random.y - 0.5) * 0.3,
        (random.z - 0.5) * 0.8
      ).multiplyScalar(speedMult);
    case 'sand':
      return new THREE.Vector3(
        -WEATHER_CONFIG.sand.baseSpeed * speedMult - random.x * 30,
        (random.y - 0.5) * 8,
        (random.z - 0.3) * 15
      );
    default:
      return new THREE.Vector3();
  }
}

function getFogConfig(weather: WeatherType, intensity: number): { color: number; density: number } | null {
  if (weather === 'none') return null;
  const densityMult = 0.4 + intensity * 1.2;
  switch (weather) {
    case 'fog':
      return { color: 0xc8d0d8, density: 0.0012 * densityMult };
    case 'sand':
      return { color: 0xd4a574, density: 0.0018 * densityMult };
    case 'rain':
      return { color: 0x556677, density: 0.0006 * densityMult };
    case 'snow':
      return { color: 0x9eb4c8, density: 0.0005 * densityMult };
    default:
      return null;
  }
}

function generateRandomOffset(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS - SHELL_MIN_RADIUS);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.6 + 30,
    r * Math.cos(phi)
  );
}

function respawnOffset(weather: WeatherType): THREE.Vector3 {
  switch (weather) {
    case 'rain': {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.4);
      const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS - SHELL_MIN_RADIUS);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        SHELL_RADIUS * 0.4 + Math.random() * 50,
        r * Math.cos(phi)
      );
    }
    case 'snow': {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.5);
      const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS - SHELL_MIN_RADIUS);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        SHELL_RADIUS * 0.3 + Math.random() * 60,
        r * Math.cos(phi)
      );
    }
    case 'fog': {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS * 0.5 - SHELL_MIN_RADIUS);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.5 + 20,
        r * Math.cos(phi)
      );
    }
    case 'sand': {
      return new THREE.Vector3(
        SHELL_RADIUS * 0.8 + Math.random() * 60,
        (Math.random() - 0.2) * SHELL_RADIUS * 0.5,
        (Math.random() - 0.5) * SHELL_RADIUS * 0.9
      );
    }
    default:
      return generateRandomOffset();
  }
}

export function WeatherParticles({ weather, intensity }: WeatherParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleDataRef = useRef<ParticleData[]>([]);
  const prevWeatherRef = useRef<WeatherType>('none');
  const { camera, scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const worldPos = useRef(new THREE.Vector3());

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const particleData: ParticleData[] = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -10000;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 0;

      particleData.push({
        velocity: new THREE.Vector3(),
        phase: Math.random() * Math.PI * 2,
        offset: generateRandomOffset(),
      });
    }

    particleDataRef.current = particleData;
    prevWeatherRef.current = 'none';

    return { positions, colors };
  }, []);

  useEffect(() => {
    if (weather === prevWeatherRef.current) return;

    const config = WEATHER_CONFIG[weather];
    const points = pointsRef.current;
    if (!points) return;

    const geometry = points.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;
    const particleData = particleDataRef.current;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const idx = i * 3;
      const isVisible = i < config.visibleCount;

      if (isVisible) {
        particleData[i].offset.copy(generateRandomOffset());

        const randomVec = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        particleData[i].velocity.copy(getWorldVelocity(weather, randomVec, intensity));
        particleData[i].phase = Math.random() * Math.PI * 2;

        const randomVal = Math.random();
        const color = getWeatherColor(weather, randomVal);
        colorArray[idx] = color.r;
        colorArray[idx + 1] = color.g;
        colorArray[idx + 2] = color.b;
      } else {
        posArray[idx] = 0;
        posArray[idx + 1] = -10000;
        posArray[idx + 2] = 0;
        colorArray[idx] = 0;
        colorArray[idx + 1] = 0;
        colorArray[idx + 2] = 0;
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    prevWeatherRef.current = weather;
  }, [weather, intensity]);

  useEffect(() => {
    const fogConfig = getFogConfig(weather, intensity);
    if (fogConfig) {
      if (!fogRef.current) {
        fogRef.current = new THREE.FogExp2(fogConfig.color, fogConfig.density);
      } else {
        fogRef.current.color.setHex(fogConfig.color);
        fogRef.current.density = fogConfig.density;
      }
      scene.fog = fogRef.current;
    } else {
      scene.fog = null;
      fogRef.current = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [weather, intensity, scene]);

  useEffect(() => {
    if (fogRef.current) {
      const fogConfig = getFogConfig(weather, intensity);
      if (fogConfig) {
        fogRef.current.density = fogConfig.density;
      }
    }
  }, [intensity, weather]);

  useFrame((state, delta) => {
    if (!pointsRef.current || weather === 'none') return;

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;
    const config = WEATHER_CONFIG[weather];
    const particleData = particleDataRef.current;
    const cameraPos = camera.position;

    for (let i = 0; i < config.visibleCount; i++) {
      const idx = i * 3;
      const data = particleData[i];
      if (!data) continue;

      const offset = data.offset;

      switch (weather) {
        case 'rain': {
          offset.x += data.velocity.x * delta;
          offset.y += data.velocity.y * delta;
          offset.z += data.velocity.z * delta;

          const dist = offset.length();
          if (offset.y < -80 || dist > SHELL_RADIUS * 1.1) {
            offset.copy(respawnOffset(weather));
          }
          break;
        }

        case 'snow': {
          const swayX = Math.sin(time * 0.8 + data.phase) * 6;
          const swayZ = Math.cos(time * 0.6 + data.phase * 1.3) * 5;
          offset.x += (data.velocity.x + swayX) * delta;
          offset.y += data.velocity.y * delta;
          offset.z += (data.velocity.z + swayZ) * delta;

          const dist = offset.length();
          if (offset.y < -60 || dist > SHELL_RADIUS * 1.1) {
            offset.copy(respawnOffset(weather));
          }
          break;
        }

        case 'fog': {
          offset.x += data.velocity.x * delta;
          offset.y += data.velocity.y * delta;
          offset.z += data.velocity.z * delta;

          const dist = offset.length();
          if (dist > SHELL_RADIUS * 0.95 || dist < SHELL_MIN_RADIUS * 0.5) {
            if (dist > 0) {
              const norm = 1 / dist;
              offset.x = -offset.x * norm * SHELL_RADIUS * 0.75;
              offset.y = -offset.y * norm * SHELL_RADIUS * 0.35;
              offset.z = -offset.z * norm * SHELL_RADIUS * 0.75;
            } else {
              offset.copy(respawnOffset(weather));
            }
          }
          break;
        }

        case 'sand': {
          offset.x += data.velocity.x * delta;
          offset.y += data.velocity.y * delta + Math.sin(time * 3 + data.phase) * 4 * delta;
          offset.z += data.velocity.z * delta;

          if (offset.x < -SHELL_RADIUS * 0.9 || Math.abs(offset.x) > SHELL_RADIUS * 1.3 || Math.abs(offset.z) > SHELL_RADIUS * 1.1) {
            offset.copy(respawnOffset(weather));
          }
          break;
        }
      }

      worldPos.current.x = cameraPos.x + offset.x;
      worldPos.current.y = cameraPos.y + offset.y;
      worldPos.current.z = cameraPos.z + offset.z;

      posArray[idx] = worldPos.current.x;
      posArray[idx + 1] = worldPos.current.y;
      posArray[idx + 2] = worldPos.current.z;
    }

    posAttr.needsUpdate = true;
  });

  if (weather === 'none') return null;

  const config = WEATHER_CONFIG[weather];
  const baseOpacity = config.minOpacity + intensity * (config.maxOpacity - config.minOpacity);
  const pointSize = weather === 'fog' ? 28 : weather === 'snow' ? 2.2 : 1.4;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={MAX_PARTICLES}
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
