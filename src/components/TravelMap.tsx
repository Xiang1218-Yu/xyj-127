import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, TrendingUp, Globe, Award } from 'lucide-react';
import { streetViewLocations, type StreetViewLocation } from '@/data/locations';
import { useTravelStore } from '@/store/useTravelStore';
import { cn } from '@/lib/utils';

interface TravelMapProps {
  open: boolean;
  onClose: () => void;
  onSelectLocation?: (location: StreetViewLocation) => void;
}

const MAP_WIDTH = 900;
const MAP_HEIGHT = 450;

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * MAP_WIDTH;
  const y = ((90 - lat) / 180) * MAP_HEIGHT;
  return { x, y };
}

function getHeatColor(intensity: number): string {
  if (intensity <= 1) return 'from-cyan-400 to-blue-500';
  if (intensity <= 2) return 'from-cyan-400 via-blue-500 to-purple-500';
  if (intensity <= 4) return 'from-purple-500 via-pink-500 to-orange-400';
  return 'from-orange-400 via-red-500 to-yellow-400';
}

function getMarkerSize(visitCount: number): number {
  const baseSize = 12;
  const maxSize = 32;
  const size = baseSize + Math.min(visitCount - 1, 5) * 4;
  return Math.min(size, maxSize);
}

export function TravelMap({ open, onClose, onSelectLocation }: TravelMapProps) {
  const { visitedLocations, uniqueLocations, totalVisits } = useTravelStore();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const maxVisits = useMemo(() => {
    return Math.max(...visitedLocations.map((v) => v.visitCount), 1);
  }, [visitedLocations]);

  const visitedLocationsWithData = useMemo(() => {
    return visitedLocations
      .map((v) => {
        const location = streetViewLocations.find((l) => l.id === v.id);
        if (!location) return null;
        return { ...v, location };
      })
      .filter(Boolean) as Array<typeof visitedLocations[0] & { location: StreetViewLocation }>;
  }, [visitedLocations]);

  const continents = useMemo(() => {
    const set = new Set(streetViewLocations.map((l) => l.continent));
    return Array.from(set);
  }, []);

  const continentStats = useMemo(() => {
    const stats: Record<string, { total: number; visited: number }> = {};
    for (const loc of streetViewLocations) {
      if (!stats[loc.continent]) {
        stats[loc.continent] = { total: 0, visited: 0 };
      }
      stats[loc.continent].total++;
      if (visitedLocations.some((v) => v.id === loc.id)) {
        stats[loc.continent].visited++;
      }
    }
    return stats;
  }, [visitedLocations]);

  const handleSelectContinent = (continent: string | null) => {
    setSelectedContinent(continent);
    if (continent && hoveredLocation) {
      const loc = streetViewLocations.find((l) => l.id === hoveredLocation);
      if (loc && loc.continent !== continent) {
        setHoveredLocation(null);
      }
    }
  };

  const filteredLocations = useMemo(() => {
    if (!selectedContinent) return visitedLocationsWithData;
    return visitedLocationsWithData.filter((v) => v.location.continent === selectedContinent);
  }, [visitedLocationsWithData, selectedContinent]);

  const handleMarkerClick = (location: StreetViewLocation) => {
    if (onSelectLocation) {
      onSelectLocation(location);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-y-auto"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-lg font-bold">旅行足迹地图</h2>
                  <p className="text-white/50 text-xs">记录你探索过的每一个角落</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-white/10">
              <StatCard
                icon={<MapPin className="w-5 h-5" />}
                label="已探索地点"
                value={`${uniqueLocations} / ${streetViewLocations.length}`}
                gradient="from-cyan-400 to-blue-500"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="总浏览次数"
                value={totalVisits.toString()}
                gradient="from-purple-400 to-pink-500"
              />
              <StatCard
                icon={<Award className="w-5 h-5" />}
                label="探索完成度"
                value={`${Math.round((uniqueLocations / streetViewLocations.length) * 100)}%`}
                gradient="from-amber-400 to-orange-500"
              />
            </div>

            <div className="px-6 py-3 flex items-center gap-2 border-b border-white/5">
              <span className="text-white/50 text-xs">大洲筛选:</span>
              <button
                onClick={() => handleSelectContinent(null)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  selectedContinent === null
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                )}
              >
                全部
              </button>
              {continents.map((continent) => (
                <button
                  key={continent}
                  onClick={() => handleSelectContinent(continent)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                    selectedContinent === continent
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  )}
                >
                  {continent}
                  {continentStats[continent] && (
                    <span className="ml-1 text-white/40">
                      {continentStats[continent].visited}/{continentStats[continent].total}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative p-6">
              <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950/50 border border-white/5">
                <svg
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  className="w-full h-auto"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <pattern
                    id="gridPattern"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                    <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                    <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
                  </radialGradient>
                  </defs>

                  <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gridPattern)" />

                  <g stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={(i * MAP_HEIGHT) / 6}
                        x2={MAP_WIDTH}
                        y2={(i * MAP_HEIGHT) / 6}
                      />
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <line
                        key={`v-${i}`}
                        x1={(i * MAP_WIDTH) / 12}
                        y1="0"
                        x2={(i * MAP_WIDTH) / 12}
                        y2={MAP_HEIGHT}
                      />
                    ))}
                  </g>

                  <g fill="rgba(255,255,255,0.03)">
                    <ellipse cx="225" cy="225" rx="180" ry="150" />
                    <ellipse cx="450" cy="200" rx="250" ry="180" />
                    <ellipse cx="675" cy="230" rx="200" ry="160" />
                    <ellipse cx="750" cy="275" rx="120" ry="80" />
                    <ellipse cx="450" cy="340" rx="150" ry="100" />
                    <ellipse cx="150" cy="120" rx="100" ry="70" />
                  </g>

                  {streetViewLocations.map((loc) => {
                    const { x, y } = latLngToXY(loc.latitude, loc.longitude);
                    const isVisited = visitedLocations.some((v) => v.id === loc.id);
                    const visitData = visitedLocations.find((v) => v.id === loc.id);
                    const visitCount = visitData?.visitCount || 0;
                    const isFiltered = selectedContinent && loc.continent !== selectedContinent;
                    const isHovered = hoveredLocation === loc.id;
                    const size = getMarkerSize(visitCount);
                    const intensity = visitCount;

                    if (!isVisited) {
                      return (
                        <g key={loc.id} opacity={isFiltered ? 0.08 : 1}>
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill="rgba(255,255,255,0.15)"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                          />
                        </g>
                      );
                    }

                    return (
                      <g
                        key={loc.id}
                        style={{ cursor: onSelectLocation ? 'pointer' : 'default' }}
                        onMouseEnter={() => setHoveredLocation(loc.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                        onClick={() => handleMarkerClick(loc)}
                        opacity={isFiltered ? 0.3 : 1}
                      >
                        <motion.circle
                          cx={x}
                          cy={y}
                          r={size * 2}
                          fill="url(#glow-gradient)"
                          initial={{ opacity: 0.5, r: size }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            r: [size * 1.5, size * 2.5, size * 1.5],
                          }}
                          transition={{
                            duration: 2 + intensity * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />

                        <circle
                          cx={x}
                          cy={y}
                          r={size * 1.5}
                          fill="url(#glow-gradient)"
                          opacity="0.4"
                        />

                        <motion.circle
                          cx={x}
                          cy={y}
                          r={size / 2 + (isHovered ? 2 : 0)}
                          className={cn(
                            'fill-current',
                            getHeatColor(intensity)
                          )}
                          style={{
                            fill: intensity <= 1 ? '#22d3ee' :
                              intensity <= 2 ? '#a855f7' :
                              intensity <= 4 ? '#f97316' : '#ef4444'
                          }}
                          whileHover={{ r: size / 2 + 3 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        />

                        <circle
                          cx={x}
                          cy={y}
                          r={size / 4}
                          fill="white"
                          opacity="0.9"
                        />
                      </g>
                    );
                  })}

                  {hoveredLocation && (() => {
                    const loc = streetViewLocations.find((l) => l.id === hoveredLocation);
                    const visitData = visitedLocations.find((v) => v.id === hoveredLocation);
                    if (!loc || !visitData) return null;
                    const { x, y } = latLngToXY(loc.latitude, loc.longitude);
                    const size = getMarkerSize(visitData.visitCount);
                    const tooltipX = x + size + 10;
                    const tooltipY = y - 30;
                    
                    return (
                      <g>
                        <rect
                          x={tooltipX}
                          y={tooltipY}
                          width="140"
                          height="50"
                          rx="8"
                          fill="rgba(15, 23, 42, 0.95)"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <text
                          x={tooltipX + 10}
                          y={tooltipY + 20}
                          fill="white"
                          fontSize="12"
                          fontWeight="600"
                        >
                          {loc.name}
                        </text>
                        <text
                          x={tooltipX + 10}
                          y={tooltipY + 38}
                          fill="rgba(255,255,255,0.5)"
                          fontSize="10"
                        >
                          {loc.city}, {loc.country}
                        </text>
                        <text
                          x={tooltipX + 10}
                          y={tooltipY + 52}
                          fill="#22d3ee"
                          fontSize="10"
                        >
                          访问 {visitData.visitCount} 次
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/50 text-xs">热力强度:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-white/40 text-xs">1次</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-white/40 text-xs">2次</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-white/40 text-xs">3-4次</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-white/40 text-xs">5次+</span>
                  </div>
                </div>
                <span className="text-white/30 text-xs">
                  点击标记可快速传送
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <h3 className="text-white/80 text-sm font-medium mb-3">
                {selectedContinent ? `${selectedContinent} - 探索记录` : '最近探索'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-40 overflow-y-auto">
                {filteredLocations.length === 0 && (
                  <div className="col-span-full py-6 text-center">
                    <p className="text-white/30 text-sm">
                      {selectedContinent ? `${selectedContinent} 暂无探索记录` : '暂无探索记录'}
                    </p>
                    <p className="text-white/20 text-xs mt-1">开始探索世界吧！</p>
                  </div>
                )}
                {filteredLocations
                  .sort((a, b) => b.visitedAt - a.visitedAt)
                  .slice(0, 8)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      className={cn(
                        'relative rounded-xl p-3 border cursor-pointer transition-all',
                        'bg-white/5 border-white/10 hover:bg-white/10'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMarkerClick(item.location)}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                            item.visitCount <= 1 ? 'bg-cyan-400' :
                            item.visitCount <= 2 ? 'bg-purple-500' :
                            item.visitCount <= 4 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">
                            {item.location.name}
                          </p>
                          <p className="text-white/40 text-xs truncate">
                            {item.location.city}
                          </p>
                          <p className="text-cyan-400/70 text-xs">
                            {item.visitCount} 次访问
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', gradient)}>
        {icon}
      </div>
      <div>
        <p className="text-white text-lg font-bold">{value}</p>
        <p className="text-white/40 text-xs">{label}</p>
      </div>
    </div>
  );
}
