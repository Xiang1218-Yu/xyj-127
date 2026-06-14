import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe2, X, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonTaps, fadeInOut, slideInRightSpring, staggerItem } from '@/animations';
import type { StreetViewLocation } from '@/data/locations';

interface LocationListSidebarProps {
  open: boolean;
  onClose: () => void;
  locations: StreetViewLocation[];
  currentLocationId: string;
  onSelectLocation: (location: StreetViewLocation) => void;
  onRandom: () => void;
}

export function LocationListSidebar({
  open,
  onClose,
  locations,
  currentLocationId,
  onSelectLocation,
  onRandom
}: LocationListSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-l border-white/10 flex flex-col"
            variants={slideInRightSpring}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SidebarHeader locationCount={locations.length} onClose={onClose} />
            <LocationList
              locations={locations}
              currentLocationId={currentLocationId}
              onSelect={onSelectLocation}
            />
            <SidebarFooter onRandom={onRandom} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SidebarHeaderProps {
  locationCount: number;
  onClose: () => void;
}

function SidebarHeader({ locationCount, onClose }: SidebarHeaderProps) {
  return (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-cyan-400" />
          全球目的地
        </h2>
        <motion.button
          {...buttonTaps.icon}
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
      <p className="text-white/50 text-sm">
        共 {locationCount} 个精选街景，点击任意一个开始探索
      </p>
    </div>
  );
}

interface LocationListProps {
  locations: StreetViewLocation[];
  currentLocationId: string;
  onSelect: (location: StreetViewLocation) => void;
}

function LocationList({ locations, currentLocationId, onSelect }: LocationListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
      {locations.map((location, index) => (
        <LocationItem
          key={location.id}
          location={location}
          isCurrent={location.id === currentLocationId}
          index={index}
          onSelect={() => onSelect(location)}
        />
      ))}
    </div>
  );
}

interface LocationItemProps {
  location: StreetViewLocation;
  isCurrent: boolean;
  index: number;
  onSelect: () => void;
}

function LocationItem({ location, isCurrent, index, onSelect }: LocationItemProps) {
  return (
    <motion.button
      variants={staggerItem('right', 50)}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.05 }}
      {...buttonTaps.subtle}
      onClick={onSelect}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all group',
        isCurrent
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
          {isCurrent && (
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
  );
}

interface SidebarFooterProps {
  onRandom: () => void;
}

function SidebarFooter({ onRandom }: SidebarFooterProps) {
  return (
    <div className="p-6 border-t border-white/10">
      <motion.button
        onClick={onRandom}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
      >
        <Shuffle className="w-5 h-5" />
        随机探索下一个
      </motion.button>
    </div>
  );
}
