import React from 'react';
import { motion } from 'motion/react';
import { Wifi, BatteryMedium, Signal, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { APP_LOGOS } from '../constants/logos';

export const SmartphoneMockup: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-[280px] sm:max-w-[310px] select-none"
    >
      {/* Outer Glow Halo */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#4C7DFF]/20 via-[#6EA8FF]/20 to-[#32D583]/15 rounded-[48px] blur-2xl opacity-70 -z-10" />

      {/* Smartphone Hardware Frame */}
      <div className="relative rounded-[42px] p-3.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 shadow-[0_25px_60px_-15px_rgba(76,125,255,0.3),0_0_0_1px_rgba(255,255,255,0.8)_inset] border border-slate-300/80">
        
        {/* Antennas / Side buttons accents */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-10 bg-slate-300 rounded-l" />
        <div className="absolute -left-[5px] top-38 w-[3px] h-10 bg-slate-300 rounded-l" />
        <div className="absolute -right-[5px] top-28 w-[3px] h-12 bg-slate-300 rounded-r" />

        {/* Screen Bezel */}
        <div className="relative rounded-[34px] overflow-hidden bg-[#F4F7FF] border border-slate-900/10 shadow-inner min-h-[530px] flex flex-col justify-between">
          
          {/* Punch-hole / Dynamic Island Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 bg-slate-950/90 rounded-full shadow-sm text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>

          {/* Android Status Bar */}
          <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-700 z-20">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span>100%</span>
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Screen Content: SHINE TOOLS Mock Interface */}
          <div className="px-3.5 pt-3 pb-2 space-y-3 flex-1">
            {/* Mock App Header */}
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-white shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={APP_LOGOS.website}
                  alt="SHINE TOOLS"
                  className="w-7 h-7 rounded-full object-cover shadow-xs border border-blue-200"
                />
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-none">SHINE TOOLS</div>
                  <div className="text-[9px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Ultra Fast Proxy
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-50 text-[#4C7DFF] flex items-center justify-center text-[10px] font-bold">
                PRO
              </div>
            </div>

            {/* Mock Mini Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30">
              <div className="text-[9px] uppercase tracking-wider font-extrabold text-blue-100 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> All In One Android Tools
              </div>
              <div className="text-xs font-bold mt-0.5 leading-snug">
                Shine Mail, Alight Motion & NFToken
              </div>
            </div>

            {/* Mock Alight Motion PRO Box */}
            <div className="bg-white rounded-2xl p-2.5 border border-blue-50 shadow-sm space-y-2">
              <div className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <img src={APP_LOGOS.alightMotion} alt="AM" className="w-4 h-4 rounded object-cover" />
                  <span>Alight Motion PRO</span>
                </div>
                <span className="text-[9px] text-[#32D583] font-semibold">Active</span>
              </div>
              <div className="h-7 bg-slate-50 border border-slate-200/60 rounded-xl px-2 flex items-center text-[10px] text-slate-400">
                user@shinemail.org
              </div>
              <div className="h-7 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
                <span>AKTIVASI INSTAN</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Mock Status Tile */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded-2xl border border-blue-50 shadow-sm text-center">
                <div className="text-base font-extrabold text-[#4C7DFF]">100%</div>
                <div className="text-[9px] font-bold text-slate-500">Fast Speed</div>
              </div>
              <div className="bg-white p-2 rounded-2xl border border-blue-50 shadow-sm text-center">
                <div className="text-base font-extrabold text-[#32D583]">FREE</div>
                <div className="text-[9px] font-bold text-slate-500">Unlimited</div>
              </div>
            </div>

            {/* Mock Verification Tag */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Server Status: Online & Stabil</span>
            </div>
          </div>

          {/* Android Navigation Bar Pill */}
          <div className="py-2.5 flex justify-center items-center">
            <div className="w-24 h-1 bg-slate-400/80 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
