'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl text-divine mt-4 mb-4">
            Privacy Policy
          </h1>
          <div className="divine-divider max-w-sm mx-auto mt-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 prose prose-invert prose-gold max-w-none"
        >
          <p className="text-muted text-sm leading-relaxed mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl text-divine font-display mb-4">1. Information We Collect</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            At Jaipur Murti, we collect information to provide you with a premium shopping experience. This includes your name, email address, phone number, shipping address, and payment information when you make a purchase or subscribe to our newsletter.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">2. How We Use Your Information</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            We use your data to process orders, arrange shipping, provide customer support, and send exclusive updates regarding our sacred murti collections. We never sell your personal information to third parties.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">3. Data Protection</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your payment information is processed securely through Razorpay. We do not store full credit card details on our servers. Our database uses row-level security to ensure your account information remains private and secure.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">4. Cookies</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            We use cookies and similar technologies to remember your preferences (like the 10% discount popup) and analyze site traffic to improve our services.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">5. Contact Us</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact us at udityatanwar@gmail.com or via WhatsApp at +91 76659 41949.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
