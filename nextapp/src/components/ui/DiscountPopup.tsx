'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already seen or closed the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[101] w-full max-w-md"
          >
            <div className="relative glass rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
              
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/60 hover:text-white hover:bg-black/40 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="p-8 md:p-10 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-divine-radial opacity-30 pointer-events-none" />
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                      <Sparkles size={24} className="text-gold" />
                    </div>
                    <h3 className="font-display text-3xl text-divine mb-3">Welcome to the Family</h3>
                    <p className="text-muted text-sm leading-relaxed">
                      Your 10% discount code has been sent to <span className="text-gold">{email}</span>. Use code <span className="font-bold text-white tracking-widest">DIVINE10</span> at checkout.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-5xl mb-6 float">🕉️</div>
                    <h3 className="font-display text-3xl md:text-4xl text-divine mb-2">
                      Receive <span className="text-gold shimmer">10% Off</span>
                    </h3>
                    <p className="text-muted text-sm leading-relaxed mb-8">
                      Join our sacred community. Sign up for our newsletter and receive an exclusive 10% discount on your first premium murti.
                    </p>

                    <form onSubmit={handleSubmit} className="relative z-10">
                      <div className="relative mb-4">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input 
                          type="email" 
                          placeholder="Enter your email address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-gold/20 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gold text-black font-medium py-3.5 px-4 rounded-full text-[10px] sm:text-xs md:text-sm tracking-wider hover:bg-gold-light transition-all shadow-gold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'PROCESSING...' : 'CLAIM MY DISCOUNT'}
                      </button>
                    </form>
                    <p className="text-[9px] text-muted tracking-wider mt-4 uppercase">
                      By signing up, you agree to our terms and privacy policy.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
