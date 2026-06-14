import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { buttonTaps } from '@/animations';
import { useFavoriteStore } from '@/store/useFavoriteStore';

interface FavoriteButtonProps {
  locationId: string;
}

export function FavoriteButton({ locationId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const active = isFavorite(locationId);

  return (
    <motion.button
      {...buttonTaps.icon}
      onClick={() => toggleFavorite(locationId)}
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center transition-all
        ${active
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
          : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-transparent'
        }
      `}
    >
      <Star
        className={`w-4 h-4 transition-all ${active ? 'fill-yellow-400' : ''}`}
      />
    </motion.button>
  );
}
