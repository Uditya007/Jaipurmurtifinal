'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ChevronRight, Check, Shield, Lock, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/client';

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
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const stepIndex = STEPS.indexOf(step);

  const shipping = 0;
  const gst = Math.round(totalPrice * 0.05);
  const total = totalPrice + gst;

  // Check auth on load; prefill form if logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setForm(prev => ({
          ...prev,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || '',
        }));
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  // Guard: redirect to login if not logged in and tries to go to shipping
  const proceedToShipping = () => {
    if (!user) {
      router.push('/auth?redirect=/cart');
      return;
    }
    if (items.length > 0) setStep('shipping');
  };

  // Save order to Supabase + handle Razorpay
  const handleOrderPlace = async () => {
    if (!user) {
      router.push('/auth?redirect=/cart');
      return;
    }
    setIsProcessing(true);

    try {
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

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve) => { script.onload = resolve; });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Jaipur Murti',
        description: 'Premium Hindu Idols & Statues',
        order_id: order.id,
        prefill: {
          name: form.name,
          email: form.email || user?.email,
          contact: form.phone,
        },
        theme: { color: '#D4AF37' },
        handler: async function (response: any) {
          try {
            // Save order to Supabase
            const shippingAddr = [form.address, form.city, form.state, form.pin]
              .filter(Boolean).join(', ');

            const { error: orderError } = await supabase.from('orders').insert({
              user_id: user.id,
              status: 'processing',
              total_amount: total,
              items: items.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                image: i.images?.[0] || '',
              })),
              shipping_address: shippingAddr || 'Address not provided',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            if (orderError) {
              console.error('Order save error:', orderError);
            }
          } catch (err) {
            console.error('Failed to save order:', err);
          }
          clearCart();
          setStep('success');
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () { setIsProcessing(false); }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Could not initiate payment. Please try again.');
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

                  </div>

                  <div className="divine-divider mb-4" />

                  <div className="flex justify-between mb-6">
                    <span className="font-display text-lg text-divine">Total</span>
                    <span className="font-display text-xl text-gold">₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Login prompt if not logged in */}
                  {authChecked && !user && items.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-4">
                      <Lock size={12} />
                      <span>Please <Link href="/auth?redirect=/cart" className="underline font-medium">sign in</Link> to checkout</span>
                    </div>
                  )}

                  <button
                    onClick={proceedToShipping}
                    disabled={items.length === 0}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm tracking-widest font-medium transition-all duration-300 ${
                      items.length === 0
                        ? 'bg-white/5 text-muted cursor-not-allowed'
                        : 'bg-gold text-black hover:bg-gold-light shadow-gold'
                    }`}
                  >
                    {user ? (
                      <>{`PROCEED TO CHECKOUT`} <ChevronRight size={14} /></>
                    ) : (
                      <><Lock size={14} /> SIGN IN TO CHECKOUT</>
                    )}
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

          {/* ─── SUCCESS POPUP ─── */}
          <AnimatePresence>
            {step === 'success' && (
              <motion.div
                key="thank-you-popup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(12px)' }}
              >
                {/* Floating sparkles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-gold"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      x: (Math.random() - 0.5) * 600,
                      y: (Math.random() - 0.5) * 600,
                    }}
                    transition={{ delay: i * 0.1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ left: '50%', top: '50%' }}
                  >
                    {i % 3 === 0 ? '✦' : i % 3 === 1 ? '🌟' : '✨'}
                  </motion.div>
                ))}

                {/* Modal card */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 60 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
                  className="relative glass rounded-3xl border border-gold/30 p-10 max-w-md w-full text-center shadow-2xl overflow-hidden"
                >
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-divine-radial opacity-20 pointer-events-none" />

                  {/* Checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3, stiffness: 300 }}
                    className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/50 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check size={36} className="text-gold" />
                  </motion.div>

                  {/* Om */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl mb-4 float"
                  >
                    🕉️
                  </motion.div>

                  {/* Thank you text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="font-display text-4xl text-divine mb-2">Thank You!</h2>
                    <p className="text-gold font-serif italic text-lg mb-4">For Shopping with Jaipur Murti</p>
                    <div className="divine-divider max-w-xs mx-auto mb-6" />
                    <p className="text-muted leading-relaxed text-sm mb-6">
                      Your order has been placed successfully. 🙏<br />
                      We'll carefully pack your sacred murti and send
                      you a confirmation shortly.
                    </p>
                  </motion.div>

                  {/* Order info box */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-black/30 rounded-2xl p-4 mb-8 border border-gold/10"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-muted uppercase mb-2">
                      <Sparkles size={12} className="text-gold" />
                      <span>Order Confirmed</span>
                      <Sparkles size={12} className="text-gold" />
                    </div>
                    <p className="font-display text-gold text-xl">May the Divine Bless Your Home</p>
                    <div className="flex justify-center gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-gold fill-gold" />
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black text-xs tracking-widest rounded-full font-medium hover:bg-gold-light transition-all shadow-gold"
                    >
                      CONTINUE SHOPPING <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </div>
    </div>
  );
}
