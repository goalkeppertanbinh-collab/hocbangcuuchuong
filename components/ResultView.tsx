
import React, { useState, useEffect } from 'react';
import { QuizResult, GameMode } from '../types';
import { getAiFeedback } from '../services/geminiService';
import VoiceSpeaker from './VoiceSpeaker';
import { saveProgress, saveQuizAttempt, saveSticker, getProgress } from '../utils/storage';

interface ResultViewProps {
  result: QuizResult;
  table: number;
  mode: GameMode;
  onRetry: () => void;
  onHome: () => void;
}

const STICKERS = ['🦖', '🦄', '🚀', '🐱‍🚀', '🦁', '🦉', '🦋', '🐳', '🐲', '🚁', '🍔', '🍦', '💎', '🎮', '🛸', '🌋'];

const ResultView: React.FC<ResultViewProps> = ({ result, table, mode, onRetry, onHome }) => {
  const [aiText, setAiText] = useState<string>('Đang đợi Cô Linh chấm bài...');
  const [loading, setLoading] = useState(true);
  const [newSticker, setNewSticker] = useState<string | null>(null);
  const [showGift, setShowGift] = useState(false);

  const percentage = (result.score / result.total) * 100;

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedback = await getAiFeedback(result.score, result.total, table, mode);
      setAiText(feedback || 'Cố gắng lên bé nhé!');
      setLoading(false);
    };
    fetchFeedback();

    saveQuizAttempt(table, mode, result.score);

    if (percentage === 100) {
      saveProgress(table, mode);
      
      // Kiểm tra xem đã có sticker cho bảng này chưa (giả lập chọn sticker dựa trên bảng)
      const progress = getProgress();
      const sticker = STICKERS[table % STICKERS.length];
      if (!progress.stickers.includes(sticker)) {
        setNewSticker(sticker);
        setTimeout(() => setShowGift(true), 1500);
      }
    }
  }, [result, table, mode]);

  const handleCollectSticker = () => {
    if (newSticker) {
      saveSticker(newSticker);
      setNewSticker(null);
      setShowGift(false);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 max-w-2xl mx-auto relative">
      <div className="text-center space-y-4">
        <div className="text-8xl mb-4 animate-bounce">
          {percentage === 100 ? '👑' : percentage >= 80 ? '🌟' : percentage >= 50 ? '🎈' : '💪'}
        </div>
        <h2 className="text-4xl font-black text-gray-800">Kết quả thử thách!</h2>
        <div className="text-7xl font-black text-sky-600 drop-shadow-sm">
          {result.score} / {result.total}
        </div>
        <p className="text-xl text-gray-500 font-medium font-school">
          {percentage === 100 ? 'Thật tuyệt vời! Không sai câu nào luôn!' : 'Em đã rất cố gắng rồi đấy!'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-4 border-pink-100 shadow-xl relative">
        <div className="absolute -top-8 -left-8 text-7xl">👩‍🏫</div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-pink-800 font-school">Cô Linh nhận xét:</h3>
          {!loading && aiText && <VoiceSpeaker text={aiText} />}
        </div>
        <div className="bg-pink-50 p-6 rounded-2xl border-2 border-dashed border-pink-200">
          {loading ? (
            <div className="flex justify-center p-4">
               <div className="animate-pulse flex space-x-2">
                 <div className="h-3 w-3 bg-pink-400 rounded-full"></div>
                 <div className="h-3 w-3 bg-pink-400 rounded-full"></div>
                 <div className="h-3 w-3 bg-pink-400 rounded-full"></div>
               </div>
            </div>
          ) : (
            <p className="text-2xl text-gray-800 leading-relaxed font-school text-center">"{aiText}"</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onRetry} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all text-xl">
          Làm lại bài này 🔄
        </button>
        <button onClick={onHome} className="flex-1 bg-white text-pink-600 font-black py-5 rounded-2xl border-4 border-pink-100 shadow-md transition-all text-xl">
          Quay về bản đồ 🗺️
        </button>
      </div>

      {/* Sticker Gift Modal */}
      {showGift && newSticker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-sky-900/80 backdrop-blur-md"></div>
           <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl text-center space-y-6 animate-in zoom-in duration-500 max-w-sm">
              <div className="text-2xl font-black text-sky-800 uppercase tracking-widest">QUÀ TẶNG BÉ!</div>
              <div className="text-[10rem] animate-bounce">{newSticker}</div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-gray-800">Nhãn dán mới!</h3>
                 <p className="text-gray-500 font-medium">Chúc mừng bé đã đạt điểm tuyệt đối! Hãy dán nó vào sổ nhé.</p>
              </div>
              <button 
                onClick={handleCollectSticker}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-5 rounded-2xl text-2xl shadow-lg transition-all transform active:scale-95"
              >
                Nhận ngay 🎁
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
