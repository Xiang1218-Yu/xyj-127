import { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Unlink, ChevronDown, RefreshCw } from 'lucide-react';
import { PanoramaSphere } from '@/components/PanoramaSphere';
import { CameraController } from '@/components/CameraController';
import { WeatherParticles } from '@/components/WeatherParticles';
import { streetViewLocations, type StreetViewLocation, getRandomLocation } from '@/data/locations';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';

type ViewMode = 'sync' | 'independent';

interface SceneCaptureProps {
  onSceneReady?: () => void;
}

function SceneCapture({ onSceneReady }: SceneCaptureProps) {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    if (gl && scene && camera) {
      onSceneReady?.();
    }
  }, [gl, scene, camera, onSceneReady]);
  
  return null;
}

interface PanoramaViewProps {
  location: StreetViewLocation;
  interactive: boolean;
  controlledHeading?: number;
  controlledPitch?: number;
  onCameraChange?: (heading: number, pitch: number) => void;
  onSceneReady?: () => void;
}

function PanoramaView({
  location,
  interactive,
  controlledHeading,
  controlledPitch,
  onCameraChange,
  onSceneReady
}: PanoramaViewProps) {
  const isNight = location.id.includes('night') || location.id.includes('aurora') || location.id.includes('iceland');
  const weather = useEditorStore((s) => s.weather);
  const weatherIntensity = useEditorStore((s) => s.weatherIntensity);

  return (
    <>
      <SceneCapture onSceneReady={onSceneReady} />
      <PanoramaSphere location={location} locationKey={location.id} />
      <CameraController
        initialHeading={location.initialHeading}
        initialPitch={location.initialPitch}
        enabled={interactive}
        locationKey={location.id}
        controlledHeading={controlledHeading}
        controlledPitch={controlledPitch}
        onCameraChange={onCameraChange}
        useStoreControls={false}
      />
      <ambientLight intensity={0.3} />
      {isNight && <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />}
      <WeatherParticles weather={weather} intensity={weatherIntensity} />
    </>
  );
}

interface LocationSelectorProps {
  location: StreetViewLocation;
  onChange: (location: StreetViewLocation) => void;
  side: 'left' | 'right';
}

