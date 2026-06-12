import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { StreetViewLocation, PanoramaTheme } from '@/data/locations';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b})`;
}

function generateStreetViewPanorama(
  location: StreetViewLocation,
  width: number = 4096,
  height: number = 2048
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const theme = location.theme;

  const horizonY = height * 0.5;

  // 1. Sky Gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGradient.addColorStop(0, theme.skyTop);
  skyGradient.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, horizonY);

  // 2. Sky effects based on time of day
  if (theme.timeOfDay === 'night') {
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (horizonY * 0.8);
      const radius = Math.random() * 1.5 + 0.5;
      const alpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }

  if (theme.timeOfDay === 'sunset' || theme.timeOfDay === 'dawn') {
    const sunX = width * 0.7;
    const sunY = horizonY - 80;
    const sunRadius = theme.timeOfDay === 'sunset' ? 120 : 90;
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, 'rgba(255, 220, 150, 0.9)');
    sunGradient.addColorStop(0.3, 'rgba(255, 160, 80, 0.5)');
    sunGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
    ctx.fillStyle = sunGradient;
    ctx.fillRect(0, 0, width, horizonY);
    ctx.beginPath();
    ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
    ctx.fillStyle = theme.timeOfDay === 'sunset' ? '#FF8C42' : '#FFD700';
    ctx.fill();
  }

  if (location.id === 'northern-lights') {
    for (let i = 0; i < 8; i++) {
      const waveY = horizonY * 0.2 + Math.random() * horizonY * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= width; x += 20) {
        const y = waveY + Math.sin(x * 0.003 + i) * 60 + Math.sin(x * 0.007 + i * 2) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, horizonY);
      ctx.lineTo(0, horizonY);
      ctx.closePath();
      const auroraGradient = ctx.createLinearGradient(0, waveY - 100, 0, horizonY);
      auroraGradient.addColorStop(0, 'rgba(0, 255, 127, 0)');
      auroraGradient.addColorStop(0.5, `rgba(0, 255, 127, ${0.15 + i * 0.02})`);
      auroraGradient.addColorStop(1, `rgba(100, 200, 255, ${0.1 + i * 0.015})`);
      ctx.fillStyle = auroraGradient;
      ctx.fill();
    }
  }

  // Daytime clouds
  if (theme.timeOfDay === 'day') {
    for (let i = 0; i < 15; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * (horizonY * 0.5) + 50;
      const cw = 200 + Math.random() * 300;
      const ch = 40 + Math.random() * 60;
      ctx.beginPath();
      ctx.ellipse(cx, cy, cw / 2, ch / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
      ctx.fill();
    }
  }

  // 3. Mountains (if enabled)
  if (theme.hasMountains) {
    const mountainCount = 5;
    for (let m = 0; m < mountainCount; m++) {
      const baseY = horizonY;
      const peakHeight = 150 + Math.random() * 200;
      ctx.beginPath();
      const startX = -200 + (m * (width + 400)) / mountainCount;
      ctx.moveTo(startX, baseY);
      const segments = 8;
      for (let s = 0; s <= segments; s++) {
        const x = startX + (s * ((width + 400) / mountainCount)) / segments;
        const peakFactor = Math.sin((s / segments) * Math.PI);
        const y = baseY - peakHeight * peakFactor + (Math.random() - 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(startX + (width + 400) / mountainCount, baseY);
      ctx.closePath();
      const mountainColor = m % 2 === 0 ? theme.buildingColor1 : theme.buildingColor2;
      const mountainGradient = ctx.createLinearGradient(0, baseY - peakHeight, 0, baseY);
      mountainGradient.addColorStop(0, lerpColor(mountainColor, '#FFFFFF', location.id === 'northern-lights' ? 0.7 : 0.2));
      mountainGradient.addColorStop(1, mountainColor);
      ctx.fillStyle = mountainGradient;
      ctx.fill();
    }
  }

  // 4. Ground gradient (street/ground)
  const groundGradient = ctx.createLinearGradient(0, horizonY, 0, height);
  groundGradient.addColorStop(0, theme.groundTop);
  groundGradient.addColorStop(1, theme.groundBottom);
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // 5. Water (if enabled)
  if (theme.hasWater) {
    const waterTop = horizonY + (height - horizonY) * 0.3;
    for (let y = waterTop; y < height; y += 3) {
      const waveOffset = Math.sin(y * 0.05) * 10;
      for (let x = 0; x < width; x += 4) {
        const wave = Math.sin(x * 0.015 + y * 0.02) * 5;
        const depth = (y - waterTop) / (height - waterTop);
        let waterColor: string;
        if (location.id === 'bali-beach') {
          waterColor = lerpColor('#40E0D0', '#006994', depth);
        } else if (location.id === 'venice-canals') {
          waterColor = lerpColor('#87CEEB', '#2F4F4F', depth);
        } else if (location.id === 'northern-lights') {
          waterColor = lerpColor('#2a3a5a', '#0a0a2a', depth);
        } else {
          waterColor = lerpColor('#5F9EA0', '#003366', depth);
        }
        ctx.fillStyle = waterColor;
        ctx.fillRect(x + waveOffset + wave, y, 4, 3);
      }
    }
    if (theme.timeOfDay === 'sunset') {
      const reflectionGradient = ctx.createLinearGradient(0, waterTop, 0, waterTop + 200);
      reflectionGradient.addColorStop(0, 'rgba(255, 140, 66, 0.3)');
      reflectionGradient.addColorStop(1, 'rgba(255, 140, 66, 0)');
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(0, waterTop, width, 200);
    }
  }

  // 6. Street pattern for urban locations
  const isUrban = ['modern', 'european', 'asian'].includes(theme.buildingStyle);
  if (isUrban && !theme.hasWater) {
    const roadStart = horizonY + 30;
    // Road surface
    const roadGradient = ctx.createLinearGradient(0, roadStart, 0, height);
    roadGradient.addColorStop(0, '#2a2a2a');
    roadGradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(width * 0.15, roadStart, width * 0.7, height - roadStart);

    // Lane markings (perspective)
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    const vanishingX = width / 2;
    const vanishingY = horizonY + 10;
    for (let i = -3; i <= 3; i++) {
      const startX = vanishingX + i * 80;
      const endX = vanishingX + i * 400;
      ctx.moveTo(startX, vanishingY);
      ctx.lineTo(endX, height);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Sidewalks
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, roadStart, width * 0.15, height - roadStart);
    ctx.fillRect(width * 0.85, roadStart, width * 0.15, height - roadStart);
  }

  // 7. Beach sand pattern
  if (theme.buildingStyle === 'tropical' && theme.hasWater) {
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * width;
      const y = horizonY + Math.random() * (height - horizonY) * 0.3;
      ctx.fillStyle = `rgba(210, 180, 140, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // 8. Buildings - based on style
  if (!theme.hasMountains || ['modern', 'european', 'asian', 'historic', 'tropical'].includes(theme.buildingStyle)) {
    const numBuildings = 40;
    const buildingWidth = width / numBuildings;

    for (let i = 0; i < numBuildings; i++) {
      const x = i * buildingWidth + (Math.random() - 0.5) * buildingWidth * 0.3;
      let bHeight: number;
      let bWidth: number;

      switch (theme.buildingStyle) {
        case 'modern':
          bHeight = 200 + Math.random() * 400;
          bWidth = buildingWidth * (0.6 + Math.random() * 0.5);
          break;
        case 'european':
          bHeight = 80 + Math.random() * 150;
          bWidth = buildingWidth * (0.7 + Math.random() * 0.4);
          break;
        case 'asian':
          if (location.id === 'great-wall') {
            bHeight = 60 + Math.random() * 80;
            bWidth = buildingWidth * 1.5;
          } else {
            bHeight = 150 + Math.random() * 350;
            bWidth = buildingWidth * (0.5 + Math.random() * 0.6);
          }
          break;
        case 'historic':
          if (location.id === 'colosseum') {
            bHeight = 150 + Math.random() * 100;
            bWidth = buildingWidth * 2;
          } else if (location.id === 'machu-picchu') {
            bHeight = 40 + Math.random() * 80;
            bWidth = buildingWidth * (0.8 + Math.random() * 0.6);
          } else {
            bHeight = 80 + Math.random() * 120;
            bWidth = buildingWidth * (0.7 + Math.random() * 0.5);
          }
          break;
        case 'tropical':
          bHeight = 40 + Math.random() * 60;
          bWidth = buildingWidth * (0.6 + Math.random() * 0.5);
          break;
        case 'desert':
          bHeight = 20 + Math.random() * 40;
          bWidth = buildingWidth * (0.8 + Math.random() * 0.6);
          break;
        default:
          bHeight = 100 + Math.random() * 200;
          bWidth = buildingWidth * 0.8;
      }

      const y = horizonY - bHeight;

      // Building body
      const buildingGradient = ctx.createLinearGradient(x, y, x + bWidth, y);
      const colorVariant = i % 2 === 0 ? theme.buildingColor1 : theme.buildingColor2;
      buildingGradient.addColorStop(0, lerpColor(colorVariant, '#000000', 0.15));
      buildingGradient.addColorStop(0.5, colorVariant);
      buildingGradient.addColorStop(1, lerpColor(colorVariant, '#000000', 0.25));
      ctx.fillStyle = buildingGradient;
      ctx.fillRect(x, y, bWidth, bHeight);

      // Building edge shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x + bWidth - 4, y, 4, bHeight);

      // Windows
      if (theme.buildingStyle !== 'desert') {
        const windowRows = Math.floor(bHeight / 25);
        const windowCols = Math.floor(bWidth / 20);
        for (let wr = 0; wr < windowRows; wr++) {
          for (let wc = 0; wc < windowCols; wc++) {
            const wx = x + 8 + wc * 20;
            const wy = y + 15 + wr * 25;
            const ww = 10;
            const wh = 14;

            if (theme.timeOfDay === 'night') {
              const isLit = Math.random() > 0.3;
              if (isLit) {
                const windowGlow = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 0, wx + ww / 2, wy + wh / 2, 20);
                windowGlow.addColorStop(0, 'rgba(255, 220, 150, 0.4)');
                windowGlow.addColorStop(1, 'rgba(255, 220, 150, 0)');
                ctx.fillStyle = windowGlow;
                ctx.fillRect(wx - 10, wy - 10, ww + 20, wh + 20);
                ctx.fillStyle = Math.random() > 0.5 ? '#FFE4B5' : '#FFFF99';
              } else {
                ctx.fillStyle = '#1a1a2a';
              }
            } else {
              ctx.fillStyle = Math.random() > 0.3 ? '#87CEEB' : '#A0A0A0';
            }
            ctx.fillRect(wx, wy, ww, wh);
          }
        }
      }

      // Special landmark features
      if (i === Math.floor(numBuildings / 2)) {
        if (location.id === 'eiffel-tower') {
          // Eiffel Tower shape
          const towerX = width / 2;
          const towerBase = horizonY;
          const towerTop = horizonY - 380;
          ctx.fillStyle = '#6B4423';
          ctx.beginPath();
          ctx.moveTo(towerX - 80, towerBase);
          ctx.lineTo(towerX - 30, towerBase - 150);
          ctx.lineTo(towerX - 15, towerBase - 280);
          ctx.lineTo(towerX, towerTop);
          ctx.lineTo(towerX + 15, towerBase - 280);
          ctx.lineTo(towerX + 30, towerBase - 150);
          ctx.lineTo(towerX + 80, towerBase);
          ctx.closePath();
          ctx.fill();
          // Tower details
          ctx.strokeStyle = '#4A3015';
          ctx.lineWidth = 2;
          for (let t = 0; t < 5; t++) {
            const ty = towerBase - t * 75;
            const tw = 80 - t * 18;
            ctx.beginPath();
            ctx.moveTo(towerX - tw, ty);
            ctx.lineTo(towerX + tw, ty);
            ctx.stroke();
          }
          // Top light
          if (theme.timeOfDay === 'night' || theme.timeOfDay === 'sunset') {
            ctx.beginPath();
            ctx.arc(towerX, towerTop, 12, 0, Math.PI * 2);
            const sparkle = ctx.createRadialGradient(towerX, towerTop, 0, towerX, towerTop, 40);
            sparkle.addColorStop(0, 'rgba(255, 215, 0, 1)');
            sparkle.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = sparkle;
            ctx.fill();
          }
        }

        if (location.id === 'sydney-opera') {
          // Opera House shells
          const ohX = width / 2;
          const ohY = horizonY - 60;
          ctx.fillStyle = '#F8F8F8';
          for (let s = 0; s < 5; s++) {
            const sx = ohX - 150 + s * 75;
            const sHeight = 80 + Math.abs(s - 2) * -15 + 30;
            ctx.beginPath();
            ctx.moveTo(sx - 30, ohY);
            ctx.quadraticCurveTo(sx, ohY - sHeight, sx + 30, ohY);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Base
          ctx.fillStyle = '#E8DCC8';
          ctx.fillRect(ohX - 180, ohY, 360, 40);
        }

        if (location.id === 'taj-mahal') {
          const tmX = width / 2;
          const tmY = horizonY;
          // Main dome
          ctx.fillStyle = '#FFFAF0';
          ctx.beginPath();
          ctx.arc(tmX, tmY - 150, 90, Math.PI, 0);
          ctx.fill();
          // Dome finial
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.moveTo(tmX - 8, tmY - 240);
          ctx.lineTo(tmX, tmY - 270);
          ctx.lineTo(tmX + 8, tmY - 240);
          ctx.closePath();
          ctx.fill();
          // Main building
          ctx.fillStyle = '#FFFAF0';
          ctx.fillRect(tmX - 160, tmY - 150, 320, 150);
          // Archway
          ctx.fillStyle = '#2F4F4F';
          ctx.beginPath();
          ctx.arc(tmX, tmY - 80, 50, Math.PI, 0);
          ctx.fill();
          ctx.fillRect(tmX - 50, tmY - 80, 100, 80);
          // Minarets
          for (let m = 0; m < 2; m++) {
            const mx = tmX + (m === 0 ? -200 : 200);
            ctx.fillStyle = '#FFFAF0';
            ctx.fillRect(mx - 15, tmY - 180, 30, 180);
            ctx.beginPath();
            ctx.arc(mx, tmY - 180, 18, Math.PI, 0);
            ctx.fill();
          }
          // Reflecting pool hint
          ctx.fillStyle = 'rgba(100, 149, 237, 0.3)';
          ctx.fillRect(tmX - 40, horizonY + 50, 80, height - horizonY - 50);
        }

        if (location.id === 'colosseum') {
          const colX = width / 2;
          const colY = horizonY;
          // Outer wall
          ctx.fillStyle = '#C9A86C';
          ctx.fillRect(colX - 200, colY - 180, 400, 180);
          // Arches (3 tiers)
          ctx.strokeStyle = '#8B7355';
          ctx.lineWidth = 3;
          for (let tier = 0; tier < 3; tier++) {
            const ty = colY - 50 - tier * 50;
            for (let a = 0; a < 8; a++) {
              const ax = colX - 170 + a * 50;
              ctx.beginPath();
              ctx.arc(ax, ty, 18, Math.PI, 0);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(ax - 18, ty);
              ctx.lineTo(ax - 18, ty + 30);
              ctx.lineTo(ax + 18, ty + 30);
              ctx.lineTo(ax + 18, ty);
              ctx.stroke();
            }
          }
          // Broken top
          ctx.fillStyle = '#A0826D';
          ctx.fillRect(colX - 200, colY - 190, 80, 15);
          ctx.fillRect(colX + 80, colY - 185, 120, 10);
        }
      }
    }

    // Neon signs for night cityscapes
    if (theme.timeOfDay === 'night' && theme.buildingStyle !== 'desert') {
      for (let n = 0; n < 15; n++) {
        const nx = Math.random() * width;
        const ny = horizonY - 100 - Math.random() * 250;
        const nw = 40 + Math.random() * 80;
        const nh = 15 + Math.random() * 25;
        const colors = [theme.accentColor, theme.streetLightColor, '#FF0066', '#00FFFF', '#FFFF00', '#FF69B4'];
        const neonColor = colors[Math.floor(Math.random() * colors.length)];

        const neonGlow = ctx.createRadialGradient(nx + nw / 2, ny + nh / 2, 0, nx + nw / 2, ny + nh / 2, nw);
        neonGlow.addColorStop(0, neonColor + '88');
        neonGlow.addColorStop(1, neonColor + '00');
        ctx.fillStyle = neonGlow;
        ctx.fillRect(nx - nw, ny - nh, nw * 3, nh * 3);

        ctx.fillStyle = neonColor;
        ctx.fillRect(nx, ny, nw, nh);
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(nx, ny, nw, nh);
      }
    }
  }

  // 9. Trees (if enabled)
  if (theme.hasTrees) {
    for (let t = 0; t < 25; t++) {
      const tx = Math.random() * width;
      const ty = horizonY + 10 + Math.random() * 50;
      const scale = 0.5 + Math.random() * 1;

      if (theme.buildingStyle === 'tropical') {
        // Palm tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(tx - 4 * scale, ty - 80 * scale, 8 * scale, 80 * scale);
        // Palm leaves
        ctx.fillStyle = '#228B22';
        for (let l = 0; l < 7; l++) {
          const angle = (l / 7) * Math.PI * 2;
          ctx.save();
          ctx.translate(tx, ty - 80 * scale);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(30 * scale, 0, 40 * scale, 8 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // Tree trunk
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(tx - 5 * scale, ty - 40 * scale, 10 * scale, 40 * scale);
        // Tree foliage
        const foliageColor = theme.timeOfDay === 'night' ? '#0a3d0a' : (location.id === 'great-wall' ? '#8B7355' : '#228B22');
        ctx.fillStyle = foliageColor;
        ctx.beginPath();
        ctx.arc(tx, ty - 60 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tx - 20 * scale, ty - 45 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tx + 20 * scale, ty - 45 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 10. Street lights
  if (isUrban) {
    for (let sl = 0; sl < 20; sl++) {
      const slx = (sl * width) / 20 + 30;
      const sly = horizonY + 80 + sl * 5;
      // Pole
      ctx.fillStyle = theme.streetLightColor;
      ctx.fillRect(slx - 2, sly - 100, 4, 100);
      // Arm
      ctx.fillRect(slx - 2, sly - 100, 25, 3);
      // Light fixture
      ctx.fillStyle = theme.streetLightColor;
      ctx.fillRect(slx + 20, sly - 105, 15, 8);
      // Light glow
      if (theme.timeOfDay === 'night' || theme.timeOfDay === 'sunset') {
        const glowGradient = ctx.createRadialGradient(slx + 27, sly - 95, 0, slx + 27, sly - 95, 120);
        glowGradient.addColorStop(0, 'rgba(255, 220, 150, 0.4)');
        glowGradient.addColorStop(1, 'rgba(255, 220, 150, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(slx - 100, sly - 200, 250, 250);
      }
    }
  }

  // 11. Snow overlay for Iceland
  if (location.id === 'northern-lights') {
    for (let i = 0; i < 100; i++) {
      const sx = Math.random() * width;
      const sy = horizonY + Math.random() * (height - horizonY);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 12. Vignette for atmosphere
  const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.8);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

interface PanoramaSphereProps {
  location: StreetViewLocation;
  onReady?: () => void;
}

function PanoramaSphere({ location, onReady }: PanoramaSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const canvas = generateStreetViewPanorama(location);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }

    setTimeout(() => {
      setIsLoading(false);
      onReady?.();
    }, 500);
  }, [location, onReady]);

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
  locationId: string;
}

function CameraController({ initialHeading, initialPitch, isInteractive, locationId }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const phi = THREE.MathUtils.degToRad(90 - initialPitch);
    const theta = THREE.MathUtils.degToRad(initialHeading);
    const radius = 100;

    camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
  }, [camera, initialHeading, initialPitch, locationId]);

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
        locationId={location.id}
      />
      <ambientLight intensity={0.5} />
      {location.theme.timeOfDay === 'night' && (
        <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      )}
    </Canvas>
  );
}
