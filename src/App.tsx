/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ArrowUp, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Wallet,
  Clock,
  ExternalLink,
  Smartphone,
  Watch,
  Headphones,
  SmartphoneIcon,
  ChevronRight,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types & Constants ---

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  badge?: 'HOT' | 'NEW';
  category: string;
  icon: React.ReactNode;
}

const CATEGORIES = [
  { name: 'Luxury Watches', icon: '⌚', count: 120, id: 'watches' },
  { name: 'Caps & Hats', icon: '🧢', count: 85, id: 'caps' },
  { name: 'Bracelets', icon: '📿', count: 45, id: 'bracelets' },
  { name: 'Rings', icon: '💍', count: 32, id: 'rings' },
  { name: 'Wall Clocks', icon: '🕐', count: 15, id: 'clocks' },
  { name: 'Mobile Accessories', icon: '📱', count: 210, id: 'mobile' },
];

const BESTSELLERS: Product[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `best-${i}`,
  name: i % 2 === 0 ? "Rolex Submariner Gold Edition" : "Premium Steel Bracelet",
  price: 2500 + (i * 200),
  originalPrice: 3500 + (i * 200),
  rating: 4.5 + (Math.random() * 0.5),
  badge: i === 0 ? 'HOT' : undefined,
  category: i % 2 === 0 ? 'watches' : 'bracelets',
  icon: i % 2 === 0 ? <Watch className="w-12 h-12 text-brand-highlight" /> : <ShieldCheck className="w-12 h-12 text-brand-highlight" />
}));

const NEW_ARRIVALS: Product[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `new-${i}`,
  name: i === 0 ? "Smart Series Ultra 2" : "Vintage Wall Clock",
  price: 1800 + (i * 150),
  originalPrice: 2200 + (i * 150),
  rating: 5,
  badge: 'NEW',
  category: i === 0 ? 'mobile' : 'clocks',
  icon: i === 0 ? <Smartphone className="w-12 h-12 text-brand-highlight" /> : <Clock className="w-12 h-12 text-brand-highlight" />
}));

