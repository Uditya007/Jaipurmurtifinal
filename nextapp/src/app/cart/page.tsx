'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ChevronRight, Check, Shield, Lock, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Step = 'cart' | 'shipping' | 'payment' | 'success';

const STEPS: Step[] = ['cart', 'shipping', 'payment', 'success'];
const STEP_LABELS = ['Cart', 'Shipping', 'Payment', 'Confirmed'];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pin: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const shipping = totalPrice > 5000 ? 0 : 299;
  const gst = Math.round(totalPrice * 0.05);
  const total = totalPrice + shipping + gst;

  const handleOrderPlace = async () => {
    setIsProcessing(true);

    try {
      // 1. Create order on server
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: `receipt_${Date.now()}`
        }),
      });

      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || 'Failed to initialize payment');
      }

      // 2. Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', 
        amount: order.amount,
        currency: order.currency,
        name: 'Jaipur Murti',
        description: 'Premium Hindu Idols & Statues',
        order_id: order.id,
        prefill: {
          name: form.name || form.cardName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#D4AF37', // Brand gold color
        },
        handler: function (response: any) {
          // Payment successful
          console.log('Payment success:', response);
          clearCart();
          setStep('success');
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Could not initiate payment. Please check your configuration or try again.');
      setIsProcessing(false);
    }
  };

  const updateForm = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const inputClass = "w-full bg-bg-3 border border-gold/15 rounded-xl px-4 py-3 text-sm text-divine placeholder-muted focus:border-gold/50 transition-colors duration-200";

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/products" className="flex items-center gap-2 text-muted text-xs tracking-widest hover:text-gold transition-colors mb-6">
            <ArrowLeft size={13} /> BACK TO COLLECTION
          </Link>
          <h1 className="font-display text-5xl text-divine">
            {step === 'success' ? 'Order Confirmed' : 'Sacred Cart'}
          </h1>
        </motion.div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-0 mb-12">
            {STEP_LABELS.slice(0, 3).map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
                  i === stepIndex ? 'bg-gold text-black font-medium' :
                  i < stepIndex ? 'text-gold' : 'text-muted'
                }`}>
                  {i < stepIndex && <Check size={11} />}
                  <span>{label.toUpperCase()}</span>
                </div>
                {i < 2 && (
                  <div className="w-8 h-px bg-gold/20 mx-1" />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── CART STEP ─── */}
          {step === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.length === 0 ? (
                  <div className="glass rounded-2xl p-16 text-center">
                    <ShoppingCart size={40} className="text-gold/30 mx-auto mb-4" />
                    <p className="text-muted mb-2">Your sacred cart is empty</p>
                    <Link href="/products" className="text-gold text-sm hover:underline">
                      Explore our collection →
                    </Link>
                  </div>
                ) : (
                  items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: i * 0.07 }}
                      className="glass rounded-2xl p-5 flex gap-5"
                    >
                      {/* Icon */}
                      <div className="w-20 h-20 rounded-xl bg-bg-3 flex items-center justify-center text-4xl flex-shrink-0"
                        style={{ background: 'radial-gradient(ellipse at center, #1a1008, #050505)' }}
                      >
                        {item.category === 'Bronze' ? '🕉️' :
                         item.category === 'Marble' ? '🌺' :
                         item.category === 'Crystal' ? '💎' :
                         item.category === 'Brass' ? '⚱️' : '🪷'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-divine">{item.name}</h3>
                        <p className="text-xs text-muted mt-0.5 mb-3">{item.material} · {item.height}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0 glass rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-muted hover:text-gold transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm text-divine">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-muted hover:text-gold transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-display text-lg text-gold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Order summary */}
              <div>
                <div className="glass rounded-2xl p-6 sticky top-28">
                  <h3 className="font-display text-xl text-divine mb-6">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal ({totalItems} items)</span>
                      <span className="text-divine">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Shipping</span>
                      <span className={shipping === 0 ? 'text-emerald-400' : 'text-divine'}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">GST (5%)</span>
                      <span className="text-divine">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    {totalPrice < 5000 && totalPrice > 0 && (
                      <p className="text-[10px] text-muted">
                        Add ₹{(5000 - totalPrice).toLocaleString('en-IN')} more for FREE shipping
                      </p>
                    )}
                  </div>

                  <div className="divine-divider mb-4" />

                  <div className="flex justify-between mb-6">
                    <span className="font-display text-lg text-divine">Total</span>
                    <span className="font-display text-xl text-gold">₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => items.length > 0 && setStep('shipping')}
                    disabled={items.length === 0}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm tracking-widest font-medium transition-all duration-300 ${
                      items.length === 0
                        ? 'bg-white/5 text-muted cursor-not-allowed'
                        : 'bg-gold text-black hover:bg-gold-light shadow-gold'
                    }`}
                  >
                    PROCEED TO SHIPPING <ChevronRight size={14} />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted">
                    <Lock size={10} className="text-gold" />
                    Secure & encrypted checkout
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── SHIPPING STEP ─── */}
          {step === 'shipping' && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="glass rounded-2xl p-8">
                  <h2 className="font-display text-2xl text-divine mb-8">Shipping Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'Rahul Sharma' },
                      { key: 'email', label: 'Email', placeholder: 'rahul@example.com' },
                      { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
                      { key: 'address', label: 'Street Address', placeholder: '123 Temple Lane', full: true },
                      { key: 'city', label: 'City', placeholder: 'Mumbai' },
                      { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                      { key: 'pin', label: 'PIN Code', placeholder: '400001' },
                    ].map(f => (
                      <div key={f.key} className={f.full ? 'md:col-span-2' : ''}>
                        <label className="text-[10px] tracking-widest text-muted uppercase mb-2 block">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={e => updateForm(f.key, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep('cart')}
                      className="flex items-center gap-2 px-6 py-3 border border-gold/20 text-muted text-xs tracking-widest rounded-full hover:border-gold/40 hover:text-gold transition-all"
                    >
                      <ArrowLeft size={13} /> BACK
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-black text-xs tracking-widest rounded-full font-medium hover:bg-gold-light transition-all shadow-gold"
                    >
                      CONTINUE TO PAYMENT <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mini summary */}
              <div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display text-lg text-divine mb-4">Your Order</h3>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm mb-3">
                      <span className="text-muted truncate max-w-[140px]">{item.name} ×{item.quantity}</span>
                      <span className="text-divine">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="divine-divider my-4" />
                  <div className="flex justify-between">
                    <span className="font-display text-divine">Total</span>
                    <span className="font-display text-gold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PAYMENT STEP ─── */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="glass rounded-2xl p-8">
                  <h2 className="font-display text-2xl text-divine mb-2">Payment</h2>
                  <p className="text-xs text-muted mb-8 flex items-center gap-2">
                    <Lock size={10} className="text-gold" /> 256-bit SSL encrypted · PCI DSS compliant
                  </p>

                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 text-center mb-8">
                    <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6 mx-auto mb-4 opacity-80 invert" />
                    <p className="text-sm text-divine mb-2">You will be redirected to Razorpay to complete your payment securely.</p>
                    <p className="text-xs text-muted">Supports UPI, all major Credit/Debit Cards, and Net Banking.</p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep('shipping')}
                      className="flex items-center gap-2 px-6 py-3 border border-gold/20 text-muted text-xs tracking-widest rounded-full hover:border-gold/40 hover:text-gold transition-all"
                    >
                      <ArrowLeft size={13} /> BACK
                    </button>
                    <button
                      onClick={handleOrderPlace}
                      disabled={isProcessing}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs tracking-widest font-medium transition-all ${
                        isProcessing 
                          ? 'bg-gold/50 text-black/50 cursor-not-allowed' 
                          : 'bg-gold text-black hover:bg-gold-light shadow-gold'
                      }`}
                    >
                      {isProcessing ? (
                        <><Loader2 size={13} className="animate-spin" /> INITIALIZING...</>
                      ) : (
                        <><Shield size={13} /> PAY SECURELY VIA RAZORPAY</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display text-lg text-divine mb-4">Order Summary</h3>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm mb-3">
                      <span className="text-muted truncate max-w-[140px]">{item.name} ×{item.quantity}</span>
                      <span className="text-divine">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="divine-divider my-4" />
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted">Subtotal</span>
                      <span className="text-divine">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Shipping</span>
                      <span className={shipping === 0 ? 'text-emerald-400' : 'text-divine'}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">GST</span>
                      <span className="text-divine">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-display text-divine">Total</span>
                    <span className="font-display text-gold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── SUCCESS STEP ─── */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mx-auto mb-8"
              >
                <Check size={32} className="text-gold" />
              </motion.div>

              <div className="text-6xl mb-6 float">🕉️</div>
              <h2 className="font-display text-5xl text-divine mb-4">May Your Puja Begin</h2>
              <p className="text-muted max-w-md mx-auto mb-8 leading-relaxed">
                Your order has been placed and will be carefully packed and shipped with white-glove care.
                You'll receive a tracking notification soon.
              </p>

              <div className="glass rounded-2xl p-6 max-w-sm mx-auto mb-10">
                <p className="text-xs tracking-widest text-muted mb-3">ESTIMATED DELIVERY</p>
                <p className="font-display text-xl text-gold">5–7 Business Days</p>
                <p className="text-xs text-muted mt-1">Insured & climate-controlled shipping</p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black text-sm tracking-widest rounded-full font-medium hover:bg-gold-light transition-all shadow-gold"
              >
                CONTINUE EXPLORING <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
