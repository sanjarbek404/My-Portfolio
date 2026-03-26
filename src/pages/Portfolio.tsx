import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence, useInView, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, ArrowRight, Code, Globe, Zap, Layers, Moon, Sun, Award, ExternalLink, Briefcase, MonitorSmartphone, Server, PenTool, GraduationCap, Lock, FileText, Terminal, Coffee, Users, Star, ArrowUpRight, Send, Instagram, Copy, Check } from 'lucide-react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, increment, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-black flex items-center justify-center"
    >
      <div className="overflow-hidden flex gap-2 md:gap-4">
        <motion.span
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl font-display font-bold text-[#1d1d1f] dark:text-white tracking-tighter uppercase"
        >
          Sanjarbek
        </motion.span>
        <motion.span
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-400 dark:text-gray-600 tracking-tighter uppercase"
        >
          Otabekov
        </motion.span>
      </div>
    </motion.div>
  );
};



const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#1d1d1f] dark:bg-white origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};




const TextReveal = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

const FloatingNav = ({ isDark, toggleDark }: { isDark: boolean, toggleDark: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('UZ');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(prev => prev === 'UZ' ? 'EN' : 'UZ');
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] transition-colors duration-500">
        <div className="absolute inset-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF4E00]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      </div>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] md:w-auto`}
      >
        <div className={`flex justify-between items-center gap-4 md:gap-8 transition-all duration-500 bg-white/70 dark:bg-[#1d1d1f]/70 backdrop-blur-xl px-6 py-3 rounded-full border border-black/5 dark:border-white/10 shadow-2xl shadow-black/5`}>

          <a href="#" className="text-lg font-bold tracking-tighter text-[#1d1d1f] dark:text-white flex items-center justify-center w-10 h-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1d1d1f] dark:text-white">
              <path d="M17 15.5C17 17.5 15.5 19 12 19C8.5 19 7 17.5 7 15.5M7 8.5C7 6.5 8.5 5 12 5C15.5 5 17 6.5 17 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8.5C17 10.5 15.5 12 12 12C8.5 12 7 13.5 7 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>


          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#86868b] dark:text-white/70">
            <a href="#about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Men</a>
            <a href="#skills" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Ko'nikmalar</a>
            <a href="#projects" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Loyihalar</a>
            <a href="#experience" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Tajriba</a>
            <Link to="/cv-builder" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors flex items-center gap-1"><FileText size={14} /> CV</Link>
          </div>

          <div className="flex items-center gap-3">

            <button onClick={toggleLang} className="text-xs font-bold text-[#1d1d1f] dark:text-white px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              {lang}
            </button>

            <button onClick={toggleDark} className="p-2 rounded-full text-[#1d1d1f] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>


            <Link to="/login" className="p-2 rounded-full text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center" title="Admin Panel">
              <Lock size={16} />
            </Link>


            <a href="#contact" className="text-xs font-bold uppercase tracking-wider bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] px-5 py-2.5 rounded-full transition-transform flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Aloqa
            </a>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#1d1d1f] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transition-transform origin-left ${isMobileMenuOpen ? 'rotate-45 translate-x-px' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-transform origin-left ${isMobileMenuOpen ? '-rotate-45 translate-x-px' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl pt-32 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Men</a>
              <a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Ko'nikmalar</a>
              <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Loyihalar</a>
              <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Tajriba</a>
              <Link to="/cv-builder" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-[#1d1d1f] dark:text-white flex items-center justify-center gap-2"><FileText size={24} /> CV Builder</Link>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] px-8 py-4 rounded-full font-bold uppercase tracking-wider mx-auto shadow-lg">
                Aloqa
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LocalTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-mono text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-md w-max">
      <Globe size={14} className="animate-pulse text-blue-500" />
      <span>Tashkent, UZ</span>
      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-1"></span>
      <span>
        {time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Tashkent'
        })}
      </span>
    </div>
  );
};

