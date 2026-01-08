
import React, { useState, useEffect } from 'react';
import { QuizResult, GameMode } from '../types';
import { getAiFeedback } from '../services/geminiService';
import VoiceSpeaker from './VoiceSpeaker';
import { saveProgress, saveQuizAttempt } from '../utils/storage';

interface ResultViewProps {
  result: QuizResult;
  table: number;
  mode: GameMode;
  onRetry: () => void;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, table, mode, onRetry, onHome }) => {
  const [aiText, setAiText] = useState<string>('Đang đợi Cô Linh chấm bài...');
  const [loading, setLoading] = useState(true);

  const percentage = (result.score / result.total) * 100;

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedback = await getAiFeedback(result.score, result.total, table, mode);
      setAiText(feedback || 'Cố gắng lên bé nhé!');
      setLoading(false);
    };
    fetchFeedback();

    // Lưu nỗ lực thi
    saveQuizAttempt(table, mode, result.score);

    // Nếu đạt 100% điểm, tự động đánh dấu đã hoàn thành bảng này
    if (percentage === 100) {
      saveProgress(table, mode);
    }
  }, [result, table, mode]);

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="text-8xl mb-4 animate-bounce">
          {percentage === 100 ? '👑' : percentage >= 80 ? '🌟' : percentage >= 50 ? '🎈' : '💪'}
        </div>
        <h2 className="text-4xl font-black text-gray-800">Kết quả thử thách!</h2>
        <div className="text-7xl font-black text-sky-600 drop-shadow-sm">
          {result.score} / {result.total}
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-xs bg-gray-200 h-4 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full transition-all duration-1000 ${percentage === 100 ? 'bg-green-500' : 'bg-sky-500'}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-xl text-gray-500 font-medium">
          {percentage === 100 ? 'Thật tuyệt vời! Không sai câu nào luôn!' : 'Em đã rất cố gắng rồi đấy!'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-4 border-pink-100 shadow-xl relative overflow-visible">
        <div className="absolute -top-8 -left-8 text-7xl">👩‍🏫</div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-pink-800 font-school underline decoration-pink-200">Cô Linh nhận xét:</h3>
          {!loading && aiText && <VoiceSpeaker text={aiText} />}
        </div>
        <div className="bg-pink-50 p-6 rounded-2xl border-2 border-dashed border-pink-200 min-h-[100px] flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200"></span>
            </div>
          ) : (
            <p className="text-2xl text-gray-800 leading-relaxed font-school text-center">
              {aiText}
            </p>
          )}
        </div>
      </div>

      {result.wrongAnswers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-red-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Em cần luyện tập thêm các câu này nhé:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {result.wrongAnswers.map((q, idx) => (
              <div key={idx} className="bg-white border-2 border-red-100 p-4 rounded-2xl text-center font-bold text-red-500 shadow-sm hover:scale-105 transition-transform">
                {q.mode === GameMode.DIVISION 
                  ? `${q.multiplier1 * q.multiplier2} : ${q.multiplier1} = ${q.multiplier2}` 
                  : `${q.multiplier1} x ${q.multiplier2} = ${q.answer}`}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onRetry} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all text-xl flex items-center justify-center gap-3">
          <span>Thử sức lại</span> 🔄
        </button>
        <button onClick={onHome} className="flex-1 bg-white text-pink-600 font-black py-5 rounded-2xl border-4 border-pink-100 shadow-md transition-all text-xl flex items-center justify-center gap-3">
          <span>Quay về</span> 🏠
        </button>
      </div>
    </div>
  );
};

export default ResultView;
