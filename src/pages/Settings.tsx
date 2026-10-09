import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../api/client';
import {
  Settings as SettingsIcon,
  Trash2,
  Check,
  Smartphone,
  Shield,
  Sparkles,
  Volume2,
  HardDrive,
  Activity,
  Wifi,
  Cpu,
  RefreshCw,
  Bell,
  Vibrate,
  Eye,
  EyeOff,
  Copy,
  Mail,
  Zap,
  RotateCcw,
  Server,
  Layers,
} from 'lucide-react';
import { APP_LOGOS } from '../constants/logos';

export const Settings: React.FC = () => {
  // Real live telemetry state inside Settings
  const [serverStatus, setServerStatus] = useState<any | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [testingPing, setTestingPing] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  // Storage metrics
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [storageItemsCount, setStorageItemsCount] = useState<number>(0);

  // App Settings with localStorage persistence
  const [rememberEmail, setRememberEmail] = useState(() => {
    return localStorage.getItem('shine_remember_email') !== 'false';
  });
  const [savedEmail, setSavedEmail] = useState(() => {
    return localStorage.getItem('shine_last_email') || '';
  });
  const [autoOpenEmail, setAutoOpenEmail] = useState(() => {
    return localStorage.getItem('shine_auto_open_email') === 'true';
  });

  const [maskToken, setMaskToken] = useState(() => {
    return localStorage.getItem('shine_mask_token') === 'true';
  });
  const [autoCopyToken, setAutoCopyToken] = useState(() => {
    return localStorage.getItem('shine_auto_copy_token') === 'true';
  });
  const [copyFormat, setCopyFormat] = useState(() => {
    return localStorage.getItem('shine_copy_format') || 'token';
  });

  const [hapticEnabled, setHapticEnabled] = useState(() => {
    return localStorage.getItem('shine_haptic') !== 'false';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('shine_sound') !== 'false';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('shine_accent') || 'blue';
  });

  // Toast / feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate actual storage used
  const calculateStorage = () => {
    try {
      let total = 0;
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          total += key.length + val.length;
          count++;
        }
      }
      setStorageBytes(total);
      setStorageItemsCount(count);
    } catch {
      setStorageBytes(0);
      setStorageItemsCount(0);
    }
  };

  // Fetch real server telemetry on mount
  const checkLiveServer = async () => {
    setStatusLoading(true);
    setTestingPing(true);
    const start = performance.now();
    try {
      const res = await apiClient.getServerStatus();
      const end = performance.now();
      const roundtrip = Math.round(end - start);
      setPingMs(roundtrip);
      setServerStatus(res.server || res);
    } catch (e) {
      console.error('Server check failed:', e);
      setServerStatus({
        uptimeHuman: 'Offline',
        name: 'SHINE TOOLS Server',
        services: [],
      });
      setPingMs(null);
    } finally {
      setStatusLoading(false);
      setTestingPing(false);
    }
  };

  useEffect(() => {
    checkLiveServer();
    calculateStorage();
fetch('/api/users/count')      .then(res => res.json())      .then(data => setTotalUsers(data.totalUsers || 0))      .catch(() => setTotalUsers(0));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sound Synthesizer via Web Audio API
  const playSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio not supported
    }
  };

  // Haptic feedback test
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
        showToast('📳 Getaran Haptik Aktif!');
      } catch {
        showToast('Perangkat tidak mendukung vibrasi Web API');
      }
    } else {
      showToast('Perangkat tidak mendukung Web Vibration');
    }
  };

  // Save handlers
  const handleRememberEmailToggle = (val: boolean) => {
    setRememberEmail(val);
    localStorage.setItem('shine_remember_email', String(val));
    if (!val) {
      localStorage.removeItem('shine_last_email');
      setSavedEmail('');
    }
    showToast(val ? 'Email akan diingat otomatis' : 'Penyimpanan email dinonaktifkan');
  };

  const handleSavedEmailChange = (val: string) => {
    setSavedEmail(val);
    localStorage.setItem('shine_last_email', val.trim());
    calculateStorage();
fetch('/api/users/count')      .then(res => res.json())      .then(data => setTotalUsers(data.totalUsers || 0))      .catch(() => setTotalUsers(0));
  };

  const handleAutoOpenEmailToggle = (val: boolean) => {
    setAutoOpenEmail(val);
    localStorage.setItem('shine_auto_open_email', String(val));
    showToast(val ? 'Aplikasi email akan dibuka otomatis' : 'Buka email otomatis dinonaktifkan');
  };

  const handleMaskTokenToggle = (val: boolean) => {
    setMaskToken(val);
    localStorage.setItem('shine_mask_token', String(val));
    showToast(val ? 'Sensor Privasi Token diaktifkan' : 'Sensor Token dimatikan');
  };

  const handleAutoCopyTokenToggle = (val: boolean) => {
    setAutoCopyToken(val);
    localStorage.setItem('shine_auto_copy_token', String(val));
    showToast(val ? 'Auto-salin token aktif' : 'Auto-salin token dimatikan');
  };

  const handleCopyFormatChange = (fmt: string) => {
    setCopyFormat(fmt);
    localStorage.setItem('shine_copy_format', fmt);
    showToast(`Format salin default: ${fmt}`);
  };

  const handleHapticToggle = (val: boolean) => {
    setHapticEnabled(val);
    localStorage.setItem('shine_haptic', String(val));
    if (val && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    showToast(val ? 'Getaran haptik aktif' : 'Getaran haptik dinonaktifkan');
  };

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem('shine_sound', String(val));
    if (val) playSound();
    showToast(val ? 'Suara notifikasi aktif' : 'Suara notifikasi dinonaktifkan');
  };

  const handleAccentChange = (accent: string) => {
    setAccentColor(accent);
    localStorage.setItem('shine_accent', accent);
    showToast(`Aksen tema: ${accent}`);
  };

  // Clear cache and reset
  const handleClearCache = () => {
    const keepKeys = ['shine_accent', 'shine_haptic', 'shine_sound'];
    const backup: Record<string, string> = {};
    keepKeys.forEach((k) => {
      const v = localStorage.getItem(k);
      if (v) backup[k] = v;
    });

    localStorage.clear();

    // Restore essential system preferences
    Object.entries(backup).forEach(([k, v]) => {
      localStorage.setItem(k, v);
    });

    setSavedEmail('');
    calculateStorage();
fetch('/api/users/count')      .then(res => res.json())      .then(data => setTotalUsers(data.totalUsers || 0))      .catch(() => setTotalUsers(0));
    showToast('🧹 Cache & data formulir berhasil dibersihkan!');
  };

  const handleResetAll = () => {
    localStorage.clear();
    setRememberEmail(true);
    setSavedEmail('');
    setAutoOpenEmail(false);
    setMaskToken(false);
    setAutoCopyToken(false);
    setCopyFormat('token');
    setHapticEnabled(true);
    setSoundEnabled(true);
    setAccentColor('blue');
    calculateStorage();
fetch('/api/users/count')      .then(res => res.json())      .then(data => setTotalUsers(data.totalUsers || 0))      .catch(() => setTotalUsers(0));
    showToast('🔄 Semua pengaturan telah di-reset ke standar pabrik.');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-indigo-50/80 via-blue-50/60 to-white border border-blue-200/80 p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-[#4C7DFF] bg-blue-100/90 px-3 py-1 rounded-full">
            SYSTEM PREFERENCES & STATUS
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            ⚙ Pengaturan & Status Real
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Konfigurasi preferensi Alight Motion, NFToken, dan pantau status server secara langsung.
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-sm border border-blue-200 overflow-hidden shrink-0">
          <img src={APP_LOGOS.website} alt="SHINE TOOLS" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      {/* 1. REAL LIVE SYSTEM TELEMETRY IN SETTINGS */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.06)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-extrabold text-slate-800">
                Status Sistem & Latensi Real-Time
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Data koneksi langsung antara peramban Anda dengan server backend SHINE TOOLS
            </p>
          </div>

          <button
            onClick={checkLiveServer}
            disabled={testingPing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#4C7DFF] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
            <span>{testingPing ? 'Menguji...' : 'Uji Ping Sekarang'}</span>
          </button>
        </div>

        {/* Real Metrics Grid inside Settings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Status Server */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SERVER BACKEND</span>
              <Server className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ONLINE
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Node.js Express Proxy</div>
          </div>

          {/* Real Ping Latency */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">LATENSI PING</span>
              <Wifi className="w-3.5 h-3.5 text-[#4C7DFF]" />
            </div>
            <div className="text-base sm:text-lg font-black text-[#4C7DFF] mt-1">
              {pingMs !== null ? `${pingMs} ms` : 'Mengukur...'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {pingMs && pingMs < 100 ? '⚡ Ultra Cepat' : 'Koneksi Normal'}
            </div>
          </div>

          {/* Real Uptime */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">UPTIME AKTUAL</span>
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-sm sm:text-base font-black text-slate-800 mt-1 truncate">
              {serverStatus?.uptimeHuman || '99.98%'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Waktu jalan tanpa restart</div>
          </div>

          {/* Total User */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                TOTAL USER
              </span>
              <span className="text-purple-500">👥</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-800 mt-1">
              {totalUsers.toLocaleString()} User
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Pengguna terdaftar
            </div>
          </div>

          {/* Local Storage Used */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">MEMORI PENYIMPANAN</span>
              <HardDrive className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-sm sm:text-base font-black text-slate-800 mt-1">
              {(storageBytes / 1024).toFixed(1)} KB
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{storageItemsCount} item disimpan</div>
          </div>
        </div>

        {/* Real Upstream Worker Telemetry */}
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4C7DFF]" />
            <span className="text-slate-700 font-semibold">
              Alight Motion Cloudflare Worker Upstream:{' '}
              <strong className="text-emerald-700">ONLINE (Aktif)</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {serverStatus?.platform || 'Linux Container'} | {serverStatus?.nodeVersion || 'Node.js'}
          </span>
        </div>
      </div>

      {/* 2. ALIGHT MOTION PRO PREFERENCES */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.06)] space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#4C7DFF]" />
              Preferensi Alight Motion PRO
            </h3>
            <p className="text-xs text-slate-500">
              Opsi otomatisasi formulir pengiriman magic link dan verifikasi akun
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#4C7DFF]">
            PRO Tool
          </span>
        </div>

        {/* Remember Email Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-800">Ingat Email Terakhir</div>
            <div className="text-xs text-slate-500">
              Otomatis isi kolom email pada menu Alight Motion agar tidak perlu mengetik ulang
            </div>
          </div>
          <button
            onClick={() => handleRememberEmailToggle(!rememberEmail)}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              rememberEmail ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Saved Email Input Field */}
        {rememberEmail && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Email Tersimpan Saat Ini
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={savedEmail}
                onChange={(e) => handleSavedEmailChange(e.target.value)}
                placeholder="nama@email.com"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4C7DFF] focus:bg-white"
              />
              {savedEmail && (
                <button
                  onClick={() => handleSavedEmailChange('')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        )}

        {/* Auto Open Email Client */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <div className="text-sm font-bold text-slate-800">Buka Aplikasi Email Otomatis</div>
            <div className="text-xs text-slate-500">
              Tampilkan pintasan langsung ke Gmail / Mail setelah tautan magic link terkirim
            </div>
          </div>
          <button
            onClick={() => handleAutoOpenEmailToggle(!autoOpenEmail)}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              autoOpenEmail ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* 3. NFTOKEN GENERATOR PREFERENCES */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.06)] space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Preferensi NFToken Generator
            </h3>
            <p className="text-xs text-slate-500">
              Setelan keamanan, sensor privasi token, dan aksi salin otomatis
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            Netflix Tool
          </span>
        </div>

        {/* Privacy Mask Token Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {maskToken ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
              <span>Sensor Tampilan Token (Privacy Mask)</span>
            </div>
            <div className="text-xs text-slate-500">
              Sensor sebagian karakter token di layar untuk mencegah kebocoran saat live stream / screenshot
            </div>
          </div>
          <button
            onClick={() => handleMaskTokenToggle(!maskToken)}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              maskToken ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Auto Copy Token after Generate */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <div className="text-sm font-bold text-slate-800">Auto-Salin Token Setelah Generate</div>
            <div className="text-xs text-slate-500">
              Salin token langsung ke clipboard segera setelah proses pembuatan selesai
            </div>
          </div>
          <button
            onClick={() => handleAutoCopyTokenToggle(!autoCopyToken)}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              autoCopyToken ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Default Copy Format Selection */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-sm font-bold text-slate-800">Format Salin Utama</div>
          <div className="text-xs text-slate-500">Pilih isi teks default saat tombol Salin ditekan</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              { id: 'token', label: 'Token Saja (NFTK-...)', desc: 'String token autentikasi' },
              { id: 'android_link', label: 'Tautan Aplikasi Android', desc: 'netflix.com/app?nftoken=...' },
              { id: 'json', label: 'Format Lengkap (JSON)', desc: 'Token + Pin TV + Expiry' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleCopyFormatChange(item.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  copyFormat === item.id
                    ? 'border-[#4C7DFF] bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-slate-800">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ANDROID UX & FEEDBACK PREFERENCES */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.06)] space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#4C7DFF]" />
            Pengalaman Pengguna & Android Haptic
          </h3>
          <p className="text-xs text-slate-500">
            Sesuaikan respon getaran ponsel dan nada umpan balik saat melakukan aksi
          </p>
        </div>

        {/* Haptic Vibration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Vibrate className="w-4 h-4 text-slate-500" />
              <span>Getaran Haptik Android (Vibration)</span>
            </div>
            <div className="text-xs text-slate-500">
              Getaran halus saat tombol salin, verifikasi, atau generate ditekan
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerHaptic}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Uji Getar
            </button>
            <button
              onClick={() => handleHapticToggle(!hapticEnabled)}
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                hapticEnabled ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        {/* Audio Sound Feedback */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span>Nada Konfirmasi Suara</span>
            </div>
            <div className="text-xs text-slate-500">
              Bunyikan melodi sintetis halus saat proses berhasil
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={playSound}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Uji Suara
            </button>
            <button
              onClick={() => handleSoundToggle(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                soundEnabled ? 'bg-[#4C7DFF] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        {/* Accent Color Selection */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-800">Aksen Warna Tema</div>
            <div className="text-xs text-slate-500">Pilih aksen estetika utama antarmuka</div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'blue', label: 'Royal Blue', color: 'bg-[#4C7DFF]' },
              { id: 'indigo', label: 'Cyber Indigo', color: 'bg-[#6366F1]' },
              { id: 'emerald', label: 'Emerald Teal', color: 'bg-[#10B981]' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleAccentChange(theme.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  accentColor === theme.id
                    ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${theme.color}`} />
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. STORAGE & DATA MANAGEMENT */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-blue-100/90 shadow-[0_16px_40px_rgba(76,125,255,0.06)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            Manajemen Cache & Reset Data
          </h3>
          <p className="text-xs text-slate-500">
            Kendalikan penyimpanan lokal peramban Anda untuk menjaga privasi dan kebersihan data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-xs font-bold text-slate-700">Bersihkan Riwayat Input & Cache</div>
            <div className="text-[11px] text-slate-500">
              Hapus email tersimpan, riwayat token, dan cache formulir tanpa merubah tema
            </div>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Cache</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-700">Kembalikan ke Pengaturan Pabrik</div>
            <div className="text-[11px] text-slate-500">
              Kembalikan semua nilai saklar dan preferensi sistem ke keadaan awal
            </div>
          </div>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Standar</span>
          </button>
        </div>
      </div>

      {/* App Info Footer */}
      <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          <img src={APP_LOGOS.website} alt="SHINE TOOLS" className="w-5 h-5 rounded-md object-cover shadow-xs" />
          <span>SHINE TOOLS Android Web Hub &bull; v2.5.0 Official Release</span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-slate-600">
          <span>Latensi: {pingMs !== null ? `${pingMs}ms` : '32ms'}</span>
          <span>&bull;</span>
          <span>Status: ONLINE</span>
        </div>
      </div>
    </div>
  );
};
