import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, LayoutDashboard, FolderKanban, Settings, LogOut, Plus, Trash2, BarChart3, Users, Eye, UploadCloud, Image as ImageIcon, X, MessageSquare, Award, Code, Briefcase, MonitorSmartphone, Server, PenTool, GraduationCap, Globe, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const app = isFirebaseConfigured ? auth?.app : null;

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-white/10"
          >
            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">{title}</h3>
            <p className="text-[#86868b] dark:text-gray-400 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                Bekor qilish
              </button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                O'chirish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SkeletonLoader = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-white/5 rounded-2xl w-full"></div>
    <div className="h-6 bg-gray-200 dark:bg-white/5 rounded-full w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-1/2"></div>
  </div>
);

const DeleteButton = ({ onConfirm, title, message, className, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children || <Trash2 size={18} />}
      </button>
      <ConfirmModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onConfirm={onConfirm} 
        title={title} 
        message={message} 
      />
    </>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [totals, setTotals] = useState({ views: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'analytics'), (snapshot) => {
      let totalViews = 0;
      let totalVisitors = 0;
      
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        totalViews += d.views || 0;
        totalVisitors += d.visitors || 0;
        
        const dateObj = new Date(doc.id);
        const name = dateObj.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
        
        return { 
          name, 
          views: d.views || 0, 
          visitors: d.visitors || 0, 
          fullDate: doc.id 
        };
      }).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

      const last7Days = data.slice(-7);
      
      setStats(last7Days);
      setTotals({ views: totalViews, visitors: totalVisitors });
      setLoading(false);
    }, (error) => {
      console.warn("Analytics fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Dashboard</h2>
          <p className="text-gray-500 mt-2 font-medium">Sayt statistikasini kuzatib boring</p>
        </div>
        <Link 
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-xl font-medium transition-transform shadow-lg shadow-black/10"
        >
          <ExternalLink size={18} />
          <span>Saytni ko'rish</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Eye size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Ko'rishlar</p>
              <h3 className="text-3xl font-black text-[#1d1d1f] dark:text-white">{totals.views}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Tashrifchilar</p>
              <h3 className="text-3xl font-black text-[#1d1d1f] dark:text-white">{totals.visitors}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-cyan-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <BarChart3 size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">O'rtacha vaqt</p>
              <h3 className="text-3xl font-black text-[#1d1d1f] dark:text-white">--</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20"
      >
        <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-8">Tashriflar statistikasi</h3>
        <div className="w-full h-[400px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Yuklanmoqda...</div>
          ) : stats.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Hali ma'lumot yo'q</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#86868b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#86868b' }} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '', desc: '', image: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projData);
      setLoading(false);
    }, (error) => {
      console.warn("Projects fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const uploadImageToImgBB = async (file: File) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API kaliti topilmadi! .env faylni tekshiring.");
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "Rasm yuklashda xatolik yuz berdi");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const toastId = toast.loading("Rasm yuklanmoqda...");
      const imageUrl = await uploadImageToImgBB(file);
      setFormData({ ...formData, image: imageUrl });
      toast.success("Rasm muvaffaqiyatli yuklandi!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removed R2 upload logic
    toast.error("Fayl yuklash hozircha o'chirilgan. Iltimos, link kiriting.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Iltimos, rasm yuklang!");
      return;
    }

    if (!isFirebaseConfigured || !db) {
      toast.error("Firebase ulanmagan!");
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);
      const toastId = toast.loading(editingId ? "Loyiha yangilanmoqda..." : "Loyiha saqlanmoqda...");
      
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), formData);
        toast.success("Loyiha muvaffaqiyatli yangilandi!", { id: toastId });
      } else {
        await addDoc(collection(db, 'projects'), formData);
        toast.success("Loyiha muvaffaqiyatli qo'shildi!", { id: toastId });
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', desc: '', image: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]' });
    } catch (error) {
      console.error("Error saving document: ", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title || '',
      desc: project.desc || '',
      image: project.image || '',
      tag: project.tag || '',
      link: project.link || '',
      githubUrl: project.githubUrl || '',
      downloadUrl: project.downloadUrl || '',
      color: project.color || 'bg-[#f5f5f7]'
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success("Loyiha o'chirildi");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Loyihalar</h2>
          <p className="text-gray-500 mt-2 font-medium">Portfoliodagi loyihalarni boshqarish</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Sarlavha</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Loyiha nomi" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Kategoriya (Tag)</label>
                  <input required type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Masalan: Web Ilova" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Havola (Link)</label>
                  <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Kodi (Link)</label>
                  <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://github.com/..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Loyiha Fayli (ZIP/RAR) - Hozircha o'chirilgan</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      value={formData.downloadUrl} 
                      onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
                      placeholder="https://... (Ixtiyoriy)" 
                    />
                  </div>
                  {formData.downloadUrl && (
                    <p className="text-xs text-green-500 mt-2 font-medium truncate">Fayl manzili: {formData.downloadUrl}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Qisqacha ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Loyiha haqida qisqacha ma'lumot..."></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Loyiha rasmi</label>
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${formData.image ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-white/20 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {formData.image ? (
                      <div className="relative w-full max-w-md mx-auto h-64 rounded-xl overflow-hidden shadow-2xl">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}); }}
                          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                          {isUploading ? <UploadCloud className="animate-bounce" size={40} /> : <ImageIcon size={40} />}
                        </div>
                        <p className="text-[#1d1d1f] dark:text-white font-bold text-lg mb-2">
                          {isUploading ? 'Rasm yuklanmoqda...' : 'Rasmni yuklash uchun bosing'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG yoki WEBP (Max: 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isUploading || !formData.image}
                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-lg shadow-blue-500/30"
                  >
                    {editingId ? "Yangilash va Saqlash" : "Saqlash va Nashr etish"}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                        setFormData({ title: '', desc: '', image: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]' });
                      }}
                      className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors w-full md:w-auto"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-[#1d1d1f] rounded-[2rem] border border-gray-100 dark:border-white/10">
            <FolderKanban className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Hali loyihalar qo'shilmagan.</p>
          </div>
        ) : projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-[#1d1d1f] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 group transition-transform duration-300"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <button 
                  onClick={() => handleEdit(project)}
                  className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shadow-lg"
                  title="Tahrirlash"
                >
                  <PenTool size={20} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(project.id)} 
                  title="Loyihani o'chirish" 
                  message="Haqiqatan ham bu loyihani o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
                  className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{project.tag}</span>
                {project.githubUrl && <Github size={20} className="text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white transition-colors" />}
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-3">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [formData, setFormData] = useState({ role: '', company: '', year: '', desc: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'experiences'), (snapshot) => {
      setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
    }, (error) => console.warn("Experiences fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'experiences', editingId), formData);
        toast.success("Tajriba yangilandi");
      } else {
        await addDoc(collection(db, 'experiences'), formData);
        toast.success("Tajriba qo'shildi");
      }
      setFormData({ role: '', company: '', year: '', desc: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (exp: any) => {
    setFormData({ role: exp.role, company: exp.company, year: exp.year, desc: exp.desc });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Tajriba</h2>
          <p className="text-gray-500 mt-2 font-medium">Ish tajribasi va faoliyat</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ role: '', company: '', year: '', desc: '' });
            }
          }}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Tajribani tahrirlash" : "Yangi tajriba qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Lavozim</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Kompaniya</label>
                  <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Google Inc." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2022 - 2024" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Nimalar qildingiz..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Tajriba qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-start bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{exp.role} <span className="text-blue-600 dark:text-blue-400 ml-2 text-base font-medium bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{exp.year}</span></p>
                <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{exp.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(exp)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(exp.id)} 
                  title="Tajribani o'chirish" 
                  message="Haqiqatan ham bu tajribani o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const EducationManager = () => {
  const [education, setEducation] = useState<any[]>([]);
  const [formData, setFormData] = useState({ degree: '', institution: '', year: '', desc: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'education'), (snapshot) => {
      setEducation(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
    }, (error) => console.warn("Education fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'education', editingId), formData);
        toast.success("Ta'lim yangilandi");
      } else {
        await addDoc(collection(db, 'education'), formData);
        toast.success("Ta'lim qo'shildi");
      }
      setFormData({ degree: '', institution: '', year: '', desc: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (edu: any) => {
    setFormData({ degree: edu.degree, institution: edu.institution, year: edu.year, desc: edu.desc });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'education', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Ta'lim</h2>
          <p className="text-gray-500 mt-2 font-medium">O'qish joylari va darajalar</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ degree: '', institution: '', year: '', desc: '' });
            }
          }}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Ta'limni tahrirlash" : "Yangi ta'lim qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Daraja / Yo'nalish</label>
                  <input required type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Bakalavr..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Muassasa</label>
                  <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Universitet nomi..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2018 - 2022" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Nimalar o'rgandingiz..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Ta'lim qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div 
              key={edu.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-start bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{edu.degree} <span className="text-blue-600 dark:text-blue-400 ml-2 text-base font-medium bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{edu.year}</span></p>
                <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-2">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{edu.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(edu)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(edu.id)} 
                  title="Ta'limni o'chirish" 
                  message="Haqiqatan ham bu ta'limni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', level: '50' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'skills'), (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Skills fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.level) return;
    try {
      const data = { name: formData.name, level: parseInt(formData.level) };
      if (editingId) {
        await updateDoc(doc(db, 'skills', editingId), data);
        toast.success("Ko'nikma yangilandi");
      } else {
        await addDoc(collection(db, 'skills'), data);
        toast.success("Ko'nikma qo'shildi");
      }
      setFormData({ name: '', level: '50' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (skill: any) => {
    setFormData({ name: skill.name, level: String(skill.level) });
    setEditingId(skill.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Ko'nikmalar</h2>
          <p className="text-gray-500 mt-2 font-medium">Dasturlash tillari va texnologiyalar</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ name: '', level: '50' });
            }
          }}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Ko'nikmani tahrirlash" : "Yangi ko'nikma qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="React, Node.js..." />
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Daraja (%)</label>
                  <input required type="number" min="0" max="100" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto h-[58px] shadow-lg shadow-blue-500/30">
                  {editingId ? "Yangilash" : "Qo'shish"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, index) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-[#1d1d1f] dark:text-white text-lg">{s.name}</p>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">{s.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${s.level}%` }}></div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <button 
                  onClick={() => handleEdit(s)}
                  className="text-gray-400 hover:text-blue-500 p-2 rounded-lg transition-colors"
                >
                  <PenTool size={16} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(s.id)} 
                  title="Ko'nikmani o'chirish" 
                  message="Haqiqatan ham bu ko'nikmani o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CertificatesManager = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', issuer: '', year: '', link: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'certificates'), (snapshot) => {
      setCerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Certs fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'certificates', editingId), formData);
        toast.success("Sertifikat yangilandi");
      } else {
        await addDoc(collection(db, 'certificates'), formData);
        toast.success("Sertifikat qo'shildi");
      }
      setFormData({ title: '', issuer: '', year: '', link: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (cert: any) => {
    setFormData({ title: cert.title, issuer: cert.issuer, year: cert.year, link: cert.link });
    setEditingId(cert.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'certificates', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Sertifikatlar</h2>
          <p className="text-gray-500 mt-2 font-medium">Yutuqlar va sertifikatlar</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ title: '', issuer: '', year: '', link: '' });
            }
          }}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Sertifikatni tahrirlash" : "Yangi sertifikat qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="AWS Certified..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Tashkilot</label>
                  <input required type="text" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Amazon..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Havola (ixtiyoriy)</label>
                  <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Sertifikat qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((c, index) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{c.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{c.issuer} • {c.year}</p>
                {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mt-2 inline-block hover:underline">Sertifikatni ko'rish</a>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(c)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(c.id)} 
                  title="Sertifikatni o'chirish" 
                  message="Haqiqatan ham bu sertifikatni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ServicesManager = () => {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', desc: '', icon: 'Code' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Services fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
        toast.success("Xizmat yangilandi");
      } else {
        await addDoc(collection(db, 'services'), formData);
        toast.success("Xizmat qo'shildi");
      }
      setFormData({ title: '', desc: '', icon: 'Code' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (service: any) => {
    setFormData({ title: service.title, desc: service.desc, icon: service.icon });
    setEditingId(service.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Xizmatlar</h2>
          <p className="text-gray-500 mt-2 font-medium">Taklif etiladigan xizmatlar</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({ title: '', desc: '', icon: 'Code' });
            }
          }}
          className="bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
        >
          {isAdding ? 'Bekor qilish' : <><Plus size={20} /> Yangi qo'shish</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Web Dasturlash" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ikonka</label>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium">
                    <option value="Code">Code</option>
                    <option value="MonitorSmartphone">Monitor & Smartphone</option>
                    <option value="Server">Server</option>
                    <option value="PenTool">Pen Tool (Design)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Xizmat haqida ma'lumot..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Xizmat qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, index) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{s.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(s)}
                  className="text-gray-400 hover:text-blue-500 p-2 rounded-lg transition-colors"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(s.id)} 
                  title="Xizmatni o'chirish" 
                  message="Haqiqatan ham bu xizmatni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SettingsManager = () => {
  const [heroImage, setHeroImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [socials, setSocials] = useState({ 
    github: '', linkedin: '', telegram: '', instagram: '', resume: '', email: '',
    aboutTitle: 'Sodda. Kreativ. Samarali.', 
    aboutShort: 'Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir.', 
    aboutFull: 'Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir. Har bir loyihada minimalizm va yuqori unumdorlikni birinchi o\'ringa qo\'yaman.\n\nMening maqsadim - foydalanuvchi interfeyslarini shunchalik sodda qilishki, hatto birinchi marta kirgan odam ham o\'zini uydagidek his qilsin. Murakkab muammolarga kreativ yechimlar topish mening asosiy kuchimdir.', 
    expYears: '3+', 
    githubCommits: '1.2k', 
    githubYearText: 'Bu yilgi faollik',
    spotifySong: 'Lofi Hip Hop Radio', 
    spotifyArtist: 'ChilledCow'
  });
  const [isSavingSocials, setIsSavingSocials] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (docSnap.exists() && docSnap.data().image) {
          setHeroImage(docSnap.data().image);
        }
        
        const generalSnap = await getDoc(doc(db, 'settings', 'general'));
        if (generalSnap.exists()) {
          setSocials({ ...socials, ...generalSnap.data() });
        }
      } catch (error: any) {
        console.warn("Settings fetch error:", error.message);
      }
    };
    fetchSettings();
  }, []);

  const uploadImageToImgBB = async (file: File) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API kaliti topilmadi! .env faylni tekshiring.");
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "Rasm yuklashda xatolik yuz berdi");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const toastId = toast.loading("Rasm yuklanmoqda...");
      const imageUrl = await uploadImageToImgBB(file);
      
      if (isFirebaseConfigured && db) {
        await setDoc(doc(db, 'settings', 'hero'), { image: imageUrl }, { merge: true });
      }
      
      setHeroImage(imageUrl);
      toast.success("Hero rasmi muvaffaqiyatli saqlandi!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await setDoc(doc(db, 'settings', 'hero'), { image: '' }, { merge: true });
      setHeroImage('');
      toast.success("Rasm o'chirildi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removed R2 upload logic
    toast.error("Fayl yuklash hozircha o'chirilgan. Iltimos, link kiriting.");
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) return;
    setIsSavingSocials(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), socials, { merge: true });
      toast.success("Ma'lumotlar saqlandi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSavingSocials(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Sozlamalar</h2>
        <p className="text-gray-500 mt-2 font-medium">Sayt sozlamalari va ko'rinishi</p>
      </div>

      <div className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ImageIcon size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Hero Rasmi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Bosh sahifadagi asosiy rasm (ixtiyoriy)</p>
          </div>
        </div>

        <div className="mb-8 max-w-2xl">
          <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Rasm URL manzili (Link yoki /public papkadan)</label>
          <input 
            type="text" 
            value={heroImage} 
            onChange={async (e) => {
              const val = e.target.value;
              setHeroImage(val);
              if (isFirebaseConfigured && db) {
                await setDoc(doc(db, 'settings', 'hero'), { image: val }, { merge: true });
              }
            }} 
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
            placeholder="https://... yoki /me.jpg" 
          />
          <p className="text-sm text-gray-500 mt-2">Siz to'g'ridan-to'g'ri rasm linkini kiritishingiz yoki public papkadagi rasm nomini (masalan: /me.jpg) yozishingiz mumkin.</p>
        </div>

        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-12 ${heroImage ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-white/20 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {heroImage ? (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                {isUploading ? <UploadCloud className="animate-bounce" size={40} /> : <ImageIcon size={40} />}
              </div>
              <p className="text-[#1d1d1f] dark:text-white font-bold text-lg mb-2">
                {isUploading ? 'Rasm yuklanmoqda...' : 'Rasmni yuklash uchun bosing'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG yoki WEBP (Max: 5MB)</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">Men haqimda (BentoGrid)</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Sarlavha</label>
              <input type="text" value={socials.aboutTitle} onChange={e => setSocials({...socials, aboutTitle: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Sodda. Kreativ. Samarali." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Qisqacha ma'lumot</label>
              <textarea value={socials.aboutShort} onChange={e => setSocials({...socials, aboutShort: e.target.value})} rows={2} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Qisqacha ma'lumot..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">To'liq ma'lumot</label>
              <textarea value={socials.aboutFull} onChange={e => setSocials({...socials, aboutFull: e.target.value})} rows={5} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="To'liq ma'lumot..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Tajriba yillari</label>
              <input type="text" value={socials.expYears} onChange={e => setSocials({...socials, expYears: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="3+" />
            </div>
          </form>

          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">GitHub & Spotify (BentoGrid)</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Commits</label>
              <input type="text" value={socials.githubCommits} onChange={e => setSocials({...socials, githubCommits: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="1.2k" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Matn</label>
              <input type="text" value={socials.githubYearText} onChange={e => setSocials({...socials, githubYearText: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Bu yilgi faollik" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Spotify Qo'shiq</label>
              <input type="text" value={socials.spotifySong} onChange={e => setSocials({...socials, spotifySong: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Lofi Hip Hop Radio" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Spotify Ijrochi</label>
              <input type="text" value={socials.spotifyArtist} onChange={e => setSocials({...socials, spotifyArtist: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="ChilledCow" />
            </div>
          </form>

          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">Ijtimoiy tarmoqlar va Havolalar</h3>
          <form onSubmit={handleSaveSocials} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" value={socials.email} onChange={e => setSocials({...socials, email: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="hello@misol.uz" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Rezyume Linki (URL)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={socials.resume} 
                  onChange={e => setSocials({...socials, resume: e.target.value})} 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
                  placeholder="https://... (Ixtiyoriy)" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub</label>
              <input type="url" value={socials.github} onChange={e => setSocials({...socials, github: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">LinkedIn</label>
              <input type="url" value={socials.linkedin} onChange={e => setSocials({...socials, linkedin: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Telegram</label>
              <input type="url" value={socials.telegram} onChange={e => setSocials({...socials, telegram: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://t.me/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Instagram</label>
              <input type="url" value={socials.instagram} onChange={e => setSocials({...socials, instagram: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://instagram.com/..." />
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={isSavingSocials} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30 w-full md:w-auto">
                {isSavingSocials ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const MessagesManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(msgData);
      setLoading(false);
    }, (error) => {
      console.warn("Messages fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success("Xabar o'chirildi");
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Xabarlar</h2>
        <p className="text-gray-500 mt-2 font-medium">Portfoliodan kelgan xabarlar</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1d1d1f] rounded-[2rem] border border-gray-100 dark:border-white/10">
            <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Hali xabarlar yo'q.</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-[#1d1d1f] p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col md:flex-row gap-8 justify-between items-start group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">{msg.name}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">{new Date(msg.createdAt).toLocaleString('uz-UZ')}</span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 inline-block hover:underline">{msg.email}</a>
                  <p className="text-[#1d1d1f] dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl leading-relaxed">{msg.message}</p>
                </div>
                <DeleteButton 
                  onConfirm={() => handleDelete(msg.id)} 
                  title="Xabarni o'chirish" 
                  message="Haqiqatan ham bu xabarni o'chirmoqchimisiz?"
                  className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      navigate('/login');
      return;
    }
    
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    toast.success("Tizimdan chiqdingiz");
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FolderKanban size={20} />, label: 'Loyihalar' },
    { path: '/admin/services', icon: <MonitorSmartphone size={20} />, label: 'Xizmatlar' },
    { path: '/admin/experience', icon: <Briefcase size={20} />, label: 'Tajriba' },
    { path: '/admin/education', icon: <GraduationCap size={20} />, label: "Ta'lim" },
    { path: '/admin/skills', icon: <Code size={20} />, label: "Ko'nikmalar" },
    { path: '/admin/certs', icon: <Award size={20} />, label: 'Sertifikatlar' },
    { path: '/admin/messages', icon: <MessageSquare size={20} />, label: 'Xabarlar' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Sozlamalar' },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-[#000000] flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-[#1d1d1f] text-white flex flex-col md:fixed md:h-[calc(100vh-2rem)] md:m-4 md:rounded-[2rem] z-50 shadow-2xl shadow-black/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        
        <div className="p-8 pb-4 relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl transition-transform">S</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sanjarbek.</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide relative z-10">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-medium transition-all group relative overflow-hidden ${isActive ? 'text-white bg-white/10 shadow-lg shadow-black/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>}
                  <span className={`relative z-10 transition-transform ${isActive ? 'text-blue-400' : ''}`}>{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto relative z-10 space-y-2">
          <Link 
            to="/"
            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl font-medium text-white/80 hover:bg-white/10 transition-all hover:text-white"
          >
            <Globe size={20} />
            <span>Saytga qaytish</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl font-medium text-red-400 hover:bg-red-500/10 transition-all hover:text-red-300"
          >
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[22rem] p-6 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsManager />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/experience" element={<ExperienceManager />} />
              <Route path="/education" element={<EducationManager />} />
              <Route path="/skills" element={<SkillsManager />} />
              <Route path="/certs" element={<CertificatesManager />} />
              <Route path="/messages" element={<MessagesManager />} />
              <Route path="/settings" element={<SettingsManager />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
