import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { WeatherType } from '@/store/useEditorStore';

/* ============================================================
 * 职责分层：
 * 1. 配置层 - 基础天气参数（固定最大值）
 * 2. 强度计算层 - 根据 intensity 计算动态参数
 * 3. 粒子生成层 - 球壳均匀分布生成
 * 4. 粒子运动层 - 每帧更新 + 边界重生
 * 5. 渲染层 - Three.js 渲染
 * ============================================================ */

/* ------------------------------------------------------------
 * 1. 配置层 - 各种天气的基础参数定义
 * ------------------------------------------------------------ */
interface WeatherBaseConfig {
  maxCount: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
  baseSpeed: number;
  fogColor: number;
  fogDensityBase: number;
}

interface WeatherParticleState {
  velocity: THREE.Vector3;
  phase: number;
  localOffset: THREE.Vector3;
}

const MAX_PARTICLES = 10000;
const SHELL_RADIUS = 340;
const SHELL_MIN_RADIUS = 30;

const WEATHER_BASE_CONFIG: Record<WeatherType, WeatherBaseConfig> = {
  none: {
    maxCount: 0,
    minSize: 0,
    maxSize: 0,
    minOpacity: 0,
    maxOpacity: 0,
    baseSpeed: 0,
    fogColor: 0x000000,
    fogDensityBase: 0,
  },
  rain: {
    maxCount: 6000,
    minSize: 0.5,
    maxSize: 1.8,
    minOpacity: 0.3,
    maxOpacity: 0.85,
    baseSpeed: 110,
    fogColor: 0x556677,
    fogDensityBase: 0.0006,
  },
  snow: {
    maxCount: 5000,
    minSize: 1.0,
    maxSize: 3.5,
    minOpacity: 0.5,
    maxOpacity: 0.95,
    baseSpeed: 10,
    fogColor: 0x9eb4c8,
    fogDensityBase: 0.0005,
  },
  fog: {
    maxCount: 800,
    minSize: 18,
    maxSize: 55,
    minOpacity: 0.06,
    maxOpacity: 0.28,
    baseSpeed: 0.6,
    fogColor: 0xc8d0d8,
    fogDensityBase: 0.0012,
  },
  sand: {
    maxCount: 7000,
    minSize: 0.4,
    maxSize: 1.6,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    baseSpeed: 65,
    fogColor: 0xd4a574,
    fogDensityBase: 0.0018,
  },
};

const WEATHER_COLOR_FN: Record<WeatherType, (random: number) => THREE.Color> = {
  none: () => new THREE.Color(0x000000),
  rain: (r) => new THREE.Color().setHSL(0.58, 0.25, 0.78 + r * 0.15),
  snow: (r) => new THREE.Color().setHSL(0.6, 0.08, 0.9 + r * 0.08),
  fog: (r) => new THREE.Color().setHSL(0.6, 0.05, 0.85 + r * 0.1),
  sand: (r) => new THREE.Color().setHSL(0.08 + r * 0.04, 0.5, 0.48 + r * 0.2),
};

/* ------------------------------------------------------------
 * 2. 强度计算层 - 根据 intensity 计算动态参数
 * ------------------------------------------------------------ */
function calcDynamicParams(weather: WeatherType, intensity: number) {
  const base = WEATHER_BASE_CONFIG[weather];
  const t = intensity;
  return {
    visibleCount: Math.floor(base.maxCount * (0.2 + t * 0.9)),
    opacity: base.minOpacity + t * (base.maxOpacity - base.minOpacity),
    speedMult: 0.4 + t * 1.4,
    sizeMult: 0.7 + t * 0.6,
    fogDensity: base.fogDensityBase * (0.4 + t * 1.2),
  };
}

function calcParticleSize(weather: WeatherType, intensity: number, random: number) {
  const base = WEATHER_BASE_CONFIG[weather];
  const t = intensity;
  const sizeRange = base.maxSize - base.minSize;
  return (base.minSize + random * sizeRange) * (0.7 + t * 0.6);
}

