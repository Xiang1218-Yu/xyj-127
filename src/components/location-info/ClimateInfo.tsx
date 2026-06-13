import { Thermometer, Droplets, Sun } from 'lucide-react';
import { InfoSection } from './InfoSection';
import type { ClimateInfo as ClimateInfoType } from '@/data/locations';

interface ClimateInfoProps {
  climate: ClimateInfoType;
}

export function ClimateInfo({ climate }: ClimateInfoProps) {
  const maxRainfall = Math.max(...climate.monthlyData.map(d => d.rainfall));
  const maxTemp = Math.max(...climate.monthlyData.map(d => d.tempHigh));
  const minTemp = Math.min(...climate.monthlyData.map(d => d.tempLow));

  return (
    <InfoSection
      icon={<Thermometer className="w-4 h-4 text-orange-400" />}
      title="气候信息"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="px-2.5 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
            <Thermometer className="w-3.5 h-3.5 text-orange-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50">年均温</div>
            <div className="text-sm text-orange-300 font-medium">{climate.avgTemp}</div>
          </div>
          <div className="px-2.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
            <Droplets className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50">气候类型</div>
            <div className="text-[11px] text-cyan-300 font-medium leading-tight">{climate.type}</div>
          </div>
          <div className="px-2.5 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
            <Sun className="w-3.5 h-3.5 text-yellow-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50">最佳季节</div>
            <div className="text-[11px] text-yellow-300 font-medium leading-tight">{climate.bestSeason}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider">月度气温与降水</div>
          <div className="flex items-end gap-[3px] h-20">
            {climate.monthlyData.map((d) => {
              const tempRange = maxTemp - minTemp;
              const highPct = tempRange > 0 ? ((d.tempHigh - minTemp) / tempRange) * 100 : 50;
              const lowPct = tempRange > 0 ? ((d.tempLow - minTemp) / tempRange) * 100 : 50;
              const rainPct = maxRainfall > 0 ? (d.rainfall / maxRainfall) * 100 : 0;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-[2px] group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                    {d.month} {d.tempHigh}°/{d.tempLow}° {d.rainfall}mm
                  </div>
                  <div className="w-full flex flex-col items-center gap-[1px]" style={{ height: '56px' }}>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-orange-500/60 to-orange-400/30"
                      style={{ height: `${highPct * 0.56}px` }}
                    />
                    <div
                      className="w-full bg-cyan-500/30"
                      style={{ height: `${Math.max(1, rainPct * 0.3)}px` }}
                    />
                  </div>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{
                      marginTop: `-${lowPct * 0.3}px`,
                      backgroundColor: 'rgba(56, 189, 248, 0.6)',
                    }}
                  />
                  <span className="text-[8px] text-white/30">{d.month.replace('月', '')}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-[9px] text-white/40">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-orange-500/50" />气温
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-cyan-500/30" />降水
            </span>
          </div>
        </div>
      </div>
    </InfoSection>
  );
}
