import { toPng } from 'html-to-image';
import type { StreetViewLocation } from '@/data/locations';

interface CaptureOptions {
  filterCss?: string;
  location?: StreetViewLocation;
  includeInfo?: boolean;
}

export async function captureScene(
  containerEl: HTMLElement,
  canvasEl: HTMLCanvasElement,
  options: CaptureOptions = {}
): Promise<string> {
  const { filterCss = 'none' } = options;

  const clone = containerEl.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = `${containerEl.offsetWidth}px`;
  clone.style.height = `${containerEl.offsetHeight}px`;
  clone.style.overflow = 'hidden';
  clone.style.pointerEvents = 'none';

  const clonedCanvas = clone.querySelector('canvas');
  if (clonedCanvas) {
    const ctx = clonedCanvas.getContext('2d');
    if (ctx) {
      clonedCanvas.width = canvasEl.width;
      clonedCanvas.height = canvasEl.height;
      if (filterCss && filterCss !== 'none') {
        ctx.filter = filterCss;
      }
      ctx.drawImage(canvasEl, 0, 0);
    }
  }

  const overlayDiv = clone.querySelector('[data-overlay-layer]');
  if (overlayDiv) {
    overlayDiv.removeAttribute('style');
    (overlayDiv as HTMLElement).style.cssText = 'position: absolute; inset: 0; pointer-events: none;';
  }

  document.body.appendChild(clone);

  try {
    const dataUrl = await toPng(clone, {
      width: containerEl.offsetWidth,
      height: containerEl.offsetHeight,
      pixelRatio: 2,
      style: {
        filter: 'none',
      },
    });

    if (options.includeInfo && options.location) {
      return addLocationInfo(dataUrl, options.location);
    }

    return dataUrl;
  } finally {
    document.body.removeChild(clone);
  }
}

async function addLocationInfo(dataUrl: string, location: StreetViewLocation): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(img, 0, 0);

      const gradientH = img.height * 0.15;
      const gradient = ctx.createLinearGradient(0, canvas.height - gradientH, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - gradientH, canvas.width, gradientH);

      const scale = canvas.width / 1920;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10;

      ctx.font = `bold ${Math.round(48 * scale)}px system-ui, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(location.name, Math.round(48 * scale), canvas.height - Math.round(56 * scale));

      ctx.font = `${Math.round(24 * scale)}px system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(`${location.city}, ${location.country}`, Math.round(48 * scale), canvas.height - Math.round(20 * scale));
      ctx.restore();

      resolve(canvas.toDataURL('image/png', 1.0));
    };
    img.src = dataUrl;
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

export async function createShareCard(
  containerEl: HTMLElement,
  canvasEl: HTMLCanvasElement,
  options: CaptureOptions & {
    cardStyle?: 'minimal' | 'elegant' | 'vibrant';
  } = {}
): Promise<string> {
  const {
    location,
    filterCss = 'none',
    cardStyle = 'elegant',
  } = options;

  const sceneDataUrl = await captureScene(containerEl, canvasEl, { filterCss });

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
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 24);
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
      ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = sceneDataUrl;
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
