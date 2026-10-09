import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Mail } from 'lucide-react';
import { SmartphoneMockup } from './SmartphoneMockup';
import { PageId } from './Sidebar';

import { APP_LOGOS } from '../constants/logos';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-[#EEF4FF] via-[#E4EFFF] to-[#F3F7FF] border border-blue-200/60 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(76,125,255,0.08)]">
      {/* Soft Ambient Light Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-300/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-blue-200/80 shadow-sm text-xs font-bold text-[#4C7DFF]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4C7DFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4C7DFF]"></span>
            </span>
            <span>⚡ THE ULTIMATE ANDROID TOOL PLATFORM</span>
          </motion.div>

          {/* Big Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              ALL TOOLS IN <span className="bg-gradient-to-r from-[#4C7DFF] via-[#5F93FF] to-[#6EA8FF] bg-clip-text text-transparent">ONE PLACE</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Gunakan premium tools, buat email & generator Gmail, generate token siap pakai, dan pantau performa server dalam satu platform Android modern.
            </p>
          </motion.div>

          {/* Quick CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('shinemail')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-[#4C7DFF] text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all cursor-pointer"
            >
              <img
                src={APP_LOGOS.shineMail}
                alt="Shine Mail"
                className="w-5 h-5 rounded-md object-cover ring-1 ring-white/60"
              />
              <span>Shine Mail & Gmail</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-black">NEW</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('premium')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-blue-200/80 shadow-sm hover:border-[#4C7DFF]/50 transition-all cursor-pointer"
            >
              <img
                src={APP_LOGOS.alightMotion}
                alt="Alight Motion"
                className="w-5 h-5 rounded-md object-cover ring-1 ring-amber-200"
              />
              <span>Alight Motion PRO</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('nftoken')}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 font-bold text-sm border border-blue-200/70 shadow-sm hover:border-[#4C7DFF]/40 transition-all cursor-pointer"
            >
              <img
                src={APP_LOGOS.netflix}
                alt="Netflix NFToken"
                className="w-5 h-5 rounded-md object-cover ring-1 ring-red-200"
              />
              <span>NFToken (Netflix)</span>
            </motion.button>
          </motion.div>

          {/* Value Badges */}
          <div className="pt-3 border-t border-blue-200/50 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#32D583]" />
              <span>100% Aman & Tanpa Iklan Popup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#4C7DFF]" />
              <span>Koneksi Direct Proxy Tercepat</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-tech Modern Smartphone Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <SmartphoneMockup />
        </div>
      </div>
    </section>
  );
};
