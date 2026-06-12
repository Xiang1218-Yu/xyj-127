import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Trophy, Clock, Grid3X3, Zap, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StreetViewLocation } from '@/data/locations';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  correctRow: number;
  correctCol: number;
  isPlaced: boolean;
}

interface PanoramaPuzzleGameProps {
  screenshot: string;
  location: StreetViewLocation;
  onClose: () => void;
  onRestart?: () => void;
}

const DIFFICULTY_CONFIG = {
  easy: { grid: 3, timeLimit: 180, baseScore: 1000 },
  medium: { grid: 4, timeLimit: 240, baseScore: 2000 },
  hard: { grid: 5, timeLimit: 300, baseScore: 3500 }
};

export default function PanoramaPuzzleGame({ screenshot, location, onClose }: PanoramaPuzzleGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [dragPiece, setDragPiece] = useState<{ id: number; x: number; y: number } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const config = DIFFICULTY_CONFIG[difficulty];
  const gridSize = config.grid;

  const pieceSize = useMemo(() => {
    return Math.min(400, window.innerWidth - 80) / gridSize;
  }, [gridSize]);

  const boardSize = pieceSize * gridSize;

  const loadImage = useCallback((): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = screenshot;
    });
  }, [screenshot]);

  const initializePuzzle = useCallback(async () => {
    const img = await loadImage();
    imageRef.current = img;

    const newPieces: PuzzlePiece[] = [];
    const positions: { row: number; col: number }[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col });
      }
    }

    const shuffled = [...positions].sort(() => Math.random() - 0.5);

    for (let i = 0; i < positions.length; i++) {
      newPieces.push({
        id: i,
        row: shuffled[i].row,
        col: shuffled[i].col,
        correctRow: positions[i].row,
        correctCol: positions[i].col,
        isPlaced: false
      });
    }

    setPieces(newPieces);
    setTimeLeft(config.timeLimit);
    setScore(0);
    setMoves(0);
    setSelectedPiece(null);
  }, [gridSize, config.timeLimit, loadImage]);

  const startGame = useCallback(async () => {
    await initializePuzzle();
    setGameState('playing');
    setShowPreview(false);
  }, [initializePuzzle]);

  const restartGame = useCallback(async () => {
    setGameState('ready');
    setShowPreview(true);
  }, []);

  const checkWin = useCallback((currentPieces: PuzzlePiece[]) => {
    return currentPieces.every(piece => piece.correctRow === piece.row && piece.correctCol === piece.col);
  }, []);

  const swapPieces = useCallback((pieceId1: number, pieceId2: number) => {
    setPieces(prev => {
      const newPieces = [...prev];
      const idx1 = newPieces.findIndex(p => p.id === pieceId1);
      const idx2 = newPieces.findIndex(p => p.id === pieceId2);

      if (idx1 === -1 || idx2 === -1) return prev;

      const tempRow = newPieces[idx1].row;
      const tempCol = newPieces[idx1].col;
      newPieces[idx1].row = newPieces[idx2].row;
      newPieces[idx1].col = newPieces[idx2].col;
      newPieces[idx2].row = tempRow;
      newPieces[idx2].col = tempCol;

      newPieces[idx1].isPlaced = newPieces[idx1].correctRow === newPieces[idx1].row && newPieces[idx1].correctCol === newPieces[idx1].col;
      newPieces[idx2].isPlaced = newPieces[idx2].correctRow === newPieces[idx2].row && newPieces[idx2].correctCol === newPieces[idx2].col;

      if (checkWin(newPieces)) {
        const timeBonus = Math.floor(timeLeft * 10);
        const moveBonus = Math.max(0, 1000 - moves * 10);
        setScore(config.baseScore + timeBonus + moveBonus);
        setTimeout(() => setGameState('won'), 300);
      }

      return newPieces;
    });
    setMoves(prev => prev + 1);
  }, [checkWin, timeLeft, moves, config.baseScore]);

  const handlePieceClick = useCallback((pieceId: number) => {
    if (gameState !== 'playing') return;

    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      swapPieces(selectedPiece, pieceId);
      setSelectedPiece(null);
    }
  }, [gameState, selectedPiece, swapPieces]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, pieceId: number) => {
    if (gameState !== 'playing') return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragPiece({ id: pieceId, x: clientX, y: clientY });
  }, [gameState]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragPiece) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragPiece(prev => prev ? { ...prev, x: clientX, y: clientY } : null);
  }, [dragPiece]);

  const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragPiece || !boardRef.current) {
      setDragPiece(null);
      return;
    }

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      const targetCol = Math.floor(x / pieceSize);
      const targetRow = Math.floor(y / pieceSize);

      const targetPiece = pieces.find(p => p.row === targetRow && p.col === targetCol);
      if (targetPiece && targetPiece.id !== dragPiece.id) {
        swapPieces(dragPiece.id, targetPiece.id);
      }
    }

    setDragPiece(null);
  }, [dragPiece, boardSize, pieceSize, pieces, swapPieces]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPiece = (piece: PuzzlePiece, isDragging = false) => {
    const bgPosX = -(piece.correctCol * pieceSize);
    const bgPosY = -(piece.correctRow * pieceSize);

    return (
      <motion.div
        key={piece.id}
        className={cn(
          'absolute cursor-grab active:cursor-grabbing rounded transition-all duration-150',
          selectedPiece === piece.id && 'ring-4 ring-cyan-400 ring-opacity-80 z-10',
          piece.isPlaced && 'ring-2 ring-green-400 ring-opacity-60',
          isDragging && 'opacity-50 z-20 scale-105'
        )}
        style={{
          width: pieceSize - 2,
          height: pieceSize - 2,
          left: piece.col * pieceSize + 1,
          top: piece.row * pieceSize + 1,
          backgroundImage: `url(${screenshot})`,
          backgroundSize: `${boardSize}px ${boardSize}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          boxShadow: piece.isPlaced ? '0 0 12px rgba(74, 222, 128, 0.4)' : '0 2px 8px rgba(0,0,0,0.3)'
        }}
        onClick={() => handlePieceClick(piece.id)}
        onMouseDown={(e) => handleDragStart(e, piece.id)}
        onTouchStart={(e) => handleDragStart(e, piece.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
    );
  };

  const renderDragPiece = () => {
    if (!dragPiece) return null;

    const piece = pieces.find(p => p.id === dragPiece.id);
    if (!piece) return null;

    const bgPosX = -(piece.correctCol * pieceSize);
    const bgPosY = -(piece.correctRow * pieceSize);

    return (
      <div
        className="fixed pointer-events-none z-50 rounded shadow-2xl"
        style={{
          width: pieceSize - 2,
          height: pieceSize - 2,
          left: dragPiece.x - pieceSize / 2,
          top: dragPiece.y - pieceSize / 2,
          backgroundImage: `url(${screenshot})`,
          backgroundSize: `${boardSize}px ${boardSize}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          transform: 'rotate(3deg)',
          opacity: 0.9
        }}
      />
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">空间记忆训练</h2>
              <p className="text-white/50 text-sm">{location.name} · {location.city}</p>
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
          {gameState === 'ready' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">准备好了吗？</h3>
                <p className="text-white/60">观察全景画面，记住细节，然后在限时内完成拼图</p>
              </div>

              <div className="relative mx-auto mb-6 rounded-2xl overflow-hidden" style={{ width: Math.min(400, window.innerWidth - 80), aspectRatio: '1/1' }}>
                <img
                  src={screenshot}
                  alt="全景预览"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 text-sm font-medium">记忆画面，点击开始后将打乱</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">选择难度</p>
                <div className="flex justify-center gap-3">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        'px-5 py-3 rounded-xl font-medium transition-all',
                        difficulty === d
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {d === 'easy' && <Grid3X3 className="w-4 h-4" />}
                        {d === 'medium' && <Zap className="w-4 h-4" />}
                        {d === 'hard' && <Trophy className="w-4 h-4" />}
                        <span>{d === 'easy' ? '简单 3×3' : d === 'medium' ? '中等 4×4' : '困难 5×5'}</span>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatTime(DIFFICULTY_CONFIG[d].timeLimit)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>开始挑战</span>
                </div>
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                    <Clock className={cn('w-5 h-5', timeLeft < 30 ? 'text-red-400' : 'text-cyan-400')} />
                    <span className={cn('font-mono font-bold text-lg', timeLeft < 30 ? 'text-red-400' : 'text-white')}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-bold">{moves} 步</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white font-bold">
                      {pieces.filter(p => p.isPlaced).length}/{pieces.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 flex items-center gap-2 transition-colors"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-sm">{showPreview ? '隐藏' : '查看'}原图</span>
                  </button>
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">重来</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-center gap-6">
                <div className="relative">
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div
                        className="absolute inset-0 z-30 rounded-2xl overflow-hidden pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <img
                          src={screenshot}
                          alt="原图预览"
                          className="w-full h-full object-cover opacity-30"
                          style={{ width: boardSize, height: boardSize }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    ref={boardRef}
                    className="relative bg-slate-950 rounded-2xl p-1"
                    style={{ width: boardSize + 8, height: boardSize + 8 }}
                  >
                    <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)` }}>
                      {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                        <div
                          key={i}
                          className="border border-white/5"
                          style={{ width: pieceSize, height: pieceSize }}
                        />
                      ))}
                    </div>

                    {pieces
                      .filter(p => !dragPiece || p.id !== dragPiece.id)
                      .map(piece => renderPiece(piece))}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <h4 className="text-white/70 text-sm font-medium mb-2">游戏提示</h4>
                    <ul className="text-white/50 text-xs space-y-1">
                      <li>• 点击两个拼图块进行交换</li>
                      <li>• 或者直接拖拽拼图到目标位置</li>
                      <li>• 绿色边框表示位置正确</li>
                      <li>• 剩余时间越多，得分越高</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white/70 text-sm font-medium mb-2">位置信息</h4>
                    <p className="text-white/50 text-xs">{location.name}</p>
                    <p className="text-white/40 text-xs">{location.city}, {location.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {gameState === 'won' && (
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center p-8"
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-2">恭喜完成！</h3>
                  <p className="text-white/60 mb-6">你的空间记忆力很棒！</p>
                  <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-cyan-400 text-3xl font-bold">{score}</p>
                      <p className="text-white/50 text-sm">得分</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-yellow-400 text-3xl font-bold">{moves}</p>
                      <p className="text-white/50 text-sm">步数</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-green-400 text-3xl font-bold">{formatTime(config.timeLimit - timeLeft)}</p>
                      <p className="text-white/50 text-sm">用时</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      再来一局
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-colors"
                    >
                      继续探索
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {gameState === 'lost' && (
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center p-8"
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">时间到！</h3>
                  <p className="text-white/60 mb-6">别灰心，再试一次吧</p>
                  <div className="bg-white/10 rounded-xl p-4 mb-8 max-w-xs mx-auto">
                    <p className="text-white/50 text-sm mb-1">已完成</p>
                    <p className="text-white text-2xl font-bold">
                      {pieces.filter(p => p.isPlaced).length} / {pieces.length} 块
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      再试一次
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                      返回
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {renderDragPiece()}
    </motion.div>
  );
}