function LocationSelector({ location, onChange, side }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colors = {
    left: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-200',
    right: 'from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-200'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r backdrop-blur-md border transition-all',
          colors[side]
        )}
      >
        <span className="text-sm font-medium truncate max-w-[180px]">
          {location.name}
        </span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
          >
            <div className="p-2">
              {streetViewLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onChange(loc);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg transition-all mb-1',
                    loc.id === location.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className="font-medium text-sm">{loc.name}</div>
                  <div className="text-xs opacity-60">{loc.city}, {loc.country}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DualPanoramaViewerProps {
  onClose: () => void;
}

export function DualPanoramaViewer({ onClose }: DualPanoramaViewerProps) {
  const [leftLocation, setLeftLocation] = useState<StreetViewLocation>(() => getRandomLocation());
  const [rightLocation, setRightLocation] = useState<StreetViewLocation>(() => getRandomLocation(leftLocation.id));
  const [viewMode, setViewMode] = useState<ViewMode>('sync');
  const [leftHeading, setLeftHeading] = useState(leftLocation.initialHeading);
  const [leftPitch, setLeftPitch] = useState(leftLocation.initialPitch);
  const [rightHeading, setRightHeading] = useState(rightLocation.initialHeading);
  const [rightPitch, setRightPitch] = useState(rightLocation.initialPitch);
  const [syncSource, setSyncSource] = useState<'left' | 'right'>('left');
  const [leftLoading, setLeftLoading] = useState(true);
  const [rightLoading, setRightLoading] = useState(true);

  const handleLeftCameraChange = useCallback((heading: number, pitch: number) => {
    setLeftHeading(heading);
    setLeftPitch(pitch);
    if (viewMode === 'sync' && syncSource === 'left') {
      setRightHeading(heading);
      setRightPitch(pitch);
    }
  }, [viewMode, syncSource]);

  const handleRightCameraChange = useCallback((heading: number, pitch: number) => {
    setRightHeading(heading);
    setRightPitch(pitch);
    if (viewMode === 'sync' && syncSource === 'right') {
      setLeftHeading(heading);
      setLeftPitch(pitch);
    }
  }, [viewMode, syncSource]);

  const toggleViewMode = useCallback(() => {
    if (viewMode === 'sync') {
      setViewMode('independent');
    } else {
      setViewMode('sync');
      const sourceHeading = syncSource === 'left' ? leftHeading : rightHeading;
      const sourcePitch = syncSource === 'left' ? leftPitch : rightPitch;
      setLeftHeading(sourceHeading);
      setLeftPitch(sourcePitch);
      setRightHeading(sourceHeading);
      setRightPitch(sourcePitch);
    }
  }, [viewMode, syncSource, leftHeading, leftPitch, rightHeading, rightPitch]);

  const handleSwapLocations = useCallback(() => {
    const tempLocation = leftLocation;
    const tempHeading = leftHeading;
    const tempPitch = leftPitch;
    
    setLeftLocation(rightLocation);
    setLeftHeading(rightHeading);
    setLeftPitch(rightPitch);
    
    setRightLocation(tempLocation);
    setRightHeading(tempHeading);
    setRightPitch(tempPitch);
  }, [leftLocation, rightLocation, leftHeading, leftPitch, rightHeading, rightPitch]);

  const handleRandomLeft = useCallback(() => {
    const newLocation = getRandomLocation(leftLocation.id);
    setLeftLocation(newLocation);
    setLeftHeading(newLocation.initialHeading);
    setLeftPitch(newLocation.initialPitch);
    if (viewMode === 'sync') {
      setRightHeading(newLocation.initialHeading);
      setRightPitch(newLocation.initialPitch);
    }
  }, [leftLocation.id, viewMode]);

  const handleRandomRight = useCallback(() => {
    const newLocation = getRandomLocation(rightLocation.id);
    setRightLocation(newLocation);
    setRightHeading(newLocation.initialHeading);
    setRightPitch(newLocation.initialPitch);
    if (viewMode === 'sync') {
      setLeftHeading(newLocation.initialHeading);
      setLeftPitch(newLocation.initialPitch);
    }
  }, [rightLocation.id, viewMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-bold">双全景对比</h2>
            <span className="text-white/40 text-sm">并排浏览不同地点</span>
          </div>

          <div className="flex items-center gap-3">
            <LocationSelector
              location={leftLocation}
              onChange={(loc) => {
                setLeftLocation(loc);
                setLeftHeading(loc.initialHeading);
                setLeftPitch(loc.initialPitch);
                if (viewMode === 'sync') {
                  setRightHeading(loc.initialHeading);
                  setRightPitch(loc.initialPitch);
                }
              }}
              side="left"
            />

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSwapLocations}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all"
              title="交换位置"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>

            <LocationSelector
              location={rightLocation}
              onChange={(loc) => {
                setRightLocation(loc);
                setRightHeading(loc.initialHeading);
                setRightPitch(loc.initialPitch);
                if (viewMode === 'sync') {
                  setLeftHeading(loc.initialHeading);
                  setLeftPitch(loc.initialPitch);
                }
              }}
              side="right"
            />

            <div className="w-px h-8 bg-white/20" />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleViewMode}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border transition-all',
                viewMode === 'sync'
                  ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
                  : 'bg-white/10 border-white/15 text-white/70 hover:bg-white/20 hover:text-white'
              )}
            >
              {viewMode === 'sync' ? (
                <>
                  <Link className="w-4 h-4" />
                  <span className="text-sm font-medium">同步旋转</span>
                </>
              ) : (
                <>
                  <Unlink className="w-4 h-4" />
                  <span className="text-sm font-medium">独立浏览</span>
                </>
              )}
            </motion.button>

            {viewMode === 'sync' && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-white/50 text-xs">同步源:</span>
                <button
                  onClick={() => setSyncSource('left')}
                  className={cn(
                    'px-2 py-1 rounded-lg text-xs font-medium transition-all',
                    syncSource === 'left'
                      ? 'bg-cyan-500/30 text-cyan-200'
                      : 'text-white/50 hover:text-white/80'
                  )}
                >
                  左侧
                </button>
                <button
                  onClick={() => setSyncSource('right')}
                  className={cn(
                    'px-2 py-1 rounded-lg text-xs font-medium transition-all',
                    syncSource === 'right'
                      ? 'bg-purple-500/30 text-purple-200'
                      : 'text-white/50 hover:text-white/80'
                  )}
                >
                  右侧
                </button>
              </div>
            )}

            <div className="w-px h-8 bg-white/20" />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex">
        <div className="relative w-1/2 h-full border-r border-white/10">
          <div className="absolute top-20 left-4 z-10 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm">
            <span className="text-cyan-200 text-xs font-medium">左画面</span>
          </div>
          
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomLeft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm text-cyan-200 text-xs hover:bg-cyan-500/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              随机
            </motion.button>
            <div className="px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white/50 text-xs">
              {leftLocation.city}, {leftLocation.country}
            </div>
          </div>

          {leftLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-cyan-300 text-sm">加载中...</div>
            </div>
          )}

          <Canvas
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 5] }}
            style={{ background: '#111', width: '100%', height: '100%' }}
          >
            <PanoramaView
              location={leftLocation}
              interactive={viewMode === 'independent' || syncSource === 'left'}
              controlledHeading={viewMode === 'sync' && syncSource === 'right' ? rightHeading : undefined}
              controlledPitch={viewMode === 'sync' && syncSource === 'right' ? rightPitch : undefined}
              onCameraChange={handleLeftCameraChange}
              onSceneReady={() => setLeftLoading(false)}
            />
          </Canvas>
        </div>

        <div className="relative w-1/2 h-full">
          <div className="absolute top-20 right-4 z-10 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm">
            <span className="text-purple-200 text-xs font-medium">右画面</span>
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white/50 text-xs">
              {rightLocation.city}, {rightLocation.country}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomRight}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm text-purple-200 text-xs hover:bg-purple-500/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              随机
            </motion.button>
          </div>

          {rightLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-purple-300 text-sm">加载中...</div>
            </div>
          )}

          <Canvas
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 5] }}
            style={{ background: '#111', width: '100%', height: '100%' }}
          >
            <PanoramaView
              location={rightLocation}
              interactive={viewMode === 'independent' || syncSource === 'right'}
              controlledHeading={viewMode === 'sync' && syncSource === 'left' ? leftHeading : undefined}
              controlledPitch={viewMode === 'sync' && syncSource === 'left' ? leftPitch : undefined}
              onCameraChange={handleRightCameraChange}
              onSceneReady={() => setRightLoading(false)}
            />
          </Canvas>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/50 text-xs flex items-center gap-3">
          <span>
            {viewMode === 'sync'
              ? `拖动${syncSource === 'left' ? '左' : '右'}画面，两侧视角同步变化`
              : '两个画面可独立拖动浏览'}
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">ESC</kbd>
            退出
          </span>
        </div>
      </div>
    </motion.div>
  );
}
