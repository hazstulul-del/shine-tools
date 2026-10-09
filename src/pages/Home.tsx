import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { MovingText } from '../components/MovingText';
import { FeatureCards } from '../components/FeatureCards';
import { PageId } from '../components/Sidebar';
import {
  Zap,
  Coins,
  Trophy,
  ArrowRight,
  Sparkles,
  Server,
  Settings as SettingsIcon,
  Mail,
} from 'lucide-react';

import { APP_LOGOS } from '../constants/logos';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'mail' | 'premium' | 'system'>('all');

  return (
    <div className="space-y-8 sm:space-y-10 pb-12">
      {/* 1. Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* 2. Moving Text Feature */}
      <MovingText />

      {/* 3. Feature Cards (4 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">
              KEUNGGULAN UTAMA
            </span>
            <span className="text-[11px] text-[#4C7DFF] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              PRO CORE
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Platform Terverifikasi</span>
        </div>
        <FeatureCards />
      </div>

      {/* 4. Quick Android App Store Tools Grid */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>ALAT POPULER & TERSEDIA</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                ACTIVE
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Pilih tool favorit untuk langsung membuka modul aplikasi
            </p>
          </div>

          {/* Quick Filter Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-blue-100 shadow-sm self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#4C7DFF]'
              }`}
            >
              Semua Tool
            </button>
            <button
              onClick={() => setFilter('mail')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'mail'
                  ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#4C7DFF]'
              }`}
            >
              <img src={APP_LOGOS.shineMail} alt="Shine Mail" className="w-3.5 h-3.5 rounded object-cover" />
              <span>Shine Mail</span>
            </button>
            <button
              onClick={() => setFilter('premium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'premium'
                  ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#4C7DFF]'
              }`}
            >
              ⚡ Premium & Token
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'system'
                  ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#4C7DFF]'
              }`}
            >
              🖥 Sistem
            </button>
          </div>
        </div>

        {/* Featured App-Store Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card Shine Mail (NEW) */}
          {(filter === 'all' || filter === 'mail') && (
            <div
              onClick={() => onNavigate('shinemail')}
              className="cursor-pointer bg-white rounded-[28px] p-5 sm:p-6 border-2 border-sky-200/80 shadow-[0_12px_32px_rgba(76,125,255,0.08)] hover:shadow-[0_16px_40px_rgba(76,125,255,0.15)] transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/40 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-50 to-blue-100 p-0.5 shadow-sm border border-white overflow-hidden shrink-0">
                  <img
                    src={APP_LOGOS.shineMail}
                    alt="Shine Mail"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-white bg-sky-500 px-2.5 py-1 rounded-full shadow-xs">
                    NEW FEATURE
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    Live Inbox
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-[#4C7DFF] transition-colors flex items-center gap-1.5">
                  <span>Shine Mail & Gmail Gen</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Kotak masuk sementara (disposable temp mail) untuk terima OTP/magic link & generator trik Gmail dot matrix resmi.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4C7DFF]">
                <span>Buka Shine Mail</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Card Alight Motion */}
          {(filter === 'all' || filter === 'premium') && (
            <div
              onClick={() => onNavigate('premium')}
              className="cursor-pointer bg-white rounded-[28px] p-5 sm:p-6 border border-blue-100/80 shadow-[0_12px_32px_rgba(76,125,255,0.06)] hover:shadow-[0_16px_40px_rgba(76,125,255,0.12)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-50 to-yellow-100 p-0.5 shadow-sm border border-white overflow-hidden shrink-0">
                  <img
                    src={APP_LOGOS.alightMotion}
                    alt="Alight Motion"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  Magic Link
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-[#4C7DFF] transition-colors">
                  Alight Motion Premium
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Kirim magic link dan verifikasi status lisensi akun Alight Creative Anda dengan mudah.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4C7DFF]">
                <span>Aktivasi Akun</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Card NFTOKEN */}
          {(filter === 'all' || filter === 'premium') && (
            <div
              onClick={() => onNavigate('nftoken')}
              className="cursor-pointer bg-white rounded-[28px] p-5 sm:p-6 border border-blue-100/80 shadow-[0_12px_32px_rgba(76,125,255,0.06)] hover:shadow-[0_16px_40px_rgba(76,125,255,0.12)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-50 to-amber-100 p-0.5 shadow-sm border border-white overflow-hidden shrink-0">
                  <img
                    src={APP_LOGOS.netflix}
                    alt="Netflix NFTOKEN"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  1-Click Instant
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-[#4C7DFF] transition-colors">
                  NFTOKEN Generator (Netflix)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Hasilkan NFTOKEN siap pakai dengan 1 klik atau konversi cookie sesi Netflix secara instan.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4C7DFF]">
                <span>Generate Token</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Card Server Status */}
          {(filter === 'all' || filter === 'system') && (
            <div
              onClick={() => onNavigate('status')}
              className="cursor-pointer bg-white rounded-[28px] p-5 sm:p-6 border border-blue-100/80 shadow-[0_12px_32px_rgba(76,125,255,0.06)] hover:shadow-[0_16px_40px_rgba(76,125,255,0.12)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-100 text-indigo-600 flex items-center justify-center text-2xl shadow-sm border border-white">
                  🖥
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  99.9% Uptime
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-[#4C7DFF] transition-colors">
                  Server & Cloud Status
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Cek status kesehatan API proxy, latensi koneksi edge node, dan kapasitas server real-time.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4C7DFF]">
                <span>Cek Status</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Card Settings */}
          {(filter === 'all' || filter === 'system') && (
            <div
              onClick={() => onNavigate('settings')}
              className="cursor-pointer bg-white rounded-[28px] p-5 sm:p-6 border border-blue-100/80 shadow-[0_12px_32px_rgba(76,125,255,0.06)] hover:shadow-[0_16px_40px_rgba(76,125,255,0.12)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center text-2xl shadow-sm border border-white">
                  ⚙
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  Konfigurasi
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-[#4C7DFF] transition-colors">
                  Pengaturan Aplikasi
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Kelola preferensi tema tampilan Android, bersihkan cache lokal, dan sesuaikan preferensi sistem.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4C7DFF]">
                <span>Buka Setting</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