const Hero = ({ settings }: { settings: any }) => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(doc(db, 'settings', 'hero'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().image) {
          setHeroImage(docSnap.data().image);
        } else {
          setHeroImage(null);
        }
      });
      return () => unsub();
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings?.email || 'sanjarbekotabekov010@gmail.com');
    setCopied(true);
    toast.success("Email nusxalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center overflow-hidden">
      <div className="w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div style={{ y: y1 }} className="flex-1 flex flex-col items-start text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/20 w-max">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Hozirda o`z ustimda Ishlayapman
              </div>
              <LocalTime />
            </motion.div>

            <TextReveal>
              <h1 className="text-[14vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] font-display font-bold tracking-tighter uppercase text-[#1d1d1f] dark:text-white mb-6">
                Sanjarbek <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E00] to-orange-400">Otabekov.</span>
              </h1>
            </TextReveal>

            <div className="flex flex-col gap-10 w-full mt-8 items-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl font-light tracking-tight text-[#86868b] dark:text-gray-400 max-w-2xl leading-relaxed"
              >
                Men raqamli mahsulotlar yaratuvchi Creative Developer va UI dizaynerman. Minimalizm va yuqori unumdorlikni birlashtiraman.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center"
              >

                <a href="#projects" className="group relative overflow-hidden bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Loyihalarni ko'rish
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>

                {settings?.resume && (
                  <a href={settings.resume} target="_blank" rel="noreferrer" className="group relative overflow-hidden bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/10 px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md hover:-translate-y-1">
                    <FileText size={18} />
                    CV Yuklab olish
                  </a>
                )}

                <div className="flex justify-center gap-4 ml-0 sm:ml-4">
                  <button onClick={handleCopyEmail} className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all" title="Email nusxalash">
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                  {settings?.github && (

                    <a href={settings.github} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                      <Github size={20} />
                    </a>

                  )}
                  {settings?.linkedin && (

                    <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                      <Linkedin size={20} />
                    </a>

                  )}
                  {settings?.telegram && (

                    <a href={settings.telegram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                      <Send size={20} />
                    </a>

                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 rounded-full blur-[60px] animate-pulse"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 dark:border-white/10 shadow-2xl">
              <img
                src={heroImage || ""}
                alt="Sanjarbek Otabekov"
                className="w-full h-full object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#1d1d1f] dark:text-white"
      >
        <ArrowRight className="rotate-90" size={24} />
      </motion.div>
    </section>
  );
};

const Marquee = () => {
  const items = [
    "CREATIVE DEVELOPER", "UI/UX DESIGNER", "FRONTEND ENGINEER", "FULLSTACK ARCHITECT",
    "CREATIVE DEVELOPER", "UI/UX DESIGNER", "FRONTEND ENGINEER", "FULLSTACK ARCHITECT"
  ];

  return (
    <div className="py-6 bg-[#1d1d1f] dark:bg-white overflow-hidden flex whitespace-nowrap transform -rotate-2 scale-110 shadow-xl z-20 relative">
      <motion.div
        className="flex gap-8 items-center px-4"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-3xl md:text-5xl font-display font-bold text-white dark:text-[#1d1d1f] tracking-tighter uppercase opacity-90">
              {item}
            </span>
            <Star className="text-[#FF4E00] fill-[#FF4E00]" size={24} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};



const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-50"
        >

          <button
            onClick={scrollToTop}
            className="w-14 h-14 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-full flex items-center justify-center shadow-lg transition-transform"
          >
            <ArrowRight className="-rotate-90" size={24} />
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BentoGrid = ({ settings }: { settings: any }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextReveal>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase">Men haqimda</h2>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-[2rem] p-10 flex flex-col justify-between group transition-transform duration-500 border border-black/5 dark:border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 transition-transform duration-500 text-[#1d1d1f] dark:text-white">
              <Layers size={200} />
            </div>
            <div className="relative z-10">
              <Layers className="text-[#1d1d1f] dark:text-white mb-8" size={40} strokeWidth={1.5} />
              <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] dark:text-white mb-6 tracking-tight">Sodda. Kreativ. Samarali.</h3>
              <p className="text-[#86868b] dark:text-gray-400 leading-relaxed text-lg md:text-xl font-light">
                Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir. Har bir loyihada minimalizm va yuqori unumdorlikni birinchi o'ringa qo'yaman.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 md:row-span-1 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-[2rem] p-8 relative overflow-hidden border border-black/5 dark:border-white/5"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform duration-500 text-[#1d1d1f] dark:text-white">
              <Globe size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white mb-4">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-sm text-[#86868b] dark:text-gray-400 font-medium tracking-widest uppercase mb-2">Joylashuv</p>
                <p className="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Toshkent, UZ</p>
                <p className="text-sm text-[#86868b] dark:text-gray-400 mt-2 font-mono">
                  {time.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 bg-[#1d1d1f] dark:bg-white rounded-[2rem] p-8 relative overflow-hidden text-white dark:text-[#1d1d1f]"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-500">
              <Zap size={140} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-full border border-white/20 dark:border-black/10 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-6xl font-display font-bold tracking-tighter mb-2">1+</p>
                <p className="opacity-80 font-medium tracking-widest uppercase text-sm">Yillik tajriba</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 md:row-span-1 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-[2rem] p-8 flex flex-col justify-between border border-black/5 dark:border-white/5"
          >
            <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white mb-4">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">Rezyume</h3>
              {settings?.resume ? (
                <a href={settings.resume} target="_blank" rel="noreferrer" className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Yuklab olish <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="text-sm text-gray-400">Tez orada...</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 md:row-span-1 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-[2rem] p-8 flex flex-col justify-between border border-black/5 dark:border-white/5"
          >
            <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white mb-4">
              <Terminal size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">Stack</h3>
              <p className="text-sm text-[#86868b] dark:text-gray-400">React, Node.js, TypeScript, Tailwind</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SkillsAndCerts = () => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsubscribe = onSnapshot(collection(db, 'skills'), (snapshot) => {
        setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <section id="skills" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-4">Ko'nikmalar</h2>
          </TextReveal>
          <p className="text-xl text-[#86868b] dark:text-gray-400 max-w-2xl font-light">Mening texnologik steyim va ishlash qurollarim.</p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
            Hali ko'nikmalar qo'shilmagan.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-4 aspect-square"
              >
                <span className="text-4xl filter drop-shadow-lg">{skill.icon || '⚡'}</span>
                <span className="font-bold text-[#1d1d1f] dark:text-white tracking-tight text-center">{skill.name}</span>
                <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#1d1d1f] dark:bg-white rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    { id: '01', title: 'Web Dasturlash', desc: 'Zamonaviy, tezkor va xavfsiz web ilovalar yaratish. React, Node.js va boshqa ilg\'or texnologiyalar yordamida.', icon: <Code size={32} /> },
    { id: '02', title: 'UI/UX Dizayn', desc: 'Foydalanuvchilar uchun qulay va chiroyli interfeyslar yaratish. Figma va zamonaviy dizayn trendlari asosida.', icon: <PenTool size={32} /> },
    { id: '03', title: 'Mobil Moslashuv', desc: 'Barcha qurilmalarda mukammal ishlaydigan responsiv dizaynlar. Smartfon va planshetlar uchun optimizatsiya.', icon: <MonitorSmartphone size={32} /> },
    { id: '04', title: 'Backend & API', desc: 'Mustahkam va xavfsiz server qismini yaratish. RESTful API va ma\'lumotlar bazasi arxitekturasi.', icon: <Server size={32} /> }
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-4">Xizmatlar</h2>
          </TextReveal>
          <p className="text-xl text-[#86868b] dark:text-gray-400 max-w-2xl font-light">Loyiha uchun kerak bo'ladigan barcha texnik yechimlar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md p-10 rounded-[2rem] border border-black/5 dark:border-white/5"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="text-[#1d1d1f] dark:text-white transition-colors">
                  {service.icon}
                </div>
                <span className="text-2xl font-display font-bold text-black/10 dark:text-white/10/20 transition-colors">
                  {service.id}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-4 tracking-tight">{service.title}</h3>
              <p className="text-[#86868b] dark:text-gray-400/70 font-light leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkflowSection = () => {
  const steps = [
    { id: '01', title: 'Tahlil va Rejalashtirish', desc: 'Loyiha talablarini o\'rganish, maqsadlarni belgilash va texnik yechimlarni tanlash.' },
    { id: '02', title: 'Dizayn va Prototip', desc: 'Foydalanuvchi interfeysi (UI) va tajribasi (UX) dizaynini yaratish, interaktiv prototiplar tayyorlash.' },
    { id: '03', title: 'Dasturlash', desc: 'Tasdiqlangan dizayn asosida frontend va backend qismlarini kodlash, ma\'lumotlar bazasini ulash.' },
    { id: '04', title: 'Testlash va Ishga tushirish', desc: 'Barcha funksiyalarni tekshirish, xatoliklarni to\'g\'rilash va loyihani ommaga taqdim etish.' }
  ];

  return (
    <section className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-4">Ish Jarayoni</h2>
          </TextReveal>
          <p className="text-xl text-[#86868b] dark:text-gray-400 max-w-2xl font-light">G'oyadan tortib tayyor mahsulotgacha bo'lgan yo'l.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md p-8 rounded-[2rem] border border-black/5 dark:border-white/5"
            >
              <div className="text-5xl font-display font-bold text-black/5 dark:text-white/5 mb-6">{step.id}</div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-3 tracking-tight">{step.title}</h3>
              <p className="text-[#86868b] dark:text-gray-400 font-light leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = ({ settings }: { settings: any }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projData);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <section id="projects" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <TextReveal>
              <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-4">Loyihalar</h2>
            </TextReveal>
            <p className="text-xl text-[#86868b] dark:text-gray-400 max-w-2xl font-light">Dizayn va kodning mukammal uyg'unligi orqali yaratilgan eng yaxshi ishlarim.</p>
          </div>
          <a href={settings?.github || "https://github.com"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white transition-opacity">
            Barcha loyihalar <ArrowUpRight size={18} />
          </a>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Yuklanmoqda...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
            Hali loyihalar qo'shilmagan.
          </div>
        ) : (
          <div className="space-y-32">
            {projects.map((project, index) => (

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  <div className={`lg:col-span-7 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-[2rem] overflow-hidden bg-white/80 dark:bg-[#111]/80 backdrop-blur-md aspect-[4/3]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                  </div>

                  <div className={`lg:col-span-5 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-xs font-bold tracking-widest uppercase text-[#86868b] dark:text-gray-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="h-px w-12 bg-black/20 dark:bg-white/20"></div>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#1d1d1f] dark:text-white">
                        {project.tag}
                      </span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-display font-bold text-[#1d1d1f] dark:text-white mb-6 tracking-tight">{project.title}</h3>
                    <p className="text-lg text-[#86868b] dark:text-gray-400 mb-10 leading-relaxed font-light">{project.desc}</p>

                    <div className="flex flex-wrap items-center gap-6">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white bg-[#FF4E00] px-6 py-3 rounded-full transition-transform shadow-lg">
                          Ko'rish <ArrowUpRight size={16} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/20 px-6 py-3 rounded-full transition-colors">
                          <Github size={16} /> Kod
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { id: 1, name: 'Azizbek Rahimov', role: 'CEO, TechStart', text: 'Sanjarbek bilan ishlash juda oson kechdi. U bizning talablarimizni tez tushundi va ajoyib veb-ilova yaratib berdi.', rating: 5 },
    { id: 2, name: 'Malika Karimova', role: 'Marketing Menejer', text: 'Dizayn va funksionallik uyg\'unligi ajoyib. Saytimizning konversiya darajasi sezilarli darajada oshdi.', rating: 5 },
    { id: 3, name: 'Sardor Aliyev', role: 'Startup Asoschisi', text: 'O\'z ishining ustasi. Murakkab muammolarga oddiy va samarali yechimlar topa oladi. Tavsiya qilaman!', rating: 5 }
  ];

  return (
    <section className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <TextReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-4">Mijozlar Fikri</h2>
          </TextReveal>
          <p className="text-xl text-[#86868b] dark:text-gray-400 max-w-2xl font-light">Men bilan ishlagan insonlar nima deydi?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md p-10 rounded-[2rem] border border-black/5 dark:border-white/5"
            >
              <div className="flex gap-1 text-yellow-400 mb-8">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="text-[#1d1d1f] dark:text-gray-300 text-lg mb-10 italic font-light leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#1d1d1f] dark:text-white tracking-tight">{t.name}</h4>
                  <p className="text-sm text-[#86868b] dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceEducation = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsubExp = onSnapshot(collection(db, 'experiences'), (snapshot) => {
        setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
      });
      const unsubEdu = onSnapshot(collection(db, 'education'), (snapshot) => {
        setEducation(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
      });
      return () => { unsubExp(); unsubEdu(); };
    }
  }, []);

  return (
    <section id="experience" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Experience */}
        <div>
          <TextReveal>
            <h2 className="text-4xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-12 flex items-center gap-4">
              <Briefcase size={32} /> Tajriba
            </h2>
          </TextReveal>
          {experiences.length === 0 ? (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
              Hali tajribalar qo'shilmagan.
            </div>
          ) : (
            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8 border-l border-black/10 dark:border-white/10"
                >
                  <div className="absolute top-0 left-0 w-3 h-3 bg-[#FF4E00] rounded-full -translate-x-[6.5px] shadow-[0_0_10px_rgba(255,78,0,0.5)]"></div>
                  <div className="text-sm font-bold tracking-widest uppercase text-[#86868b] dark:text-gray-500 mb-2">{exp.year}</div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-1 tracking-tight">{exp.role}</h3>
                  <div className="text-lg text-[#1d1d1f] dark:text-white font-medium mb-4">{exp.company}</div>
                  <p className="text-[#86868b] dark:text-gray-400 font-light leading-relaxed">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <TextReveal>
            <h2 className="text-4xl font-display font-bold tracking-tighter text-[#1d1d1f] dark:text-white uppercase mb-12 flex items-center gap-4">
              <GraduationCap size={32} /> Ta'lim
            </h2>
          </TextReveal>
          {education.length === 0 ? (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
              Hali ta'lim ma'lumotlari qo'shilmagan.
            </div>
          ) : (
            <div className="space-y-12">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8 border-l border-black/10 dark:border-white/10"
                >
                  <div className="absolute top-0 left-0 w-3 h-3 bg-[#FF4E00] rounded-full -translate-x-[6.5px] shadow-[0_0_10px_rgba(255,78,0,0.5)]"></div>
                  <div className="text-sm font-bold tracking-widest uppercase text-[#86868b] dark:text-gray-500 mb-2">{edu.year}</div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-1 tracking-tight">{edu.degree}</h3>
                  <div className="text-lg text-[#1d1d1f] dark:text-white font-medium mb-4">{edu.institution}</div>
                  <p className="text-[#86868b] dark:text-gray-400 font-light leading-relaxed">{edu.desc}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ settings }: { settings: any }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) {
      toast.error("Firebase ulanmagan!");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success("Xabaringiz muvaffaqiyatli yuborildi!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-[#1d1d1f] dark:bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TextReveal>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tighter uppercase mb-8 leading-[0.9]">
              Keling, <br /> gaplashamiz.
            </h2>
          </TextReveal>
          <p className="text-xl text-gray-400 mb-12 font-light max-w-md">
            Yangi loyiha ustida ishlashga yoki shunchaki fikr almashishga doim tayyorman.
          </p>

          <div className="flex flex-col gap-6">
            <a href={`mailto:${settings?.email || 'sanjarbekotabekov010@gmail.com'}`} className="text-2xl md:text-4xl font-light transition-colors w-max">
              {settings?.email || 'sanjarbekotabekov010@gmail.com'}
            </a>
            <div className="flex gap-4 mt-4">
              {settings?.github && (
                <a href={settings.github} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white transition-all">
                  <Github size={24} />
                </a>
              )}
              {settings?.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white transition-all">
                  <Linkedin size={24} />
                </a>
              )}
              {settings?.telegram && (
                <a href={settings.telegram} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white transition-all">
                  <Send size={24} />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white transition-all">
                  <Instagram size={24} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-gray-600 font-light" placeholder="Ismingiz" />
            </div>
            <div>
              <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-gray-600 font-light" placeholder="Email manzilingiz" />
            </div>
            <div>
              <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-gray-600 font-light resize-none" rows={4} placeholder="Xabaringiz..."></textarea>
            </div>
            <button type="submit" disabled={loading} className="flex items-center gap-4 text-xl font-medium transition-colors disabled:opacity-50">
              <span className="w-12 h-12 rounded-full bg-[#FF4E00] text-white flex items-center justify-center shadow-lg">
                <ArrowUpRight size={24} />
              </span>
              {loading ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ settings }: { settings: any }) => {
  return (
    <footer className="bg-[#1d1d1f] dark:bg-[#050505] py-8 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-500 text-sm font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Sanjarbek Otabekov.
        </div>
        <div className="flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-400">
          {settings?.resume && <a href={settings.resume} target="_blank" rel="noreferrer" className="transition-colors">Rezyume</a>}
          {settings?.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer" className="transition-colors">Telegram</a>}
          {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="transition-colors">Instagram</a>}
        </div>
      </div>
    </footer>
  );
};

export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });

    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const statRef = doc(db, 'analytics', today);

        const visitedKey = `visited_${today}`;
        const isUnique = !localStorage.getItem(visitedKey);

        await setDoc(statRef, {
          views: increment(1),
          visitors: isUnique ? increment(1) : increment(0),
          date: today
        }, { merge: true });

        if (isUnique) {
          localStorage.setItem(visitedKey, 'true');
        }
      } catch (error: any) {
        console.warn("Analytics error (Permissions):", error.message);
      }
    };

    trackVisit();
    return () => unsubSettings();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-black min-h-screen font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 relative">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <AnimatePresence>
        {loading && <InitialLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollProgress />
          <ScrollToTop />
          <FloatingNav isDark={isDark} toggleDark={toggleDark} />
          <main>
            <Hero settings={settings} />
            <Marquee />
            <BentoGrid settings={settings} />
            <ServicesSection />
            <SkillsAndCerts />
            <ProjectsSection settings={settings} />
            <WorkflowSection />
            <TestimonialsSection />
            <ExperienceEducation />
            <Contact settings={settings} />
          </main>
          <Footer settings={settings} />
        </motion.div>
      )}
    </div>
  );
}
