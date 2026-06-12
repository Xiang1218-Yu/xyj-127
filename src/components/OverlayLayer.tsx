import { useRef, useEffect, useCallback } from 'react';
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
  } = useEditorStore();

  const dragStateRef = useRef<{
    isDragging: boolean;
    itemId: string | null;
    itemType: 'watermark' | 'sticker' | null;
    startX: number;
    startY: number;
    startItemX: number;
    startItemY: number;
  }>({
    isDragging: false,
    itemId: null,
    itemType: null,
    startX: 0,
    startY: 0,
    startItemX: 0,
    startItemY: 0,
  });

  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    itemId: string,
    itemType: 'watermark' | 'sticker',
    item: Watermark | Sticker
  ) => {
    if (!isEditorOpen) return;
    e.preventDefault();
    e.stopPropagation();
    
    selectItem(itemId, itemType);
    
    const container = containerRef.current;
    if (!container) return;
    
    dragStateRef.current = {
      isDragging: true,
      itemId,
      itemType,
      startX: e.clientX,
      startY: e.clientY,
      startItemX: item.x,
      startItemY: item.y,
    };
  }, [containerRef, selectItem, isEditorOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const { startX, startY, startItemX, startItemY, itemId, itemType } = dragStateRef.current;
      
      const deltaX = ((e.clientX - startX) / rect.width) * 100;
      const deltaY = ((e.clientY - startY) / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(100, startItemX + deltaX));
      const newY = Math.max(0, Math.min(100, startItemY + deltaY));
      
      if (itemType === 'watermark') {
        updateWatermark(itemId!, { x: newX, y: newY });
      } else if (itemType === 'sticker') {
        updateSticker(itemId!, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      dragStateRef.current.isDragging = false;
      dragStateRef.current.itemId = null;
      dragStateRef.current.itemType = null;
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!isEditorOpen) return;
      const target = e.target as HTMLElement;
      if (!target.closest('[data-overlay-item]')) {
        selectItem(null, null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, updateWatermark, updateSticker, selectItem, isEditorOpen]);

  if (!isEditorOpen) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {watermarks.map((wm) => (
        <div
          key={wm.id}
          data-overlay-item="watermark"
          onMouseDown={(e) => handleMouseDown(e, wm.id, 'watermark', wm)}
          className={cn(
            'absolute pointer-events-auto cursor-move select-none',
            selectedItemId === wm.id && selectedItemType === 'watermark' && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded'
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
          }}
        >
          {wm.text}
        </div>
      ))}

      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          data-overlay-item="sticker"
          onMouseDown={(e) => handleMouseDown(e, sticker.id, 'sticker', sticker)}
          className={cn(
            'absolute pointer-events-auto cursor-move select-none',
            selectedItemId === sticker.id && selectedItemType === 'sticker' && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded'
          )}
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
            opacity: sticker.opacity,
            fontSize: '48px',
            lineHeight: 1,
          }}
        >
          {sticker.emoji}
        </div>
      ))}
    </div>
  );
}
