
import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  onStatsClick: () => void;
  showHome: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onStatsClick, showHome }) => {
  return (
    <header className="math-gradient p-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
        <div className="bg-white/20 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Toán Vui Vẻ</h1>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onStatsClick}
          className="bg-white/20 hover:bg-white/30 transition-all p-2 rounded-full flex items-center gap-2 px-4 font-semibold"
          title="Nhật ký học tập"
        >
          <span className="text-xl">📓</span>
          <span className="hidden sm:inline">Nhật ký</span>
        </button>
        
        {showHome && (
          <button 
            onClick={onHomeClick}
            className="bg-white/20 hover:bg-white/30 transition-all p-2 rounded-full flex items-center gap-2 px-4 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="hidden sm:inline">Trang chủ</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
