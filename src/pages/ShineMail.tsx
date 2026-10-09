import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../api/client';
import { PageId } from '../components/Sidebar';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Send,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Inbox,
  Clock,
  ArrowRight,
  Shuffle,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  Zap,
  Globe,
  Sliders,
  FileText,
  User,
  Hash,
} from 'lucide-react';
import { APP_LOGOS } from '../constants/logos';

interface ShineMailProps {
  onNavigate?: (page: PageId) => void;
}

interface TempEmailMessage {
  id: number;
  from: string;
  subject: string;
  date: string;
  excerpt: string;
  recipient?: string;
  timestamp?: number;
}

interface MessageDetail {
  id: number;
  from: string;
  subject: string;
  date: string;
  recipient: string;
  body: string;
  extractedOtps: string[];
  extractedMagicLink: string | null;
  extractedLinks: string[];
}

export const ShineMail: React.FC<ShineMailProps> = ({ onNavigate }) => {
  // Navigation / active sub-tab
  const [activeTab, setActiveTab] = useState<'tempmail' | 'gmailgen' | 'randomgen'>('tempmail');

  // --- TAB 1: TEMP MAIL STATE ---
  const [currentEmail, setCurrentEmail] = useState<string>(() => {
    return localStorage.getItem('shinemail_address') || '';
  });
  const [sidToken, setSidToken] = useState<string>(() => {
    return localStorage.getItem('shinemail_sid') || '';
  });
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [inboxLoading, setInboxLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<TempEmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [fetchingMessage, setFetchingMessage] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(10);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Custom username modal/input state
  const [customUser, setCustomUser] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('sharklasers.com');
  const [availableDomains, setAvailableDomains] = useState<string[]>([
    'sharklasers.com',
    'guerrillamailblock.com',
    'guerrillamail.com',
    'grr.la',
    'guerrillamail.net',
    'pokemail.net',
  ]);
  const [isChangingUser, setIsChangingUser] = useState<boolean>(false);
  const [customUserLoading, setCustomUserLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- TAB 2: GMAIL DOT & ALIAS GENERATOR STATE ---
  const [gmailBase, setGmailBase] = useState<string>('jimelkingbakwanz163');
  const [useDotTrick, setUseDotTrick] = useState<boolean>(true);
  const [usePlusTrick, setUsePlusTrick] = useState<boolean>(true);
  const [useGooglemailDomain, setUseGooglemailDomain] = useState<boolean>(true);
  const [gmailCount, setGmailCount] = useState<number>(50);
  const [customPlusTags, setCustomPlusTags] = useState<string>('alight, pro, vip, test, sub, play');
  const [generatedGmails, setGeneratedGmails] = useState<string[]>([]);
  const [gmailSearchQuery, setGmailSearchQuery] = useState<string>('');

  // --- TAB 3: BULK RANDOM GENERATOR STATE ---
  const [randomCount, setRandomCount] = useState<number>(25);
  const [randomDomain, setRandomDomain] = useState<string>('gmail.com');
  const [includePassword, setIncludePassword] = useState<boolean>(true);
  const [generatedRandomList, setGeneratedRandomList] = useState<
    { email: string; name: string; password?: string }[]
  >([]);

  // Trigger brief toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy helper with animated feedback
  const handleCopy = (text: string, label: string = 'Teks') => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast(`✓ Berhasil menyalin ${label}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // 1. Initial Load: create or restore email
  useEffect(() => {
    const initMail = async () => {
      setEmailLoading(true);
      try {
        const storedSid = localStorage.getItem('shinemail_sid');
        const res = await apiClient.createShineMail(storedSid || undefined);
        if (res.success && res.email) {
          setCurrentEmail(res.email);
          setSidToken(res.sid_token);
          localStorage.setItem('shinemail_address', res.email);
          localStorage.setItem('shinemail_sid', res.sid_token);
        }
      } catch (err) {
        console.error('Failed to init Shine Mail:', err);
      } finally {
        setEmailLoading(false);
      }

      // Load available domains
      try {
        const domRes = await apiClient.getShineMailDomains();
        if (domRes.success && domRes.domains?.length) {
          setAvailableDomains(domRes.domains);
        }
      } catch {
        // ignore
      }
    };

    if (!currentEmail || !sidToken) {
      initMail();
    } else {
      loadInbox(false);
    }
  }, []);

  // 2. Load Inbox
  const loadInbox = async (showSpinner: boolean = true) => {
    if (!sidToken) return;
    if (showSpinner) setInboxLoading(true);
    try {
      const res = await apiClient.checkShineMailInbox(sidToken, 0);
      if (res.success && Array.isArray(res.emails)) {
        setMessages(res.emails);
        if (res.email && res.email !== currentEmail) {
          setCurrentEmail(res.email);
          localStorage.setItem('shinemail_address', res.email);
        }
      }
    } catch (err) {
      console.error('Failed to check inbox:', err);
    } finally {
      if (showSpinner) setInboxLoading(false);
    }
  };

  // 3. Auto-refresh timer for Temp Mail
  useEffect(() => {
    if (!autoRefresh || activeTab !== 'tempmail' || !sidToken) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadInbox(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, activeTab, sidToken]);

  // 4. Create brand new random email
  const handleGenerateNewEmail = async () => {
    setEmailLoading(true);
    try {
      localStorage.removeItem('shinemail_sid');
      localStorage.removeItem('shinemail_address');
      const res = await apiClient.createShineMail();
      if (res.success && res.email) {
        setCurrentEmail(res.email);
        setSidToken(res.sid_token);
        localStorage.setItem('shinemail_address', res.email);
        localStorage.setItem('shinemail_sid', res.sid_token);
        setMessages([]);
        setSelectedMessage(null);
        showToast('✓ Email baru berhasil dibuat!');
        loadInbox(true);
      }
    } catch (err) {
      showToast('⚠️ Gagal membuat email baru. Coba lagi.');
    } finally {
      setEmailLoading(false);
    }
  };

  // 5. Change custom email username / domain
  const handleApplyCustomUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUser.trim()) return;

    setCustomUserLoading(true);
    try {
      const res = await apiClient.setShineMailUser(customUser.trim(), sidToken, selectedDomain);
      if (res.success && res.email) {
        setCurrentEmail(res.email);
        setSidToken(res.sid_token);
        localStorage.setItem('shinemail_address', res.email);
        localStorage.setItem('shinemail_sid', res.sid_token);
        setIsChangingUser(false);
        setCustomUser('');
        showToast(`✓ Email diubah menjadi ${res.email}`);
        loadInbox(true);
      } else {
        showToast(`⚠️ ${res.error || 'Gagal mengubah email'}`);
      }
    } catch (err) {
      showToast('⚠️ Terjadi kendala saat mengubah email');
    } finally {
      setCustomUserLoading(false);
    }
  };

  // 6. View Message Detail
  const handleOpenMessage = async (msgId: number) => {
    if (!sidToken) return;
    setFetchingMessage(true);
    try {
      const res = await apiClient.getShineMailMessage(sidToken, msgId);
      if (res.success && res.mail) {
        setSelectedMessage(res.mail);
      } else {
        showToast('⚠️ Gagal memuat isi pesan');
      }
    } catch (err) {
      showToast('⚠️ Kendala jaringan saat membuka pesan');
    } finally {
      setFetchingMessage(false);
    }
  };

  // --- GMAIL GENERATOR LOGIC ---
  const generateGmailList = () => {
    let cleanBase = gmailBase.trim().toLowerCase();
    // remove @gmail.com or @googlemail.com if user included it
    cleanBase = cleanBase.replace(/@(gmail\.com|googlemail\.com)$/i, '').replace(/[^a-z0-9._-]/g, '');

    if (!cleanBase) {
      showToast('⚠️ Masukkan username Gmail yang valid');
      return;
    }

    const rawUser = cleanBase.replace(/\./g, ''); // base without dots
    const results = new Set<string>();

    // 1. Dot Trick Generator (binary placement)
    if (useDotTrick && rawUser.length >= 2) {
      const maxCombinations = Math.min(gmailCount * 2, Math.pow(2, rawUser.length - 1));
      
      // Always include base without dots
      results.add(`${rawUser}@gmail.com`);

      // Generate systematic dot permutations
      for (let i = 1; i < maxCombinations && results.size < gmailCount; i++) {
        let dotted = '';
        for (let j = 0; j < rawUser.length; j++) {
          dotted += rawUser[j];
          // If j is not last char, check if bit (j) is 1
          if (j < rawUser.length - 1 && ((i >> j) & 1)) {
            dotted += '.';
          }
        }
        results.add(`${dotted}@gmail.com`);
        if (useGooglemailDomain && results.size < gmailCount) {
          results.add(`${dotted}@googlemail.com`);
        }
      }
    }

    // 2. Plus Trick Generator
    if (usePlusTrick) {
      const tags = customPlusTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      // Add numeric plus aliases (e.g. +1, +2, +3...)
      for (let i = 1; i <= 20 && results.size < gmailCount; i++) {
        results.add(`${rawUser}+${i}@gmail.com`);
      }

      // Add keyword plus aliases
      for (const tag of tags) {
        if (results.size >= gmailCount) break;
        results.add(`${rawUser}+${tag}@gmail.com`);
        if (useGooglemailDomain && results.size < gmailCount) {
          results.add(`${rawUser}+${tag}@googlemail.com`);
        }
      }
    }

    // 3. Fallback fill if not enough
    if (results.size < gmailCount) {
      for (let i = 21; results.size < gmailCount && i <= 500; i++) {
        results.add(`${rawUser}+acc${i}@gmail.com`);
      }
    }

    const finalArray = Array.from(results).slice(0, gmailCount);
    setGeneratedGmails(finalArray);
    showToast(`✓ Berhasil membuat ${finalArray.length} variasi Gmail!`);
  };

  // Auto generate once on switch or initial
  useEffect(() => {
    if (generatedGmails.length === 0) {
      generateGmailList();
    }
  }, []);

  // Filtered Gmail list based on search
  const filteredGmails = useMemo(() => {
    if (!gmailSearchQuery.trim()) return generatedGmails;
    return generatedGmails.filter((g) =>
      g.toLowerCase().includes(gmailSearchQuery.toLowerCase().trim())
    );
  }, [generatedGmails, gmailSearchQuery]);

  // Download Gmail list as TXT
  const handleDownloadTxt = (list: string[], filename: string) => {
    const textContent = list.join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`✓ Berhasil mengunduh file ${filename}`);
  };

  // --- RANDOM BULK GENERATOR LOGIC ---
  const generateRandomBulkList = () => {
    const firstNames = [
      'budi', 'rizky', 'dimas', 'aditya', 'bayu', 'fajar', 'hendra', 'bagas',
      'anisa', 'dewi', 'putri', 'sarah', 'citra', 'lestari', 'nurul', 'tiara',
      'kevin', 'jason', 'michael', 'alex', 'david', 'ryan', 'daniel', 'chris',
    ];
    const lastNames = [
      'santoso', 'pratama', 'wijaya', 'saputra', 'kusuma', 'setiawan', 'hidayat',
      'ramadhan', 'putra', 'nugroho', 'firmansyah', 'gunawan', 'kurniawan', 'utama',
      'miller', 'smith', 'walker', 'clark', 'adams', 'turner', 'parker', 'white',
    ];
    const symbols = ['_', '.', ''];

    const items: { email: string; name: string; password?: string }[] = [];

    for (let i = 0; i < randomCount; i++) {
      const f = firstNames[Math.floor(Math.random() * firstNames.length)];
      const l = lastNames[Math.floor(Math.random() * lastNames.length)];
      const sep = symbols[Math.floor(Math.random() * symbols.length)];
      const num = Math.floor(10 + Math.random() * 990);
      const email = `${f}${sep}${l}${num}@${randomDomain}`;
      const fullName = `${f.charAt(0).toUpperCase() + f.slice(1)} ${l.charAt(0).toUpperCase() + l.slice(1)}`;
      
      let pass = undefined;
      if (includePassword) {
        pass = `Shine#${Math.floor(1000 + Math.random() * 9000)}!`;
      }

      items.push({ email, name: fullName, password: pass });
    }

    setGeneratedRandomList(items);
    showToast(`✓ Berhasil membuat ${items.length} akun email acak!`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Toast Notification Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 border border-slate-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#EEF6FF] via-[#E2EFFF] to-[#F3F8FF] border border-blue-200/70 p-6 sm:p-8 shadow-[0_16px_40px_rgba(76,125,255,0.06)]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-sm text-xs font-extrabold text-[#4C7DFF]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>⚡ SHINE MAIL SYSTEM - ACTIVE</span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md shadow-sky-500/20 border-2 border-white ring-2 ring-sky-300/80 overflow-hidden shrink-0">
                <img
                  src={APP_LOGOS.shineMail}
                  alt="Shine Mail"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span>SHINE MAIL</span>
                  <span className="text-xs sm:text-sm font-bold bg-sky-500 text-white px-2.5 py-1 rounded-xl shadow-sm">
                    PRO HUB
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-sky-700 font-bold mt-0.5">
                  Official Email & Disposable Inbox Generator
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
              Buat email sementara (disposable inbox) untuk menerima kode OTP & link verifikasi,
              atau buat ratusan variasi Gmail asli tanpa batas dengan trik dot matrix resmi Google!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-blue-100 shadow-sm shrink-0">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Status Kotak Masuk
              </div>
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Siap Menerima Email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center p-1.5 rounded-2xl bg-white border border-blue-100 shadow-sm overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('tempmail')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'tempmail'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/25'
              : 'text-slate-600 hover:text-[#4C7DFF] hover:bg-blue-50/50'
          }`}
        >
          <span>Kotak Masuk Sementara</span>
        </button>

        <button
          onClick={() => setActiveTab('gmailgen')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'gmailgen'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/25'
              : 'text-slate-600 hover:text-[#4C7DFF] hover:bg-blue-50/50'
          }`}
        >
          <span className="text-base font-black leading-none text-red-500">G</span>
          <span>🔴 Generator Variasi Gmail</span>
        </button>

        <button
          onClick={() => setActiveTab('randomgen')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'randomgen'
              ? 'bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white shadow-md shadow-blue-400/25'
              : 'text-slate-600 hover:text-[#4C7DFF] hover:bg-blue-50/50'
          }`}
        >
          <Shuffle className="w-4 h-4 text-emerald-500" />
          <span>🎲 Generator Mail Acak</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: KOTAK MASUK SEMENTARA (SHINE TEMP MAIL)            */}
      {/* ======================================================== */}
      {activeTab === 'tempmail' && (
        <div className="space-y-6">
          {/* Active Email Card */}
          <div className="bg-white rounded-[28px] p-5 sm:p-7 border border-blue-100 shadow-[0_12px_36px_rgba(76,125,255,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Alamat Email Aktif Anda
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Gunakan alamat ini untuk mendaftar akun atau menerima magic link / kode OTP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChangingUser(!isChangingUser)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ubah Username</span>
                </button>

                <button
                  onClick={handleGenerateNewEmail}
                  disabled={emailLoading}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#4C7DFF] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${emailLoading ? 'animate-spin' : ''}`} />
                  <span>Acak Email Baru</span>
                </button>
              </div>
            </div>

            {/* Change Username / Domain Inline Drawer */}
            <AnimatePresence>
              {isChangingUser && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleApplyCustomUser}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 overflow-hidden"
                >
                  <div className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                    <span>CUSTOM ALAMAT EMAIL SHINE MAIL</span>
                    <button
                      type="button"
                      onClick={() => setIsChangingUser(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex items-center rounded-xl bg-white border border-slate-200 px-3 py-2 focus-within:border-[#4C7DFF]">
                      <span className="text-xs text-slate-400 font-bold mr-1.5">@</span>
                      <input
                        type="text"
                        placeholder="Ketik username baru (misal: jimmymotion)"
                        value={customUser}
                        onChange={(e) => setCustomUser(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none"
                    >
                      {availableDomains.map((dom) => (
                        <option key={dom} value={dom}>
                          @{dom}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={customUserLoading || !customUser.trim()}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {customUserLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Terapkan</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Email Address Display Box with 1-Click Copy */}
            <div className="relative group">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 border-2 border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#4C7DFF] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>ALAMAT EMAIL SEMENTARA</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate select-all font-mono">
                    {emailLoading ? 'Membuat email baru...' : currentEmail || 'shine_mail@sharklasers.com'}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => handleCopy(currentEmail, 'Alamat Email')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4C7DFF] to-[#6EA8FF] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {copiedText === currentEmail ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Email</span>
                      </>
                    )}
                  </button>

                  {/* Direct shortcut to Alight Motion if user wants */}
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('premium')}
                      title="Gunakan email ini untuk aktivasi Alight Motion PRO"
                      className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Ke Alight PRO</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inbox Messages Section */}
          <div className="bg-white rounded-[28px] p-5 sm:p-7 border border-blue-100 shadow-[0_12px_36px_rgba(76,125,255,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-sm border border-emerald-100">
                  📥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Kotak Masuk (Inbox)
                    </h3>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-[#4C7DFF]">
                      {messages.length} Pesan
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Pesan masuk akan otomatis muncul di sini saat pengirim mengirim email
                  </p>
                </div>
              </div>

              {/* Auto Refresh & Manual Refresh Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    autoRefresh
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    Auto ({countdown}s)
                  </span>
                </button>

                <button
                  onClick={() => loadInbox(true)}
                  disabled={inboxLoading}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4C7DFF] hover:bg-blue-600 text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${inboxLoading ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            {/* Message List */}
            {inboxLoading && messages.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#4C7DFF] animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-600">Menghubungi server email...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-14 sm:py-16 px-4 rounded-2xl bg-gradient-to-b from-slate-50/50 to-blue-50/30 border border-dashed border-blue-200 text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-3xl bg-blue-100/70 text-blue-500 flex items-center justify-center text-3xl mx-auto shadow-inner">
                    📬
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-white text-[8px] font-bold items-center justify-center">
                      !
                    </span>
                  </span>
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-base font-extrabold text-slate-800">
                    Belum Ada Email Masuk
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Kirim email atau minta magic link / OTP ke alamat di atas. Sistem memindai email baru setiap 10 detik secara otomatis!
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => handleCopy(currentEmail, 'Alamat Email')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-[#4C7DFF] shadow-sm hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Alamat Email Untuk Dipakai</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    whileHover={{ scale: 1.005 }}
                    onClick={() => handleOpenMessage(msg.id)}
                    className="cursor-pointer p-4 rounded-2xl border border-slate-200/80 hover:border-[#4C7DFF]/50 bg-white hover:bg-blue-50/20 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900 group-hover:text-[#4C7DFF] transition-colors">
                          {msg.from || 'Pengirim'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{msg.date || 'Baru saja'}</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 truncate">
                        {msg.subject || '(Tanpa Subjek)'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {msg.excerpt || 'Klik untuk melihat detail isi pesan'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <span className="px-3 py-1.5 rounded-xl bg-blue-50 group-hover:bg-[#4C7DFF] text-[#4C7DFF] group-hover:text-white text-xs font-bold transition-all flex items-center gap-1">
                        <span>Baca Pesan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Modal / Overlay for Reading Selected Message */}
          <AnimatePresence>
            {selectedMessage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[32px] shadow-2xl border border-blue-100 flex flex-col overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        EMAIL MASUK
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {selectedMessage.subject || 'Detail Pesan'}
                      </h3>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-1 font-medium">
                        <span>Dari: <b className="text-slate-800">{selectedMessage.from}</b></span>
                        <span>•</span>
                        <span>{selectedMessage.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Body with Smart OTP & Magic Link Detection */}
                  <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                    {/* 🔑 Smart OTP Highlight Box if detected */}
                    {selectedMessage.extractedOtps && selectedMessage.extractedOtps.length > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                            <KeyRound className="w-4 h-4 text-emerald-600" />
                            <span>KODE VERIFIKASI / OTP TERDETEKSI</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full">
                            Auto Extracted
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {selectedMessage.extractedOtps.map((otp, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-mono font-black text-base text-emerald-700 shadow-sm"
                            >
                              <span>{otp}</span>
                              <button
                                onClick={() => handleCopy(otp, 'Kode OTP')}
                                className="text-xs text-emerald-600 hover:text-emerald-800 font-bold ml-1 cursor-pointer"
                              >
                                {copiedText === otp ? 'Tersalin' : 'Salin'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ⚡ Smart Magic Link Highlight Box if detected */}
                    {selectedMessage.extractedMagicLink && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span>MAGIC LINK / TAUTAN LOGIN TERDETEKSI</span>
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full">
                            Alight Motion / Auth
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Tautan verifikasi ditemukan di dalam email. Anda dapat menyalinnya atau langsung membuka modul Alight Motion PRO!
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() =>
                              handleCopy(selectedMessage.extractedMagicLink!, 'Magic Link')
                            }
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Magic Link</span>
                          </button>

                          {onNavigate && (
                            <button
                              onClick={() => {
                                setSelectedMessage(null);
                                onNavigate('premium');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#4C7DFF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Buka Verifikasi Alight Motion</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Raw Message Content Display */}
                    <div className="space-y-2">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Isi Pesan:
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap break-words max-h-72 overflow-y-auto custom-scrollbar select-text">
                        {selectedMessage.body
                          ? selectedMessage.body.replace(/<[^>]+>/g, ' ')
                          : 'Konten email kosong'}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GMAIL DOT & ALIAS GENERATOR                       */}
      {/* ======================================================== */}
      {activeTab === 'gmailgen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] p-5 sm:p-7 border border-blue-100 shadow-[0_12px_36px_rgba(76,125,255,0.06)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-sm border border-red-100 font-black">
                  G
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Generator Variasi Gmail (Dot & Plus Trick)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Hasilkan ratusan variasi Gmail yang semuanya masuk ke 1 Inbox Gmail utama Anda
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Resmi Server Google Mail</span>
              </div>
            </div>

            {/* How it works info card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/50 via-amber-50/30 to-blue-50/50 border border-red-100 text-xs text-slate-600 leading-relaxed space-y-1.5">
              <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>CARA KERJA TRIK GMAIL INI:</span>
              </div>
              <p>
                Google Mail secara resmi <b>mengabaikan tanda titik (.)</b> di alamat email Anda. Artinya jika email asli Anda adalah <code>jimelking@gmail.com</code>, maka email seperti <code>j.imelking@gmail.com</code> atau <code>ji.melking@gmail.com</code> adalah <b>akun yang sama</b> dan semua email masuk ke kotak masuk Anda.
              </p>
              <p>
                Begitu juga dengan tanda plus (<code>+</code>), misal <code>jimelking+alight@gmail.com</code>. Sangat berguna untuk mendaftar akun baru berkali-kali tanpa perlu mendaftar email baru!
              </p>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Username Gmail Utama Anda</span>
                </label>
                <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#4C7DFF] focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={gmailBase}
                    onChange={(e) => setGmailBase(e.target.value)}
                    placeholder="Contoh: jimelkingbakwanz163"
                    className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">@gmail.com</span>
                </div>
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jumlah Variasi Email</span>
                </label>
                <select
                  value={gmailCount}
                  onChange={(e) => setGmailCount(Number(e.target.value))}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#4C7DFF] focus:bg-white"
                >
                  <option value={20}>20 Variasi Email</option>
                  <option value={50}>50 Variasi Email</option>
                  <option value={100}>100 Variasi Email</option>
                  <option value={200}>200 Variasi Email</option>
                  <option value={500}>500 Variasi Email</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  onClick={generateGmailList}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Gmail</span>
                </button>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDotTrick}
                  onChange={(e) => setUseDotTrick(e.target.checked)}
                  className="rounded text-[#4C7DFF] focus:ring-0"
                />
                <span>Gunakan Dot Trick (.)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePlusTrick}
                  onChange={(e) => setUsePlusTrick(e.target.checked)}
                  className="rounded text-[#4C7DFF] focus:ring-0"
                />
                <span>Gunakan Plus Trick (+)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGooglemailDomain}
                  onChange={(e) => setUseGooglemailDomain(e.target.checked)}
                  className="rounded text-[#4C7DFF] focus:ring-0"
                />
                <span>Sertakan domain @googlemail.com</span>
              </label>
            </div>

            {/* Custom Plus Tags input if enabled */}
            {usePlusTrick && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  Custom Kata Plus Tag (pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={customPlusTags}
                  onChange={(e) => setCustomPlusTags(e.target.value)}
                  placeholder="alight, pro, vip, test, sub"
                  className="w-full bg-white rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
            )}

            {/* Output List Section */}
            {generatedGmails.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Daftar Variasi ({filteredGmails.length} dari {generatedGmails.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        handleCopy(
                          generatedGmails.join('\n'),
                          `Semua ${generatedGmails.length} Gmail`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#4C7DFF] text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua</span>
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadTxt(
                          generatedGmails,
                          `gmail_variations_${gmailBase}.txt`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh TXT</span>
                    </button>
                  </div>
                </div>

                {/* Search in generated list */}
                <input
                  type="text"
                  placeholder="Cari email tertentu di dalam daftar..."
                  value={gmailSearchQuery}
                  onChange={(e) => setGmailSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#4C7DFF]"
                />

                {/* List Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto p-1 custom-scrollbar">
                  {filteredGmails.map((email, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-all flex items-center justify-between gap-2 shadow-xs group"
                    >
                      <span className="text-xs font-mono font-bold text-slate-800 truncate select-all">
                        {email}
                      </span>
                      <button
                        onClick={() => handleCopy(email, 'Email')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-[#4C7DFF] text-slate-600 group-hover:text-white text-[10px] font-bold transition-all shrink-0 cursor-pointer"
                      >
                        {copiedText === email ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: GENERATOR MAIL ACAK (BULK DUMMY LIST)            */}
      {/* ======================================================== */}
      {activeTab === 'randomgen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] p-5 sm:p-7 border border-blue-100 shadow-[0_12px_36px_rgba(76,125,255,0.06)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-sm border border-emerald-100">
                  🎲
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Generator Email Acak / Bulk Dummy
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Hasilkan daftar email dummy realistis lengkap dengan nama & password untuk keperluan testing data
                  </p>
                </div>
              </div>
            </div>

            {/* Config Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Domain</label>
                <select
                  value={randomDomain}
                  onChange={(e) => setRandomDomain(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#4C7DFF] focus:bg-white"
                >
                  <option value="gmail.com">@gmail.com (Google)</option>
                  <option value="yahoo.com">@yahoo.com (Yahoo)</option>
                  <option value="outlook.com">@outlook.com (Microsoft)</option>
                  <option value="icloud.com">@icloud.com (Apple)</option>
                  <option value="shinemail.org">@shinemail.org (Shine)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Jumlah Email</label>
                <select
                  value={randomCount}
                  onChange={(e) => setRandomCount(Number(e.target.value))}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#4C7DFF] focus:bg-white"
                >
                  <option value={10}>10 Email</option>
                  <option value={25}>25 Email</option>
                  <option value={50}>50 Email</option>
                  <option value={100}>100 Email</option>
                </select>
              </div>

              <div>
                <button
                  onClick={generateRandomBulkList}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Generate Email Acak</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePassword}
                  onChange={(e) => setIncludePassword(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Sertakan Password Acak (Contoh: Shine#1024!)</span>
              </label>
            </div>

            {/* Results */}
            {generatedRandomList.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <span className="text-sm font-extrabold text-slate-900">
                    Hasil {generatedRandomList.length} Akun Email
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const lines = generatedRandomList.map((i) =>
                          i.password ? `${i.email} | ${i.password} | ${i.name}` : i.email
                        );
                        handleCopy(lines.join('\n'), 'Semua Akun');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua</span>
                    </button>

                    <button
                      onClick={() => {
                        const lines = generatedRandomList.map((i) =>
                          i.password ? `${i.email} | ${i.password} | ${i.name}` : i.email
                        );
                        handleDownloadTxt(lines, `random_emails_${randomDomain}.txt`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh TXT</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto p-1 custom-scrollbar">
                  {generatedRandomList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs group"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono font-bold text-slate-900 select-all">
                          {item.email}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                          <span>Nama: {item.name}</span>
                          {item.password && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-emerald-600 font-bold">
                                Pass: {item.password}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleCopy(
                            item.password ? `${item.email} | ${item.password}` : item.email,
                            'Email & Data'
                          )
                        }
                        className="self-end sm:self-auto px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#4C7DFF] text-slate-600 group-hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Salin
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
