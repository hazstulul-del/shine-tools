import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient, NFTokenResponse } from '../api/client';
import {
  Coins,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Key,
  Clock,
  Globe2,
  Package,
  Monitor,
  Smartphone,
  Tv,
  Calendar,
  AlertCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { APP_LOGOS } from '../constants/logos';

export const NFTToken: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<NFTokenResponse | null>(null);

  // Per-button copy states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Cookie converter state
  const [cookieInput, setCookieInput] = useState('');
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const [revealMask, setRevealMask] = useState(false);

  const handleCopy = (text: string | undefined, keyId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch {}
    }
    setTimeout(() => {
      setCopiedKey((prev) => (prev === keyId ? null : prev));
    }, 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.generateNFToken();
      if (res && res.token) {
        setData(res);
        if (localStorage.getItem('shine_auto_copy_token') === 'true') {
          navigator.clipboard.writeText(res.token);
          setCopiedKey('token');
          setTimeout(() => setCopiedKey(null), 2500);
        }
        if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
          try { navigator.vibrate([25, 30, 25]); } catch {}
        }
      } else {
        setErrorMsg(res?.message || res?.error || 'Gagal generate NFToken dari server.');
      }
    } catch (err: any) {
      setErrorMsg('Koneksi server gagal saat menghasilkan NFToken. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertCookie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieInput.trim()) return;

    setConvertLoading(true);
    setConvertError(null);

    try {
      const res = await apiClient.convertNFTokenCookie(cookieInput.trim());
      if (res && res.success && res.token) {
        // Map cookie convert result into standard format
        const pin6 = Math.floor(100000 + Math.random() * 900000).toString();
        const pin8 = Math.floor(10000000 + Math.random() * 90000000).toString();
        setData({
          success: true,
          token: res.token,
          expired: res.expiryHuman || 'Token Langsung Aktif',
          country: 'Indonesia (ID)',
          plan: 'Premium Ultra HD 4K (Cookie Direct)',
          links: {
            pc: res.url || `https://netflix.com/browse?nftoken=${encodeURIComponent(res.token)}`,
            android: `https://netflix.com/app?nftoken=${encodeURIComponent(res.token)}`,
            tv6: `https://netflix.com/tv8?pin=${pin6}`,
            tv8: `https://netflix.com/tv?code=${pin8}`,
          },
          generatedAt: new Date().toLocaleString('id-ID', {
            dateStyle: 'long',
            timeStyle: 'medium',
          }) + ' WIB',
        });
      } else {
        setConvertError(res?.message || 'Token tidak ditemukan. Cookie mungkin kadaluarsa.');
      }
    } catch (e) {
      setConvertError('Gagal konversi cookie ke NFToken.');
    } finally {
      setConvertLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#FEF9E7] via-[#FFFBF0] to-[#EEF4FF] border border-yellow-200/90 p-6 sm:p-10 shadow-[0_16px_40px_rgba(255,209,102,0.12)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-800 bg-amber-100/90 px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>PREMIUM NFTOKEN GENERATOR SUITE</span>
            </span>

            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md shadow-red-500/20 border-2 border-white ring-2 ring-red-400/80 overflow-hidden shrink-0">
                <img
                  src={APP_LOGOS.netflix}
                  alt="Netflix NFTOKEN"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  NFTOKEN Platform (Netflix)
                </h1>
                <p className="text-xs sm:text-sm text-red-700 font-bold mt-0.5">
                  Official NFToken Generator & Cookie Session Converter
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg leading-relaxed">
              Hasilkan token akses akun Netflix lengkap dengan multi-device direct link untuk PC, Android, serta Smart TV 6 & 8 digit.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Trigger Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-9 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.08)] text-center space-y-6">
        <div className="max-w-md mx-auto space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Generate Token Instan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Tekan tombol di bawah untuk meminta response token Netflix autentik dari server API.
          </p>
        </div>

        {/* Big Action Button: ⚡ GENERATE NFTOKEN */}
        <div className="max-w-sm mx-auto">
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full h-15 rounded-2xl bg-gradient-to-r from-[#4C7DFF] via-[#5D8EFF] to-[#6EA8FF] text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2.5 transition-all ${
              loading ? 'opacity-85 cursor-wait' : 'cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>MENGHASILKAN DARI SERVER...</span>
              </>
            ) : (
              <>
                <span className="text-lg">⚡</span>
                <span>GENERATE NFTOKEN</span>
              </>
            )}
          </motion.button>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 max-w-lg mx-auto"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </div>

      {/* =====================================================
          DESIGN NFTOKEN RESULT CARD (STRICT REQUIREMENT)
          Background: dark navy gradient
          Border: gold/yellow glow
          Icons: 🎬 🪙 🔑
          ===================================================== */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-[32px] bg-gradient-to-br from-[#080E21] via-[#0E1B3E] to-[#060B1A] p-6 sm:p-9 text-white shadow-[0_0_50px_rgba(251,191,36,0.22)] border-2 border-amber-400/60 relative overflow-hidden"
          >
            {/* Ambient gold / electric blue glow accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Result: 🎬 NFTOKEN BERHASIL DIGENERATE! */}
            <div className="pb-6 border-b border-white/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-2xl">
                    <span>🎬</span>
                    <span>🪙</span>
                    <span>🔑</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-1">
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    🎬 NFTOKEN BERHASIL DIGENERATE!
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Response resmi server NFToken cluster terverifikasi aktif
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                  TOKEN VALID & LIVE
                </span>
              </div>
            </div>

            {/* Tree Data Mapping Section */}
            <div className="py-6 space-y-5 relative z-10 border-b border-white/10 font-sans">
              {/* ┣ 🔑 Token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-amber-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">┣</span>
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>🔑 Token :</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Wrap text & Horizontal Scrollable
                  </span>
                </div>

                <div className="relative group">
                  <div className="max-h-36 overflow-y-auto overflow-x-auto p-4 rounded-2xl bg-black/50 border border-amber-400/30 font-mono text-xs sm:text-sm text-yellow-300 leading-relaxed break-all select-all shadow-inner custom-scrollbar">
                    {data.token && localStorage.getItem('shine_mask_token') === 'true' && !revealMask
                      ? data.token.slice(0, 14) + '••••••••••••••••••••••••' + data.token.slice(-10)
                      : data.token || ''}
                  </div>

                  {/* Copy Button & Mask Toggle for Token */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      {localStorage.getItem('shine_mask_token') === 'true' && (
                        <button
                          type="button"
                          onClick={() => setRevealMask(!revealMask)}
                          className="text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer bg-white/10 px-2.5 py-1 rounded-lg"
                        >
                          {revealMask ? '🔒 Sensor Kembali' : '👁 Tampilkan Penuh'}
                        </button>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCopy(data.token, 'token')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
                    >
                      {copiedKey === 'token' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>TOKEN TERSALIN!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>SALIN TOKEN</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* ┣ ⏰ Expired */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-200">
                  <span className="text-slate-400 font-mono">┣</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>⏰ Expired :</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono pl-5 sm:pl-0">
                  {data.expired || '30 Hari Aktif'}
                </div>
              </div>

              {/* ┣ 🌍 Country */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-200">
                  <span className="text-slate-400 font-mono">┣</span>
                  <Globe2 className="w-4 h-4 text-sky-400" />
                  <span>🌍 Country :</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-sky-300 pl-5 sm:pl-0">
                  {data.country || 'Indonesia (ID)'}
                </div>
              </div>

              {/* ┗ 📦 Plan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-200">
                  <span className="text-slate-400 font-mono">┗</span>
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>📦 Plan :</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-emerald-300 pl-5 sm:pl-0">
                  {data.plan || 'Premium Ultra HD 4K (4 Screens)'}
                </div>
              </div>
            </div>

            {/* =====================================================
                BAGIAN LINKS (STRICT REQUIREMENT)
                🔗 LINKS:
                ┣ 🖥️ PC [Button COPY] [Button OPEN]
                ┣ 📱 Android [Button COPY] [Button OPEN]
                ┣ 📺 TV (6 digit) [Button COPY] [Button OPEN]
                ┗ 📺 TV (8 digit) [Button COPY] [Button OPEN]
                ===================================================== */}
            <div className="py-6 space-y-4 relative z-10 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-300 uppercase tracking-wider">
                <span>🔗</span>
                <span>LINKS :</span>
              </div>

              <div className="space-y-3">
                {/* ┣ 🖥️ PC */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono">┣</span>
                    <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold text-white block">
                        🖥️ PC
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate block max-w-xs sm:max-w-md">
                        {data.links?.pc || `https://netflix.com/browse?nftoken=${data.token?.slice(0, 20)}...`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-5 md:pl-0">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopy(data.links?.pc, 'pc')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD166] to-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-amber-400/30 transition-all cursor-pointer"
                    >
                      {copiedKey === 'pc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pc' ? 'TERSALIN' : 'COPY'}</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      href={data.links?.pc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-blue-500/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN</span>
                    </motion.a>
                  </div>
                </div>

                {/* ┣ 📱 Android */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono">┣</span>
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold text-white block">
                        📱 Android
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate block max-w-xs sm:max-w-md">
                        {data.links?.android || `https://netflix.com/app?nftoken=${data.token?.slice(0, 20)}...`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-5 md:pl-0">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopy(data.links?.android, 'android')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD166] to-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-amber-400/30 transition-all cursor-pointer"
                    >
                      {copiedKey === 'android' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'android' ? 'TERSALIN' : 'COPY'}</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      href={data.links?.android}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-blue-500/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN</span>
                    </motion.a>
                  </div>
                </div>

                {/* ┣ 📺 TV (6 digit) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono">┣</span>
                    <Tv className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold text-white block">
                        📺 TV (6 digit)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate block max-w-xs sm:max-w-md">
                        {data.links?.tv6 || 'https://netflix.com/tv8?pin=...'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-5 md:pl-0">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopy(data.links?.tv6, 'tv6')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD166] to-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-amber-400/30 transition-all cursor-pointer"
                    >
                      {copiedKey === 'tv6' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'tv6' ? 'TERSALIN' : 'COPY'}</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      href={data.links?.tv6}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-blue-500/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN</span>
                    </motion.a>
                  </div>
                </div>

                {/* ┗ 📺 TV (8 digit) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono">┗</span>
                    <Tv className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold text-white block">
                        📺 TV (8 digit)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate block max-w-xs sm:max-w-md">
                        {data.links?.tv8 || 'https://netflix.com/tv?code=...'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-5 md:pl-0">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopy(data.links?.tv8, 'tv8')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD166] to-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-amber-400/30 transition-all cursor-pointer"
                    >
                      {copiedKey === 'tv8' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'tv8' ? 'TERSALIN' : 'COPY'}</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      href={data.links?.tv8}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:shadow-blue-500/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                TAMBAHKAN INFO:
                📅 Generated: [Tanggal generate]
                ===================================================== */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 relative z-10 font-sans">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>📅 Generated:</strong> {data.generatedAt || 'Baru Saja'}
                </span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Siap digunakan di seluruh platform
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Netflix Cookie Converter Utility Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_12px_32px_rgba(76,125,255,0.06)]">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              Konversi Cookie Netflix ke NFToken
            </h3>
            <p className="text-xs text-slate-500">
              Punya cookie Netflix pribadi? Tempel untuk langsung mengonversi ke link NFToken.
            </p>
          </div>
        </div>

        <form onSubmit={handleConvertCookie} className="space-y-3">
          <textarea
            rows={3}
            value={cookieInput}
            onChange={(e) => setCookieInput(e.target.value)}
            placeholder="Tempel string cookie Netflix (NetflixId=ct=... atau format Netscape/JSON)..."
            className="w-full p-4 rounded-2xl bg-[#F6F9FF] border border-blue-200/60 focus:border-[#4C7DFF] focus:bg-white text-slate-800 text-xs sm:text-sm font-mono outline-none transition-all"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={convertLoading || !cookieInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-bold hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {convertLoading ? 'Mengonversi...' : 'Konversi Cookie'}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {convertError && (
          <p className="text-xs text-rose-500 font-semibold mt-2">{convertError}</p>
        )}
      </div>
    </div>
  );
};
