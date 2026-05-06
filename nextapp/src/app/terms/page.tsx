'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
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
            Terms & Conditions
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
          
          <h2 className="text-xl text-divine font-display mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            By accessing and using the Jaipur Murti website, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">2. Handcrafted Variations</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Please note that each murti is individually hand-carved from natural stone or cast in metal. Because of this, slight variations in color, texture, and exact dimensions may occur compared to the photographs shown. These are not flaws, but rather the mark of authentic artisanship.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">3. Pricing and Payments</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice. Secure payments are facilitated via Razorpay.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">4. Order Cancellations</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Orders can be cancelled within 24 hours of placement for a full refund. After this window, the creation and packaging process begins, and cancellations may be subject to a restocking fee depending on the order status.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">5. Intellectual Property</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            All content on this website, including text, graphics, logos, images, and software, is the property of Jaipur Murti and protected by international copyright laws.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
