import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { collapseExpandStandard, rotateExpandFast } from '@/animations';

interface InfoSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function InfoSection({ icon, title, children, defaultOpen = false }: InfoSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition-all text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-white/90 text-sm font-medium">{title}</span>
        </div>
        <motion.div
          animate={isOpen ? 'animate' : 'initial'}
          {...rotateExpandFast}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={collapseExpandStandard}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-3.5 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
