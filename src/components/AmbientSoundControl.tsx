import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Pause, Play, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AmbientSoundConfig } from '@/data/soundConfigs';

interface AmbientSoundControlProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentSounds: AmbientSoundConfig[];
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export function AmbientSoundControl({
  isPlaying,
  isMuted,
  volume,
  currentSounds,
  onTogglePlay,
  onToggleMute,
  onVolumeChange
}: AmbientSoundControlProps) {
  const [expanded, setExpanded] = useState(false);

  const displayVolume = isMuted ? 0 : volume;

  return (
    <motion.div
      className="absolute right-6 top-24 z-30"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', damping: 20 }}
    >
      <div className="relative">
        <motion.div
          className={cn(
            "overflow-hidden rounded-2xl backdrop-blur-md border transition-all",
            expanded
              ? "bg-black/50 border-cyan-400/30"
              : "bg-black/30 border-white/10"
          )}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="relative">
              {currentSounds.length > 0 ? (
                <span className="text-xl">{currentSounds[0].icon}</span>
              ) : (
                <Music className="w-5 h-5 text-cyan-400" />
              )}
              {isPlaying && !isMuted && (
                <motion.div
                  className="absolute -inset-1 rounded-full bg-cyan-400/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">
                {currentSounds.length > 0 ? (
                  <span className="flex items-center gap-1">
                    {currentSounds.map((s, i) => (
                      <span key={s.id}>
                        {i > 0 && <span className="text-white/40">+</span>}
                        {s.name}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-white/50">环境音效</span>
                )}
              </div>
              {isPlaying && !isMuted && (
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      animate={{ height: [4, 12 + i * 3, 4] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-white/50" />
            </motion.div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isPlaying
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                          : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                      )}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMute();
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isMuted
                          ? "bg-red-500/20 text-red-400 border border-red-400/30"
                          : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                      )}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </motion.button>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={displayVolume}
                        onChange={(e) => {
                          const newVolume = parseFloat(e.target.value);
                          onVolumeChange(newVolume);
                          if (isMuted && newVolume > 0) {
                            onToggleMute();
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:from-cyan-400
                          [&::-webkit-slider-thumb]:to-blue-500
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:shadow-cyan-500/30
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110"
                        style={{
                          background: `linear-gradient(to right, rgb(34, 211, 238) 0%, rgb(59, 130, 246) ${displayVolume * 100}%, rgba(255,255,255,0.1) ${displayVolume * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <span className="text-white/60 text-xs font-mono w-8 text-right">
                        {Math.round(displayVolume * 100)}
                      </span>
                    </div>
                  </div>

                  {currentSounds.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-white/40 text-xs">当前音效详情</p>
                      <div className="space-y-1.5">
                        {currentSounds.map((sound) => (
                          <div
                            key={sound.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5"
                          >
                            <span className="text-lg">{sound.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 text-sm font-medium">{sound.name}</p>
                              <p className="text-white/40 text-xs truncate">{sound.description}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(4)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 bg-cyan-400/60 rounded-full"
                                  animate={{ height: [3, 8 + i * 2, 3] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: 'easeInOut'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-white/30 text-xs">
                    提示：首次点击启用音效，切换地点时会自动匹配环境音
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
