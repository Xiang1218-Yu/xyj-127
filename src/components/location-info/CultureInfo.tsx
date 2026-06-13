import { Palette } from 'lucide-react';
import { InfoSection } from './InfoSection';
import type { CultureHighlight } from '@/data/locations';

interface CultureInfoProps {
  culture: CultureHighlight[];
}

export function CultureInfo({ culture }: CultureInfoProps) {
  return (
    <InfoSection
      icon={<Palette className="w-4 h-4 text-purple-400" />}
      title="文化特色"
    >
      <div className="space-y-2">
        {culture.map((item, index) => (
          <div
            key={index}
            className="flex gap-2.5 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10"
          >
            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-white/90 text-xs font-medium">{item.title}</div>
              <div className="text-white/50 text-[11px] leading-relaxed">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