// --- Sub-components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 font-serif text-2xl md:text-4xl text-brand-secondary">
      {[
        { val: timeLeft.hours, label: 'HH' },
        { val: timeLeft.minutes, label: 'MM' },
        { val: timeLeft.seconds, label: 'SS' }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center bg-brand-highlight/5 px-4 py-2 rounded-lg border border-brand-highlight/10">
          <span className="font-bold">{format(item.val)}</span>
          <span className="text-[10px] tracking-widest font-sans opacity-60">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-brand-bg border border-brand-highlight/10 p-4 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-highlight/40 hover:shadow-[0_15px_40px_rgba(165,42,42,0.1)]"
    >
      {product.badge && (
        <div className={cn(
          "absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold tracking-tighter text-white rounded-full",
          product.badge === 'HOT' ? 'accent-gradient' : 'bg-brand-secondary text-white'
        )}>
          {product.badge}
        </div>
      )}
      
      <div className="aspect-square bg-brand-secondary/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:bg-brand-secondary/10 transition-colors">
        <div className="animate-float">
          {product.icon}
        </div>
      </div>
      
      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3 h-3 fill-brand-highlight stroke-brand-highlight", i >= Math.floor(product.rating) && "opacity-30")} />
          ))}
          <span className="text-[10px] text-brand-text opacity-60 ml-1">({product.rating.toFixed(1)})</span>
        </div>
        <h3 className="text-lg leading-tight group-hover:text-brand-highlight transition-colors text-brand-secondary font-serif">{product.name}</h3>
        <div className="flex items-center justify-center gap-2 pt-1 font-serif">
          <span className="text-brand-highlight text-xl">Rs. {product.price.toLocaleString()}</span>
          <span className="text-brand-text/50 text-sm line-through">Rs. {product.originalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
        <button 
          onClick={onAddToCart}
          className="flex-1 accent-gradient text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Cart
        </button>
        <button className="bg-brand-highlight/10 text-brand-highlight p-2 rounded-lg border border-brand-highlight/20 hover:bg-brand-highlight/20 transition-all">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section
      const sections = ['home', 'shop', 'categories', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = useCallback(() => {
    setCartCount(prev => prev + 1);
    setToast("Added to cart!");
    setTimeout(() => setToast(null), 3000);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-highlight selection:text-brand-bg">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] accent-gradient text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-4">
        <motion.a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.3)] animate-pulse"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.a>
      </div>

      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-[90] w-12 h-12 glass-effect text-brand-highlight rounded-full flex items-center justify-center hover:bg-brand-highlight hover:text-brand-bg transition-all shadow-lg"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky Navigation */}
      <header className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
        isScrolled ? "bg-brand-bg/95 backdrop-blur-xl py-3 border-b border-brand-highlight/10 shadow-sm" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-3xl text-brand-highlight">♛</span>
            <span className="text-xl md:text-2xl font-serif tracking-tight text-brand-secondary uppercase">
              Prince <span className="text-brand-highlight">Mobile</span> & AH Store
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={cn(
                  "relative text-sm font-medium tracking-widest uppercase transition-all duration-300 py-1",
                  activeSection === item.toLowerCase() ? "text-brand-highlight" : "text-brand-text opacity-70 hover:opacity-100"
                )}
              >
                {item}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[1px] bg-brand-highlight transition-all duration-300",
                  activeSection === item.toLowerCase() ? "w-full" : "w-0"
                )} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-brand-text hover:text-brand-highlight transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="relative cursor-pointer group">
              <ShoppingBag className="w-5 h-5 text-brand-text group-hover:text-brand-highlight transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-highlight text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-brand-text hover:text-brand-highlight transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full glass-effect py-6 overflow-hidden border-b border-brand-highlight/10 shadow-2xl"
            >
              <div className="container mx-auto px-6">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for premium accessories..." 
                    className="w-full bg-transparent border-b-2 border-brand-highlight/20 focus:border-brand-highlight outline-none py-4 text-2xl font-serif text-brand-secondary placeholder:text-brand-text/30"
                    autoFocus
                  />
                  <X 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-brand-text/50 cursor-pointer hover:text-brand-highlight" 
                    onClick={() => setIsSearchOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-secondary/80 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-brand-bg border-l border-brand-highlight/10 z-[120] p-10 flex flex-col gap-10 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl text-brand-highlight">♛</span>
                <X className="w-8 h-8 text-brand-secondary" onClick={() => setIsMenuOpen(false)} />
              </div>
              <nav className="flex flex-col gap-6 text-2xl font-serif">
                {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="text-left py-2 border-b border-brand-highlight/5 text-brand-secondary hover:text-brand-highlight transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <div className="mt-auto flex gap-6 text-brand-highlight">
                <Instagram className="w-6 h-6" />
                <Facebook className="w-6 h-6" />
                <MessageCircle className="w-6 h-6" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-bg">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(165,42,42,0.05)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]" />
            
            {/* Sparkles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-brand-highlight rounded-full animate-sparkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.3
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 lg:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-brand-highlight tracking-[0.4em] uppercase text-sm font-semibold"
                  >
                    Est. 2022 • Rawalpindi
                  </motion.span>
                  <h1 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] font-serif text-brand-secondary">
                    Wear The <br />
                    <span className="accent-text-gradient italic">Crown</span>
                  </h1>
                </div>
                
                <p className="text-lg md:text-xl text-brand-text opacity-70 max-w-lg leading-relaxed font-body">
                  Elevate your lifestyle with the finest selection of premium men&apos;s accessories. From luxury timepieces to contemporary tech.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => scrollTo('shop')}
                    className="accent-gradient text-white font-bold py-5 px-10 rounded-full text-lg tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_40px_rgba(165,42,42,0.2)]"
                  >
                    SHOP NOW
                  </button>
                  <button className="border-2 border-brand-highlight text-brand-highlight font-bold py-5 px-10 rounded-full text-lg tracking-widest hover:bg-brand-highlight hover:text-white transition-all">
                    VIEW CATALOGUE
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="hidden lg:flex justify-center items-center relative h-[600px]"
              >
                <div className="absolute inset-0 bg-brand-highlight/5 blur-[120px] rounded-full animate-accent-glow" />
                <div className="relative z-10 group animate-float">
                  <div className="w-[500px] h-[500px] bg-gradient-to-br from-brand-highlight/20 to-transparent p-1 rounded-full overflow-hidden backdrop-blur-sm border border-brand-highlight/20">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <Watch className="w-64 h-64 text-brand-highlight group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
                    </div>
                  </div>
                  {/* Decorative orbital elements */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 glass-effect rounded-full flex items-center justify-center animate-bounce shadow-xl">
                    <Star className="w-10 h-10 text-brand-highlight fill-brand-highlight" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section id="categories" className="py-24 bg-brand-bg relative border-t border-brand-highlight/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-6xl uppercase tracking-[0.1em] text-brand-secondary">Browse Collections</h2>
              <div className="h-1 w-24 accent-gradient mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative bg-brand-secondary/5 border border-brand-highlight/5 p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 cursor-pointer hover:border-brand-highlight/30 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-highlight/5 blur-3xl group-hover:bg-brand-highlight/10 transition-all" />
                  <span className="text-6xl md:text-8xl group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-serif text-brand-secondary">{cat.name}</h3>
                    <p className="text-brand-text opacity-50 text-sm uppercase tracking-widest">{cat.count} ITEMS</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section id="shop" className="py-24 bg-brand-bg">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl text-brand-secondary">Bestsellers</h2>
                <p className="text-brand-text opacity-50 uppercase tracking-widest text-sm">Most popular pieces this month</p>
              </div>
              <div className="h-1 w-24 accent-gradient invisible md:visible" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {BESTSELLERS.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="relative py-20 bg-brand-bg overflow-hidden border-y border-brand-highlight/5">
          <div className="absolute inset-0 accent-gradient opacity-5" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="glass-effect p-12 md:p-20 rounded-[3rem] border-brand-highlight/10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left bg-white/60">
              <div className="space-y-6 max-w-2xl">
                <div className="inline-block px-4 py-1 bg-brand-highlight/10 text-brand-highlight text-xs font-bold tracking-[0.3em] uppercase rounded-full">
                  Flash Sale • Limited Time
                </div>
                <h2 className="text-4xl md:text-7xl font-serif text-brand-secondary">
                  Free Delivery <br />
                  <span className="text-brand-highlight italic">Across Pakistan</span>
                </h2>
                <p className="text-xl text-brand-text opacity-70">On all orders above Rs. 2,000. Shop premium now.</p>
                <button className="accent-gradient text-white font-bold py-4 px-12 rounded-full text-lg tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl">
                  CLAIM DEAL
                </button>
              </div>

              <div className="space-y-6 flex flex-col items-center">
                <p className="text-brand-secondary uppercase tracking-[0.3em] text-sm font-bold opacity-40">Ends In</p>
                <CountdownTimer />
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-24 bg-brand-bg">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-brand-highlight uppercase tracking-[0.4em] text-xs font-bold">Latest Collections</span>
              <h2 className="text-4xl md:text-6xl text-brand-secondary">New Arrivals</h2>
              <div className="h-1 w-24 accent-gradient mx-auto" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {NEW_ARRIVALS.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-brand-bg border-y border-brand-highlight/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                { icon: <ShieldCheck />, title: "100% Authentic", desc: "Genuine Brand Products" },
                { icon: <Truck />, title: "Fast Delivery", desc: "Across Pakistan" },
                { icon: <Wallet />, title: "Cash on Delivery", desc: "Available Nationwide" },
                { icon: <RotateCcw />, title: "7-Day Returns", desc: "Easy Return Policy" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-highlight/5 flex items-center justify-center text-brand-highlight group-hover:bg-brand-highlight group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-serif text-brand-secondary">{item.title}</h4>
                    <p className="text-sm text-brand-text opacity-60 font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-24 bg-brand-bg overflow-hidden">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl text-center mb-16 text-brand-secondary">The Royal Voice</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                { name: "Ahmed Khan", city: "Lahore", text: "Truly premium quality. The watch exceeded my expectations. Fast delivery too!" },
                { name: "Sania Malik", city: "Rawalpindi", text: "Best mobile accessories store in Pindi. Have been a customer for 2 years." },
                { name: "Zia Sheikh", city: "Karachi", text: "Ordered a wall clock and a bracelet. Both items are top notch. High-end packaging!" }
              ].map((rev, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-brand-secondary/5 p-10 rounded-3xl border border-brand-highlight/5 flex flex-col justify-between"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-highlight stroke-brand-highlight" />
                    ))}
                  </div>
                  <p className="text-xl italic font-serif leading-relaxed text-brand-text mb-8">
                    &quot;{rev.text}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center text-white font-bold text-xl">
                      {rev.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-brand-secondary">{rev.name}</p>
                      <p className="text-xs text-brand-text opacity-50 uppercase tracking-widest">{rev.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-brand-bg relative overflow-hidden border-t border-brand-highlight/5">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-brand-highlight uppercase tracking-[0.4em] text-xs font-bold">Our Story</span>
                  <h2 className="text-5xl md:text-7xl text-brand-secondary">About Prince Store</h2>
                </div>
                <div className="space-y-6 text-xl text-brand-text opacity-80 leading-relaxed font-body">
                  <p>
                    Founded in the heart of Rawalpindi, <span className="text-brand-secondary font-bold">Prince Mobile & AH Store</span> has grown from a local shop to a national symbol of premium accessories and luxury lifestyle.
                  </p>
                  <p>
                    Our curated collection of watches, jewelry, and tech accessories is sourced globally to ensure our customers in Pakistan have access to the absolute best. We believe that style is a reflection of personality, and every piece we sell is meant to empower that identity.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
                  {[
                    { label: "Products", val: "500+" },
                    { label: "Happy Clients", val: "10k+" },
                    { label: "Experience", val: "3+ Yrs" }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-3xl md:text-4xl font-serif text-brand-highlight">{stat.val}</p>
                      <p className="text-xs text-brand-text opacity-50 uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-brand-highlight/10">
                  <div className="w-full h-full bg-brand-secondary/5 flex items-center justify-center group overflow-hidden">
                    <span className="text-9xl text-brand-highlight/10 group-hover:scale-150 transition-transform duration-[3000ms]">♛</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                    <div className="absolute bottom-10 left-10 text-brand-secondary font-serif text-3xl">
                      Excellence & <br /> <span className="italic">Reliability</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-highlight flex flex-col items-center justify-center rounded-3xl text-white p-6 shadow-2xl animate-float">
                  <Star className="w-10 h-10 mb-2" />
                  <p className="text-center font-bold text-sm">Voted Best Boutique Store in Pindi 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-brand-bg border-t border-brand-highlight/5">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-3xl md:text-5xl text-brand-secondary">@PrinceMobileAH</h2>
              <button className="flex items-center gap-2 text-brand-highlight hover:underline">
                Follow on Instagram <Instagram className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-brand-secondary/5 rounded-xl flex items-center justify-center group cursor-pointer overflow-hidden relative border border-brand-highlight/5">
                  <Camera className="w-10 h-10 text-brand-highlight opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                  <div className="absolute inset-0 bg-brand-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp CTA Section */}
        <section id="contact" className="py-24 bg-brand-bg relative border-t border-brand-highlight/5">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto glass-effect p-16 rounded-[4rem] border-brand-highlight/20 relative overflow-hidden bg-brand-bg">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-600/5 blur-[100px]" />
              <div className="space-y-8 relative z-10">
                <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(22,163,74,0.2)] animate-pulse">
                  <MessageCircle className="w-12 h-12" />
                </div>
                <h2 className="text-4xl md:text-7xl leading-tight text-brand-secondary">Order Directly Via <br /> <span className="text-green-600">WhatsApp</span></h2>
                <p className="text-brand-text opacity-70 text-xl">Fast, Easy, Trusted. Our experts reply within minutes to assist you with your purchase.</p>
                <div className="pt-6">
                  <a 
                    href="https://wa.me/923001234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-green-600 text-white font-bold py-6 px-12 rounded-full text-2xl hover:bg-green-500 transition-all active:scale-95 shadow-xl"
                  >
                    CHAT WITH US NOW
                  </a>
                  <p className="mt-6 text-brand-text opacity-40 uppercase tracking-[0.2em] text-xs">Mon - Sat: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-bg pt-24 pb-12 border-t border-brand-highlight/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl text-brand-highlight">♛</span>
                <span className="text-2xl font-serif tracking-tight text-brand-secondary uppercase">Prince Store</span>
              </div>
              <p className="text-brand-text opacity-70 text-lg leading-relaxed">
                Rawalpindi&apos;s most trusted destination for premium men&apos;s accessories. Quality that speaks royalty.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, MessageCircle].map((Icon, idx) => (
                  <button key={idx} className="w-11 h-11 rounded-full glass-effect flex items-center justify-center text-brand-secondary hover:bg-brand-highlight hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-brand-highlight uppercase tracking-[0.2em] text-sm font-bold">Quick Links</h4>
              <ul className="space-y-4 text-brand-text opacity-70 font-medium">
                {['Home', 'Shop', 'Categories', 'About Us', 'Contact', 'FAQs'].map(link => (
                  <li key={link}>
                    <button className="hover:text-brand-highlight transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-brand-highlight uppercase tracking-[0.2em] text-sm font-bold">Collections</h4>
              <ul className="space-y-4 text-brand-text opacity-70 font-medium">
                {['Luxury Watches', 'Men\'s Rings', 'Bracelets', 'Caps & Hats', 'Wall Clocks', 'Tech Gear'].map(link => (
                  <li key={link}>
                    <button className="hover:text-brand-highlight transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-brand-highlight uppercase tracking-[0.2em] text-sm font-bold">Find Us</h4>
              <div className="space-y-6 text-brand-text opacity-70 font-medium">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-brand-highlight"><ArrowUp className="w-5 h-5 rotate-45" /></div>
                  <p>Shop #42, Prince Mall, Rawalpindi, Punjab, Pakistan</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-brand-highlight"><MessageCircle className="w-5 h-5" /></div>
                  <p>+92 300 1234567</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-brand-highlight"><Star className="w-5 h-5" /></div>
                  <p>info@princemobileah.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-highlight/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-brand-text opacity-50 text-sm">
              © 2025 <span className="text-brand-highlight">Prince Mobile & AH Store</span>. All rights reserved.
            </p>
            <div className="flex gap-8 text-brand-text opacity-40 text-xs uppercase tracking-widest font-bold">
              <button className="hover:text-brand-highlight">Privacy Policy</button>
              <button className="hover:text-brand-highlight">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
