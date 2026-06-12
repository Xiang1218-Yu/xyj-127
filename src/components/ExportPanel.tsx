import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Image as ImageIcon, Share2, Loader2, Check, X } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { captureScene, createShareCard, downloadImage } from '@/utils/screenshot';
import type { StreetViewLocation } from '@/data/locations';
import { cn } from '@/lib/utils';

interface ExportPanelProps {
  getCanvas: () => HTMLCanvasElement | null;
  location: StreetViewLocation;
}

type CardStyle = 'minimal' | 'elegant' | 'vibrant';

const CARD_STYLES: { id: CardStyle; name: string; preview: string }[] = [
  { id: 'elegant', name: '优雅', preview: 'from-slate-900 to-slate-800' },
  { id: 'minimal', name: '简约', preview: 'from-white to-gray-100' },
  { id: 'vibrant', name: '活力', preview: 'from-cyan-400 via-purple-500 to-pink-500' },
];

export function ExportPanel({ getCanvas, location }: ExportPanelProps) {
  const { watermarks, stickers, getFilterCss } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);
  const [includeInfo, setIncludeInfo] = useState(true);
  const [cardStyle, setCardStyle] = useState<CardStyle>('elegant');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'screenshot' | 'card' | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleCaptureScreenshot = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    setIsExporting(true);
    try {
      const dataUrl = await captureScene(canvas, {
        width: 1920,
        height: 1080,
        filterCss: getFilterCss(),
        watermarks,
        stickers,
        location,
        includeInfo,
      });
      setPreviewUrl(dataUrl);
      setPreviewType('screenshot');
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateShareCard = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    setIsExporting(true);
    try {
      const dataUrl = await createShareCard(canvas, {
        filterCss: getFilterCss(),
        watermarks,
        stickers,
        location,
        cardStyle,
      });
      setPreviewUrl(dataUrl);
      setPreviewType('card');
    } catch (err) {
      console.error('Failed to create share card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    
    const filename = previewType === 'card'
      ? `share-${location.id}-${Date.now()}.png`
      : `screenshot-${location.id}-${Date.now()}.png`;
    
    downloadImage(previewUrl, filename);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white/90 text-sm font-medium">导出设置</h3>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeInfo}
            onChange={(e) => setIncludeInfo(e.target.checked)}
            className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
          />
          <span className="text-white/80 text-sm">截图时包含地点信息</span>
        </label>
      </div>

      <div className="space-y-3">
        <h4 className="text-white/60 text-xs">分享卡片样式</h4>
        <div className="grid grid-cols-3 gap-2">
          {CARD_STYLES.map((style) => (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCardStyle(style.id)}
              className={cn(
                'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                cardStyle === style.id
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/30'
                  : 'border-white/10 hover:border-white/30'
              )}
            >
              <div className={`h-full bg-gradient-to-br ${style.preview} flex items-end justify-center pb-2`}>
                <span className={cn(
                  'text-xs font-medium',
                  style.id === 'minimal' ? 'text-slate-800' : 'text-white'
                )}>
                  {style.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCaptureScreenshot}
          disabled={isExporting}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
          截图保存
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateShareCard}
          disabled={isExporting}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          生成分享卡片
        </motion.button>
      </div>

      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
            onClick={handleClosePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-full overflow-auto"
            >
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <h3 className="text-white font-medium">
                    {previewType === 'card' ? '分享卡片预览' : '截图预览'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className={cn(
                        'px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all',
                        exportSuccess
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      )}
                    >
                      {exportSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          已保存
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          下载图片
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClosePreview}
                      className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
