import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Copy, Check } from 'lucide-react';
import type { StreetViewLocation } from '@/data/locations';
import { buttonTaps, fadeInOut, modalContentSpring } from '@/animations';

interface SharePanelProps {
  location: StreetViewLocation;
}

function generateMarkdown(loc: StreetViewLocation): string {
  const lines: string[] = [
    `# ${loc.name}`,
    '',
    `> ${loc.description}`,
    '',
    `## 基本信息`,
    '',
    `| 项目 | 内容 |`,
    `|------|------|`,
    `| 地点 | ${loc.city}, ${loc.country} |`,
    `| 大洲 | ${loc.continent} |`,
    `| 坐标 | ${loc.latitude.toFixed(4)}°N, ${loc.longitude.toFixed(4)}°E |`,
    `| 标签 | ${loc.tags.map(t => `\`${t}\``).join(' ')} |`,
    '',
    `## 气候信息`,
    '',
    `- **气候类型**: ${loc.climate.type}`,
    `- **年均温度**: ${loc.climate.avgTemp}`,
    `- **最佳旅行季节**: ${loc.climate.bestSeason}`,
    '',
    `| 月份 | 最高温(°C) | 最低温(°C) | 降水(mm) |`,
    `|------|-----------|-----------|----------|`,
    ...loc.climate.monthlyData.map(d =>
      `| ${d.month} | ${d.tempHigh} | ${d.tempLow} | ${d.rainfall} |`
    ),
    '',
    `## 文化特色`,
    '',
    ...loc.culture.map(c => `- ${c.icon} **${c.title}**: ${c.description}`),
    '',
    `## 旅行小贴士`,
    '',
    ...loc.tips.map(t => `- ${t.icon} **${t.title}**: ${t.content}`),
    '',
    `## 旅游提示`,
    '',
    `- 🚌 **交通**: ${loc.travelAdvice.transport}`,
    `- 🏨 **住宿**: ${loc.travelAdvice.accommodation}`,
    `- 💰 **预算**: ${loc.travelAdvice.budget}`,
    `- 🛡️ **安全**: ${loc.travelAdvice.safety}`,
    '',
    `---`,
    `*由「全球街景漫游」生成*`,
  ];
  return lines.join('\n');
}

export function SharePanel({ location }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const md = generateMarkdown(location);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = md;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <motion.button
        {...buttonTaps.icon}
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
      >
        <FileText className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              variants={modalContentSpring}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-lg max-h-[80vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold text-sm">Markdown 分享文本</h3>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    {...buttonTaps.standard}
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-auto max-h-[calc(80vh-64px)] p-5">
                <pre className="text-white/80 text-xs leading-relaxed font-mono whitespace-pre-wrap break-words bg-black/30 rounded-xl p-4 border border-white/5">
                  {md}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
