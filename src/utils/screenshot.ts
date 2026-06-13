import type { StreetViewLocation } from '@/data/locations';
import type { Watermark, Sticker } from '@/store/useEditorStore';

interface CaptureOptions {
  sceneDataUrl: string;
  sceneWidth: number;
  sceneHeight: number;
  filterCss?: string;
  watermarks?: Watermark[];
  stickers?: Sticker[];
  location?: StreetViewLocation;
  includeInfo?: boolean;
  exportWidth?: number;
  exportHeight?: number;
}

export async function captureScene(
  options: CaptureOptions
): Promise<string> {
  const {
    sceneDataUrl,
    sceneWidth,
    sceneHeight,
    filterCss = 'none',
    watermarks = [],
    stickers = [],
    location,
    includeInfo = false,
  } = options;

  if (!sceneDataUrl) {
    throw new Error('No scene data');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = sceneWidth;
        canvas.height = sceneHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No 2D context'));
          return;
        }

        if (filterCss && filterCss !== 'none') {
          ctx.filter = filterCss;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';

        stickers.forEach(sticker => {
          const x = (sticker.x / 100) * canvas.width;
          const y = (sticker.y / 100) * canvas.height;
          const size = Math.round(48 * sticker.scale * (canvas.width / 1920));

          ctx.save();
          ctx.globalAlpha = sticker.opacity;
          ctx.translate(x, y);
          ctx.rotate((sticker.rotation * Math.PI) / 180);
          ctx.font = `${size}px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Symbola, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sticker.emoji, 0, 0);
          ctx.restore();
        });

        watermarks.forEach(wm => {
          const x = (wm.x / 100) * canvas.width;
          const y = (wm.y / 100) * canvas.height;
          const scale = canvas.width / 1920;
          const fontSize = Math.max(12, Math.round(wm.fontSize * scale));

          ctx.save();
          ctx.globalAlpha = wm.opacity;
          ctx.translate(x, y);
          ctx.rotate((wm.rotation * Math.PI) / 180);
          ctx.font = `${fontSize}px ${wm.fontFamily}`;
          ctx.fillStyle = wm.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = Math.round(4 * scale);
          ctx.shadowOffsetX = Math.round(2 * scale);
          ctx.shadowOffsetY = Math.round(2 * scale);
          ctx.fillText(wm.text, 0, 0);
          ctx.restore();
        });

        if (includeInfo && location) {
          const gradientH = canvas.height * 0.15;
          const gradient = ctx.createLinearGradient(0, canvas.height - gradientH, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height - gradientH, canvas.width, gradientH);

          const s = canvas.width / 1920;
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = Math.round(10 * s);

          ctx.font = `bold ${Math.round(48 * s)}px system-ui, sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(location.name, Math.round(48 * s), canvas.height - Math.round(56 * s));

          ctx.font = `${Math.round(24 * s)}px system-ui, sans-serif`;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillText(`${location.city}, ${location.country}`, Math.round(48 * s), canvas.height - Math.round(20 * s));
          ctx.restore();
        }

        resolve(canvas.toDataURL('image/png', 1.0));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load scene image'));
    img.src = sceneDataUrl;
  });
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface ShareCardOptions {
  sceneDataUrl: string;
  sceneWidth: number;
  sceneHeight: number;
  filterCss?: string;
  watermarks?: Watermark[];
  stickers?: Sticker[];
  location?: StreetViewLocation;
  cardStyle?: 'minimal' | 'elegant' | 'vibrant';
}

export async function createShareCard(
  options: ShareCardOptions
): Promise<string> {
  const {
    sceneDataUrl,
    sceneWidth,
    sceneHeight,
    filterCss = 'none',
    watermarks = [],
    stickers = [],
    location,
    cardStyle = 'elegant',
  } = options;

  const photoDataUrl = await captureScene({
    sceneDataUrl,
    sceneWidth,
    sceneHeight,
    filterCss,
    watermarks,
    stickers,
  });

  const cardWidth = 1200;
  const cardHeight = 1500;

  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = cardWidth;
  cardCanvas.height = cardHeight;
  const ctx = cardCanvas.getContext('2d')!;

  if (cardStyle === 'minimal') {
    ctx.fillStyle = '#ffffff';
  } else if (cardStyle === 'vibrant') {
    const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = '#0f172a';
  }
  ctx.fillRect(0, 0, cardWidth, cardHeight);

  const photoWidth = cardWidth - 80;
  const photoHeight = 900;
  const photoX = 40;
  const photoY = 40;

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 24);
      } else {
        const r = 24;
        ctx.moveTo(photoX + r, photoY);
        ctx.arcTo(photoX + photoWidth, photoY, photoX + photoWidth, photoY + photoHeight, r);
        ctx.arcTo(photoX + photoWidth, photoY + photoHeight, photoX, photoY + photoHeight, r);
        ctx.arcTo(photoX, photoY + photoHeight, photoX, photoY, r);
        ctx.arcTo(photoX, photoY, photoX + photoWidth, photoY, r);
      }
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
      ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = photoDataUrl;
  });

  const textY = photoY + photoHeight + 80;
  const textColor = cardStyle === 'minimal' ? '#1e293b' : '#ffffff';
  const subTextColor = cardStyle === 'minimal' ? '#64748b' : 'rgba(255,255,255,0.6)';

  if (location) {
    ctx.save();
    ctx.font = 'bold 56px system-ui, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(location.name, cardWidth / 2, textY);

    ctx.font = '28px system-ui, sans-serif';
    ctx.fillStyle = subTextColor;
    ctx.fillText(`${location.city} · ${location.country}`, cardWidth / 2, textY + 50);

    ctx.font = '24px system-ui, sans-serif';
    ctx.fillStyle = subTextColor;
    wrapText(ctx, location.description, cardWidth / 2, textY + 100, cardWidth - 160, 36);
    ctx.restore();
  }

  const footerY = cardHeight - 80;
  ctx.save();
  if (cardStyle === 'minimal') {
    ctx.fillStyle = '#06b6d4';
  } else if (cardStyle === 'vibrant') {
    ctx.fillStyle = '#ffffff';
  } else {
    const gradient = ctx.createLinearGradient(cardWidth / 2 - 100, footerY, cardWidth / 2 + 100, footerY);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
  }
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = cardStyle === 'minimal' ? (ctx.fillStyle as string) : '#ffffff';
  ctx.fillText('🌍 全球街景漫游', cardWidth / 2, footerY);
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillStyle = subTextColor;
  ctx.fillText('探索世界的每一个角落', cardWidth / 2, footerY + 35);
  ctx.restore();

  return cardCanvas.toDataURL('image/png', 1.0);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split('');
  let line = '';
  let lineY = y;

  for (let n = 0; n < chars.length; n++) {
    const test = line + chars[n];
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, lineY);
      line = chars[n];
      lineY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, lineY);
}