/* ------------------------------------------------------------
 * 3. 粒子生成层 - 球壳均匀分布
 * ------------------------------------------------------------ */
function generateShellOffset(yOffset = 30): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS - SHELL_MIN_RADIUS);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.6 + yOffset,
    r * Math.cos(phi)
  );
}

function respawnShellOffset(weather: WeatherType): THREE.Vector3 {
  switch (weather) {
    case 'rain':
    case 'snow': {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SHELL_MIN_RADIUS + Math.random() * (SHELL_RADIUS - SHELL_MIN_RADIUS);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        SHELL_RADIUS * 0.4 + Math.random() * 60,
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
      return generateShellOffset();
  }
}

/* ------------------------------------------------------------
 * 4. 粒子运动层 - 更新位置 + 边界检查
 * ------------------------------------------------------------ */
function updateParticleMotion(
  offset: THREE.Vector3,
  velocity: THREE.Vector3,
  phase: number,
  weather: WeatherType,
  delta: number,
  time: number
): boolean {
  switch (weather) {
    case 'rain': {
      offset.x += velocity.x * delta;
      offset.y += velocity.y * delta;
      offset.z += velocity.z * delta;
      return offset.y < -80 || offset.length() > SHELL_RADIUS * 1.15;
    }

    case 'snow': {
      const swayX = Math.sin(time * 0.8 + phase) * 7;
      const swayZ = Math.cos(time * 0.6 + phase * 1.3) * 6;
      offset.x += (velocity.x + swayX) * delta;
      offset.y += velocity.y * delta;
      offset.z += (velocity.z + swayZ) * delta;
      return offset.y < -60 || offset.length() > SHELL_RADIUS * 1.15;
    }

    case 'fog': {
      offset.x += velocity.x * delta;
      offset.y += velocity.y * delta;
      offset.z += velocity.z * delta;
      const dist = offset.length();
      return dist > SHELL_RADIUS * 0.95 || dist < SHELL_MIN_RADIUS * 0.5;
    }

    case 'sand': {
      offset.x += velocity.x * delta;
      offset.y += velocity.y * delta + Math.sin(time * 3 + phase) * 4 * delta;
      offset.z += velocity.z * delta;
      return (
        offset.x < -SHELL_RADIUS * 0.9 ||
        Math.abs(offset.x) > SHELL_RADIUS * 1.3 ||
        Math.abs(offset.z) > SHELL_RADIUS * 1.1
      );
    }

    default:
      return false;
  }
}

function createVelocity(weather: WeatherType, random: THREE.Vector3, speedMult: number): THREE.Vector3 {
  const base = WEATHER_BASE_CONFIG[weather];
  switch (weather) {
    case 'rain':
      return new THREE.Vector3(
        (random.x - 0.5) * 3,
        -base.baseSpeed * speedMult,
        (random.z - 0.5) * 3
      );
    case 'snow':
      return new THREE.Vector3(
        (random.x - 0.5) * 4,
        -base.baseSpeed * speedMult,
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
        -base.baseSpeed * speedMult - random.x * 30,
        (random.y - 0.5) * 8,
        (random.z - 0.3) * 15
      );
    default:
      return new THREE.Vector3();
  }
}

/* ------------------------------------------------------------
 * 5. 渲染层 - 主组件
 * ------------------------------------------------------------ */
interface WeatherParticlesProps {
  weather: WeatherType;
  intensity: number;
}

export function WeatherParticles({ weather, intensity }: WeatherParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<WeatherParticleState[]>([]);
  const sizesRef = useRef<Float32Array | null>(null);
  const prevWeatherRef = useRef<WeatherType>('none');
  const prevIntensityRef = useRef(0);
  const { camera, scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const worldPos = useRef(new THREE.Vector3());

  /* ---------- 初始化固定大小缓冲区 ---------- */
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const sizes = new Float32Array(MAX_PARTICLES);
    const particles: WeatherParticleState[] = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
      positions[i * 3 + 1] = -10000;
      particles.push({
        velocity: new THREE.Vector3(),
        phase: Math.random() * Math.PI * 2,
        localOffset: generateShellOffset(),
      });
    }

    particlesRef.current = particles;
    sizesRef.current = sizes;
    prevWeatherRef.current = 'none';
    prevIntensityRef.current = 0;

    return { positions, colors, sizes };
  }, []);

  /* ---------- 天气切换：重置粒子 ---------- */
  useEffect(() => {
    if (weather === prevWeatherRef.current && prevIntensityRef.current === intensity) return;

    const params = calcDynamicParams(weather, intensity);
    const points = pointsRef.current;
    if (!points) return;

    const geometry = points.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;
    const sizeArray = sizesRef.current;
    const particles = particlesRef.current;
    const colorFn = WEATHER_COLOR_FN[weather];

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const idx = i * 3;
      const isVisible = i < params.visibleCount;

      if (isVisible) {
        particles[i].localOffset.copy(generateShellOffset());
        const randomVec = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        particles[i].velocity.copy(createVelocity(weather, randomVec, params.speedMult));
        particles[i].phase = Math.random() * Math.PI * 2;

        const randomVal = Math.random();
        const color = colorFn(randomVal);
        colorArray[idx] = color.r;
        colorArray[idx + 1] = color.g;
        colorArray[idx + 2] = color.b;

        if (sizeArray) {
          sizeArray[i] = calcParticleSize(weather, intensity, randomVal);
        }
      } else {
        posArray[idx + 1] = -10000;
        colorArray[idx] = 0;
        colorArray[idx + 1] = 0;
        colorArray[idx + 2] = 0;
        if (sizeArray) sizeArray[i] = 0;
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    prevWeatherRef.current = weather;
    prevIntensityRef.current = intensity;
  }, [weather, intensity]);

  /* ---------- 雾效管理 ---------- */
  useEffect(() => {
    const baseConfig = WEATHER_BASE_CONFIG[weather];
    if (weather === 'none' || baseConfig.fogDensityBase === 0) {
      scene.fog = null;
      fogRef.current = null;
      return;
    }

    const params = calcDynamicParams(weather, intensity);
    if (!fogRef.current) {
      fogRef.current = new THREE.FogExp2(baseConfig.fogColor, params.fogDensity);
    } else {
      fogRef.current.color.setHex(baseConfig.fogColor);
      fogRef.current.density = params.fogDensity;
    }
    scene.fog = fogRef.current;

    return () => {
      scene.fog = null;
    };
  }, [weather, intensity, scene]);

  /* ---------- 每帧更新粒子运动 ---------- */
  useFrame((state, delta) => {
    if (!pointsRef.current || weather === 'none') return;

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;
    const params = calcDynamicParams(weather, intensity);
    const particles = particlesRef.current;
    const cameraPos = camera.position;

    for (let i = 0; i < params.visibleCount; i++) {
      const idx = i * 3;
      const particle = particles[i];
      if (!particle) continue;

      const needRespawn = updateParticleMotion(
        particle.localOffset,
        particle.velocity,
        particle.phase,
        weather,
        delta,
        time
      );

      if (needRespawn) {
        particle.localOffset.copy(respawnShellOffset(weather));
      }

      worldPos.current.x = cameraPos.x + particle.localOffset.x;
      worldPos.current.y = cameraPos.y + particle.localOffset.y;
      worldPos.current.z = cameraPos.z + particle.localOffset.z;

      posArray[idx] = worldPos.current.x;
      posArray[idx + 1] = worldPos.current.y;
      posArray[idx + 2] = worldPos.current.z;
    }

    posAttr.needsUpdate = true;
  });

  if (weather === 'none') return null;

  const params = calcDynamicParams(weather, intensity);
  const avgSize = (WEATHER_BASE_CONFIG[weather].minSize + WEATHER_BASE_CONFIG[weather].maxSize) / 2;

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
        size={avgSize * params.sizeMult}
        vertexColors
        transparent
        opacity={params.opacity}
        sizeAttenuation
        depthWrite={false}
        blending={weather === 'fog' ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
