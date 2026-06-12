import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Star, Share2, ChevronUp, ChevronDown } from 'lucide-react';
import type { StreetViewLocation } from '@/data/locations';

interface LocationInfoCardProps {
  location: StreetViewLocation;
  expanded: boolean;
  onToggleExpand: () => void;
  visible: boolean;
}

export function LocationInfoCard({
  location,
  expanded,
  onToggleExpand,
  visible
}: LocationInfoCardProps) {
  if (!visible) return null;

  return (
    <motion.div
      className="absolute left-6 bottom-6 z-30 max-w-sm"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ delay: 0.3, type: 'spring', damping: 20 }}
    >
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/15 overflow-hidden shadow-2xl shadow-black/50">
        <AnimatePresence mode="wait">
          {!expanded ? (
            <CollapsedBar
              key="collapsed"
              location={location}
              onExpand={onToggleExpand}
            />
          ) : (
            <ExpandedContent
              key="expanded"
              location={location}
              onCollapse={onToggleExpand}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface CollapsedBarProps {
  location: StreetViewLocation;
  onExpand: () => void;
}

function CollapsedBar({ location, onExpand }: CollapsedBarProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onClick={onExpand}
      className="flex items-center gap-3 px-5 py-3 w-full hover:bg-white/5 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
        <img
          src={location.thumbnailUrl}
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/100/100?random=${location.id}`;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm truncate">
          {location.name}
        </div>
        <div className="text-white/50 text-xs flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{location.city}, {location.country}</span>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] flex-shrink-0">
        {location.continent}
      </span>
      <ChevronUp className="w-4 h-4 text-white/50 flex-shrink-0" />
    </motion.button>
  );
}

interface ExpandedContentProps {
  location: StreetViewLocation;
  onCollapse: () => void;
}

function ExpandedContent({ location, onCollapse }: ExpandedContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={location.thumbnailUrl}
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/800/400?random=${location.id}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/90 text-xs font-medium flex items-center gap-1">
            <Compass className="w-3 h-3" />
            {location.continent}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-white text-2xl font-bold drop-shadow-lg">
            {location.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location.city}, {location.country}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {location.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {location.tags.map(tag => (
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
              <div className="font-mono text-white/70">{location.latitude.toFixed(4)}°</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-white/50 text-xs">
              <div className="text-white/30 mb-0.5">经度</div>
              <div className="font-mono text-white/70">{location.longitude.toFixed(4)}°</div>
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

      <button
        onClick={onCollapse}
        className="w-full py-2.5 border-t border-white/10 text-white/50 text-xs flex items-center justify-center gap-1 hover:bg-white/5 hover:text-white/80 transition-all"
      >
        <span>收起信息卡</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
