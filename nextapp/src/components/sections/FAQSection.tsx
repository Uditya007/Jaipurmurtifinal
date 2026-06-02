'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Do you ship worldwide?",
    answer: "Yes, we ship our sacred murtis globally. We use museum-grade international packing techniques to ensure that every deity arrives in perfect condition, fully insured for your peace of mind."
  },
  {
    question: "How long does shipping take within India?",
    answer: "Standard orders within India typically arrive within 7-10 business days. Custom or large marble pieces may take 15-20 days due to the specialized handling and crating required."
  },
  {
    question: "Is the marble used authentic White marble?",
    answer: "Absolutely. We source all our marble directly from the oldest quarries in White, Rajasthan. Every piece comes with an authenticity certificate verifying the material and the artisan lineage."
  },
  {
    question: "Can I request a custom size or deity?",
    answer: "Yes, we specialize in bespoke murtis. Our master artisans can carve any deity in specific sizes (from 6 inches to 6 feet) and postures according to your spiritual requirements. Please contact us via WhatsApp for custom commissions."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for any manufacturing defects or damage during transit. Since each murti is a sacred object, we encourage you to review all photos and videos provided before shipping to ensure it meets your expectations."
  },
  {
    question: "How should I care for my marble murti?",
    answer: "Marble is best cleaned with a soft, dry cotton cloth. Avoid using harsh chemicals. For daily puja rituals, you can use mild gangajal or milk, but ensure the murti is wiped dry afterwards to maintain the marble's natural glow."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-bg-1">
      <div className="absolute inset-0 bg-divine-radial opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <HelpCircle size={14} className="text-gold" />
            <span className="text-xs tracking-[0.5em] text-gold uppercase font-light">Assistance</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-divine mb-6"
          >
            Frequently Asked <span className="shimmer">Questions</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Find answers to common questions about our craftsmanship, shipping process, 
            and how to bring a piece of Jaipur's heritage into your home.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-3xl border transition-all duration-300 ${
                openIndex === i 
                  ? 'bg-white/40 border-amber-200/60 shadow-sm' 
                  : 'bg-transparent border-gold/10 hover:border-gold/30'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`font-display text-lg md:text-xl transition-colors ${
                  openIndex === i ? 'text-gold' : 'text-divine'
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-all ${
                  openIndex === i ? 'bg-gold text-black rotate-0' : 'bg-gold/10 text-gold rotate-90'
                }`}>
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-sm md:text-base text-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted text-sm mb-6">Still have questions?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://wa.me/917665941949" 
              className="px-8 py-4 bg-gold text-black font-bold text-xs tracking-[0.2em] rounded-full hover:bg-gold-light transition-all shadow-gold"
            >
              WHATSAPP US
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 border border-gold/30 text-gold font-bold text-xs tracking-[0.2em] rounded-full hover:bg-gold/10 transition-all"
            >
              SEND EMAIL
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
