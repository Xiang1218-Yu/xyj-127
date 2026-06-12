import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle,
  MapPin,
  Globe2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  Sparkles,
  Loader2,
  Compass,
  X,
  List,
  Star,
  Share2
} from 'lucide-react';
import StreetViewer from '@/components/StreetViewer';
import {
  streetViewLocations,
  getRandomLocation,
  type StreetViewLocation
} from '@/data/locations';
import { cn } from '@/lib/utils';

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<StreetViewLocation>(() => getRandomLocation());
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visitedCount, setVisitedCount] = useState(1);

  const handleRandom = useCallback(() => {
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentLocation(prev => getRandomLocation(prev.id));
      setIsTransitioning(false);
      setVisitedCount(c => c + 1);
    }, 600);
  }, []);

  const handleSelectLocation = useCallback((location: StreetViewLocation) => {
    setIsTransitioning(true);
    setIsLoading(true);
    setShowLocationList(false);
    setTimeout(() => {
      setCurrentLocation(location);
      setIsTransitioning(false);
      setVisitedCount(c => c + 1);
    }, 600);
  }, []);

  const handleSceneReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleRandom();
      }
      if (e.code === 'KeyL' && !e.repeat) {
        setShowLocationList(prev => !prev);
      }
      if (e.code === 'KeyI' && !e.repeat) {
        setShowInfo(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandom]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Street Viewer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLocation.id}
          className={cn(
            'absolute inset-0',
            isTransitioning && 'opacity-0 scale-105'
          )}
          animate={{
            opacity: isTransitioning ? 0 : 1,
            scale: isTransitioning ? 1.05 : 1
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <StreetViewer
            location={currentLocation}
            isInteractive={!isLoading}
            onSceneReady={handleSceneReady}
          />
        </motion.div>
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Globe2 className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <p className="mt-6 text-white/80 text-lg font-light tracking-wider">
              正在传送至 {currentLocation.city}...
            </p>
            <div className="mt-4 flex items-center gap-2 text-white/50 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>加载全景画面</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 to-transparent" />
      </div>

      {/* Header */}
      <motion.header
        className="absolute top-0 inset-x-0 z-30 px-6 py-5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', damping: 20 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-black"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">
                全球街景漫游
              </h1>
              <p className="text-white/50 text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                已探索 {visitedCount} 个目的地
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLocationList(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 hover:bg-white/20 transition-all"
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">地点列表</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(prev => !prev)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md border transition-all',
                showInfo
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/10 border-white/15 text-white/90 hover:bg-white/20'
              )}
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">信息</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Location Info Card (Bottom Left) - Collapsible */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute left-6 bottom-6 z-30 max-w-sm"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 20 }}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/15 overflow-hidden shadow-2xl shadow-black/50">
              {/* Collapsed Bar */}
              <AnimatePresence>
                {!infoExpanded && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => setInfoExpanded(true)}
                    className="flex items-center gap-3 px-5 py-3 w-full hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
                      <img
                        src={currentLocation.thumbnailUrl}
                        alt={currentLocation.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/100/100?random=${currentLocation.id}`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">
                        {currentLocation.name}
                      </div>
                      <div className="text-white/50 text-xs flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{currentLocation.city}, {currentLocation.country}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] flex-shrink-0">
                      {currentLocation.continent}
                    </span>
                    <ChevronUp className="w-4 h-4 text-white/50 flex-shrink-0" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Expanded Content */}
              <AnimatePresence>
                {infoExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={currentLocation.thumbnailUrl}
                        alt={currentLocation.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/800/400?random=${currentLocation.id}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/90 text-xs font-medium flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          {currentLocation.continent}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                          {currentLocation.name}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{currentLocation.city}, {currentLocation.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-white/80 text-sm leading-relaxed mb-4">
                        {currentLocation.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {currentLocation.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-white/10 text-white/70 text-xs border border-white/10"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="text-white/50 text-xs">
                            <div className="text-white/30 mb-0.5">纬度</div>
                            <div className="font-mono text-white/70">{currentLocation.latitude.toFixed(4)}°</div>
                          </div>
                          <div className="w-px h-8 bg-white/10" />
                          <div className="text-white/50 text-xs">
                            <div className="text-white/30 mb-0.5">经度</div>
                            <div className="font-mono text-white/70">{currentLocation.longitude.toFixed(4)}°</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                          >
                            <Star className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Collapse Button */}
                    <button
                      onClick={() => setInfoExpanded(false)}
                      className="w-full py-2.5 border-t border-white/10 text-white/50 text-xs flex items-center justify-center gap-1 hover:bg-white/5 hover:text-white/80 transition-all"
                    >
                      <span>收起信息卡</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Random Button (Bottom Right) */}
      <motion.div
        className="absolute right-6 bottom-6 z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
      >
        <motion.button
          onClick={handleRandom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative px-7 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center gap-3 shadow-2xl shadow-blue-500/30">
            <motion.div
              animate={{ rotate: isTransitioning ? 360 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Shuffle className="w-6 h-6 text-white" />
            </motion.div>
            <div className="text-left">
              <div className="text-white font-bold text-lg leading-tight">
                随机探索
              </div>
              <div className="text-white/70 text-xs">
                空格键 快捷切换
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </motion.div>

      {/* Control Hint (Bottom Center) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/60 text-xs flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            拖动鼠标旋转视角
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">L</kbd>
            打开列表
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">I</kbd>
            隐藏信息
          </span>
        </div>
      </motion.div>

      {/* Location List Sidebar */}
      <AnimatePresence>
        {showLocationList && (
          <>
            <motion.div
              className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationList(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-l border-white/10 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-cyan-400" />
                    全球目的地
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLocationList(false)}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-white/50 text-sm">
                  共 {streetViewLocations.length} 个精选街景，点击任意一个开始探索
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {streetViewLocations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectLocation(location)}
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full text-left p-4 rounded-2xl border transition-all group',
                      location.id === currentLocation.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={location.thumbnailUrl}
                          alt={location.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/200/200?random=${location.id}`;
                          }}
                        />
                        {location.id === currentLocation.id && (
                          <div className="absolute inset-0 bg-cyan-500/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-white font-semibold truncate">
                            {location.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] flex-shrink-0">
                            {location.continent}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{location.city}, {location.country}</span>
                        </div>
                        <p className="text-white/40 text-xs mt-2 line-clamp-2">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="p-6 border-t border-white/10">
                <motion.button
                  onClick={handleRandom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  <Shuffle className="w-5 h-5" />
                  随机探索下一个
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compass Indicator (Top Center) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-24 z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center">
            <Compass className="w-7 h-7 text-white/70" />
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold">
            N
          </div>
        </div>
      </motion.div>
    </div>
  );
}
