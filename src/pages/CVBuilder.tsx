import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Download, Plus, Trash2, Image as ImageIcon, Mail, Phone, MapPin, Globe, LayoutTemplate, CheckCircle2, ZoomIn, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
    </div>
  );
};

const DeleteButton = ({ onConfirm, title, message, className, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children || <Trash2 size={16} />}
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

type TemplateType = 'modern' | 'classic' | 'minimal';

export default function CVBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [data, setData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    summary: '',
    skills: '',
    experience: [],
    education: []
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.name}_CV`,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setData({
      ...data,
      experience: [...data.experience, { id: Date.now(), role: '', company: '', year: '', desc: '' }]
    });
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setData({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: number) => {
    setData({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    setData({
      ...data,
      education: [...data.education, { id: Date.now(), degree: '', school: '', year: '', desc: '' }]
    });
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setData({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: number) => {
    setData({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const templates = [
    { id: 'modern', name: 'Zamonaviy', desc: 'Toza va professional ko\'rinish', color: 'bg-blue-500' },
    { id: 'classic', name: 'Klassik', desc: 'An\'anaviy va rasmiy uslub', color: 'bg-gray-800' },
    { id: 'minimal', name: 'Minimalistik', desc: 'Ortiqcha detallarsiz, oddiy', color: 'bg-emerald-500' },
  ];

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#0a0a0a] text-[#1d1d1f] dark:text-white flex flex-col">
        <header className="bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">CV Builder</h1>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Shablonni tanlang</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">O'zingizga yoqqan CV shablonini tanlang va ma'lumotlaringizni to'ldirishni boshlang. Barcha shablonlar PDF formatida yuklab olish uchun moslashtirilgan.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {templates.map((tpl, i) => (
              <motion.button
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedTemplate(tpl.id as TemplateType)}
                className="group relative bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-left hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 ${tpl.color}`}></div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 transition-transform">
                  <LayoutTemplate className="text-gray-600 dark:text-gray-300" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{tpl.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tpl.desc}</p>
                
                <div className="mt-8 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Tanlash <ArrowLeft className="ml-1 rotate-180" size={16} />
                </div>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#0a0a0a] text-[#1d1d1f] dark:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedTemplate(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Shablonlarga qaytish">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">CV Builder</h1>
            <div className="h-6 w-px bg-gray-300 dark:bg-white/20 mx-2 hidden sm:block"></div>
            <span className="text-sm font-medium text-gray-500 capitalize bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
              {selectedTemplate} shablon
            </span>
          </div>
          <button
            onClick={() => handlePrint()}
            className="flex items-center gap-2 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] px-5 py-2.5 rounded-full font-medium text-sm transition-transform shadow-sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">PDF Yuklab olish</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[calc(100vh-8rem)]">
          
          {/* Editor Form (Left Side) */}
          <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-white/10 overflow-y-auto custom-scrollbar flex flex-col gap-10 order-2 lg:order-1 h-auto lg:h-full">
            
            {/* Photo Upload */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-blue-500"/> Rasm</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 dark:bg-[#0a0a0a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#1d1d1f] border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400" size={32} />
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  <p className="font-medium text-gray-900 dark:text-gray-200 mb-1">Rasmni yuklash uchun ustiga bosing</p>
                  <p>Kvadrat formatdagi rasm tavsiya etiladi (1:1).</p>
                  {photo && <button onClick={() => setPhoto(null)} className="text-red-500 mt-2 text-xs font-medium hover:underline">Rasmni o'chirish</button>}
                </div>
              </div>
            </section>

            {/* Personal Info */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Shaxsiy Ma'lumotlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">To'liq ism</label>
                  <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Masalan: Sanjarbek" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Mutaxassislik</label>
                  <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Masalan: Frontend Dasturchi" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="hello@misol.uz" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Telefon</label>
                  <input type="text" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="+998 90 123 45 67" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Manzil</label>
                  <input type="text" value={data.address} onChange={e => setData({...data, address: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Toshkent, O'zbekiston" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Veb-sayt / Link</label>
                  <input type="text" value={data.website} onChange={e => setData({...data, website: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="github.com/username" />
                </div>
              </div>
            </section>

            {/* Summary */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Qisqacha Ma'lumot</h2>
              <textarea value={data.summary} onChange={e => setData({...data, summary: e.target.value})} rows={4} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none" placeholder="O'zingiz haqingizda qisqacha ma'lumot..."></textarea>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Ko'nikmalar</h2>
              <p className="text-xs text-gray-500 mb-2">Ko'nikmalarni vergul bilan ajratib yozing</p>
              <input type="text" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="React, Node.js, TypeScript..." />
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Tajriba</h2>
                <button onClick={addExperience} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full transition-colors"><Plus size={16} /> Qo'shish</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {data.experience.map((exp) => (
                    <motion.div 
                      key={exp.id} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 relative group"
                    >
                      <div className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteButton 
                          onConfirm={() => removeExperience(exp.id)} 
                          title="Tajribani o'chirish" 
                          message="Haqiqatan ham bu tajribani o'chirmoqchimisiz?"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-0 md:pr-8">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Lavozim</label>
                          <input type="text" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Frontend Dasturchi" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Kompaniya</label>
                          <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Tech MChJ" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Yil</label>
                          <input type="text" value={exp.year} onChange={e => updateExperience(exp.id, 'year', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="2020 - Hozir" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Ta'rif</label>
                          <textarea value={exp.desc} onChange={e => updateExperience(exp.id, 'desc', e.target.value)} rows={3} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Vazifalar va yutuqlar..."></textarea>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {data.experience.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                    Tajriba qo'shilmagan
                  </div>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Ta'lim</h2>
                <button onClick={addEducation} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full transition-colors"><Plus size={16} /> Qo'shish</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {data.education.map((edu) => (
                    <motion.div 
                      key={edu.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 relative group"
                    >
                      <div className="absolute top-4 right-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteButton 
                          onConfirm={() => removeEducation(edu.id)} 
                          title="Ta'limni o'chirish" 
                          message="Haqiqatan ham bu ta'limni o'chirmoqchimisiz?"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-0 md:pr-8">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Daraja / Yo'nalish</label>
                          <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Bakalavr" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Muassasa</label>
                          <input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Universitet nomi" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Yil</label>
                          <input type="text" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="2018 - 2022" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Ta'rif</label>
                          <textarea value={edu.desc} onChange={e => updateEducation(edu.id, 'desc', e.target.value)} rows={2} className="w-full bg-white dark:bg-[#1d1d1f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Qo'shimcha ma'lumot..."></textarea>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {data.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                    Ta'lim qo'shilmagan
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Live Preview (Right Side) */}
          <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl p-4 md:p-8 flex justify-center overflow-x-auto h-[500px] lg:h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar relative order-1 lg:order-2">
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                Jonli Ko'rinish
              </div>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1">
                <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors">
                  <ZoomOut size={14} />
                </button>
                <span className="text-white text-xs font-medium w-8 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors">
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
            
            <div className="origin-top" style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}>
              <div 
                ref={printRef}
                className="bg-white text-black w-[210mm] min-h-[297mm] shadow-2xl shrink-0 print:shadow-none print:m-0"
              >
                {selectedTemplate === 'modern' && <ModernTemplate data={data} photo={photo} />}
                {selectedTemplate === 'classic' && <ClassicTemplate data={data} photo={photo} />}
                {selectedTemplate === 'minimal' && <MinimalTemplate data={data} photo={photo} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Templates ---

const ModernTemplate = ({ data, photo }: { data: any, photo: string | null }) => (
  <div className="flex min-h-[297mm] bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
    {/* Left Sidebar */}
    <div className="w-[35%] bg-[#1a1a1a] text-white p-8 flex flex-col">
      {photo ? (
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white/20 mb-8">
          <img src={photo} alt="Profile" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-40 h-40 mx-auto rounded-full bg-white/10 border-4 border-white/20 mb-8 flex items-center justify-center">
          <span className="text-white/50 text-sm">Rasm yo'q</span>
        </div>
      )}

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-2 leading-tight">{data.name || 'Ism Familiya'}</h1>
        <h2 className="text-blue-400 font-medium tracking-widest uppercase text-sm">{data.title || 'Mutaxassislik'}</h2>
      </div>

      <div className="space-y-8 flex-1">
        <section>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Aloqa</h3>
          <div className="space-y-4 text-sm text-white/90">
            {data.email && <div className="flex items-center gap-3"><Mail size={16} className="text-blue-400 shrink-0" /> <span className="break-all">{data.email}</span></div>}
            {data.phone && <div className="flex items-center gap-3"><Phone size={16} className="text-blue-400 shrink-0" /> <span>{data.phone}</span></div>}
            {data.address && <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-400 shrink-0" /> <span>{data.address}</span></div>}
            {data.website && <div className="flex items-center gap-3"><Globe size={16} className="text-blue-400 shrink-0" /> <span>{data.website}</span></div>}
          </div>
        </section>

        {data.skills && (
          <section>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Ko'nikmalar</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.split(',').map((skill: string, i: number) => (
                <span key={i} className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Right Content */}
    <div className="w-[65%] p-10 bg-[#f8f9fa]">
      <div className="space-y-10">
        {data.summary && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Profil</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-11">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Tajriba</h3>
            </div>
            <div className="space-y-6 pl-11">
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="absolute -left-[22px] top-4 bottom-[-24px] w-0.5 bg-gray-200 last:hidden"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{exp.year}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Ta'lim</h3>
            </div>
            <div className="space-y-6 pl-11">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="absolute -left-[22px] top-4 bottom-[-24px] w-0.5 bg-gray-200 last:hidden"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{edu.year}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">{edu.school}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{edu.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

const ClassicTemplate = ({ data, photo }: { data: any, photo: string | null }) => (
  <div className="p-12 bg-white min-h-[297mm]" style={{ fontFamily: "'Georgia', serif" }}>
    <div className="text-center mb-12 border-b-2 border-gray-900 pb-10">
      {photo && (
        <img src={photo} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-gray-100 shadow-sm" />
      )}
      <h1 className="text-5xl font-bold text-gray-900 uppercase tracking-widest mb-3">{data.name || 'Ism Familiya'}</h1>
      <h2 className="text-2xl italic text-gray-600 mb-6">{data.title || 'Mutaxassislik'}</h2>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 font-sans">
        {data.email && <span className="flex items-center gap-1"><Mail size={14}/> {data.email}</span>}
        {data.phone && <span className="flex items-center gap-1"><Phone size={14}/> {data.phone}</span>}
        {data.address && <span className="flex items-center gap-1"><MapPin size={14}/> {data.address}</span>}
        {data.website && <span className="flex items-center gap-1"><Globe size={14}/> {data.website}</span>}
      </div>
    </div>

    <div className="space-y-10 px-8">
      {data.summary && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4 text-center">Profil</h3>
          <p className="text-base text-gray-800 leading-relaxed text-justify">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-6 text-center">Tajriba</h3>
          <div className="space-y-8">
            {data.experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                  <span className="text-sm font-sans text-gray-500 font-medium">{exp.year}</span>
                </div>
                <div className="text-base italic text-gray-700 mb-2">{exp.company}</div>
                <p className="text-sm text-gray-800 leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-6 text-center">Ta'lim</h3>
          <div className="space-y-8">
            {data.education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                  <span className="text-sm font-sans text-gray-500 font-medium">{edu.year}</span>
                </div>
                <div className="text-base italic text-gray-700 mb-2">{edu.school}</div>
                <p className="text-sm text-gray-800 leading-relaxed">{edu.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4 text-center">Ko'nikmalar</h3>
          <p className="text-base text-gray-800 text-center leading-relaxed font-sans">
            {data.skills.split(',').map((s: string) => s.trim()).join(' • ')}
          </p>
        </section>
      )}
    </div>
  </div>
);

const MinimalTemplate = ({ data, photo }: { data: any, photo: string | null }) => (
  <div className="p-14 flex bg-white min-h-[297mm]" style={{ fontFamily: "'Inter', sans-serif" }}>
    {/* Left Sidebar */}
    <div className="w-1/3 pr-10 border-r border-gray-200">
      {photo && (
        <img src={photo} alt="Profile" className="w-full aspect-square object-cover mb-10 grayscale rounded-2xl" />
      )}
      
      <div className="space-y-10">
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Aloqa</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {data.email && <div className="break-all">{data.email}</div>}
            {data.phone && <div>{data.phone}</div>}
            {data.address && <div>{data.address}</div>}
            {data.website && <div>{data.website}</div>}
          </div>
        </section>

        {data.skills && (
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ko'nikmalar</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {data.skills.split(',').map((skill: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  {skill.trim()}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Right Content */}
    <div className="w-2/3 pl-10">
      <div className="mb-16">
        <h1 className="text-6xl font-light text-gray-900 tracking-tighter mb-4 leading-none">{data.name || 'Ism Familiya'}</h1>
        <h2 className="text-2xl text-gray-400 font-medium tracking-wide">{data.title || 'Mutaxassislik'}</h2>
      </div>

      <div className="space-y-12">
        {data.summary && (
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Profil</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Tajriba</h3>
            <div className="space-y-8">
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="group">
                  <div className="text-xs font-medium text-gray-400 mb-1">{exp.year}</div>
                  <h4 className="font-bold text-gray-900 text-base mb-0.5">{exp.role}</h4>
                  <div className="text-sm text-gray-500 mb-3">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ta'lim</h3>
            <div className="space-y-8">
              {data.education.map((edu: any) => (
                <div key={edu.id}>
                  <div className="text-xs font-medium text-gray-400 mb-1">{edu.year}</div>
                  <h4 className="font-bold text-gray-900 text-base mb-0.5">{edu.degree}</h4>
                  <div className="text-sm text-gray-500 mb-3">{edu.school}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{edu.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
