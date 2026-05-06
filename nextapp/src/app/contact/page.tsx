'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Get in Touch</span>
          <h1 className="font-display text-5xl md:text-6xl text-divine mt-4 mb-4">
            Contact Us
          </h1>
          <div className="divine-divider max-w-sm mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
            
            <h2 className="font-display text-3xl text-divine mb-8">Reach Out Directly</h2>

            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="text-xs tracking-widest text-gold mb-1 uppercase">Founder</h3>
                  <p className="text-lg text-divine">Uditya Singh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-xs tracking-widest text-gold mb-1 uppercase">Direct Contact</h3>
                  <p className="text-lg text-divine">+91 76659 41949</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-xs tracking-widest text-[#25D366] mb-1 uppercase">WhatsApp</h3>
                  <Link href="https://wa.me/917665941949" target="_blank" className="text-lg text-divine hover:text-gold transition-colors">
                    +91 76659 41949
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-xs tracking-widest text-gold mb-1 uppercase">Email Address</h3>
                  <Link href="mailto:udityatanwar@gmail.com" className="text-lg text-divine hover:text-gold transition-colors break-all">
                    udityatanwar@gmail.com
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div className="glass rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-gold" />
                <h3 className="font-display text-xl text-divine">Visit Our Studio</h3>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-4">
                17 Artisan Row, Jaipur 302001, Rajasthan, India
              </p>
              <p className="text-[10px] text-gold tracking-widest uppercase">
                * By appointment only for premium collections
              </p>
            </div>

            <div className="glass rounded-3xl p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-gold" />
                <h3 className="font-display text-xl text-divine">Support Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Monday - Saturday</span>
                  <span className="text-divine">9:00 AM - 8:00 PM (IST)</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Sunday</span>
                  <span className="text-divine">10:00 AM - 4:00 PM (IST)</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="https://wa.me/917665941949"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-medium py-3 rounded-full text-xs tracking-widest hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageCircle size={16} />
                  CHAT ON WHATSAPP
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="text-center mb-8 relative z-10">
            <h2 className="font-display text-3xl text-divine mb-2">Send an Inquiry</h2>
            <p className="text-muted text-sm">We typically respond within 24 hours.</p>
          </div>

          <form className="max-w-2xl mx-auto space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-muted uppercase ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-gold/20 rounded-xl py-3 px-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-muted uppercase ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-gold/20 rounded-xl py-3 px-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted uppercase ml-1">Subject</label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-black/40 border border-gold/20 rounded-xl py-3 px-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"
                placeholder="Custom Murti Inquiry"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted uppercase ml-1">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/40 border border-gold/20 rounded-xl py-3 px-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-medium py-4 rounded-full text-sm tracking-widest transition-all mt-4 ${
                success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gold text-black hover:bg-gold-light shadow-gold'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : success ? (
                'MESSAGE SENT ✓'
              ) : (
                <>
                  <Send size={16} />
                  SEND MESSAGE
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
