import { useRef, useCallback } from 'react';
import { useEditorStore, type Watermark, type Sticker } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';

interface OverlayLayerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function OverlayLayer({ containerRef }: OverlayLayerProps) {
  const {
    watermarks,
    stickers,
    selectedItemId,
    selectedItemType,
    updateWatermark,
    updateSticker,
    selectItem,
    isEditorOpen,
    setEditorOpen,
  } = useEditorStore();

  const dragRef = useRef<{
    active: boolean;
    id: string;
    type: 'watermark' | 'sticker';
    originX: number;
    originY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const handlePointerDown = useCallback((
    e: React.PointerEvent,
    id: string,
    type: 'watermark' | 'sticker',
    item: Watermark | Sticker
  ) => {
    if (!isEditorOpen) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    selectItem(id, type);
    dragRef.current = {
      active: true,
      id,
      type,
      originX: e.clientX,
      originY: e.clientY,
      baseX: item.x,
      baseY: item.y,
    };
  }, [isEditorOpen, selectItem]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag?.active) return;
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const dx = ((e.clientX - drag.originX) / rect.width) * 100;
    const dy = ((e.clientY - drag.originY) / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, drag.baseX + dx));
    const newY = Math.max(0, Math.min(100, drag.baseY + dy));

    if (drag.type === 'watermark') {
      updateWatermark(drag.id, { x: newX, y: newY });
    } else {
      updateSticker(drag.id, { x: newX, y: newY });
    }
  }, [containerRef, updateWatermark, updateSticker]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (dragRef.current) {
      dragRef.current.active = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragRef.current = null;
    }
  }, []);

  const handleLayerPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isEditorOpen) return;
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      selectItem(null, null);
      setEditorOpen(false);
    }
  }, [isEditorOpen, selectItem, setEditorOpen]);

  return (
    <div
      data-overlay-layer
      onPointerDown={handleLayerPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        'absolute inset-0 z-20',
        isEditorOpen && 'pointer-events-auto',
        !isEditorOpen && 'pointer-events-none'
      )}
    >
      {watermarks.map((wm) => (
        <div
          key={wm.id}
          data-overlay-item="watermark"
          onPointerDown={(e) => handlePointerDown(e, wm.id, 'watermark', wm)}
          className={cn(
            'absolute select-none touch-none',
            isEditorOpen ? 'pointer-events-auto cursor-move' : 'pointer-events-none',
            selectedItemId === wm.id && selectedItemType === 'watermark' && isEditorOpen
              && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded px-1'
          )}
          style={{
            left: `${wm.x}%`,
            top: `${wm.y}%`,
            transform: `translate(-50%, -50%) rotate(${wm.rotation}deg)`,
            fontSize: `${wm.fontSize}px`,
            fontFamily: wm.fontFamily,
            color: wm.color,
            opacity: wm.opacity,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
          }}
        >
          {wm.text}
        </div>
      ))}

      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          data-overlay-item="sticker"
          onPointerDown={(e) => handlePointerDown(e, sticker.id, 'sticker', sticker)}
          className={cn(
            'absolute select-none touch-none',
            isEditorOpen ? 'pointer-events-auto cursor-move' : 'pointer-events-none',
            selectedItemId === sticker.id && selectedItemType === 'sticker' && isEditorOpen
              && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded'
          )}
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
            width: `${48 * sticker.scale}px`,
            height: `${48 * sticker.scale}px`,
            opacity: sticker.opacity,
            fontSize: `${48 * sticker.scale}px`,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {sticker.emoji}
        </div>
      ))}
    </div>
  );
}
