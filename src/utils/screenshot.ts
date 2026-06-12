import type { Watermark, Sticker } from '@/store/useEditorStore';
import type { StreetViewLocation } from '@/data/locations';

interface CaptureOptions {
  width?: number;
  height?: number;
  filterCss?: string;
  watermarks?: Watermark[];
  stickers?: Sticker[];
  location?: StreetViewLocation;
  includeInfo?: boolean;
}

export async function captureScene(
  canvas: HTMLCanvasElement,
  options: CaptureOptions = {}
): Promise<string> {
  const {
    width = canvas.width,
    height = canvas.height,
    filterCss = 'none',
    watermarks = [],
    stickers = [],
    location,
    includeInfo = false,
  } = options;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = width;
  exportCanvas.height = height;
  const ctx = exportCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  if (filterCss && filterCss !== 'none') {
    ctx.filter = filterCss;
  }

  ctx.drawImage(canvas, 0, 0, width, height);

  ctx.filter = 'none';

  if (includeInfo && location) {
    drawLocationInfo(ctx, location, width, height);
  }

  watermarks.forEach(wm => {
    const x = (wm.x / 100) * width;
    const y = (wm.y / 100) * height;

    ctx.save();
    ctx.globalAlpha = wm.opacity;
    ctx.translate(x, y);
    ctx.rotate((wm.rotation * Math.PI) / 180);
    ctx.font = `${wm.fontSize}px ${wm.fontFamily}`;
    ctx.fillStyle = wm.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(wm.text, 0, 0);
    ctx.restore();
  });

  stickers.forEach(sticker => {
    const x = (sticker.x / 100) * width;
    const y = (sticker.y / 100) * height;
    const fontSize = 48 * sticker.scale;

    ctx.save();
    ctx.globalAlpha = sticker.opacity;
    ctx.translate(x, y);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.scale(sticker.scale, sticker.scale);
    ctx.font = `${fontSize}px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  });

  return exportCanvas.toDataURL('image/png', 1.0);
}

function drawLocationInfo(
  ctx: CanvasRenderingContext2D,
  location: StreetViewLocation,
  width: number,
  height: number
) {
  const gradient = ctx.createLinearGradient(0, height - 200, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height - 200, width, 200);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 10;

  ctx.font = 'bold 48px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(location.name, 48, height - 100);

  ctx.font = '24px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(`${location.city}, ${location.country}`, 48, height - 56);

  ctx.restore();
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function createShareCard(
  backgroundCanvas: HTMLCanvasElement,
  options: CaptureOptions & {
    cardStyle?: 'minimal' | 'elegant' | 'vibrant';
  } = {}
): Promise<string> {
  const {
    location,
    filterCss = 'none',
    watermarks = [],
    stickers = [],
    cardStyle = 'elegant',
  } = options;

  const cardWidth = 1200;
  const cardHeight = 1500;

  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = cardWidth;
  cardCanvas.height = cardHeight;
  const ctx = cardCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

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

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 24);
  ctx.clip();

  if (filterCss && filterCss !== 'none') {
    ctx.filter = filterCss;
  }

  ctx.drawImage(backgroundCanvas, photoX, photoY, photoWidth, photoHeight);
  ctx.restore();

  watermarks.forEach(wm => {
    const x = photoX + (wm.x / 100) * photoWidth;
    const y = photoY + (wm.y / 100) * photoHeight;
    const scale = photoWidth / backgroundCanvas.width;

    ctx.save();
    ctx.globalAlpha = wm.opacity;
    ctx.translate(x, y);
    ctx.rotate((wm.rotation * Math.PI) / 180);
    ctx.font = `${wm.fontSize * scale}px ${wm.fontFamily}`;
    ctx.fillStyle = wm.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(wm.text, 0, 0);
    ctx.restore();
  });

  stickers.forEach(sticker => {
    const x = photoX + (sticker.x / 100) * photoWidth;
    const y = photoY + (sticker.y / 100) * photoHeight;
    const scale = (photoWidth / backgroundCanvas.width) * sticker.scale;
    const fontSize = 48 * scale;

    ctx.save();
    ctx.globalAlpha = sticker.opacity;
    ctx.translate(x, y);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.scale(sticker.scale, sticker.scale);
    ctx.font = `${fontSize}px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
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
    ctx.fillText(location.description, cardWidth / 2, textY + 100, cardWidth - 160);
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
  ctx.fillText('🌍 全球街景漫游', cardWidth / 2, footerY);
  
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillStyle = subTextColor;
  ctx.fillText('探索世界的每一个角落', cardWidth / 2, footerY + 35);
  ctx.restore();

  return cardCanvas.toDataURL('image/png', 1.0);
}
