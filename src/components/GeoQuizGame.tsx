import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Lightbulb, Trophy, ArrowRight, RotateCcw, Flame, Sparkles, MapPin, ChevronRight, ThumbsUp, Frown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRandomQuizQuestions, checkAnswer, CATEGORY_LABELS, CATEGORY_ICONS, type GeoQuizQuestion, type GeoQuizCategory } from '@/data/geoQuizData';

const QUESTIONS_PER_ROUND = 8;
const HINT_SCORES = [100, 60, 30];

interface GeoQuizGameProps {
  onClose: () => void;
}

interface QuizState {
  questions: GeoQuizQuestion[];
  currentIndex: number;
  currentHintIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  input: string;
  revealed: boolean;
  answered: boolean;
  isCorrect: boolean | null;
  phase: 'ready' | 'playing' | 'result' | 'summary';
}

export default function GeoQuizGame({ onClose }: GeoQuizGameProps) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    currentHintIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    input: '',
    revealed: false,
    answered: false,
    isCorrect: null,
    phase: 'ready',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = state.questions[state.currentIndex] ?? null;

  const startGame = useCallback((category?: GeoQuizCategory) => {
    let questions = getRandomQuizQuestions(QUESTIONS_PER_ROUND);
    if (category) {
      const filtered = questions.filter(q => q.category === category);
      if (filtered.length >= 4) {
        questions = filtered;
      }
    }
    setState({
      questions,
      currentIndex: 0,
      currentHintIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      input: '',
      revealed: false,
      answered: false,
      isCorrect: null,
      phase: 'playing',
    });
  }, []);

  const revealNextHint = useCallback(() => {
    if (!currentQuestion) return;
    if (state.currentHintIndex < currentQuestion.hints.length - 1) {
      setState(prev => ({ ...prev, currentHintIndex: prev.currentHintIndex + 1 }));
    }
  }, [currentQuestion, state.currentHintIndex]);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || state.answered) return;
    const correct = checkAnswer(state.input, currentQuestion);
    const hintScore = HINT_SCORES[state.currentHintIndex] ?? 10;
    const earnedScore = correct ? hintScore + state.streak * 5 : 0;

    setState(prev => ({
      ...prev,
      answered: true,
      isCorrect: correct,
      score: prev.score + earnedScore,
      streak: correct ? prev.streak + 1 : 0,
      maxStreak: correct ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
      correctCount: prev.correctCount + (correct ? 1 : 0),
    }));
  }, [currentQuestion, state.input, state.answered, state.streak, state.currentHintIndex]);

  const revealAnswer = useCallback(() => {
    if (!currentQuestion || state.revealed) return;
    setState(prev => ({
      ...prev,
      revealed: true,
      answered: true,
      isCorrect: false,
      streak: 0,
    }));
  }, [currentQuestion, state.revealed]);

  const nextQuestion = useCallback(() => {
    if (state.currentIndex >= state.questions.length - 1) {
      setState(prev => ({ ...prev, phase: 'summary' }));
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        currentHintIndex: 0,
        input: '',
        revealed: false,
        answered: false,
        isCorrect: null,
      }));
    }
  }, [state.currentIndex, state.questions.length]);

  useEffect(() => {
    if (state.phase === 'playing' && !state.answered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.phase, state.answered, state.currentIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !state.answered) {
      submitAnswer();
    } else if (e.key === 'Enter' && state.answered) {
      nextQuestion();
    }
  }, [submitAnswer, nextQuestion, state.answered]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">地理知识问答</h2>
              <p className="text-white/50 text-sm">根据提示猜出地名</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {state.phase === 'ready' && <ReadyPhase key="ready" onStart={startGame} />}
            {state.phase === 'playing' && currentQuestion && (
              <PlayingPhase
                key={`playing-${state.currentIndex}`}
                question={currentQuestion}
                hintIndex={state.currentHintIndex}
                input={state.input}
                answered={state.answered}
                isCorrect={state.isCorrect}
                revealed={state.revealed}
                score={state.score}
                streak={state.streak}
                progress={`${state.currentIndex + 1}/${state.questions.length}`}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
                onInputChange={(v) => setState(prev => ({ ...prev, input: v }))}
                onRevealHint={revealNextHint}
                onSubmit={submitAnswer}
                onReveal={revealAnswer}
                onNext={nextQuestion}
              />
            )}
            {state.phase === 'summary' && (
              <SummaryPhase
                key="summary"
                score={state.score}
                correctCount={state.correctCount}
                totalCount={state.questions.length}
                maxStreak={state.maxStreak}
                onRestart={() => startGame()}
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ReadyPhaseProps {
  onStart: (category?: GeoQuizCategory) => void;
}

function ReadyPhase({ onStart }: ReadyPhaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<GeoQuizCategory | 'all'>('all');

  const categories: { value: GeoQuizCategory | 'all'; label: string; icon: string; desc: string }[] = [
    { value: 'all', label: '全部类型', icon: '🌍', desc: '混合各类题目' },
    { value: 'country', label: '猜国家', icon: CATEGORY_ICONS.country, desc: '根据提示猜国家名' },
    { value: 'city', label: '猜城市', icon: CATEGORY_ICONS.city, desc: '根据提示猜城市名' },
    { value: 'landmark', label: '猜地标', icon: CATEGORY_ICONS.landmark, desc: '根据提示猜著名地标' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="text-center py-6"
    >
      <div className="mb-8">
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MapPin className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">地理知识挑战</h3>
        <p className="text-white/60 max-w-md mx-auto">
          根据渐进式提示，猜出对应的国家、城市或地标。提示越少，得分越高！
        </p>
      </div>

      <div className="mb-8">
        <p className="text-white/70 text-sm mb-3">选择题目类型</p>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'px-4 py-3 rounded-xl font-medium transition-all text-left',
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 text-emerald-200'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-transparent'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-semibold">{cat.label}</span>
              </div>
              <p className="text-xs opacity-60">{cat.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-8 max-w-sm mx-auto border border-white/10">
        <h4 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2 justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          评分规则
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-500/10 rounded-lg p-2">
            <div className="text-emerald-400 text-lg font-bold">100</div>
            <div className="text-white/50 text-[10px]">第1条提示</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-2">
            <div className="text-yellow-400 text-lg font-bold">60</div>
            <div className="text-white/50 text-[10px]">第2条提示</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-2">
            <div className="text-orange-400 text-lg font-bold">30</div>
            <div className="text-white/50 text-[10px]">第3条提示</div>
          </div>
        </div>
        <p className="text-white/40 text-[10px] mt-2">连续答对可获得额外加成分</p>
      </div>

      <button
        onClick={() => onStart(selectedCategory === 'all' ? undefined : selectedCategory)}
        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
      >
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          <span>开始挑战</span>
        </div>
      </button>
    </motion.div>
  );
}

interface PlayingPhaseProps {
  question: GeoQuizQuestion;
  hintIndex: number;
  input: string;
  answered: boolean;
  isCorrect: boolean | null;
  revealed: boolean;
  score: number;
  streak: number;
  progress: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (v: string) => void;
  onRevealHint: () => void;
  onSubmit: () => void;
  onReveal: () => void;
  onNext: () => void;
}

function PlayingPhase({
  question,
  hintIndex,
  input,
  answered,
  isCorrect,
  revealed,
  score,
  streak,
  progress,
  inputRef,
  onInputChange,
  onRevealHint,
  onSubmit,
  onReveal,
  onNext,
}: PlayingPhaseProps) {
  const canRevealMore = hintIndex < question.hints.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl">
            <Star className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold text-sm">{score}</span>
          </div>
          {streak > 1 && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-400/30 rounded-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 font-bold text-sm">{streak}连对</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold',
            question.category === 'country' && 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
            question.category === 'city' && 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
            question.category === 'landmark' && 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
          )}>
            {CATEGORY_ICONS[question.category]} {CATEGORY_LABELS[question.category]}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium">
            {progress}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{question.emoji}</span>
          <div>
            <p className="text-white/50 text-xs">这是哪个{CATEGORY_LABELS[question.category]}？</p>
            <p className="text-white/30 text-[10px]">{question.continent}</p>
          </div>
        </div>

        <div className="space-y-3">
          {question.hints.slice(0, hintIndex + 1).map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'px-4 py-3 rounded-xl border transition-all',
                i === 0 && !answered && 'bg-emerald-500/10 border-emerald-400/20',
                i === 1 && !answered && 'bg-yellow-500/10 border-yellow-400/20',
                i === 2 && !answered && 'bg-orange-500/10 border-orange-400/20',
                answered && 'bg-white/5 border-white/10',
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5',
                  i === 0 && 'bg-emerald-500/30 text-emerald-300',
                  i === 1 && 'bg-yellow-500/30 text-yellow-300',
                  i === 2 && 'bg-orange-500/30 text-orange-300',
                )}>
                  {i + 1}
                </div>
                <p className={cn(
                  'text-sm leading-relaxed',
                  i <= hintIndex ? 'text-white/90' : 'text-white/30',
                )}>
                  {hint}
                </p>
                <div className="flex-shrink-0 ml-auto">
                  <span className={cn(
                    'text-xs font-mono font-bold',
                    i === 0 && 'text-emerald-400',
                    i === 1 && 'text-yellow-400',
                    i === 2 && 'text-orange-400',
                  )}>
                    +{HINT_SCORES[i]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!answered && canRevealMore && (
          <motion.button
            onClick={onRevealHint}
            className="mt-3 w-full py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white/70 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Lightbulb className="w-4 h-4" />
            <span>揭示下一条提示（得分降低）</span>
          </motion.button>
        )}
      </div>

      {!answered && (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="输入你的答案..."
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all text-sm"
            />
          </div>
          <motion.button
            onClick={onSubmit}
            disabled={!input.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
            whileHover={{ scale: input.trim() ? 1.05 : 1 }}
            whileTap={{ scale: input.trim() ? 0.95 : 1 }}
          >
            确认
          </motion.button>
        </div>
      )}

      {!answered && (
        <button
          onClick={onReveal}
          className="mt-3 text-white/30 text-xs hover:text-white/50 transition-colors flex items-center gap-1 mx-auto"
        >
          <span>不知道？</span>
          <ChevronRight className="w-3 h-3" />
          <span>查看答案</span>
        </button>
      )}

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <div className={cn(
              'rounded-2xl border p-5',
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-400/30'
                : 'bg-red-500/10 border-red-400/30',
            )}>
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center">
                      <ThumbsUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-300 font-bold">回答正确！</p>
                      <p className="text-emerald-300/60 text-xs">
                        +{HINT_SCORES[hintIndex]}分{streak > 1 ? ` + ${streak - 1}×5连对加成` : ''}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
                      <Frown className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-red-300 font-bold">
                        {revealed ? '已揭示答案' : '回答错误'}
                      </p>
                      <p className="text-red-300/60 text-xs">正确答案见下方</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-black/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{question.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-lg">{question.answer}</p>
                    <p className="text-white/50 text-xs">{question.continent} · {CATEGORY_LABELS[question.category]}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/70 text-xs leading-relaxed">{question.funFact}</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              onClick={onNext}
              className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>下一题</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SummaryPhaseProps {
  score: number;
  correctCount: number;
  totalCount: number;
  maxStreak: number;
  onRestart: () => void;
  onClose: () => void;
}

function SummaryPhase({ score, correctCount, totalCount, maxStreak, onRestart, onClose }: SummaryPhaseProps) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const grade = percentage >= 90 ? 'S' : percentage >= 70 ? 'A' : percentage >= 50 ? 'B' : 'C';
  const gradeColor = grade === 'S' ? 'from-yellow-400 to-orange-500' : grade === 'A' ? 'from-emerald-400 to-teal-500' : grade === 'B' ? 'from-blue-400 to-cyan-500' : 'from-purple-400 to-pink-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-6"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      <h3 className="text-3xl font-bold text-white mb-2">挑战完成！</h3>
      <p className="text-white/60 mb-8">看看你的地理知识水平如何</p>

      <div className={cn('w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg', gradeColor)}>
        <span className="text-white text-4xl font-black">{grade}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-emerald-400 text-3xl font-bold">{score}</p>
          <p className="text-white/50 text-sm">总得分</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-cyan-400 text-3xl font-bold">{correctCount}/{totalCount}</p>
          <p className="text-white/50 text-sm">正确率 {percentage}%</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-orange-400 text-3xl font-bold">{maxStreak}</p>
          <p className="text-white/50 text-sm">最长连对</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-purple-400 text-3xl font-bold">{grade === 'S' ? '地理大师' : grade === 'A' ? '地理达人' : grade === 'B' ? '地理爱好者' : '地理新手'}</p>
          <p className="text-white/50 text-sm">称号</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          再来一局
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 transition-colors flex items-center gap-2"
        >
          继续探索
        </button>
      </div>
    </motion.div>
  );
}
