
import React from 'react';

interface MultiplayerSetupProps {
  onSelectTime: (seconds: number) => void;
  onBack: () => void;
}

const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ onSelectTime, onBack }) => {
  const timeOptions = [
    { label: '5 giây', seconds: 5, icon: '⚡', color: 'bg-red-500' },
    { label: '10 giây', seconds: 10, icon: '⏱️', color: 'bg-orange-500' },
    { label: '30 giây', seconds: 30, icon: '⏳', color: 'bg-sky-500' },
    { label: 'Không giới hạn', seconds: 0, icon: '♾️', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 max-w-lg mx-auto py-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-sky-800 font-school">Sẵn sàng thi đấu! ⚔️</h2>
        <p className="text-xl text-gray-500 font-medium font-school">Chọn thời gian cho mỗi câu hỏi nhé:</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timeOptions.map((opt) => (
          <button
            key={opt.seconds}
            onClick={() => onSelectTime(opt.seconds)}
            className={`${opt.color} hover:scale-105 transition-all text-white p-6 rounded-3xl shadow-lg flex flex-col items-center gap-2 group active:scale-95`}
          >
            <span className="text-4xl group-hover:animate-bounce">{opt.icon}</span>
            <span className="text-2xl font-black">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-6 flex justify-center">
        <button 
          onClick={onBack}
          className="text-gray-400 font-bold hover:text-sky-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default MultiplayerSetup;
