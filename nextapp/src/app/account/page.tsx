'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, HelpCircle, LogOut, ExternalLink, ChevronRight, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock types until we fully type the orders
type Order = {
  id: string;
  created_at: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: any[];
  shipping_address: string;
  tracking_number?: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setUser(session.user);

      // Fetch real orders from database (if table exists)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="glass rounded-3xl p-6 md:sticky top-32">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4 text-2xl">
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-2xl text-divine mb-1">
                {user.user_metadata?.full_name || 'Sacred Patron'}
              </h2>
              <p className="text-xs text-muted mb-8">{user.email}</p>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/10 text-gold text-sm tracking-widest font-medium transition-colors">
                  <Package size={16} />
                  MY ORDERS
                </button>
                <Link href="/contact" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-divine/70 hover:text-divine text-sm tracking-widest font-medium transition-colors">
                  <HelpCircle size={16} />
                  GET HELP
                </Link>
                <Link href="/admin/instagram" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/5 hover:bg-gold/15 text-gold text-sm tracking-widest font-semibold transition-all border border-gold/20 shadow-[0_0_12px_rgba(212,175,55,0.05)]">
                  <Sparkles size={16} className="text-gold" />
                  INSTAGRAM AGENT
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-divine/70 hover:text-red-400 text-sm tracking-widest font-medium transition-colors mt-4"
                >
                  <LogOut size={16} />
                  SIGN OUT
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="flex-1">
            <h1 className="font-display text-4xl text-divine mb-8">Order History</h1>
            
            {orders.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border-dashed border border-gold/20">
                <Package size={48} className="mx-auto text-gold/30 mb-4" />
                <h3 className="font-display text-2xl text-divine mb-2">No Orders Yet</h3>
                <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                  You haven't placed any sacred murti orders yet. Your divine journey begins when you're ready.
                </p>
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 bg-gold text-black font-medium px-8 py-3 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="glass rounded-3xl p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gold/10">
                      <div>
                        <p className="text-[10px] tracking-widest text-gold uppercase mb-1">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-medium flex items-center gap-2 ${
                          order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.status === 'delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {order.status}
                        </div>
                        <p className="font-display text-xl text-gold">₹{order.total_amount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                      <div>
                        <h4 className="text-xs tracking-widest text-muted uppercase mb-3">Shipping Address</h4>
                        <div className="flex items-start gap-2 text-sm text-divine/80 max-w-xs">
                          <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                          <p>{order.shipping_address || 'Address pending verification'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {order.tracking_number && (
                          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-xs tracking-widest uppercase">
                            Track Package
                            <ExternalLink size={14} />
                          </button>
                        )}
                        <Link href="/contact" className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-divine transition-colors text-xs tracking-widest uppercase">
                          Need Help?
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
