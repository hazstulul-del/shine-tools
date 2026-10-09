import React from 'react';
import { motion } from 'motion/react';
import { Download, MoreVertical, Menu, Sparkles, Smartphone, Check } from 'lucide-react';

import { APP_LOGOS } from '../constants/logos';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onNavigateHome,
}) => {
  const [downloadState, setDownloadState] = React.useState<'idle' | 'installing' | 'installed'>('idle');
  const [showMenuDropdown, setShowMenuDropdown] = React.useState(false);

  const handleDownloadApp = () => {
    setDownloadState('installing');
    setTimeout(() => {
      setDownloadState('installed');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 1200);
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-pill rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_12px_32px_rgba(76,125,255,0.12)] border border-white/80 bg-white/90 backdrop-blur-xl"
      >
        {/* Left: Round Logo + App Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-blue-50 text-[#4C7DFF] transition-colors focus:outline-none"
            title="Menu Sidebar"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group focus:outline-none text-left"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4C7DFF] to-[#6EA8FF] p-[2px] shadow-md shadow-blue-400/40 relative overflow-hidden"
            >
              <img
                src={APP_LOGOS.website}
                alt="SHINE TOOLS"
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-800 group-hover:text-[#4C7DFF] transition-colors">
                  SHINE TOOLS
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#4C7DFF] px-2 py-0.5 rounded-full">
                  v2.5 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                Premium Mobile Tools Hub
              </p>
            </div>
          </button>
        </div>

        {/* Right: Download Button + 3-dots Menu */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownloadApp}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all shadow-md ${
              downloadState === 'installed'
                ? 'bg-[#32D583] shadow-emerald-400/30'
                : 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] shadow-blue-400/30 hover:shadow-blue-400/50'
            }`}
          >
            {downloadState === 'installing' ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="hidden xs:inline">Memasang...</span>
              </>
            ) : downloadState === 'installed' ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden xs:inline">Terpasang!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh App</span>
              </>
            )}
          </motion.button>

          {/* Three dots button */}
          <div className="relative">
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200/60"
              aria-label="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenuDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-blue-50 py-2 z-50 text-xs sm:text-sm"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800">⚡ SHINE TOOLS APK</p>
                  <p className="text-[11px] text-slate-400">Android Edition 2026</p>
                </div>
                <button
                  onClick={() => {
                    handleDownloadApp();
                    setShowMenuDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-[#4C7DFF]" />
                  Pasang sebagai PWA
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                    setShowMenuDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#6EA8FF]" />
                  Muat Ulang Data
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1 px-4 py-1.5 text-[11px] text-slate-400">
                  Status Cloud: <span className="text-[#32D583] font-semibold">Aktif 100%</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
};
