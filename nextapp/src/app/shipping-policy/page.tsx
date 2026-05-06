'use client';

import { motion } from 'framer-motion';

export default function ShippingPolicyPage() {
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
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Delivery</span>
          <h1 className="font-display text-4xl md:text-5xl text-divine mt-4 mb-4">
            Shipping Policy
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
          
          <h2 className="text-xl text-divine font-display mb-4">1. Worldwide Delivery Timeline</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            We proudly offer <strong>Worldwide Shipping</strong> to ensure our sacred murtis can reach devotees anywhere across the globe. Every piece is carefully packaged and shipped to ensure its absolute safety.
            <br /><br />
            <strong>Domestic Orders (Within India):</strong> Delivered within 20 days from the date of order confirmation.<br />
            <strong>International Orders:</strong> Delivered between 20-30 days depending on the destination country and customs clearance.
            <br /><br />
            This timeline accounts for our rigorous quality checks, secure crating, and transit time.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">2. Packaging & Safety</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Our murtis are highly delicate and hold immense spiritual value. We use premium, shock-absorbent wooden crates and custom foam padding to guarantee that your deity arrives in pristine condition.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">3. Order Tracking</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Once your order has been dispatched from our Jaipur studio, you will receive a tracking number via email. You can also monitor your order's status directly from your Account Dashboard or our Tracking page.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">4. Shipping Charges</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Shipping costs are calculated at checkout based on the weight of the murti and the destination address. We partner with specialized logistics providers experienced in handling delicate stone and metal artifacts.
          </p>

          <h2 className="text-xl text-divine font-display mb-4">5. Issues Upon Delivery</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            If you notice any damage to the exterior packaging upon delivery, please document it with photographs before opening. Contact us immediately at +91 76659 41949 so we can assist you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
