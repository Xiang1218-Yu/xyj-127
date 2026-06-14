import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Type, Palette, RotateCw } from 'lucide-react';
import { useEditorStore, FONT_FAMILIES, COLOR_PRESETS, type Watermark } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';
import { buttonTaps } from '@/animations';

export function WatermarkPanel() {
  const { watermarks, addWatermark, updateWatermark, deleteWatermark, selectedItemId, selectItem } = useEditorStore();
  const [newText, setNewText] = useState('');

  const selectedWatermark = watermarks.find(w => w.id === selectedItemId) as Watermark | undefined;

  const handleAdd = () => {
    const text = newText.trim() || '我的水印';
    addWatermark(text);
    setNewText('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="输入水印文字..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
        <motion.button
          {...buttonTaps.standard}
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-medium flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          添加
        </motion.button>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {watermarks.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-4">暂无水印，点击上方添加</p>
        ) : (
          watermarks.map((wm) => (
            <motion.button
              key={wm.id}
              {...buttonTaps.subtle}
              onClick={() => selectItem(wm.id, 'watermark')}
              className={cn(
                'w-full px-3 py-2 rounded-xl flex items-center justify-between transition-all',
                selectedItemId === wm.id
                  ? 'bg-cyan-500/20 border border-cyan-400/40'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              )}
            >
              <span className="text-white/90 text-sm truncate">{wm.text}</span>
              <div className="flex items-center gap-1">
                <motion.button
                  {...buttonTaps.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWatermark(wm.id);
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

      {selectedWatermark && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="text-white/60 text-xs flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              文字内容
            </label>
            <input
              type="text"
              value={selectedWatermark.text}
              onChange={(e) => updateWatermark(selectedWatermark.id, { text: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-white/60 text-xs">字体大小</label>
              <input
                type="range"
                min="12"
                max="72"
                value={selectedWatermark.fontSize}
                onChange={(e) => updateWatermark(selectedWatermark.id, { fontSize: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
              <span className="text-white/60 text-xs">{selectedWatermark.fontSize}px</span>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                旋转角度
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedWatermark.rotation}
                onChange={(e) => updateWatermark(selectedWatermark.id, { rotation: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
              <span className="text-white/60 text-xs">{selectedWatermark.rotation}°</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs">不透明度</label>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedWatermark.opacity * 100}
              onChange={(e) => updateWatermark(selectedWatermark.id, { opacity: Number(e.target.value) / 100 })}
              className="w-full accent-cyan-400"
            />
            <span className="text-white/60 text-xs">{Math.round(selectedWatermark.opacity * 100)}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs">字体</label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_FAMILIES.map((font) => (
                <motion.button
                  key={font.id}
                  {...buttonTaps.subtle}
                  onClick={() => updateWatermark(selectedWatermark.id, { fontFamily: font.value })}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm transition-all',
                    selectedWatermark.fontFamily === font.value
                      ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  )}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <motion.button
                  key={color}
                  {...buttonTaps.icon}
                  onClick={() => updateWatermark(selectedWatermark.id, { color })}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 transition-all',
                    selectedWatermark.color === color
                      ? 'border-cyan-400 scale-110'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
