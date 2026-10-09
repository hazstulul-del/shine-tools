import React from 'react';
import { motion } from 'motion/react';

const marqueeItems = [
  { text: '🔥 Keren', highlight: 'Viral' },
  { text: '⚡ Ultra Fast Speed', highlight: 'Speed' },
  { text: '🚀 Premium Tools', highlight: 'Pro' },
  { text: '🖥 Server Uptime 99.9%', highlight: 'Stable' },
  { text: '🪙 NFToken Generator', highlight: 'Token' },
  { text: '🌎 All In One Platform', highlight: 'Global' },
  { text: '💎 Powerful Cloud API', highlight: 'Core' },
];

export const MovingText: React.FC = () => {
  // Duplicate for seamless infinite loop
  const list = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden rounded-[26px] bg-white/90 border border-blue-100/90 shadow-[0_10px_30px_rgba(76,125,255,0.06)] py-3 sm:py-3.5 px-4 backdrop-blur-md relative select-none">
      {/* Left and Right Fade Gradients for glass feel */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-6 sm:gap-10 whitespace-nowrap"
        animate={{
          x: ['-50%', '0%'], // kiri -> kanan movement as specified!
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: 'linear',
        }}
      >
        {list.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3.5 group cursor-default"
          >
            <span className="text-sm sm:text-base font-extrabold tracking-wide bg-gradient-to-r from-[#4C7DFF] via-[#5F93FF] to-[#6EA8FF] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              {item.text}
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-300/80 group-hover:bg-[#4C7DFF] transition-colors" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
