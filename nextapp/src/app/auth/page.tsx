'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, PackageSearch, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/client';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'track'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', orderId: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setErrorMsg('');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
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
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
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
        setForm({ email: '', password: '', name: '', orderId: '' });
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

          {/* ── Forgot Password Panel ── */}
          <AnimatePresence>
            {showForgotPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-muted text-xs text-center mb-6">
                  Enter your email and we will send you a link to reset your password.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {errorMsg && <p className="text-center text-xs text-red-400">{errorMsg}</p>}
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold mt-2"
                  >
                    {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : 'SEND RESET LINK'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setErrorMsg(''); }}
                    className="w-full text-center text-xs text-muted hover:text-gold transition-colors pt-2"
                  >
                    ← Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Auth Form ── */}
          {!showForgotPassword && (
            <>
              <div className="flex border-b border-gold/10 mb-8">
                {(['login', 'register', 'track'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setActiveTab(t); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`flex-1 pb-3 text-xs tracking-widest capitalize transition-all duration-300 border-b-2 -mb-px ${
                      activeTab === t ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-divine'
                    }`}
                  >
                    {t === 'track' ? 'Track Order' : t}
                  </button>
                ))}
              </div>

              {successMsg && (
                <div className="mb-4 text-center text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl py-3 px-4">
                  {successMsg}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.form
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {activeTab === 'register' && (
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={form.name}
                        onChange={(e) => handleUpdate('name', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}

                  {activeTab === 'track' ? (
                    <>
                      <div className="relative">
                        <PackageSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          type="text"
                          placeholder="Order ID (e.g. JM-12345)"
                          required
                          value={form.orderId}
                          onChange={(e) => handleUpdate('orderId', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={form.email}
                          onChange={(e) => handleUpdate('email', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={form.email}
                          onChange={(e) => handleUpdate('email', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          type="password"
                          placeholder="Password"
                          required
                          value={form.password}
                          onChange={(e) => handleUpdate('password', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'login' && (
                    <div className="flex justify-end pb-2">
                      <button
                        type="button"
                        onClick={() => { setShowForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[10px] tracking-widest text-muted hover:text-gold transition-colors"
                      >
                        FORGOT PASSWORD?
                      </button>
                    </div>
                  )}

                  {errorMsg && (
                    <p className="text-center text-xs text-red-400 mt-2">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        {activeTab === 'login' ? 'SIGN IN' : activeTab === 'register' ? 'CREATE ACCOUNT' : 'TRACK ORDER'}
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </motion.form>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
