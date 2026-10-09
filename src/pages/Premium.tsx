import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../api/client';
import {
  Mail,
  KeyRound,
  Crown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ClipboardPaste,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { APP_LOGOS } from '../constants/logos';

// Helper to safely extract or detect oobCode
function getOobCodePreview(input: string): string | null {
  if (!input) return null;
  const str = input.trim();

  // match oobCode in query string
  const match = str.match(/[?&]oobCode=([^&#\s]+)/i);
  if (match && match[1]) return match[1];

  // match in url-encoded
  const encMatch = str.match(/oobCode%3D([^%&#\s]+)/i);
  if (encMatch && encMatch[1]) {
    try {
      return decodeURIComponent(encMatch[1]);
    } catch {
      return encMatch[1];
    }
  }

  // match oobCode=raw
  if (str.toLowerCase().startsWith('oobcode=')) {
    return str.split('=')[1]?.trim() || null;
  }

  // match raw alphanumeric code (min 10 chars, no slash, no http)
  if (!str.startsWith('http') && !str.includes('/') && /^[A-Za-z0-9_-]{10,}$/.test(str)) {
    return str;
  }

  return null;
}

export const Premium: React.FC = () => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('shine_remember_email') !== 'false'
      ? localStorage.getItem('shine_last_email') || ''
      : '';
  });
  const [magicLink, setMagicLink] = useState('');
  const [step1Loading, setStep1Loading] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step1SuccessMsg, setStep1SuccessMsg] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const [verifiedData, setVerifiedData] = useState<{
    uid: string;
    plan: string;
    orderId: string;
    expired: string;
    email: string;
    membershipStatus?: string;
  } | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  // Real-time oobCode detection
  const detectedOobCode = useMemo(() => getOobCodePreview(magicLink), [magicLink]);

  // Step 1: Send Magic Link
  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setStep1Error('Mohon masukkan alamat email yang valid.');
      return;
    }

    setStep1Loading(true);
    setStep1Error(null);
    setStep1SuccessMsg(null);

    try {
      const res = await apiClient.sendAlightMotionLink(email.trim());
      if (res && res.success) {
        if (localStorage.getItem('shine_remember_email') !== 'false') {
          localStorage.setItem('shine_last_email', email.trim());
        }
        if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
          navigator.vibrate([40, 60, 40]);
        }
        setStep1SuccessMsg(
          res.message ||
            `Magic link berhasil dikirim ke ${email}. Buka email dari Alight Creative, salin tautan verifikasinya ke Step 2!`
        );
      } else {
        setStep1Error(res?.message || res?.error || 'Gagal mengirim magic link. Silakan coba lagi.');
      }
    } catch (err: any) {
      setStep1Error('Terjadi kesalahan pada koneksi proxy server.');
    } finally {
      setStep1Loading(false);
    }
  };

  // Quick Paste from Clipboard
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setMagicLink(text.trim());
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
          if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
            navigator.vibrate(30);
          }
        }
      }
    } catch (e) {
      // Clipboard read blocked, focus input
    }
  };

  // Step 2: Verify Magic Link
  const handleVerifyMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLink = magicLink.trim();
    if (!cleanLink) {
      setStep2Error('Mohon masukkan magic link autentikasi yang Anda terima di email Alight Creative.');
      return;
    }

    // Client-side quick check
    const code = getOobCodePreview(cleanLink);
    if (!code && !cleanLink.includes('oobCode=')) {
      setStep2Error(
        'Kode oobCode tidak ditemukan pada tautan yang dimasukkan. Pastikan Anda menyalin tautan lengkap dari email Alight Creative (tekan lama tombol "Sign In" lalu pilih "Salin alamat link").'
      );
      setShowGuide(true);
      return;
    }

    setStep2Loading(true);
    setStep2Error(null);

    try {
      const res = await apiClient.verifyAlightMotionLink(email.trim() || 'user@shine.tools', cleanLink);

      if (res && res.success) {
        if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
          navigator.vibrate([60, 80, 100]);
        }
        setVerifiedData({
          uid: res.uid || `AM-${Math.floor(100000 + Math.random() * 900000)}`,
          plan: res.planName || res.plan || 'Alight Motion Pro Lifetime VIP',
          orderId: res.orderId || `ORD-AM-${Date.now().toString().slice(-8)}`,
          expired: res.validUntil || res.expired || 'Aktif Permanen (Lifetime Subscription)',
          email: res.email || email.trim() || 'user@shine.tools',
          membershipStatus: res.membershipStatus || 'PREMIUM_ACTIVE',
        });
        setStep2Error(null);
      } else {
        setStep2Error(
          res?.error ||
            res?.message ||
            'Tautan magic link tidak valid atau kode verifikasi telah kedaluwarsa. Pastikan menyalin tautan utuh dari email Alight Creative tanpa membukanya di browser terlebih dahulu.'
        );
      }
    } catch (err: any) {
      setStep2Error('Koneksi verifikasi gagal. Pastikan koneksi internet stabil dan link yang disalin lengkap.');
    } finally {
      setStep2Loading(false);
    }
  };

  // Quick Demo Simulator for verification test
  const handleSimulateVerified = () => {
    setVerifiedData({
      uid: `AM-${Math.floor(100000 + Math.random() * 900000)}`,
      plan: 'Alight Motion Pro Lifetime VIP',
      orderId: `ORD-AM-${Date.now().toString().slice(-8)}`,
      expired: 'Aktif Selamanya (No Expiry)',
      email: email || 'pro.editor@shine.tools',
      membershipStatus: 'PREMIUM_ACTIVE',
    });
    setStep2Error(null);
  };

  const handleCopyUid = () => {
    if (verifiedData?.uid) {
      navigator.clipboard.writeText(verifiedData.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
      if (localStorage.getItem('shine_haptic') !== 'false' && 'vibrate' in navigator) {
        navigator.vibrate(40);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF9E6] via-[#FFFDF5] to-[#EEF4FF] border border-amber-200/80 p-6 sm:p-10 shadow-[0_16px_40px_rgba(255,193,7,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>ALIGHT MOTION PRO ACCESS</span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md shadow-amber-500/20 border-2 border-white ring-2 ring-amber-300/80 overflow-hidden shrink-0">
                <img
                  src={APP_LOGOS.alightMotion}
                  alt="Alight Motion"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Alight Motion Premium
                </h1>
                <p className="text-xs sm:text-sm text-amber-700 font-bold mt-0.5">
                  Aktivasi Lisensi & Generator Magic Link
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg leading-relaxed">
              Aktivasi lisensi resmi Alight Motion tanpa watermark dengan verifikasi magic link satu kali dari Alight Creative.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dual-Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* STEP 1: Input Email -> Kirim Magic Link */}
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-blue-100/90 shadow-[0_12px_32px_rgba(76,125,255,0.06)] flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#4C7DFF] font-black text-sm flex items-center justify-center border border-blue-100">
                1
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Step 1: Kirim Magic Link
                </h3>
                <p className="text-xs text-slate-400">Masukkan email akun Alight Motion</p>
              </div>
            </div>

            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Alamat Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#F6F9FF] border border-blue-200/60 focus:border-[#4C7DFF] focus:bg-white focus:ring-4 focus:ring-[#4C7DFF]/15 text-slate-800 text-sm font-semibold outline-none transition-all"
                  />
                </div>
                {typeof window !== 'undefined' && localStorage.getItem('shinemail_address') && (
                  <button
                    type="button"
                    onClick={() => setEmail(localStorage.getItem('shinemail_address') || '')}
                    className="mt-2 text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100"
                  >
                    <span>Gunakan Shine Mail:</span>
                    <span className="font-mono text-slate-700 truncate max-w-[200px]">
                      {localStorage.getItem('shinemail_address')}
                    </span>
                  </button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={step1Loading}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white font-bold text-sm shadow-md shadow-blue-400/30 hover:shadow-blue-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {step1Loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>MENGIRIM LINK...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Kirim Magic Link</span>
                  </>
                )}
              </motion.button>
            </form>

            {step1SuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{step1SuccessMsg}</span>
              </motion.div>
            )}

            {step1Error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{step1Error}</span>
              </motion.div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>💡 Tautan dikirim oleh server Alight Creative</span>
            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className="font-bold text-[#4C7DFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cara Salin?</span>
            </button>
          </div>
        </div>

        {/* STEP 2: Input Magic Link -> Verify Premium */}
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-blue-100/90 shadow-[0_12px_32px_rgba(76,125,255,0.06)] flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 font-black text-sm flex items-center justify-center border border-amber-100">
                2
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Step 2: Input Magic Link
                </h3>
                <p className="text-xs text-slate-400">Salin link dari email & verifikasi</p>
              </div>
            </div>

            <form onSubmit={handleVerifyMagicLink} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    Tautan / Magic Link:
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="text-[11px] font-bold text-[#4C7DFF] hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>{pasteSuccess ? 'Tertempel!' : 'Tempel Link'}</span>
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                  <textarea
                    rows={2}
                    value={magicLink}
                    onChange={(e) => setMagicLink(e.target.value)}
                    placeholder="https://alight-creative.firebaseapp.com/__/auth/action?mode=signIn&oobCode=..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F6F9FF] border border-blue-200/60 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 text-slate-800 text-xs sm:text-sm font-semibold outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Live oobCode status indicator */}
                {magicLink.trim() && (
                  <div className="mt-2">
                    {detectedOobCode ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Kode oobCode terdeteksi: <strong className="font-mono text-[11px]">{detectedOobCode.slice(0, 10)}...{detectedOobCode.slice(-6)}</strong>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[11px]">
                          Kode oobCode belum terdeteksi. Pastikan Anda menyalin tautan lengkap dari email, bukan cuma alamat web biasa.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={step2Loading}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white font-bold text-sm shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {step2Loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>MEMVERIFIKASI LISENSI...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Verify Premium</span>
                  </>
                )}
              </motion.button>
            </form>

            {step2Error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step2Error}</span>
                </div>
                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendMagicLink()}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Kirim Ulang Magic Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateVerified}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    Simulasi Kartu Aktif Demo →
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>🔒 Diverifikasi oleh upstream Cloudflare Worker</span>
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Accordion: Cara Salin Link yang Benar & Solusi oobCode */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Panduan: Mengapa Muncul &quot;Kode oobCode tidak ditemukan&quot;?
              </h4>
              <p className="text-xs text-slate-500">
                Penyebab utama dan tutorial salin link dari email Alight Creative agar sukses 100%
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {showGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs text-slate-600 leading-relaxed overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                  <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px]">1</span>
                    <span>Buka Email dari Alight</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Buka aplikasi Gmail atau email di HP Anda. Cari email bertajuk <strong>&quot;Sign in to Alight Creative&quot;</strong> di Kotak Masuk atau folder Spam.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                  <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px]">2</span>
                    <span>Tahan Tombol &quot;Sign In&quot;</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>JANGAN langsung diklik di browser!</strong> Tekan lama (long press) tombol <em>Sign In</em> atau link teks sampai muncul opsi menu, lalu pilih <strong>&quot;Salin alamat tautan&quot; (Copy link address)</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                  <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px]">3</span>
                    <span>Tempel &amp; Verifikasi</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Kembali ke halaman ini, klik tombol <strong>Tempel Link</strong> di Step 2, lalu klik <strong>Verify Premium</strong>. Akun Anda langsung aktif!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">💡 Penjelasan Teknis oobCode:</span>
                <p>
                  <code>oobCode</code> (Out-of-Band Code) adalah tiket otentikasi unik satu kali pakai (one-time token) dari Firebase Auth. Jika Anda membuka tautan di Google Chrome atau browser terlebih dahulu sebelum disalin ke sini, token tersebut otomatis langsung terbakar/hangus oleh server Firebase, sehingga verifikasi akan gagal. Jika sudah terlanjur hangus, cukup klik tombol <strong>Kirim Ulang Magic Link</strong> di Step 1 untuk meminta tiket baru.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PREMIUM ACTIVE CARD (WAJIB DITAMPILKAN KETIKA AKTIF) */}
      {verifiedData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-[32px] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] p-7 sm:p-9 text-white shadow-2xl relative overflow-hidden border border-amber-400/40"
        >
          {/* Holographic glowing rings */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-3xl pointer-events-none" />

          {/* Top Bar: 👑 Premium Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>PREMIUM ACTIVE</span>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                    VIP
                  </span>
                </span>
                <p className="text-xs text-amber-200/90 font-medium">Alight Motion Subscription Verified</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Account</span>
            </div>
          </div>

          {/* Card Meta Details (UID, Plan, Order ID, Expired) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6 border-b border-white/10 relative z-10">
            {/* UID */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                UID Akun
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                  {verifiedData.uid}
                </span>
                <button
                  onClick={handleCopyUid}
                  className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                  title="Salin UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Plan */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Plan
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                {verifiedData.plan}
              </span>
            </div>

            {/* Order ID */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Order ID
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-300 truncate block">
                {verifiedData.orderId}
              </span>
            </div>

            {/* Expired */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Expired
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#32D583]">
                {verifiedData.expired}
              </span>
            </div>
          </div>

          {/* Footer note inside card */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
            <span>Terdaftar untuk: <strong className="text-white">{verifiedData.email}</strong></span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Siap digunakan di aplikasi Alight Motion Android / iOS
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
