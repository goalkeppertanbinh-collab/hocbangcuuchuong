
import React, { useState, useMemo, useEffect } from 'react';
import { Question, GameMode, MultiplayerResult } from '../types';

interface MultiplayerQuizProps {
  table: number;
  mode: GameMode;
  timeLimit: number;
  onFinish: (result: MultiplayerResult) => void;
  onQuit: () => void;
}

const MultiplayerQuiz: React.FC<MultiplayerQuizProps> = ({ table, mode, timeLimit, onFinish, onQuit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ player: number; correct: boolean; timeOut?: boolean } | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);

  const questions = useMemo(() => {
    const list: Question[] = [];
    const multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);
    
    multipliers.forEach((m, idx) => {
      const isMult = mode === GameMode.MULTIPLICATION;
      const answer = isMult ? table * m : m;
      
      const optionsSet = new Set<number>([answer]);
      while (optionsSet.size < 4) {
        const fake = isMult 
          ? table * (Math.floor(Math.random() * 10) + 1)
          : (Math.floor(Math.random() * 10) + 1);
        if (fake > 0) optionsSet.add(fake);
      }
      
      list.push({
        id: idx,
        multiplier1: table,
        multiplier2: m,
        answer,
        mode,
        options: Array.from(optionsSet).sort(() => Math.random() - 0.5)
      });
    });
    return list;
  }, [table, mode]);

  const currentQuestion = questions[currentIdx];

  // Timer Effect
  useEffect(() => {
    if (timeLimit <= 0 || disabledButtons || showFeedback !== null) return;

    setTimeLeft(timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, timeLimit, disabledButtons, showFeedback]);

  const handleTimeOut = () => {
    setShowFeedback({ player: 0, correct: false, timeOut: true });
    setDisabledButtons(true);
    setTimeout(() => {
      proceedNext();
    }, 1500);
  };

  const handleAnswer = (selected: number, player: number) => {
    if (disabledButtons || showFeedback !== null) return;

    const isCorrect = selected === currentQuestion.answer;
    
    if (isCorrect) {
      setShowFeedback({ player, correct: true });
      if (player === 1) setP1Score(prev => prev + 1);
      else setP2Score(prev => prev + 1);
      
      setDisabledButtons(true);
      setTimeout(() => {
        proceedNext();
      }, 1000);
    } else {
      setShowFeedback({ player, correct: false });
      setDisabledButtons(true);
      setTimeout(() => {
        setShowFeedback(null);
        setDisabledButtons(false);
      }, 800);
    }
  };

  const proceedNext = () => {
    setShowFeedback(null);
    setDisabledButtons(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onFinish({
        p1Score,
        p2Score,
        total: questions.length
      });
    }
  };

  const isDiv = mode === GameMode.DIVISION;

  return (
    <div className="h-full flex flex-col items-stretch overflow-hidden relative">
      {/* Timer Bar - Top */}
      {timeLimit > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-20">
          <div 
            className={`h-full transition-all duration-1000 ${timeLeft <= 2 ? 'bg-red-500 animate-pulse' : 'bg-sky-500'}`}
            style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
          />
        </div>
      )}

      {/* Header Info - Floating in center */}
      <div className="absolute top-1/2 left-0 right-0 h-0 z-10 flex items-center justify-between px-2 sm:px-4">
         <button onClick={onQuit} className="bg-white/90 backdrop-blur shadow-md p-1.5 sm:p-2 rounded-full text-sky-500 font-bold flex items-center gap-2 hover:bg-white transition-all transform -translate-y-1/2 pointer-events-auto active:scale-90">
          🏠
        </button>
        
        {timeLimit > 0 && (
          <div className={`bg-white shadow-xl px-3 py-1 rounded-full font-black text-xl transform -translate-y-1/2 ${timeLeft <= 2 ? 'text-red-500 scale-125 animate-bounce' : 'text-sky-600'}`}>
            {timeLeft}s
          </div>
        )}

        <div className="bg-white/90 backdrop-blur shadow-md p-1.5 sm:p-2 rounded-xl text-sky-800 font-bold text-xs sm:text-base transform -translate-y-1/2 pointer-events-auto">
          {currentIdx + 1}/{questions.length}
        </div>
      </div>

      {/* Player 1 Section (Top, Flipped) */}
      <div className="flex-1 bg-sky-50 border-b-2 border-dashed border-sky-200 p-2 sm:p-6 flex flex-col justify-center transform rotate-180">
        <div className="text-center mb-1 sm:mb-4">
           <div className="text-[10px] sm:text-sm font-bold text-sky-400 uppercase tracking-widest">NGƯỜI CHƠI 1</div>
           <div className="text-lg sm:text-2xl font-black text-sky-600">{p1Score} điểm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-5xl font-black text-sky-800 mb-2 sm:mb-4">
             {isDiv 
              ? `${currentQuestion.multiplier1 * currentQuestion.multiplier2} : ${currentQuestion.multiplier1} = ?`
              : `${currentQuestion.multiplier1} x ${currentQuestion.multiplier2} = ?`}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm mx-auto">
            {currentQuestion.options.map((opt) => (
              <button
                key={`p1-${opt}`}
                onClick={() => handleAnswer(opt, 1)}
                disabled={disabledButtons}
                className={`py-3 sm:py-6 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold shadow-sm transition-all transform active:scale-95 ${
                  showFeedback?.player === 1 && showFeedback?.correct && opt === currentQuestion.answer ? 'bg-green-500 text-white animate-pulse' :
                  showFeedback?.player === 1 && !showFeedback?.correct && opt !== currentQuestion.answer ? 'bg-white text-gray-400' :
                  'bg-white text-sky-700 hover:bg-sky-100 border-2 border-sky-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Player 2 Section (Bottom) */}
      <div className="flex-1 bg-orange-50 p-2 sm:p-6 flex flex-col justify-center">
        <div className="text-center mb-1 sm:mb-4">
           <div className="text-[10px] sm:text-sm font-bold text-orange-400 uppercase tracking-widest">NGƯỜI CHƠI 2</div>
           <div className="text-lg sm:text-2xl font-black text-orange-600">{p2Score} điểm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-5xl font-black text-orange-800 mb-2 sm:mb-4">
             {isDiv 
              ? `${currentQuestion.multiplier1 * currentQuestion.multiplier2} : ${currentQuestion.multiplier1} = ?`
              : `${currentQuestion.multiplier1} x ${currentQuestion.multiplier2} = ?`}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm mx-auto">
            {currentQuestion.options.map((opt) => (
              <button
                key={`p2-${opt}`}
                onClick={() => handleAnswer(opt, 2)}
                disabled={disabledButtons}
                className={`py-3 sm:py-6 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold shadow-sm transition-all transform active:scale-95 ${
                  showFeedback?.player === 2 && showFeedback?.correct && opt === currentQuestion.answer ? 'bg-green-500 text-white animate-pulse' :
                  showFeedback?.player === 2 && !showFeedback?.correct && opt !== currentQuestion.answer ? 'bg-white text-gray-400' :
                  'bg-white text-orange-700 hover:bg-orange-100 border-2 border-orange-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {showFeedback !== null && (
        <div className={`fixed inset-0 pointer-events-none flex items-center justify-center z-50 animate-in fade-in zoom-in duration-300 ${showFeedback.player === 1 ? 'rotate-180' : ''}`}>
          <div className="bg-white/90 backdrop-blur rounded-full p-4 sm:p-8 shadow-2xl border-2 sm:border-4 border-white flex flex-col items-center">
            <span className="text-4xl sm:text-8xl">{showFeedback.timeOut ? '⏰' : (showFeedback.correct ? '🎯' : '❌')}</span>
            <div className={`text-sm sm:text-2xl font-black mt-1 sm:mt-2 ${showFeedback.correct ? 'text-green-600' : 'text-red-600'}`}>
               {showFeedback.timeOut ? 'HẾT GIỜ RỒI!' : (showFeedback.correct ? 'CHÍNH XÁC!' : 'SAI RỒI!')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerQuiz;
