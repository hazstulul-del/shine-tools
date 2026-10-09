/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Sidebar, PageId } from './components/Sidebar';
import { Home } from './pages/Home';
import { ShineMail } from './pages/ShineMail';
import { Premium } from './pages/Premium';
import { NFTToken } from './pages/NFTToken';
import { Status } from './pages/Status';
import { Settings } from './pages/Settings';
import { Home as HomeIcon, Zap, Coins, Activity, Settings as SettingsIcon, Mail as MailIcon } from 'lucide-react';
import { APP_LOGOS } from './constants/logos';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-[#1E293B] flex flex-col font-sans selection:bg-[#4C7DFF] selection:text-white relative">
      {/* Top Floating Navbar (Capsule) */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onNavigateHome={() => setActivePage('home')}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-24 lg:pb-12 flex gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activePage={activePage}
          onSelectPage={(page) => setActivePage(page)}
        />

        {/* Viewport Content with Smooth Page Transitions */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {activePage === 'home' && (
                <Home onNavigate={(page) => setActivePage(page)} />
              )}

              {activePage === 'shinemail' && (
                <ShineMail onNavigate={(page) => setActivePage(page)} />
              )}

              {activePage === 'premium' && <Premium />}

              {activePage === 'nftoken' && <NFTToken />}

              {activePage === 'status' && <Status />}

              {activePage === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Android Bottom Floating Navigation Pill Bar */}
      <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 max-w-lg mx-auto">
        <div className="glass-pill rounded-full px-2 py-1.5 bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_12px_36px_rgba(76,125,255,0.18)] flex items-center justify-around">
          <button
            onClick={() => setActivePage('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'home'
                ? 'text-[#4C7DFF] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <HomeIcon className="w-4.5 h-4.5" />
            <span className="text-[9.5px]">Beranda</span>
          </button>

          <button
            onClick={() => setActivePage('shinemail')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'shinemail'
                ? 'text-sky-500 font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <img
                src={APP_LOGOS.shineMail}
                alt="Mail"
                className={`w-4.5 h-4.5 rounded object-cover ${
                  activePage === 'shinemail' ? 'ring-2 ring-sky-400' : 'opacity-80'
                }`}
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            </div>
            <span className="text-[9.5px]">Mail</span>
          </button>

          <button
            onClick={() => setActivePage('premium')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'premium'
                ? 'text-amber-500 font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <img
              src={APP_LOGOS.alightMotion}
              alt="Alight"
              className={`w-4.5 h-4.5 rounded object-cover ${
                activePage === 'premium' ? 'ring-2 ring-amber-400' : 'opacity-80'
              }`}
            />
            <span className="text-[9.5px]">Alight</span>
          </button>

          <button
            onClick={() => setActivePage('nftoken')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'nftoken'
                ? 'text-red-500 font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <img
              src={APP_LOGOS.netflix}
              alt="Token"
              className={`w-4.5 h-4.5 rounded object-cover ${
                activePage === 'nftoken' ? 'ring-2 ring-red-400' : 'opacity-80'
              }`}
            />
            <span className="text-[9.5px]">Token</span>
          </button>

          <button
            onClick={() => setActivePage('status')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'status'
                ? 'text-indigo-600 font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Activity className="w-4.5 h-4.5 text-indigo-500" />
            <span className="text-[9.5px]">Status</span>
          </button>

          <button
            onClick={() => setActivePage('settings')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activePage === 'settings'
                ? 'text-[#4C7DFF] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <SettingsIcon className="w-4.5 h-4.5 text-slate-500" />
            <span className="text-[9.5px]">Setelan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

