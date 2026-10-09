import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Trophy,
  Server,
  Zap,
  Coins,
  Settings,
  X,
  Sparkles,
  Mail,
} from 'lucide-react';

import { APP_LOGOS } from '../constants/logos';

export type PageId =
  | 'home'
  | 'shinemail'
  | 'premium'
  | 'nftoken'
  | 'status'
  | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
}) => {
  const handleNav = (page: PageId) => {
    onSelectPage(page);
    // On small screens, close sidebar upon selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4C7DFF] to-[#6EA8FF] p-0.5 shadow-md shadow-blue-400/30">
            <img
              src={APP_LOGOS.website}
              alt="SHINE TOOLS"
              className="w-full h-full rounded-[14px] object-cover bg-white"
            />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 tracking-tight text-base">
              SHINE TOOLS
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Android Edition App Hub
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
        {/* 🏠 Beranda */}
        <button
          onClick={() => handleNav('home')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'home'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>🏠 Beranda</span>
        </button>

        {/* 📬 Shine Mail (Temp & Gmail Generator) */}
        <button
          onClick={() => handleNav('shinemail')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'shinemail'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <img
              src={APP_LOGOS.shineMail}
              alt="Shine Mail"
              className="w-5 h-5 rounded-md object-cover ring-1 ring-white/50 shadow-xs"
            />
            <span>📬 Shine Mail</span>
          </div>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activePage === 'shinemail'
                ? 'bg-white/20 text-white'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            NEW
          </span>
        </button>

        {/* ⚡ Alight Motion Premium */}
        <button
          onClick={() => handleNav('premium')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'premium'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <img
            src={APP_LOGOS.alightMotion}
            alt="Alight Motion"
            className="w-5 h-5 rounded-md object-cover ring-1 ring-white/50 shadow-xs"
          />
          <span>⚡ Alight Motion Premium</span>
        </button>

        {/* 🪙 NFTOKEN / Netflix */}
        <button
          onClick={() => handleNav('nftoken')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'nftoken'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <img
            src={APP_LOGOS.netflix}
            alt="Netflix"
            className="w-5 h-5 rounded-md object-cover ring-1 ring-white/50 shadow-xs"
          />
          <span>🪙 NFTOKEN (Netflix)</span>
        </button>

        {/* 🖥 Server Status */}
        <button
          onClick={() => handleNav('status')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'status'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <Server className="w-5 h-5 text-indigo-500" />
          <span>🖥 Server Status</span>
        </button>

        {/* ⚙ Setting */}
        <button
          onClick={() => handleNav('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activePage === 'settings'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/30'
              : 'text-slate-600 hover:bg-blue-50/80 hover:text-[#4C7DFF]'
          }`}
        >
          <Settings className="w-5 h-5 text-slate-500" />
          <span>⚙ Setting</span>
        </button>
      </div>

      {/* Sidebar Footer Badge */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#4C7DFF] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHINE CLOUD PRO</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ultra-fast API response & zero ads experience.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-6 h-[calc(100vh-3rem)] rounded-[32px] bg-white border border-blue-100/80 shadow-[0_16px_40px_rgba(76,125,255,0.08)] overflow-hidden">
          {navContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } rounded-r-[32px] overflow-hidden`}
      >
        {navContent}
      </aside>
    </>
  );
};
