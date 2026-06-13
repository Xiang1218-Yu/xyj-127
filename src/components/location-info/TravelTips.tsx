import { Lightbulb, Bus, Hotel, Wallet, Shield } from 'lucide-react';
import { InfoSection } from './InfoSection';
import type { TravelTip, TravelAdvice } from '@/data/locations';

interface TravelTipsProps {
  tips: TravelTip[];
  travelAdvice: TravelAdvice;
}

export function TravelTips({ tips, travelAdvice }: TravelTipsProps) {
  return (
    <div className="space-y-2">
      <InfoSection
        icon={<Lightbulb className="w-4 h-4 text-yellow-400" />}
        title="旅行小贴士"
        defaultOpen={true}
      >
        <div className="space-y-1.5">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10"
            >
              <span className="text-sm flex-shrink-0">{tip.icon}</span>
              <div className="min-w-0">
                <div className="text-white/90 text-xs font-medium">{tip.title}</div>
                <div className="text-white/50 text-[11px] leading-relaxed">{tip.content}</div>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection
        icon={<Bus className="w-4 h-4 text-emerald-400" />}
        title="旅游提示"
      >
        <div className="space-y-1.5">
          <AdviceItem
            icon={<Bus className="w-3.5 h-3.5 text-emerald-400" />}
            label="交通"
            content={travelAdvice.transport}
          />
          <AdviceItem
            icon={<Hotel className="w-3.5 h-3.5 text-blue-400" />}
            label="住宿"
            content={travelAdvice.accommodation}
          />
          <AdviceItem
            icon={<Wallet className="w-3.5 h-3.5 text-amber-400" />}
            label="预算"
            content={travelAdvice.budget}
          />
          <AdviceItem
            icon={<Shield className="w-3.5 h-3.5 text-red-400" />}
            label="安全"
            content={travelAdvice.safety}
          />
        </div>
      </InfoSection>
    </div>
  );
}

function AdviceItem({ icon, label, content }: { icon: React.ReactNode; label: string; content: string }) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="text-white/90 text-xs font-medium">{label}</div>
        <div className="text-white/50 text-[11px] leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
