import { motion } from 'framer-motion';
import { Trash2, RotateCw, Maximize2 } from 'lucide-react';
import { useEditorStore, STICKER_EMOJIS, type Sticker } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import { buttonTaps } from '@/animations';

export function StickerPanel() {
  const { stickers, addSticker, updateSticker, deleteSticker, selectedItemId, selectItem } = useEditorStore();

  const selectedSticker = stickers.find(s => s.id === selectedItemId) as Sticker | undefined;

  return (
    <div className="space-y-4">
      <h3 className="text-white/90 text-sm font-medium">选择贴纸</h3>
      
      <div className="grid grid-cols-8 gap-2">
        {STICKER_EMOJIS.map((emoji, idx) => (
          <motion.button
            key={idx}
            {...buttonTaps.emoji}
            onClick={() => addSticker(emoji)}
            className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center text-2xl transition-all"
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {stickers.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-4">暂无贴纸，点击上方添加</p>
        ) : (
          stickers.map((sticker) => (
            <motion.button
              key={sticker.id}
              {...buttonTaps.subtle}
              onClick={() => selectItem(sticker.id, 'sticker')}
              className={cn(
                'w-full px-3 py-2 rounded-xl flex items-center justify-between transition-all',
                selectedItemId === sticker.id
                  ? 'bg-cyan-500/20 border border-cyan-400/40'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sticker.emoji}</span>
                <span className="text-white/60 text-xs">
                  位置: {Math.round(sticker.x)}%, {Math.round(sticker.y)}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  {...buttonTaps.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSticker(sticker.id);
                  }}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {selectedSticker && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                缩放
              </label>
              <input
                type="range"
                min="0.3"
                max="3"
                step="0.1"
                value={selectedSticker.scale}
                onChange={(e) => updateSticker(selectedSticker.id, { scale: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
              <span className="text-white/60 text-xs">{selectedSticker.scale.toFixed(1)}x</span>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                旋转
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedSticker.rotation}
                onChange={(e) => updateSticker(selectedSticker.id, { rotation: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
              <span className="text-white/60 text-xs">{selectedSticker.rotation}°</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs">不透明度</label>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedSticker.opacity * 100}
              onChange={(e) => updateSticker(selectedSticker.id, { opacity: Number(e.target.value) / 100 })}
              className="w-full accent-cyan-400"
            />
            <span className="text-white/60 text-xs">{Math.round(selectedSticker.opacity * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
