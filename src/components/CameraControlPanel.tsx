import { motion } from 'framer-motion';
import { Play, Pause, RotateCw, Eye, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore, type ViewPresetType } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';

export function CameraControlPanel() {
  const {
    autoRotate,
    setAutoRotate,
    autoRotateSpeed,
    setAutoRotateSpeed,
    fov,
    setFov,
    currentViewPreset,
    setCurrentViewPreset
  } = useEditorStore();

  const directionPresets: { id: ViewPresetType; name: string; icon: typeof ArrowUp }[] = [
    { id: 'front', name: '正面', icon: ArrowUp },
    { id: 'back', name: '背面', icon: ArrowDown },
    { id: 'left', name: '左侧', icon: ArrowLeft },
    { id: 'right', name: '右侧', icon: ArrowRight },
    { id: 'top', name: '俯视', icon: Maximize2 },
    { id: 'bottom', name: '仰视', icon: Eye },
  ];

  const lensPresets: { id: ViewPresetType; name: string; icon: typeof ZoomIn; desc: string }[] = [
    { id: 'wide', name: '广角', icon: ZoomOut, desc: '110° FOV' },
    { id: 'default', name: '标准', icon: Eye, desc: '75° FOV' },
    { id: 'telephoto', name: '长焦', icon: ZoomIn, desc: '35° FOV' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white/90 text-sm font-medium mb-3 flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-cyan-400" />
          自动旋转
        </h3>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">
                {autoRotate ? '自动旋转中' : '已暂停'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAutoRotate(!autoRotate)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                autoRotate
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 text-cyan-200'
                  : 'bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white'
              )}
            >
              {autoRotate ? (
                <>
                  <Pause className="w-4 h-4" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  开启
                </>
              )}
            </motion.button>
          </div>

          {autoRotate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">旋转速度</span>
                <span className="text-cyan-300 text-xs font-mono bg-cyan-500/10 px-2 py-1 rounded-md">
                  {autoRotateSpeed.toFixed(1)}x
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={autoRotateSpeed}
                  onChange={(e) => setAutoRotateSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-cyan-400
                    [&::-webkit-slider-thumb]:to-blue-500
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-cyan-400/50
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white/30
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-gradient-to-br
                    [&::-moz-range-thumb]:from-cyan-400
                    [&::-moz-range-thumb]:to-blue-500
                    [&::-moz-range-thumb]:border-none"
                  style={{
                    background: `linear-gradient(to right, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.6) ${((autoRotateSpeed - 0.1) / 4.9) * 100}%, rgba(255,255,255,0.1) ${((autoRotateSpeed - 0.1) / 4.9) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-white/40">
                <span>慢速</span>
                <span>正常</span>
                <span>快速</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-white/90 text-sm font-medium mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          视场角 (FOV)
        </h3>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">当前视场角</span>
            <span className="text-purple-300 text-xs font-mono bg-purple-500/10 px-2 py-1 rounded-md">
              {fov}°
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min={20}
              max={120}
              step={1}
              value={fov}
              onChange={(e) => setFov(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-br
                [&::-webkit-slider-thumb]:from-purple-400
                [&::-webkit-slider-thumb]:to-pink-500
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-purple-400/50
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white/30
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gradient-to-br
                [&::-moz-range-thumb]:from-purple-400
                [&::-moz-range-thumb]:to-pink-500
                [&::-moz-range-thumb]:border-none"
              style={{
                background: `linear-gradient(to right, rgba(192, 132, 252, 0.6) 0%, rgba(192, 132, 252, 0.6) ${((fov - 20) / 100) * 100}%, rgba(255,255,255,0.1) ${((fov - 20) / 100) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-white/40">
            <span>20° 长焦</span>
            <span>70° 标准</span>
            <span>120° 广角</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {lensPresets.map((preset) => {
              const Icon = preset.icon;
              const isActive = currentViewPreset === preset.id || 
                (preset.id === 'default' && fov === 75 && !['wide', 'telephoto'].includes(currentViewPreset || ''));
              return (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentViewPreset(preset.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all',
                    isActive
                      ? 'bg-purple-500/20 border-purple-400/40 text-purple-200'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-[10px] opacity-60">{preset.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white/90 text-sm font-medium mb-3 flex items-center gap-2">
          <ArrowUp className="w-4 h-4 text-amber-400" />
          视角预设
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {directionPresets.map((preset) => {
            const Icon = preset.icon;
            const isActive = currentViewPreset === preset.id;
            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentViewPreset(preset.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all',
                  isActive
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{preset.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium">相机控制提示</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              拖动鼠标可自由旋转视角；使用预设可快速切换方向；调整 FOV 改变视野宽窄；开启自动旋转可自动浏览全景。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
