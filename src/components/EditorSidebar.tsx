import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Sticker, Download, RotateCcw, CloudRain, Camera } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { FilterPanel } from '@/components/FilterPanel';
import { WeatherPanel } from '@/components/WeatherPanel';
import { WatermarkPanel } from '@/components/WatermarkPanel';
import { StickerPanel } from '@/components/StickerPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { CameraControlPanel } from '@/components/CameraControlPanel';
import { cn } from '@/lib/utils';
import type { StreetViewLocation } from '@/data/locations';
import type { StreetViewerRef } from '@/components/StreetViewer';

interface EditorSidebarProps {
  getCanvas: () => HTMLCanvasElement | null;
  getStreetViewer: () => StreetViewerRef | null;
  location: StreetViewLocation;
}

const TABS = [
  { id: 'camera' as const, name: '相机', icon: Camera },
  { id: 'weather' as const, name: '天气', icon: CloudRain },
  { id: 'filter' as const, name: '滤镜', icon: Palette },
  { id: 'watermark' as const, name: '文字', icon: Type },
  { id: 'sticker' as const, name: '贴纸', icon: Sticker },
  { id: 'export' as const, name: '导出', icon: Download },
] as const;

export function EditorSidebar({ getCanvas, getStreetViewer, location }: EditorSidebarProps) {
  const { isEditorOpen, setEditorOpen, activeTab, setActiveTab, clearAll } = useEditorStore();

  const renderPanel = () => {
    switch (activeTab) {
      case 'camera':
        return <CameraControlPanel />;
      case 'weather':
        return <WeatherPanel />;
      case 'filter':
        return <FilterPanel />;
      case 'watermark':
        return <WatermarkPanel />;
      case 'sticker':
        return <StickerPanel />;
      case 'export':
        return <ExportPanel getCanvas={getCanvas} getStreetViewer={getStreetViewer} location={location} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isEditorOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
            style={{ pointerEvents: 'none' }}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-96 max-w-full bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">图片编辑</h2>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
                  title="重置所有"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditorOpen(false)}
                  className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="flex px-4 py-3 gap-2 border-b border-white/10">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.name}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {renderPanel()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
