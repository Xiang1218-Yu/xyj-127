import { motion } from 'framer-motion';
import { useEditorStore, WEATHERS, type WeatherType } from '@/store/useEditorStore';

const WEATHER_GRADIENTS: Record<WeatherType, string> = {
  none: 'from-amber-400/30 via-orange-400/20 to-yellow-300/30',
  rain: 'from-slate-500/40 via-blue-600/30 to-slate-700/40',
  snow: 'from-blue-200/40 via-slate-100/30 to-blue-300/40',
  fog: 'from-slate-300/40 via-gray-200/30 to-slate-400/40',
  sand: 'from-amber-600/40 via-yellow-700/30 to-orange-500/40',
};

export function WeatherPanel() {
  const { weather, setWeather, weatherIntensity, setWeatherIntensity } = useEditorStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white/90 text-sm font-medium mb-3">选择天气</h3>
        
        <div className="grid grid-cols-5 gap-3">
          {WEATHERS.map((w) => (
            <motion.button
              key={w.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWeather(w.id as WeatherType)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                weather === w.id
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${WEATHER_GRADIENTS[w.id]}`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl">{w.icon}</span>
                <span className="text-[10px] text-white/90 font-medium">
                  {w.name}
                </span>
              </div>
              {weather === w.id && (
                <motion.div
                  layoutId="weather-active"
                  className="absolute inset-0 border-2 border-cyan-400 rounded-xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {weather !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white/90 text-sm font-medium">天气强度</h3>
            <span className="text-cyan-300 text-xs font-mono bg-cyan-500/10 px-2 py-1 rounded-md">
              {Math.round(weatherIntensity * 100)}%
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={weatherIntensity}
              onChange={(e) => setWeatherIntensity(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-br
                [&::-webkit-slider-thumb]:from-cyan-400
                [&::-webkit-slider-thumb]:to-blue-500
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-cyan-400/50
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white/30
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gradient-to-br
                [&::-moz-range-thumb]:from-cyan-400
                [&::-moz-range-thumb]:to-blue-500
                [&::-moz-range-thumb]:border-none"
              style={{
                background: `linear-gradient(to right, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.6) ${weatherIntensity * 100}%, rgba(255,255,255,0.1) ${weatherIntensity * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-white/40">
            <span>轻微</span>
            <span>适中</span>
            <span>强烈</span>
          </div>
        </motion.div>
      )}

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl">
            {WEATHERS.find(w => w.id === weather)?.icon}
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">
              当前：{WEATHERS.find(w => w.id === weather)?.name}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {WEATHERS.find(w => w.id === weather)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
