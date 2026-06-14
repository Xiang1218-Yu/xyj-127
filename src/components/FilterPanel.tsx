import { motion } from 'framer-motion';
import { buttonTaps } from '@/animations';
import { useEditorStore, FILTERS, type FilterType } from '@/store/useEditorStore';

export function FilterPanel() {
  const { filter, setFilter } = useEditorStore();

  return (
    <div className="space-y-4">
      <h3 className="text-white/90 text-sm font-medium">选择滤镜</h3>
      
      <div className="grid grid-cols-5 gap-3">
        {FILTERS.map((f) => (
          <motion.button
            key={f.id}
            {...buttonTaps.standard}
            onClick={() => setFilter(f.id as FilterType)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              filter === f.id
                ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-500/30"
              style={{ filter: f.cssFilter }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 mb-1"
                style={{ filter: f.cssFilter }}
              />
              <span className="text-[10px] text-white/90 font-medium">
                {f.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
