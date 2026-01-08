
import React, { useState, useMemo } from 'react';
import { Question, QuizResult, GameMode } from '../types';

interface QuizGameProps {
  table: number;
  mode: GameMode;
  onFinish: (result: QuizResult) => void;
  onQuit: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ table, mode, onFinish, onQuit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

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

  const handleAnswer = (selected: number) => {
    if (showFeedback !== null) return;

    const isCorrect = selected === currentQuestion.answer;
    setSelectedOption(selected);
    setShowFeedback(isCorrect);
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      
      setTimeout(() => {
        proceedNext(newScore, wrongAnswers);
      }, 1000);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      const newWrongAnswers = [...wrongAnswers, currentQuestion];
      setWrongAnswers(newWrongAnswers);
      
      // Hiện đáp án đúng trong 1.5 giây để bé học lại
      setTimeout(() => {
        proceedNext(score, newWrongAnswers);
      }, 1500);
    }
  };

  const proceedNext = (currentScore: number, currentWrongs: Question[]) => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowFeedback(null);
      setSelectedOption(null);
    } else {
      onFinish({
        score: currentScore,
        total: questions.length,
        wrongAnswers: currentWrongs
      });
    }
  };

  const isDiv = mode === GameMode.DIVISION;
  const progress = (currentIdx / questions.length) * 100;

  return (
    <div className="space-y-10 animate-in zoom-in duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onQuit} className="text-sky-500 font-bold flex items-center gap-2 hover:text-sky-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Thoát
        </button>
        <div className="text-xl font-bold text-sky-800">
          Câu hỏi {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${isDiv ? 'bg-orange-500' : 'bg-sky-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`flex flex-col items-center space-y-8 ${shake ? 'animate-bounce' : ''}`}>
        <div className="text-center space-y-4">
          <div className={`text-7xl md:text-8xl font-black tracking-wider ${isDiv ? 'text-orange-600' : 'text-sky-800'}`}>
            {isDiv 
              ? `${currentQuestion.multiplier1 * currentQuestion.multiplier2} : ${currentQuestion.multiplier1} = ?`
              : `${currentQuestion.multiplier1} x ${currentQuestion.multiplier2} = ?`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrectAnswer = opt === currentQuestion.answer;
            
            let btnClass = 'bg-white text-gray-600 border-4 border-gray-100 hover:border-sky-300';
            
            if (showFeedback !== null) {
              if (isCorrectAnswer) {
                btnClass = 'bg-green-500 text-white border-green-600 shadow-green-200';
              } else if (isSelected && !showFeedback) {
                btnClass = 'bg-red-400 text-white border-red-500 opacity-90';
              } else {
                btnClass = 'bg-white text-gray-300 border-gray-100 opacity-50';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={showFeedback !== null}
                className={`
                  text-3xl font-bold py-8 rounded-[2rem] shadow-md transition-all transform active:scale-95
                  ${btnClass}
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      
      {showFeedback !== null && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 animate-in fade-in zoom-in duration-300">
          <div className={`text-9xl font-black drop-shadow-2xl ${showFeedback ? 'text-green-500' : 'text-red-500'}`}>
            {showFeedback ? '✅' : '❌'}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
