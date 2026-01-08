
import React from 'react';

interface VisualProps {
  m1: number; // Table
  m2: number; // Multiplier
}

const VisualMultiplication: React.FC<VisualProps> = ({ m1, m2 }) => {
  // Use fun icons based on the table number
  const icons = ['🍎', '⭐', '🎈', '🐯', '🐼', '🐧', '🍕', '🚗', '🌈', '🍦'];
  const icon = icons[m1 % icons.length];

  return (
    <div className="flex flex-wrap gap-6 justify-center max-w-sm">
      {[...Array(m2)].map((_, groupIdx) => (
        <div key={groupIdx} className="bg-sky-50 p-3 rounded-2xl border border-sky-200 flex flex-wrap gap-2 justify-center w-24">
          {[...Array(m1)].map((_, iconIdx) => (
            <span key={iconIdx} className="text-2xl hover:scale-125 transition-transform cursor-default">
              {icon}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VisualMultiplication;
