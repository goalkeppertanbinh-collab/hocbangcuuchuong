
import React, { useState } from 'react';
import VisualMath from './VisualMath';
import { GameMode } from '../types';
import VoiceSpeaker from './VoiceSpeaker';
import { saveProgress } from '../utils/storage';

interface LearningViewProps {
  table: number;
  mode: GameMode;
  onBack: () => void;
  onStartQuiz: () => void;
}

const LearningView: React.FC<LearningViewProps> = ({ table, mode, onBack, onStartQuiz }) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
  const isDiv = mode === GameMode.DIVISION;
  const icons = ['quả táo', 'ngôi sao', 'quả bóng', 'bạn hổ', 'bạn gấu', 'chim cánh cụt', 'miếng pizza', 'chiếc ô tô', 'cầu vồng', 'que kem'];
  const iconEmojis = ['🍎', '⭐', '🎈', '🐯', '🐼', '🐧', '🍕', '🚗', '🌈', '🍦'];
  const currentIcon = icons[table % icons.length];
  const currentEmoji = iconEmojis[table % iconEmojis.length];

  const handleFinishLesson = () => {
    saveProgress(table, mode);
    onBack();
  };

  // Hàm tạo lời giải thích chi tiết hơn cho từng phép tính
  const getStaticExplanation = (step: number) => {
    const result = table * step;
    
    if (isDiv) {
      if (step === 1) {
        return `Chào em! Khi có ${table} ${currentIcon} mà chia đều cho ${table} bạn, thì mỗi bạn chỉ được đúng 1 ${currentIcon} thôi. Giống như việc em có 1 cái kẹo và chỉ có mình em ăn vậy đó!`;
      }
      return `Em nhìn kìa! Cô Linh đang có tất cả là ${result} ${currentIcon} ${currentEmoji}. Bây giờ cô chia số ${currentIcon} này vào ${table} chiếc giỏ bằng nhau. Em đếm thử xem, mỗi chiếc giỏ sẽ có đúng ${step} ${currentIcon} đấy. Phép chia giúp chúng mình chia quà thật công bằng cho mọi người em nhé!`;
    } else {
      if (step === 1) {
        return `Chào em! Phép tính này rất đơn giản. Có 1 nhóm duy nhất chứa ${table} ${currentIcon}, nên tổng cộng vẫn chỉ là ${table} ${currentIcon} thôi. Số nào nhân với 1 cũng bằng chính nó đó em!`;
      }
      if (step === 2) {
        return `Chào em! ${table} nhân 2 tức là chúng mình lấy ${table} cộng thêm với chính nó một lần nữa. ${table} + ${table} = ${result}. Gấp đôi lên thật nhanh đúng không nào!`;
      }
      return `Để tính ${table} x ${step}, em hãy tưởng tượng có ${step} nhóm bạn đang chơi, mỗi nhóm có ${table} ${currentIcon} ${currentEmoji}. Thay vì đếm từng cái, chúng mình dùng phép nhân: lấy ${table} cộng lại ${step} lần. Kết quả là ${result}. Em thấy phép nhân giúp mình tính tổng siêu nhanh chưa?`;
    }
  };

  const handleOpenStep = (step: number) => {
    setSelectedStep(step);
  };

  const closeModal = () => {
    setSelectedStep(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white rounded-full text-gray-400 hover:text-sky-500 transition-colors shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className={`text-3xl font-bold ${isDiv ? 'text-orange-800' : 'text-sky-800'}`}>
              Bảng {isDiv ? 'chia' : 'nhân'} {table}
            </h2>
            <p className="text-gray-600 font-medium">Nhấn vào từng phép tính để xem Cô Linh hướng dẫn nhé!</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleFinishLesson}
            className="bg-white text-green-600 border-2 border-green-200 font-bold py-3 px-6 rounded-2xl shadow-sm hover:bg-green-50 transition-all"
          >
            Đã thuộc bài! ✅
          </button>
          <button 
            onClick={onStartQuiz}
            className={`${isDiv ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 px-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all`}
          >
            Làm bài tập ngay! 🎯
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-[2rem] border-2 ${isDiv ? 'bg-orange-50 border-orange-100' : 'bg-sky-50 border-sky-100'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleOpenStep(i + 1)}
              className="w-full flex items-center justify-between p-6 rounded-2xl transition-all border-2 bg-white text-gray-800 border-transparent hover:border-sky-300 hover:shadow-md transform hover:scale-[1.02]"
            >
              <span className="text-2xl font-bold">
                {isDiv ? `${table * (i + 1)} : ${table}` : `${table} x ${i + 1}`}
              </span>
              <span className={`text-3xl font-black ${isDiv ? 'text-orange-500' : 'text-sky-600'}`}>= {isDiv ? i + 1 : table * (i + 1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={handleFinishLesson}
          className="bg-green-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-green-700 transition-all shadow-lg transform active:scale-95 text-xl flex items-center gap-3"
        >
          <span>Em đã học xong bảng này!</span>
          <span>🏆</span>
        </button>
      </div>

      {/* Popup Modal */}
      {selectedStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 custom-scrollbar">
            {/* Header Modal */}
            <div className={`sticky top-0 z-10 p-6 flex items-center justify-between border-b ${isDiv ? 'bg-orange-50 border-orange-100' : 'bg-sky-50 border-sky-100'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">💡</span>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isDiv ? `${table * selectedStep} : ${table} = ${selectedStep}` : `${table} x ${selectedStep} = ${table * selectedStep}`}
                </h3>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Visual Section */}
              <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                <VisualMath table={table} step={selectedStep} mode={mode} />
                <div className="mt-8 text-xl font-medium text-gray-700 font-school max-w-md leading-relaxed">
                  {isDiv 
                    ? `Có tổng cộng ${table * selectedStep} ${currentIcon}. Khi chia cho ${table} nhóm, mỗi nhóm có đúng ${selectedStep} ${currentIcon} đó!`
                    : `Chúng mình có ${selectedStep} nhóm, và mỗi nhóm đều có ${table} ${currentIcon}. Tổng cộng tất cả là ${table * selectedStep} ${currentIcon}!` }
                </div>
              </div>

              {/* Cô Linh Explanation Section */}
              <div className="bg-pink-50 p-8 rounded-[2rem] border-4 border-pink-100 relative shadow-md">
                <div className="absolute -top-4 left-8 bg-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md tracking-wide">
                  BÀI GIẢNG CỦA CÔ LINH
                </div>
                <div className="flex items-start justify-between mb-6 mt-2">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="text-5xl">👩‍🏫</span>
                      <span className="absolute -bottom-1 -right-1 text-xl">✨</span>
                    </div>
                    <h4 className="text-2xl font-bold text-pink-800 font-school">Cô Linh hướng dẫn:</h4>
                  </div>
                  <VoiceSpeaker text={getStaticExplanation(selectedStep)} />
                </div>
                <div className="bg-white/90 p-6 rounded-2xl border-2 border-dashed border-pink-200 min-h-[120px] flex items-center justify-center">
                  <p className="text-2xl text-gray-800 leading-relaxed font-school text-center italic">
                    "{getStaticExplanation(selectedStep)}"
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-center pb-4">
                <button 
                  onClick={closeModal}
                  className="bg-sky-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-sky-700 transition-all shadow-lg transform active:scale-95 text-xl"
                >
                  Tuyệt vời, em hiểu rồi! 🌟
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningView;
