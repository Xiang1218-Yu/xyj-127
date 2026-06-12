import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export interface UsePanoramaTextureOptions {
  url: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function usePanoramaTexture({ url, onLoad, onError }: UsePanoramaTextureOptions) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createFallbackTexture = useCallback((): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.4, '#16213e');
    gradient.addColorStop(0.6, '#0f3460');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 500; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
      ctx.fill();
    }

    const horizonY = canvas.height * 0.55;
    const groundGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
    groundGradient.addColorStop(0, '#2d2d44');
    groundGradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

    for (let i = 0; i < 40; i++) {
      const bx = Math.random() * canvas.width;
      const bw = 30 + Math.random() * 80;
      const bh = 60 + Math.random() * 200;
      const by = horizonY - bh;
      ctx.fillStyle = `rgba(30, 30, 50, ${0.5 + Math.random() * 0.3})`;
      ctx.fillRect(bx, by, bw, bh);
      for (let wr = 0; wr < Math.floor(bh / 25); wr++) {
        for (let wc = 0; wc < Math.floor(bw / 20); wc++) {
          if (Math.random() > 0.4) {
            ctx.fillStyle = Math.random() > 0.5
              ? 'rgba(255, 220, 150, 0.8)'
              : 'rgba(150, 200, 255, 0.6)';
            ctx.fillRect(bx + 5 + wc * 20, by + 10 + wr * 25, 8, 12);
          }
        }
      }
    }

    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fallbackTexture = new THREE.CanvasTexture(canvas);
    fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
    fallbackTexture.colorSpace = THREE.SRGBColorSpace;
    return fallbackTexture;
  }, []);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn('Panorama load timed out, using fallback');
        const fallback = createFallbackTexture();
        setTexture(fallback);
        setIsLoading(false);
      }
    }, 5000);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      url,
      (loadedTexture) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
        setIsLoading(false);
        onLoad?.();
      },
      undefined,
      (err) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        console.warn('Panorama load failed, using fallback:', err);
        const fallback = createFallbackTexture();
        setTexture(fallback);
        setIsLoading(false);
        onError?.(err instanceof Error ? err : new Error('Load failed'));
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [url, createFallbackTexture, onLoad, onError]);

  return { texture, isLoading };
}
