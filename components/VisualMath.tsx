
import React from 'react';
import { GameMode } from '../types';

interface VisualProps {
  table: number; // The number (e.g. Table 2)
  step: number;  // The multiplier (e.g. x 5)
  mode: GameMode;
}

const VisualMath: React.FC<VisualProps> = ({ table, step, mode }) => {
  const icons = ['🍎', '⭐', '🎈', '🐯', '🐼', '🐧', '🍕', '🚗', '🌈', '🍦'];
  const icon = icons[table % icons.length];

  if (mode === GameMode.MULTIPLICATION) {
    return (
      <div className="flex flex-wrap gap-6 justify-center max-w-sm">
        {[...Array(step)].map((_, groupIdx) => (
          <div key={groupIdx} className="bg-sky-50 p-3 rounded-2xl border-2 border-sky-200 flex flex-wrap gap-2 justify-center w-24">
            {[...Array(table)].map((_, iconIdx) => (
              <span key={iconIdx} className="text-2xl hover:scale-125 transition-transform cursor-default">
                {icon}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Division mode: Total items being split into buckets
  const total = table * step;
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 inline-block">
        <div className="text-sm font-bold text-orange-600 mb-2">Tổng cộng: {total} {icon}</div>
        <div className="flex flex-wrap gap-1 justify-center max-w-xs">
          {[...Array(total)].map((_, i) => (
            <span key={i} className="text-lg opacity-40">{icon}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="text-3xl text-orange-400">⬇️ Chia thành {table} phần ⬇️</div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(table)].map((_, groupIdx) => (
          <div key={groupIdx} className="bg-white p-3 rounded-2xl border-2 border-orange-400 flex flex-wrap gap-2 justify-center w-20 relative">
            <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
              {groupIdx + 1}
            </span>
            {[...Array(step)].map((_, iconIdx) => (
              <span key={iconIdx} className="text-2xl animate-bounce" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                {icon}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualMath;
