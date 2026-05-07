'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, PackageSearch, ChevronRight, Loader2, Phone, Shield } from 'lucide-react';
import { createClient } from '@/lib/client';

type AuthTab = 'login' | 'register' | 'track';
type AuthMethod = 'email' | 'phone' | 'google';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [form, setForm] = useState({ email: '', password: '', name: '', orderId: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const siteUrl = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurmurti.me';

  // ── Google Sign In ──────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setGoogleLoading(false);
    }
    // On success Supabase redirects the browser — no further code needed
  };

  // ── Forgot Password ─────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${siteUrl}/auth/reset`,
    });
    setForgotLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('✅ Password reset link sent! Check your email inbox.');
      setShowForgotPassword(false);
      setForgotEmail('');
    }
  };

  // ── Phone OTP: Send ─────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    // Ensure number is E.164 format e.g. +919876543210
    let phone = form.phone.trim();
    if (!phone.startsWith('+')) phone = '+91' + phone;

    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setOtpSent(true);
      setSuccessMsg(`✅ OTP sent to ${phone}`);
    }
  };

  // ── Phone OTP: Verify ───────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    let phone = form.phone.trim();
    if (!phone.startsWith('+')) phone = '+91' + phone;

    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/');
    }
  };

  // ── Email Submit ────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (activeTab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push('/');
      } else if (activeTab === 'register') {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: `${siteUrl}/auth`,
          },
        });
        if (error) throw error;
        setSuccessMsg('✅ Account created! Check your email to verify, then log in.');
        setForm({ email: '', password: '', name: '', orderId: '', phone: '' });
      } else {
        alert(`Tracking order: ${form.orderId}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black/40 border border-gold/20 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors";
  const isAuthTab = activeTab === 'login' || activeTab === 'register';

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-md w-full px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted text-xs tracking-widest hover:text-gold transition-colors mb-6">
            <ArrowLeft size={13} /> BACK TO HOME
          </Link>
          <div className="text-5xl mb-4 float">🕉️</div>
          <h1 className="font-display text-4xl text-divine">
            {showForgotPassword
              ? 'Reset Password'
              : activeTab === 'login'
              ? 'Welcome Back'
              : activeTab === 'register'
              ? 'Join the Family'
              : 'Track Order'}
          </h1>
        </motion.div>

        <div className="glass rounded-3xl p-8 relative overflow-hidden">

          {/* ── Forgot Password ── */}
          <AnimatePresence>
            {showForgotPassword && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-muted text-xs text-center mb-6">
                  Enter your email and we will send a reset link.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="email" placeholder="Email Address" required value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)} className={inputClass} />
                  </div>
                  {errorMsg && <p className="text-center text-xs text-red-400">{errorMsg}</p>}
                  <button type="submit" disabled={forgotLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold">
                    {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : 'SEND RESET LINK'}
                  </button>
                  <button type="button" onClick={() => { setShowForgotPassword(false); setErrorMsg(''); }}
                    className="w-full text-center text-xs text-muted hover:text-gold transition-colors pt-2">
                    ← Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Panel ── */}
          {!showForgotPassword && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gold/10 mb-6">
                {(['login', 'register', 'track'] as const).map((t) => (
                  <button key={t}
                    onClick={() => { setActiveTab(t); setErrorMsg(''); setSuccessMsg(''); setOtpSent(false); setAuthMethod('email'); }}
                    className={`flex-1 pb-3 text-xs tracking-widest capitalize transition-all duration-300 border-b-2 -mb-px ${
                      activeTab === t ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-divine'}`}>
                    {t === 'track' ? 'Track Order' : t}
                  </button>
                ))}
              </div>

              {/* Auth method picker (only on login/register) */}
              {isAuthTab && (
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {([
                    { id: 'email', label: 'Email', icon: <Mail size={14} /> },
                    { id: 'phone', label: 'Phone', icon: <Phone size={14} /> },
                    { id: 'google', label: 'Google', icon: (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )},
                  ] as const).map(({ id, label, icon }) => (
                    <button key={id} type="button"
                      onClick={() => { setAuthMethod(id as AuthMethod); setErrorMsg(''); setOtpSent(false); }}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] tracking-widest border transition-all duration-200 ${
                        authMethod === id
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/10 text-muted hover:border-gold/30 hover:text-divine'}`}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 text-center text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl py-3 px-4">
                  {successMsg}
                </div>
              )}

              {/* ── Google Auth ── */}
              {isAuthTab && authMethod === 'google' && (
                <div className="space-y-4">
                  <p className="text-muted text-xs text-center mb-2">
                    Continue with your Google account — fast and secure.
                  </p>
                  {errorMsg && <p className="text-center text-xs text-red-400">{errorMsg}</p>}
                  <button onClick={handleGoogleSignIn} disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3.5 rounded-full text-sm tracking-wide hover:bg-gray-100 transition-all shadow-lg">
                    {googleLoading ? <Loader2 size={16} className="animate-spin" /> : (
                      <>
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ── Phone Auth ── */}
              {isAuthTab && authMethod === 'phone' && (
                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.form key="phone-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleSendOtp} className="space-y-4">
                      <p className="text-muted text-xs text-center">
                        Enter your phone number. We will send a 6-digit OTP via SMS.
                      </p>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-muted text-sm font-medium">+91</span>
                        <input type="tel" placeholder="98765 43210" required
                          value={form.phone}
                          onChange={(e) => handleUpdate('phone', e.target.value)}
                          className="w-full bg-black/40 border border-gold/20 rounded-xl py-3.5 pl-14 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                        />
                      </div>
                      {errorMsg && <p className="text-center text-xs text-red-400">{errorMsg}</p>}
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <>SEND OTP <ChevronRight size={14} /></>}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form key="otp-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleVerifyOtp} className="space-y-4">
                      <p className="text-muted text-xs text-center">
                        Enter the 6-digit OTP sent to +91 {form.phone}
                      </p>
                      <div className="relative">
                        <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input type="text" placeholder="Enter OTP" required maxLength={6}
                          value={otp} onChange={(e) => setOtp(e.target.value)}
                          className={inputClass + ' text-center text-lg tracking-[0.5em]'}
                        />
                      </div>
                      {errorMsg && <p className="text-center text-xs text-red-400">{errorMsg}</p>}
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <>VERIFY OTP <ChevronRight size={14} /></>}
                      </button>
                      <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setSuccessMsg(''); setErrorMsg(''); }}
                        className="w-full text-center text-xs text-muted hover:text-gold transition-colors pt-1">
                        ← Change phone number
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              )}

              {/* ── Email Auth ── */}
              {(activeTab === 'track' || authMethod === 'email') && (
                <AnimatePresence mode="wait">
                  <motion.form key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit} className="space-y-4">

                    {activeTab === 'register' && (
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input type="text" placeholder="Full Name" required value={form.name}
                          onChange={(e) => handleUpdate('name', e.target.value)} className={inputClass} />
                      </div>
                    )}

                    {activeTab === 'track' ? (
                      <>
                        <div className="relative">
                          <PackageSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                          <input type="text" placeholder="Order ID (e.g. JM-12345)" required value={form.orderId}
                            onChange={(e) => handleUpdate('orderId', e.target.value)} className={inputClass} />
                        </div>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                          <input type="email" placeholder="Email Address" required value={form.email}
                            onChange={(e) => handleUpdate('email', e.target.value)} className={inputClass} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                          <input type="email" placeholder="Email Address" required value={form.email}
                            onChange={(e) => handleUpdate('email', e.target.value)} className={inputClass} />
                        </div>
                        <div className="relative">
                          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                          <input type="password" placeholder="Password" required value={form.password}
                            onChange={(e) => handleUpdate('password', e.target.value)} className={inputClass} />
                        </div>
                      </>
                    )}

                    {activeTab === 'login' && authMethod === 'email' && (
                      <div className="flex justify-end pb-2">
                        <button type="button"
                          onClick={() => { setShowForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                          className="text-[10px] tracking-widest text-muted hover:text-gold transition-colors">
                          FORGOT PASSWORD?
                        </button>
                      </div>
                    )}

                    {errorMsg && <p className="text-center text-xs text-red-400 mt-2">{errorMsg}</p>}

                    <button type="submit" disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {loading ? <Loader2 size={16} className="animate-spin" /> : (
                        <>
                          {activeTab === 'login' ? 'SIGN IN' : activeTab === 'register' ? 'CREATE ACCOUNT' : 'TRACK ORDER'}
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </motion.form>
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
