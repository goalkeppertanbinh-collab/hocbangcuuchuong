
import React, { useState, useEffect } from 'react';
import { getProgress } from '../utils/storage';
import { GameMode, ProgressData } from '../types';

interface StatsViewProps {
  onBack: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    // Chỉ chạy ở phía client
    const data = getProgress();
    setProgress(data);
  }, []);

  if (!progress) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const totalTables = 16; 
  const learnedCount = (progress.multiplication?.length || 0) + (progress.division?.length || 0);
  const learnedPercentage = Math.round((learnedCount / totalTables) * 100);
  
  const history = progress.quizHistory || [];
  const avgScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + (curr.totalScore / curr.attempts), 0) / history.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full text-gray-400 hover:text-sky-500 transition-colors shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-sky-800 font-school">Nhật ký học tập của em 📓</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 p-6 rounded-[2rem] border-2 border-sky-100 shadow-sm text-center">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-sm font-bold text-sky-600 uppercase tracking-wider">Đã hoàn thành</div>
          <div className="text-4xl font-black text-sky-800">{learnedCount} / {totalTables}</div>
          <div className="mt-2 w-full bg-sky-200 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full transition-all" style={{ width: `${learnedPercentage}%` }} />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-100 shadow-sm text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-sm font-bold text-orange-600 uppercase tracking-wider">Điểm trung bình</div>
          <div className="text-4xl font-black text-orange-800">{avgScore} / 10</div>
        </div>

        <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100 shadow-sm text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-sm font-bold text-green-600 uppercase tracking-wider">Bài thi đã làm</div>
          <div className="text-4xl font-black text-green-800">{history.length}</div>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-[2rem] border-4 border-pink-100 relative shadow-md">
        <div className="absolute -top-6 -left-4 text-6xl">👩‍🏫</div>
        <div className="ml-12">
          <h3 className="text-2xl font-bold text-pink-800 font-school mb-2">Lời nhắn từ Cô Linh:</h3>
          <p className="text-xl text-gray-800 leading-relaxed font-school">
            Chào em! Cô Linh rất vui khi thấy em chăm chỉ luyện tập mỗi ngày. Em hãy tiếp tục học thêm các bảng mới và ôn lại những bảng mình còn chưa nhớ kỹ nhé. Cô tin là em sẽ trở thành "Thần đồng toán học" sớm thôi! ✨ Luyện tập thường xuyên là chìa khóa để giỏi Toán đấy!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-700">Chi tiết lịch sử:</h3>
        </div>
        <div className="overflow-x-auto">
          {history.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Bảng</th>
                  <th className="px-6 py-4">Số lần thi</th>
                  <th className="px-6 py-4">Điểm cao nhất</th>
                  <th className="px-6 py-4">Ngày gần nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${item.mode === GameMode.MULTIPLICATION ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.mode === GameMode.MULTIPLICATION ? 'Nhân' : 'Chia'} {item.table}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{item.attempts} lần</td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-lg ${item.bestScore === 10 ? 'text-green-500' : 'text-gray-700'}`}>
                        {item.bestScore} / 10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(item.lastAttempt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium">
              Em chưa có lịch sử làm bài. Hãy bắt đầu thử thách ngay nhé! 🚀
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={onBack} className="bg-sky-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-sky-700 transition-all shadow-lg transform active:scale-95 text-xl">
          Quay lại trang chủ 🏃‍♂️
        </button>
      </div>
    </div>
  );
};

export default StatsView;
