'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValidSession(true);
    });
  }, [supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/auth'), 3000);
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
          <div className="text-5xl mb-4 float">🔐</div>
          <h1 className="font-display text-4xl text-divine">New Password</h1>
          <p className="text-muted text-sm mt-3">Choose a strong password for your account.</p>
        </motion.div>

        <div className="glass rounded-3xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-emerald-400 text-sm">Password updated successfully!</p>
              <p className="text-muted text-xs">Redirecting you to login...</p>
            </div>
          ) : !validSession ? (
            <div className="text-center space-y-4">
              <p className="text-muted text-sm">Invalid or expired reset link.</p>
              <Link href="/auth" className="text-gold text-xs tracking-widest hover:underline">
                Request a new reset link →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>

              {errorMsg && (
                <p className="text-center text-xs text-red-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold mt-4"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>UPDATE PASSWORD <ChevronRight size={14} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
