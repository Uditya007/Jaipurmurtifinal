'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Settings, Calendar, Play, CheckCircle2, 
  AlertTriangle, RefreshCw, Send, Plus, Trash2, Shield, Bell, 
  ChevronRight, Smartphone, Eye, Download, Image as ImageIcon,
  Check, Info, BarChart2, Radio, Sliders, Layers
} from 'lucide-react';

const Instagram = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { products } from '@/lib/products';

type IGPost = {
  id: string;
  created_at: string;
  scheduled_at?: string;
  published_at?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  caption: string;
  image_url: string;
  product_id?: string;
  deity?: string;
  error_message?: string;
  post_id?: string;
};

export default function InstagramAgentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'queue' | 'settings'>('overview');
  
  // Settings & Configuration
  const [config, setConfig] = useState({
    sandbox_mode: true,
    autopilot: false,
    posting_hour: 9,
    brand_hashtags: '#jaipurmurti #sacredart #marbleidols #spiritualart',
    gemini_api_key: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    insta_business_id: '',
    facebook_access_token: '',
    custom_mantras: '🕉️ Namo Bhagavate Vasudevaya\n🕉️ Ganesha Namah\n🕉️ Sri Ramaya Namah\n🕉️ Saraswatyai Namah'
  });

  // State Management
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [runningCron, setRunningCron] = useState(false);
  const [cronLogs, setCronLogs] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Creative Studio States
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedTone, setSelectedTone] = useState<'spiritual' | 'sales' | 'elegant' | 'greeting'>('spiritual');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  
  // Canvas Customization States
  const [canvasBg, setCanvasBg] = useState<'charcoal' | 'ivory' | 'gold'>('charcoal');
  const [canvasTitle, setCanvasTitle] = useState('DIVINE GRACE');
  const [canvasSubtitle, setCanvasSubtitle] = useState('JAIPUR MARBLE ART');
  const [mandalaOpacity, setMandalaOpacity] = useState(30);
  const [borderWidth, setBorderWidth] = useState(15);
  const [canvasImageUrl, setCanvasImageUrl] = useState('');

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Load configuration and postings
  useEffect(() => {
    fetchSettings();
    fetchPosts();
  }, []);

  // Re-draw canvas whenever product or parameters change
  useEffect(() => {
    if (activeTab === 'studio') {
      drawCanvas();
    }
  }, [selectedProductId, canvasBg, canvasTitle, canvasSubtitle, mandalaOpacity, borderWidth, activeTab]);

  const triggerAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_settings' })
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setConfig(data.settings);
      }
    } catch (e) {
      // Graceful fallback to client-side localStorage
      const local = localStorage.getItem('jaipur_murti_ig_settings');
      if (local) setConfig(JSON.parse(local));
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_posts' })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (e) {
      const local = localStorage.getItem('jaipur_murti_ig_posts');
      if (local) setPosts(JSON.parse(local));
    } finally {
      setLoadingPosts(false);
    }
  };

  const saveSettings = async (updatedConfig = config) => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_settings', settings: updatedConfig })
      });
      const data = await res.json();
      if (data.success) {
        triggerAlert('success', 'Configuration settings updated successfully.');
      }
    } catch (e) {
      localStorage.setItem('jaipur_murti_ig_settings', JSON.stringify(updatedConfig));
      triggerAlert('success', 'Configuration saved locally (using Sandbox storage).');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleAutopilot = () => {
    const updated = { ...config, autopilot: !config.autopilot };
    setConfig(updated);
    saveSettings(updated);
  };

  const handleToggleSandbox = () => {
    const updated = { ...config, sandbox_mode: !config.sandbox_mode };
    setConfig(updated);
    saveSettings(updated);
  };

  const testTelegramConnection = async () => {
    if (!config.telegram_bot_token || !config.telegram_chat_id) {
      triggerAlert('error', 'Please fill in both Telegram Bot Token and Chat ID first.');
      return;
    }
    setTestingTelegram(true);
    try {
      // Simple alert trigger on backend
      const message = `✨ <b>Jaipur Murti AI Social Agent Connected!</b>\n\nYour Telegram Channel is fully linked to the Autopilot dashboard. Ready to dispatch divine updates. 🕉️`;
      const res = await fetch(`https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegram_chat_id,
          text: message,
          parse_mode: 'HTML'
        })
      });
      if (res.ok) {
        triggerAlert('success', 'Telegram test notification sent successfully! Check your channel.');
      } else {
        triggerAlert('error', 'Telegram API returned an error. Verify your Token & Chat ID.');
      }
    } catch (err) {
      triggerAlert('error', 'Failed to communicate with Telegram API.');
    } finally {
      setTestingTelegram(false);
    }
  };

  const generateCaption = async () => {
    if (!config.gemini_api_key) {
      triggerAlert('error', 'Gemini API Key is required. Configure it in Settings.');
      setActiveTab('settings');
      return;
    }
    setGeneratingCaption(true);
    try {
      const detailsText = `Name: ${selectedProduct.name}, Material: ${selectedProduct.material}, Height: ${selectedProduct.height}, Finish: ${selectedProduct.finish}, Origin: ${selectedProduct.origin}, Description: ${selectedProduct.description}. User Custom Note: ${customInstructions}`;
      
      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_caption',
          deity: selectedProduct.deity,
          details: detailsText,
          tone: selectedTone,
          config: config
        })
      });

      const data = await res.json();
      if (data.success && data.caption) {
        setGeneratedCaption(data.caption);
        triggerAlert('success', 'AI Caption beautifully composed by Gemini.');
      } else {
        throw new Error(data.error || 'Gemini returned an empty caption.');
      }
    } catch (e: any) {
      triggerAlert('error', e.message || 'Generation failed. Check your Gemini API Key.');
    } finally {
      setGeneratingCaption(false);
    }
  };

  // HTML5 Canvas Procedural Graphic Generator
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard high-res Instagram Square layout
    canvas.width = 1080;
    canvas.height = 1080;

    // Clear Canvas
    ctx.clearRect(0, 0, 1080, 1080);

    // 1. Draw Background
    let bgGrad = ctx.createRadialGradient(540, 540, 100, 540, 540, 700);
    if (canvasBg === 'charcoal') {
      bgGrad.addColorStop(0, '#22221D');
      bgGrad.addColorStop(1, '#0C0C0A');
    } else if (canvasBg === 'ivory') {
      bgGrad.addColorStop(0, '#FAFAF7');
      bgGrad.addColorStop(1, '#EDE5D8');
    } else { // gold
      bgGrad.addColorStop(0, '#F0D060');
      bgGrad.addColorStop(1, '#A07820');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Draw Procedural Sacred Geometry Mandala
    ctx.save();
    ctx.translate(540, 540);
    ctx.strokeStyle = canvasBg === 'ivory' ? 'rgba(160, 120, 32, 0.08)' : 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 2;
    const petals = 24;
    const opacityFactor = mandalaOpacity / 100;
    ctx.globalAlpha = opacityFactor;

    // concentric lines and petals
    for (let r = 100; r <= 380; r += 70) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < petals; i++) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.4, r * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1.0;

    // 3. Load and Draw Product Image Overlay
    const img = new Image();
    // Use the primary showcase image
    img.src = selectedProduct.images[0];
    img.crossOrigin = 'anonymous'; // prevent canvas tainting

    img.onload = () => {
      ctx.save();
      // Draw shadow circle under the product image
      ctx.shadowColor = canvasBg === 'ivory' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;

      // Draw a perfect circular masking frame for the image
      const cx = 540;
      const cy = 460;
      const radius = 280;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip(); // Mask the image inside a circle

      // Draw Image scaling keeping aspect ratio
      const imgAspect = img.height / img.width;
      let dWidth = radius * 2;
      let dHeight = radius * 2 * imgAspect;
      let dx = cx - radius;
      let dy = cy - radius;

      // Draw loaded image inside clip
      ctx.drawImage(img, dx, dy, dWidth, dHeight);
      ctx.restore();

      // Draw circular frame border around the mask
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = canvasBg === 'gold' ? '#FFFFFF' : '#D4AF37';
      ctx.lineWidth = 6;
      ctx.stroke();

      // 4. Draw Elegant Text/Typography
      ctx.textAlign = 'center';

      // Brand Title - "JAIPUR MURTI"
      ctx.font = '500 24px "Cinzel", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#A07820' : '#D4AF37';
      ctx.letterSpacing = '8px';
      ctx.fillText('JAIPUR MURTI', 540, 830);

      // Main Post Title - e.g. "DIVINE GRACE"
      ctx.font = '600 48px "Cinzel", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#1C1208' : '#FAFAF7';
      ctx.letterSpacing = '4px';
      ctx.fillText(canvasTitle.toUpperCase(), 540, 890);

      // Subtitle - e.g. "WHITE MARBLE ART"
      ctx.font = 'italic 300 22px "Cormorant Garamond", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#6B5E4A' : '#EDE5D8';
      ctx.letterSpacing = '2px';
      ctx.fillText(canvasSubtitle, 540, 935);

      // Watermark link
      ctx.font = '400 14px "Inter", sans-serif';
      ctx.fillStyle = canvasBg === 'ivory' ? 'rgba(160, 120, 32, 0.4)' : 'rgba(212, 175, 55, 0.4)';
      ctx.letterSpacing = '3px';
      ctx.fillText('JAIPURMURTI.ME', 540, 975);

      // 5. Draw Gold Frame / Border around the entire Canvas
      ctx.strokeStyle = canvasBg === 'ivory' ? 'rgba(160, 114, 10, 0.15)' : '#D4AF37';
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, 1080 - borderWidth, 1080 - borderWidth);

      // Save exported base64 image URL to state
      setCanvasImageUrl(canvas.toDataURL('image/jpeg', 0.95));
    };

    // If image doesn't load or is a local path, render a beautiful placeholder inside canvas
    img.onerror = () => {
      // Procedural fallback graphic - Golden Om symbol or elegant circle
      ctx.save();
      const cx = 540;
      const cy = 460;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 30;
      
      // Beautiful central circle
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fillStyle = canvasBg === 'ivory' ? '#EDE5D8' : '#2C2B25';
      ctx.fill();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Procedural sacred symbol (OM) or deity placeholder text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D4AF37';
      ctx.font = '100px "Cinzel"';
      ctx.fillText('🕉️', cx, cy + 30);
      ctx.restore();

      // Draw Elegant Typography
      ctx.textAlign = 'center';
      ctx.font = '500 24px "Cinzel", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#A07820' : '#D4AF37';
      ctx.letterSpacing = '8px';
      ctx.fillText('JAIPUR MURTI', 540, 830);

      ctx.font = '600 48px "Cinzel", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#1C1208' : '#FAFAF7';
      ctx.letterSpacing = '4px';
      ctx.fillText(canvasTitle.toUpperCase(), 540, 890);

      ctx.font = 'italic 300 22px "Cormorant Garamond", serif';
      ctx.fillStyle = canvasBg === 'ivory' ? '#6B5E4A' : '#EDE5D8';
      ctx.letterSpacing = '2px';
      ctx.fillText(canvasSubtitle, 540, 935);

      ctx.strokeStyle = canvasBg === 'ivory' ? 'rgba(160, 114, 10, 0.15)' : '#D4AF37';
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, 1080 - borderWidth, 1080 - borderWidth);

      setCanvasImageUrl(canvas.toDataURL('image/jpeg', 0.95));
    };
  };

  const handlePublishNow = async () => {
    if (!generatedCaption) {
      triggerAlert('error', 'Caption is empty! Generate a caption with AI first.');
      return;
    }
    setPublishing(true);
    try {
      const newPost = {
        deity: selectedProduct.deity,
        product_id: selectedProduct.id,
        caption: generatedCaption,
        image_url: canvasImageUrl || selectedProduct.images[0], // Canvas image base64
        status: 'published',
        created_at: new Date().toISOString()
      };

      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_post',
          post: newPost,
          config: config
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerAlert('success', `Post published successfully! Mode: ${config.sandbox_mode ? 'Sandbox Simulation' : 'Live IG Feed'}`);
        fetchPosts(); // Reload listings
        setActiveTab('overview');
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      triggerAlert('error', e.message || 'Failed to publish post to Instagram.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!generatedCaption) {
      triggerAlert('error', 'Generate a caption before scheduling.');
      return;
    }
    try {
      // Schedule post 1 day from now
      const schedTime = new Date();
      schedTime.setDate(schedTime.getDate() + 1);

      const newPost = {
        deity: selectedProduct.deity,
        product_id: selectedProduct.id,
        caption: generatedCaption,
        image_url: canvasImageUrl || selectedProduct.images[0],
        scheduled_at: schedTime.toISOString()
      };

      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule_post',
          post: newPost
        })
      });

      const data = await res.json();
      if (data.success) {
        triggerAlert('success', `Post scheduled in queue successfully for tomorrow!`);
        fetchPosts();
        setActiveTab('queue');
      }
    } catch (e) {
      triggerAlert('error', 'Failed to schedule post.');
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch('/api/instagram/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_post', id })
      });
      if (res.ok) {
        triggerAlert('success', 'Post removed from records.');
        fetchPosts();
      }
    } catch (e) {
      triggerAlert('error', 'Failed to delete post.');
    }
  };

  const triggerCronJob = async () => {
    setRunningCron(true);
    setCronLogs(['Initializing automated Cron Engine...', 'Connecting to social databases...']);
    
    try {
      const res = await fetch('/api/instagram/cron', { method: 'POST' });
      const data = await res.json();
      
      if (data.logs) {
        setCronLogs(data.logs);
      }

      if (data.success) {
        triggerAlert('success', `Cron executed successfully! Action: ${data.action.replace('_', ' ').toUpperCase()}`);
        fetchPosts(); // reload history
      } else {
        triggerAlert('error', `Cron failed: ${data.error}`);
      }
    } catch (err: any) {
      setCronLogs(prev => [...prev, `ERROR: ${err.message || 'Server timeout calling Cron endpoint'}`]);
      triggerAlert('error', 'Cron job failed to execute completely.');
    } finally {
      setRunningCron(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-divine-radial opacity-5 pointer-events-none" />

      {/* Global Alert Notification Popup */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 glass border ${
              alert.type === 'success' ? 'border-emerald-500/30 text-emerald-700 bg-emerald-500/5' :
              alert.type === 'error' ? 'border-red-500/30 text-red-700 bg-red-500/5' :
              'border-gold/30 text-gold bg-gold/5'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> :
             alert.type === 'error' ? <AlertTriangle size={18} className="text-red-500" /> :
             <Info size={18} className="text-gold" />}
            <span className="text-sm font-medium tracking-wide">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gold/10 pb-8">
          <div>
            <span className="text-xs tracking-[0.5em] text-gold uppercase">Autonomous Operations</span>
            <h1 className="font-display text-4xl md:text-5xl text-divine mt-2 flex items-center gap-3">
              <Sparkles className="text-gold animate-pulse" size={32} />
              Divine Social Agent
            </h1>
            <p className="text-muted text-sm mt-1 max-w-xl">
              An advanced AI marketing pilot that curates divine temple art collections, drafts captions with Gemini, designs graphics on Canvas, and uploads automatically to Instagram.
            </p>
          </div>

          {/* Quick Autopilot Toggle Widgets */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleSandbox}
              className={`px-4 py-2.5 rounded-xl border text-xs tracking-widest font-semibold uppercase flex items-center gap-2 transition-all ${
                config.sandbox_mode 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'bg-white/5 border-gold/20 text-muted hover:text-divine'
              }`}
            >
              <Shield size={14} />
              {config.sandbox_mode ? 'Sandbox Active' : 'Live Production'}
            </button>

            <button 
              onClick={handleToggleAutopilot}
              className={`px-4 py-2.5 rounded-xl border text-xs tracking-widest font-semibold uppercase flex items-center gap-2 transition-all ${
                config.autopilot 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-gold' 
                  : 'bg-white/5 border-gold/20 text-muted hover:text-divine'
              }`}
            >
              <Radio size={14} className={config.autopilot ? 'animate-pulse' : ''} />
              {config.autopilot ? 'Autopilot: ON' : 'Autopilot: OFF'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gold/10 mb-10 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
          {[
            { id: 'overview', label: 'OVERVIEW & RUNS', icon: BarChart2 },
            { id: 'studio', label: 'AI CREATIVE STUDIO', icon: Sparkles },
            { id: 'queue', label: 'POSTS QUEUE', icon: Calendar },
            { id: 'settings', label: 'AGENT SETTINGS', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-4 border-b-2 text-xs tracking-widest font-semibold uppercase transition-all ${
                activeTab === tab.id 
                  ? 'border-gold text-gold bg-gold/5' 
                  : 'border-transparent text-muted hover:text-divine'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & RUNS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Status & Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] tracking-widest text-muted uppercase">Agent Status</span>
                <h3 className="font-display text-2xl text-divine mt-2 flex items-center gap-2">
                  Active & Idle
                </h3>
                <p className="text-xs text-muted mt-2">
                  Scheduler checks queue and autopilot triggers daily at {config.posting_hour}:00 AM.
                </p>
              </div>

              <div className="glass rounded-3xl p-6 hover:border-gold/30 transition-all">
                <span className="text-[10px] tracking-widest text-muted uppercase">Autopilot Activity</span>
                <h3 className="font-display text-2xl text-divine mt-2">
                  {posts.filter(p => p.status === 'published').length} Published
                </h3>
                <p className="text-xs text-muted mt-2">
                  Total automated postings dispatched successfully to Instagram feed.
                </p>
              </div>

              <div className="glass rounded-3xl p-6 hover:border-gold/30 transition-all">
                <span className="text-[10px] tracking-widest text-muted uppercase">Scheduled Queue</span>
                <h3 className="font-display text-2xl text-gold mt-2">
                  {posts.filter(p => p.status === 'scheduled').length} Pending
                </h3>
                <p className="text-xs text-muted mt-2">
                  Pre-designed posts sitting in queue waiting for scheduled release.
                </p>
              </div>

              <div className="glass rounded-3xl p-6 hover:border-gold/30 transition-all">
                <span className="text-[10px] tracking-widest text-muted uppercase">Estimated Reach</span>
                <h3 className="font-display text-2xl text-divine mt-2">
                  +12.4K Devotees
                </h3>
                <p className="text-xs text-muted mt-2">
                  Organic social impressions and store conversions generated by agent.
                </p>
              </div>

            </div>

            {/* Main Console & Trigger Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Autopilot Controller Console */}
              <div className="lg:col-span-2 glass rounded-3xl p-8 flex flex-col justify-between min-h-[400px]">
                <div>
                  <h3 className="font-display text-2xl text-divine mb-3 flex items-center gap-2">
                    <Radio size={18} className="text-emerald-400 animate-pulse" />
                    Agent Automation Console
                  </h3>
                  <p className="text-muted text-sm mb-6">
                    Launch a manual execution of the Autopilot Agent. The engine will inspect the Scheduled Queue for any pending posts and upload them. If the queue is empty and **Autopilot Mode** is toggled ON, it will autonomously pick a product, generate an organic post, and upload it instantly!
                  </p>

                  {/* Terminal Log Console */}
                  <div className="bg-black/90 rounded-2xl p-5 font-mono text-xs text-zinc-400 space-y-2 h-[220px] overflow-y-auto divine-border">
                    <p className="text-zinc-600">// Autopilot Agent Execution Logs</p>
                    {cronLogs.length === 0 ? (
                      <p className="text-zinc-500 italic">Terminal is idle. Click "Trigger Cron Cycle Now" to view logs.</p>
                    ) : (
                      cronLogs.map((log, i) => {
                        let colorClass = 'text-zinc-300';
                        if (log.includes('ERROR') || log.includes('failed')) colorClass = 'text-red-400 font-semibold';
                        if (log.includes('Successfully') || log.includes('succeeded') || log.includes('Success')) colorClass = 'text-emerald-400 font-semibold';
                        if (log.includes('Selected') || log.includes('Autopilot is ACTIVE')) colorClass = 'text-gold';
                        
                        return (
                          <p key={i} className={colorClass}>
                            🚀 {log}
                          </p>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={triggerCronJob}
                    disabled={runningCron}
                    className="bg-gold text-black font-semibold tracking-widest px-8 py-3.5 rounded-full text-xs uppercase flex items-center gap-2 hover:bg-gold-light transition-all shadow-gold disabled:opacity-50"
                  >
                    {runningCron ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Running Agent...
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        Trigger Cron Cycle Now
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-muted tracking-wide max-w-xs">
                    Simulates cron trigger `/api/instagram/cron`. Safe to trigger anytime.
                  </p>
                </div>
              </div>

              {/* Quick Autopilot Guide */}
              <div className="glass rounded-3xl p-8 border-dashed border border-gold/30 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-divine mb-4">Autopilot Posting Guide</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] text-gold font-bold flex-shrink-0 mt-0.5">1</div>
                      <p className="text-xs text-muted leading-relaxed">
                        Configure your **Gemini Key** in Settings so the agent can compose spiritual commentaries and selling captions.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] text-gold font-bold flex-shrink-0 mt-0.5">2</div>
                      <p className="text-xs text-muted leading-relaxed">
                        Enable **Autopilot Mode** at the top. The agent will run fully automated sweeps and draft posts on your behalf.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] text-gold font-bold flex-shrink-0 mt-0.5">3</div>
                      <p className="text-xs text-muted leading-relaxed">
                        Configure **Telegram Alerts**. Your phone will buzz with beautiful success cards every time a post goes live!
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] text-gold font-bold flex-shrink-0 mt-0.5">4</div>
                      <p className="text-xs text-muted leading-relaxed">
                        To automate this fully, set up a free GET cron trigger for <code>https://jaipurmurti.me/api/instagram/cron</code> using any online cron provider.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gold/10">
                  <div className="flex items-center gap-2 text-xs text-gold">
                    <Info size={14} />
                    <span>Using self-healing LocalStorage sandbox.</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: AI CREATIVE STUDIO */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Creative Options & Prompts */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="glass rounded-3xl p-6 space-y-6">
                <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 flex items-center gap-2">
                  <Sliders size={16} className="text-gold" />
                  Compose Post Template
                </h3>

                {/* Product Catalog Dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-semibold">1. Select Highlight Product</label>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-sm text-divine"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.deity.split(' — ')[0]} — {p.name.slice(0, 32)}...
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone Select Grid */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-semibold">2. Choose Post Tone</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'spiritual', label: 'Devotional 🕉️' },
                      { id: 'elegant', label: 'Luxury Art 🏛️' },
                      { id: 'sales', label: 'Sales/Story ⚜️' },
                      { id: 'greeting', label: 'Greeting ✨' },
                    ].map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id as any)}
                        className={`px-3 py-3 rounded-xl border text-xs tracking-wider font-medium text-center flex items-center justify-center transition-all ${
                          selectedTone === tone.id 
                            ? 'bg-gold/10 border-gold text-gold font-bold shadow-sm' 
                            : 'bg-white/5 border-gold/10 text-muted hover:border-gold/30 hover:text-divine'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom User Instructions */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-semibold">3. Additional AI Prompt Guidelines</label>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Focus on the purity of White marble, wedding wishes, home mandir positive vibration, etc..."
                    rows={3}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                  />
                </div>

                <button
                  onClick={generateCaption}
                  disabled={generatingCaption}
                  className="w-full bg-gold text-black font-semibold tracking-widest py-3.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-gold disabled:opacity-50"
                >
                  {generatingCaption ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Gemini composing caption...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate Caption with AI
                    </>
                  )}
                </button>
              </div>

              {/* Graphic Canvas Controls */}
              <div className="glass rounded-3xl p-6 space-y-4">
                <h3 className="font-display text-lg text-divine border-b border-gold/10 pb-2 flex items-center gap-2">
                  <Layers size={16} className="text-gold" />
                  Procedural Canvas Editor
                </h3>

                {/* Title and Subtitle */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-wider text-muted uppercase">Main Title</label>
                    <input 
                      type="text" 
                      value={canvasTitle} 
                      onChange={e => setCanvasTitle(e.target.value)}
                      className="w-full bg-bg-2 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-divine" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-wider text-muted uppercase">Subtitle</label>
                    <input 
                      type="text" 
                      value={canvasSubtitle} 
                      onChange={e => setCanvasSubtitle(e.target.value)}
                      className="w-full bg-bg-2 border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-divine" 
                    />
                  </div>
                </div>

                {/* Canvas Theme / Color */}
                <div className="space-y-1">
                  <label className="text-[9px] tracking-wider text-muted uppercase">Post Theme</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'charcoal', label: 'Dark Gold 🖤' },
                      { id: 'ivory', label: 'Sacred Ivory 🤍' },
                      { id: 'gold', label: 'Full Divine 💛' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setCanvasBg(t.id as any)}
                        className={`flex-1 px-2.5 py-1.5 border rounded-lg text-[10px] tracking-wide font-medium transition-all ${
                          canvasBg === t.id 
                            ? 'bg-gold/15 border-gold text-gold font-semibold' 
                            : 'bg-white/5 border-gold/10 text-muted hover:text-divine'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mandala Opacity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-muted uppercase">
                    <span>Mandala Complexity</span>
                    <span>{mandalaOpacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={mandalaOpacity}
                    onChange={e => setMandalaOpacity(parseInt(e.target.value))}
                    className="w-full accent-gold h-1 bg-bg-2 rounded-lg cursor-pointer" 
                  />
                </div>

                {/* Border Width */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-muted uppercase">
                    <span>Border Thickness</span>
                    <span>{borderWidth}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="40" 
                    value={borderWidth}
                    onChange={e => setBorderWidth(parseInt(e.target.value))}
                    className="w-full accent-gold h-1 bg-bg-2 rounded-lg cursor-pointer" 
                  />
                </div>

                <div className="hidden">
                  <canvas ref={canvasRef} />
                </div>

                <button 
                  onClick={drawCanvas}
                  className="w-full border border-gold/30 hover:bg-gold/5 text-gold font-medium py-2 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw size={12} />
                  Re-Render Canvas Graphic
                </button>

              </div>

            </div>

            {/* Right Column: Live Instagram Feed iPhone Preview Mock */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* iPhone Mockup Frame */}
              <div className="glass rounded-[40px] p-4 border border-gold/20 shadow-2xl relative bg-black/95 max-w-[360px] mx-auto w-full aspect-[9/18.5] flex flex-col justify-between overflow-hidden">
                
                {/* Speaker/Camera Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-full z-30 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <div className="w-8 h-1 bg-zinc-800 rounded-full" />
                </div>

                <div className="flex-1 rounded-[32px] bg-bg overflow-hidden flex flex-col justify-between border border-zinc-900 pt-5">
                  
                  {/* Instagram Header Mock */}
                  <div className="flex items-center justify-between px-3.5 py-3 bg-white border-b border-zinc-100 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-red-500 to-purple-600 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display text-[9px] text-gold font-bold">JM</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-900 leading-none">jaipur_murti</span>
                        <span className="text-[8px] text-zinc-500 leading-none mt-0.5">Jaipur, Rajasthan</span>
                      </div>
                    </div>
                    <span className="text-zinc-600 text-sm font-bold tracking-tight">•••</span>
                  </div>

                  {/* Canvas Output Display */}
                  <div className="flex-1 bg-zinc-50 flex items-center justify-center relative aspect-square border-y border-zinc-100 overflow-hidden">
                    {canvasImageUrl ? (
                      <img src={canvasImageUrl} alt="Post preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6 text-zinc-400">
                        <ImageIcon size={32} className="mx-auto mb-2 opacity-40 animate-pulse" />
                        <span className="text-xs">Generating canvas graphic...</span>
                      </div>
                    )}
                  </div>

                  {/* Feed Interaction Mock */}
                  <div className="p-3.5 bg-white space-y-2.5 flex-shrink-0">
                    <div className="flex justify-between items-center text-zinc-800">
                      <div className="flex gap-4">
                        <span className="text-xl">❤️</span>
                        <span className="text-xl">💬</span>
                        <span className="text-xl">✈️</span>
                      </div>
                      <span className="text-xl">🔖</span>
                    </div>

                    <p className="text-[10px] font-bold text-zinc-800">Liked by 412 devotees and others</p>

                    {/* Scrolling Post Caption Preview */}
                    <div className="text-[10px] leading-relaxed text-zinc-800 h-[100px] overflow-y-auto pr-1">
                      <span className="font-bold mr-1.5">jaipur_murti</span>
                      <span className="whitespace-pre-line text-zinc-600 font-normal">
                        {generatedCaption || 'AI generated captions, Sanskrit chants, and brand tags will stream here in real-time...'}
                      </span>
                    </div>

                    <p className="text-[8px] text-zinc-400 uppercase tracking-wider font-semibold">1 minute ago</p>
                  </div>

                </div>
              </div>

              {/* Actions & Draft Preview */}
              <div className="glass rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 flex items-center gap-2">
                    <Eye size={16} className="text-gold" />
                    Refine Caption
                  </h3>
                  <textarea
                    value={generatedCaption}
                    onChange={(e) => setGeneratedCaption(e.target.value)}
                    placeholder="Generates dynamically... Feel free to polish or edit the final text here before publishing."
                    rows={12}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs leading-relaxed text-divine mt-4 focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSchedulePost}
                    disabled={!generatedCaption}
                    className="border border-gold/40 hover:bg-gold/5 text-gold font-semibold tracking-widest py-3.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Calendar size={14} />
                    Schedule Post
                  </button>

                  <button
                    onClick={handlePublishNow}
                    disabled={publishing || !generatedCaption}
                    className="bg-gold text-black font-semibold tracking-widest py-3.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-gold disabled:opacity-50"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Publish Now
                      </>
                    )}
                  </button>
                </div>

                {canvasImageUrl && (
                  <a
                    href={canvasImageUrl}
                    download={`jaipur_murti_ig_${selectedProduct.id}.jpg`}
                    className="w-full border border-zinc-200 hover:bg-black/5 text-muted hover:text-divine font-semibold py-2.5 rounded-xl text-[10px] tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download size={12} />
                    Export High-Res JPG
                  </a>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 3: QUEUE MANAGER */}
        {activeTab === 'queue' && (
          <div className="space-y-8">
            
            {/* Scheduled Queue Section */}
            <div>
              <h3 className="font-display text-2xl text-divine mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-gold" />
                Scheduled Social Queue
              </h3>
              
              {posts.filter(p => p.status === 'scheduled').length === 0 ? (
                <div className="glass rounded-3xl p-12 text-center border-dashed border border-gold/20">
                  <Calendar size={48} className="mx-auto text-gold/30 mb-4" />
                  <h4 className="font-display text-xl text-divine mb-1">Queue is Currently Empty</h4>
                  <p className="text-muted text-xs max-w-sm mx-auto mb-6">
                    No posts are scheduled to go live. Design a new one in the AI Creative Studio or turn on Autopilot.
                  </p>
                  <button 
                    onClick={() => setActiveTab('studio')}
                    className="bg-gold text-black font-semibold px-6 py-3 rounded-full text-xs tracking-wider uppercase hover:bg-gold-light transition-all"
                  >
                    Create Post Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.filter(p => p.status === 'scheduled').map(post => (
                    <div key={post.id} className="glass rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-gold/30 transition-all">
                      <div className="aspect-square bg-zinc-900 relative overflow-hidden">
                        <img src={post.image_url} alt="Scheduled post" className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-semibold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest">
                          Scheduled
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-gold tracking-widest uppercase font-bold mb-2">
                            Deity: {post.deity || 'Sacred Idol'}
                          </p>
                          <p className="text-xs text-muted leading-relaxed line-clamp-3">
                            {post.caption}
                          </p>
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-gold/10 flex items-center justify-between">
                          <span className="text-[9px] text-zinc-500 font-medium">
                            Release: {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : 'Pending'}
                          </span>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-zinc-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Posting History & Logs Section */}
            <div>
              <h3 className="font-display text-2xl text-divine mb-4 flex items-center gap-2">
                <Instagram size={20} className="text-gold" />
                Dispatched Posting History
              </h3>

              {posts.filter(p => p.status !== 'scheduled').length === 0 ? (
                <div className="glass rounded-3xl p-8 text-center text-muted text-xs">
                  No posting history recorded. Trigger a run or complete a manual post to log history.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.filter(p => p.status !== 'scheduled').map(post => (
                    <div 
                      key={post.id}
                      className="glass rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gold/30 transition-all"
                    >
                      <div className="flex items-center gap-4 w-full md:w-3/5">
                        <div className="w-16 h-16 rounded-xl bg-zinc-900 overflow-hidden flex-shrink-0 border border-gold/10">
                          <img src={post.image_url} alt="History post" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-md text-divine">{post.deity || 'Sacred Collection'}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-bold tracking-widest ${
                              post.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted leading-relaxed line-clamp-1 mt-1">{post.caption}</p>
                          {post.error_message && (
                            <p className="text-[10px] text-red-400 mt-1 font-mono">⚠️ Error: {post.error_message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-2/5 justify-between md:justify-end">
                        <span className="text-[10px] text-zinc-500">
                          Date: {new Date(post.created_at).toLocaleString()}
                        </span>
                        
                        {post.post_id && (
                          <a 
                            href={config.sandbox_mode ? "https://instagram.com" : `https://instagram.com/p/${post.post_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold text-xs tracking-widest font-semibold flex items-center gap-1 hover:underline"
                          >
                            VIEW
                            <ChevronRight size={12} />
                          </a>
                        )}

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-zinc-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: AGENT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* AI and Telegram settings */}
            <div className="glass rounded-3xl p-8 space-y-6">
              <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                AI Content Engine
              </h3>

              {/* Gemini API Key */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Google Gemini API Key</label>
                <input
                  type="password"
                  value={config.gemini_api_key}
                  onChange={(e) => setConfig({ ...config, gemini_api_key: e.target.value })}
                  placeholder="AI Key: AIzaSy..."
                  className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                />
                <p className="text-[9px] text-muted">Secure server-side request calls. Kept fully confidential.</p>
              </div>

              <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 pt-4 flex items-center gap-2">
                <Bell size={16} className="text-gold" />
                Telegram Channels & Bot
              </h3>

              {/* Telegram Bot Token */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Telegram Bot Token</label>
                <input
                  type="text"
                  value={config.telegram_bot_token}
                  onChange={(e) => setConfig({ ...config, telegram_bot_token: e.target.value })}
                  placeholder="Token: 8346174637:AA..."
                  className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                />
              </div>

              {/* Telegram Chat ID */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Telegram Chat ID</label>
                <input
                  type="text"
                  value={config.telegram_chat_id}
                  onChange={(e) => setConfig({ ...config, telegram_chat_id: e.target.value })}
                  placeholder="Chat ID: 5486753321"
                  className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                />
              </div>

              <button
                type="button"
                onClick={testTelegramConnection}
                disabled={testingTelegram}
                className="border border-gold/30 hover:bg-gold/5 text-gold font-medium py-2 px-5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {testingTelegram ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                Test Telegram Notification
              </button>
            </div>

            {/* Meta and Posting Settings */}
            <div className="glass rounded-3xl p-8 space-y-6">
              
              <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 flex items-center gap-2">
                <Instagram size={16} className="text-gold" />
                Meta Graph Integration
              </h3>

              <div className="space-y-4">
                {/* Insta Business ID */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Instagram Business Account ID</label>
                  <input
                    type="text"
                    value={config.insta_business_id}
                    onChange={(e) => setConfig({ ...config, insta_business_id: e.target.value })}
                    placeholder="Insta Account ID: 178414..."
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                  />
                </div>

                {/* Facebook Access Token */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Facebook Page Access Token</label>
                  <textarea
                    value={config.facebook_access_token}
                    onChange={(e) => setConfig({ ...config, facebook_access_token: e.target.value })}
                    placeholder="Meta Access Token: EAA..."
                    rows={4}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                  />
                  <p className="text-[9px] text-muted leading-relaxed">
                    Must possess <code>instagram_basic</code>, <code>instagram_content_publish</code>, and <code>pages_show_list</code> permissions.
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl text-divine border-b border-gold/10 pb-3 pt-2 flex items-center gap-2">
                <Sliders size={16} className="text-gold" />
                Autopilot Configurations
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Auto Post Hour */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Post Trigger Hour (24H)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={config.posting_hour}
                    onChange={(e) => setConfig({ ...config, posting_hour: parseInt(e.target.value) })}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                  />
                </div>

                {/* Brand Hashtags */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Base Brand Hashtags</label>
                  <input
                    type="text"
                    value={config.brand_hashtags}
                    onChange={(e) => setConfig({ ...config, brand_hashtags: e.target.value })}
                    className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                  />
                </div>
              </div>

              {/* Sanskrit Mantras List */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Mantra Bank (One per line)</label>
                <textarea
                  value={config.custom_mantras}
                  onChange={(e) => setConfig({ ...config, custom_mantras: e.target.value })}
                  rows={3}
                  className="w-full bg-bg-2 border border-gold/20 rounded-xl px-4 py-3 text-xs text-divine"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => saveSettings()}
                  disabled={savingSettings}
                  className="bg-gold text-black font-bold tracking-widest px-8 py-3.5 rounded-full text-xs uppercase hover:bg-gold-light transition-all shadow-gold disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
