import React from 'react';
import { motion } from 'motion/react';
import { Zap, Layers, ShieldCheck, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-[#4C7DFF]" />,
    title: '⚡ Fast API',
    subtitle: 'Kecepatan respon API multi-thread secepat kilat tanpa batasan kuota.',
    accent: 'from-blue-50 to-blue-100/50',
  },
  {
    icon: <Layers className="w-8 h-8 text-[#6EA8FF]" />,
    title: '🚀 Banyak Tools',
    subtitle: 'Mulai dari Alight Motion PRO, NFToken Generator, hingga pemantauan server.',
    accent: 'from-indigo-50 to-sky-100/50',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#32D583]" />,
    title: '🔒 Secure',
    subtitle: 'Proxy backend terenkripsi menjaga privasi tanpa iklan membahayakan.',
    accent: 'from-emerald-50 to-teal-100/50',
  },
  {
    icon: <Smartphone className="w-8 h-8 text-[#4C7DFF]" />,
    title: '📱 Mobile Friendly',
    subtitle: 'Dirancang khusus dengan estetika aplikasi Android modern yang responsif.',
    accent: 'from-blue-50 to-indigo-100/50',
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {features.map((feat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-[28px] p-6 border border-blue-100/70 shadow-[0_12px_32px_rgba(76,125,255,0.06)] flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle Corner Ambient */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-50/80 group-hover:bg-blue-100/60 transition-colors pointer-events-none" />

          <div>
            {/* Big Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.accent} flex items-center justify-center mb-4 shadow-sm border border-white group-hover:scale-105 transition-transform`}>
              {feat.icon}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight mb-2">
              {feat.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {feat.subtitle}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#4C7DFF]">
            <span>Optimal</span>
            <span className="w-2 h-2 rounded-full bg-[#32D583]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
