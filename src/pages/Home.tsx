import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Globe2, Sparkles, Loader2, Compass, List, Info, ChevronRight, Map, Brain, Palette, MapPin } from 'lucide-react';
import StreetViewer, { type StreetViewerRef } from '@/components/StreetViewer';
import PanoramaPuzzleGame from '@/components/PanoramaPuzzleGame';
import GeoQuizGame from '@/components/GeoQuizGame';
import { LocationInfoCard } from '@/components/LocationInfoCard';
import { LocationListSidebar } from '@/components/LocationListSidebar';
import { TravelMap } from '@/components/TravelMap';
import { EditorSidebar } from '@/components/EditorSidebar';
import { OverlayLayer } from '@/components/OverlayLayer';
import { streetViewLocations, getRandomLocation, type StreetViewLocation } from '@/data/locations';
import { useTravelStore } from '@/store/useTravelStore';
import { useEditorStore } from '@/store/useEditorStore';
import { cn } from '@/lib/utils';

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<StreetViewLocation>(() => getRandomLocation());
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showTravelMap, setShowTravelMap] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(false);
  const [puzzleScreenshot, setPuzzleScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGeoQuiz, setShowGeoQuiz] = useState(false);
  
  const streetViewerRef = useRef<StreetViewerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addVisitedLocation, uniqueLocations } = useTravelStore();
  const { getFilterCss, isEditorOpen, setEditorOpen } = useEditorStore();

  const getCanvas = useCallback(() => {
    const canvas = document.querySelector('canvas');
    return canvas;
  }, []);

  useEffect(() => {
    addVisitedLocation(currentLocation.id);
  }, []);

  const handleRandom = useCallback(() => {
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      const newLocation = getRandomLocation(currentLocation.id);
      setCurrentLocation(newLocation);
      addVisitedLocation(newLocation.id);
      setIsTransitioning(false);
    }, 600);
  }, [currentLocation.id, addVisitedLocation]);

  const handleSelectLocation = useCallback((location: StreetViewLocation) => {
    setIsTransitioning(true);
    setIsLoading(true);
    setShowLocationList(false);
    setTimeout(() => {
      setCurrentLocation(location);
      addVisitedLocation(location.id);
      setIsTransitioning(false);
    }, 600);
  }, [addVisitedLocation]);

  const handleMapLocationSelect = useCallback((location: StreetViewLocation) => {
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentLocation(location);
      addVisitedLocation(location.id);
      setIsTransitioning(false);
    }, 600);
  }, [addVisitedLocation]);

  const handleSceneReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleStartPuzzleGame = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      const screenshot = streetViewerRef.current?.captureScreenshot();
      if (screenshot) {
        setPuzzleScreenshot(screenshot);
        setShowPuzzleGame(true);
      }
      setIsCapturing(false);
    }, 300);
  }, []);

  const handleClosePuzzleGame = useCallback(() => {
    setShowPuzzleGame(false);
    setPuzzleScreenshot(null);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentLocation.id, isLoading]);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const toggleInfoExpanded = useCallback(() => {
    setInfoExpanded(prev => !prev);
  }, []);

  const handleToggleEditor = useCallback(() => {
    if (!isEditorOpen) {
      setShowInfo(false);
    }
    setEditorOpen(!isEditorOpen);
  }, [isEditorOpen, setEditorOpen, setShowInfo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isEditorOpen) {
        e.preventDefault();
        handleRandom();
      }
      if (e.code === 'KeyL' && !e.repeat && !isEditorOpen) {
        setShowLocationList(prev => !prev);
      }
      if (e.code === 'KeyI' && !e.repeat && !isEditorOpen) {
        toggleInfo();
      }
      if (e.code === 'KeyM' && !e.repeat && !isEditorOpen) {
        setShowTravelMap(prev => !prev);
      }
      if (e.code === 'KeyP' && !e.repeat && !showPuzzleGame && !isEditorOpen) {
        handleStartPuzzleGame();
      }
      if (e.code === 'KeyG' && !e.repeat && !showGeoQuiz && !isEditorOpen) {
        setShowGeoQuiz(true);
      }
      if (e.code === 'KeyE' && !e.repeat) {
        handleToggleEditor();
      }
      if (e.code === 'Escape' && !e.repeat && isEditorOpen) {
        setEditorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandom, toggleInfo, handleStartPuzzleGame, showPuzzleGame, showGeoQuiz, isEditorOpen, setEditorOpen, handleToggleEditor]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Street Viewer */}
      <motion.div
        ref={containerRef}
        className={cn('absolute inset-0', isTransitioning && 'opacity-0 scale-105')}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          scale: isTransitioning ? 1.05 : 1
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div style={{ filter: getFilterCss() }} className="absolute inset-0">
          <StreetViewer
            ref={streetViewerRef}
            location={currentLocation}
            interactive={!isLoading && !showPuzzleGame && !isEditorOpen && !showGeoQuiz}
            onSceneReady={handleSceneReady}
          />
        </div>
        
        <OverlayLayer containerRef={containerRef} />
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay cityName={currentLocation.city} />}

      {/* Gradient Overlays */}
      <GradientOverlays />

      {/* Header */}
      <Header
        visitedCount={uniqueLocations}
        showInfo={showInfo}
        onToggleInfo={toggleInfo}
        onOpenList={() => setShowLocationList(true)}
        onOpenMap={() => setShowTravelMap(true)}
        onStartGame={handleStartPuzzleGame}
        onOpenGeoQuiz={() => setShowGeoQuiz(true)}
        onOpenEditor={handleToggleEditor}
        isCapturing={isCapturing}
        isEditorOpen={isEditorOpen}
      />

      {/* Editor Sidebar */}
      <EditorSidebar
        getCanvas={getCanvas}
        getStreetViewer={() => streetViewerRef.current}
        location={currentLocation}
      />

      {/* Location Info Card */}
      <LocationInfoCard
        location={currentLocation}
        expanded={infoExpanded}
        onToggleExpand={toggleInfoExpanded}
        visible={showInfo}
      />

      {/* Random Button */}
      <RandomButton onClick={handleRandom} isTransitioning={isTransitioning} />

      {/* Control Hint */}
      <ControlHint />

      {/* Location List Sidebar */}
      <LocationListSidebar
        open={showLocationList}
        onClose={() => setShowLocationList(false)}
        locations={streetViewLocations}
        currentLocationId={currentLocation.id}
        onSelectLocation={handleSelectLocation}
        onRandom={handleRandom}
      />

      {/* Compass Indicator */}
      <CompassIndicator />

      {/* Travel Map Modal */}
      <TravelMap
        open={showTravelMap}
        onClose={() => setShowTravelMap(false)}
        onSelectLocation={handleMapLocationSelect}
      />

      {/* Puzzle Game Modal */}
      <AnimatePresence>
        {showPuzzleGame && puzzleScreenshot && (
          <PanoramaPuzzleGame
            screenshot={puzzleScreenshot}
            location={currentLocation}
            onClose={handleClosePuzzleGame}
          />
        )}
      </AnimatePresence>

      {/* Geo Quiz Modal */}
      <AnimatePresence>
        {showGeoQuiz && (
          <GeoQuizGame onClose={() => setShowGeoQuiz(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingOverlay({ cityName }: { cityName: string }) {
  return (
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
        正在传送至 {cityName}...
      </p>
      <div className="mt-4 flex items-center gap-2 text-white/50 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>加载全景画面</span>
      </div>
    </motion.div>
  );
}

function GradientOverlays() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 to-transparent" />
    </div>
  );
}

interface HeaderProps {
  visitedCount: number;
  showInfo: boolean;
  onToggleInfo: () => void;
  onOpenList: () => void;
  onOpenMap: () => void;
  onStartGame: () => void;
  onOpenGeoQuiz: () => void;
  onOpenEditor: () => void;
  isCapturing: boolean;
  isEditorOpen: boolean;
}

function Header({ visitedCount, showInfo, onToggleInfo, onOpenList, onOpenMap, onStartGame, onOpenGeoQuiz, onOpenEditor, isCapturing, isEditorOpen }: HeaderProps) {
  return (
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
            onClick={onStartGame}
            disabled={isCapturing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30 transition-all disabled:opacity-50"
          >
            {isCapturing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span className="text-sm font-medium hidden sm:inline">空间训练</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenGeoQuiz}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">地理问答</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenMap}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 hover:bg-white/20 transition-all"
          >
            <Map className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">足迹地图</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenList}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 hover:bg-white/20 transition-all"
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">地点列表</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleInfo}
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenEditor}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md border transition-all',
              isEditorOpen
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/40 text-purple-200'
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30'
            )}
          >
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">编辑</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

interface RandomButtonProps {
  onClick: () => void;
  isTransitioning: boolean;
}

function RandomButton({ onClick, isTransitioning }: RandomButtonProps) {
  return (
    <motion.div
      className="absolute right-6 bottom-6 z-30"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', damping: 20 }}
    >
      <motion.button
        onClick={onClick}
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
  );
}

function ControlHint() {
  return (
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
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">M</kbd>
          足迹地图
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
        <span className="w-px h-4 bg-white/20" />
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 font-mono text-[10px] text-purple-200 border border-purple-400/30">P</kbd>
          空间训练
        </span>
        <span className="w-px h-4 bg-white/20" />
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-gradient-to-r from-emerald-500/30 to-teal-500/30 font-mono text-[10px] text-emerald-200 border border-emerald-400/30">G</kbd>
          地理问答
        </span>
        <span className="w-px h-4 bg-white/20" />
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 font-mono text-[10px] text-purple-200 border border-purple-400/30">E</kbd>
          图片编辑
        </span>
      </div>
    </motion.div>
  );
}

function CompassIndicator() {
  return (
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
  );
}
