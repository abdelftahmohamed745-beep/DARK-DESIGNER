import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Sparkles, Check, Upload, Mail, User } from 'lucide-react';
import { compressImage } from '../utils';

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (updatedProfile: Profile) => void;
  theme: 'dark' | 'light';
  lang: 'en' | 'ar';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
];

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  theme,
  lang,
}: ProfileModalProps) {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [avatar, setAvatar] = useState(profile.avatar || PRESET_AVATARS[0]);
  const [isCompiling, setIsCompiling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  // Sync state if profile changes
  useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setAvatar(profile.avatar || PRESET_AVATARS[0]);
  }, [profile]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isRtl ? 'يرجى تحميل ملف صورة صالح' : 'Please upload a valid image file');
      return;
    }

    setIsCompiling(true);
    try {
      const base64 = await compressImage(file, 200, 200, 0.8);
      setAvatar(base64);
    } catch (err) {
      console.error(err);
      alert(isRtl ? 'فشل معالجة الصورة' : 'Image processing failed');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert(isRtl ? 'يرجى ملء الاسم والبريد الإلكتروني' : 'Please fill in name and email');
      return;
    }
    onSave({ name: name.trim(), email: email.trim().toLowerCase(), avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 z-10 border ${
          isDark ? 'bg-[#0d0d0f] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        } ${isRtl ? 'text-right' : 'text-left'}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
            isDark ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400' : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className={`mb-6 flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
          }`}>
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">
              {isRtl ? 'إعداد الملف الشخصي' : 'Configure Designer Profile'}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {isRtl ? 'تخصيص هويتك والتحقق من حساب النشر' : 'Customize your identity & publishing details'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <label className={`text-[10px] font-bold uppercase tracking-widest font-mono self-start ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {isRtl ? 'الصورة الشخصية' : 'Profile Picture'}
            </label>
            
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full overflow-hidden border-2 shadow-md relative ${
                isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-100'
              }`}>
                {isCompiling ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`absolute bottom-0 right-0 p-2 rounded-full border shadow-md transition-all cursor-pointer ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-850' : 'bg-white border-zinc-250 text-zinc-900 hover:bg-zinc-50'
                }`}
                title={isRtl ? 'تحميل صورة جديدة' : 'Upload custom image'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Presets Grid */}
            <div className="text-center w-full">
              <p className={`text-[9px] font-bold uppercase tracking-wider font-mono mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {isRtl ? 'أو اختر من الرموز الجاهزة' : 'Or select from premium presets'}
              </p>
              <div className="flex items-center justify-center gap-2">
                {PRESET_AVATARS.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 relative transition-all cursor-pointer ${
                      avatar === url
                        ? (isDark ? 'border-white scale-110' : 'border-zinc-950 scale-110')
                        : (isDark ? 'border-zinc-800 opacity-60 hover:opacity-100' : 'border-zinc-200 opacity-60 hover:opacity-100')
                    }`}
                  >
                    <img src={url} alt={`Preset ${index}`} className="w-full h-full object-cover" />
                    {avatar === url && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {isRtl ? 'الاسم بالكامل' : 'Full Name'} *
            </label>
            <div className="relative">
              <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-500`}>
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder={isRtl ? 'أدخل اسمك الكريم' : 'e.g. Abdelrahman Mohamed'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full text-xs rounded-xl py-3 focus:outline-none focus:ring-2 border ${
                  isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                } ${
                  isDark
                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                }`}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {isRtl ? 'البريد الإلكتروني' : 'Email Address'} *
            </label>
            <div className="relative">
              <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-500`}>
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-xs rounded-xl py-3 focus:outline-none focus:ring-2 border ${
                  isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                } ${
                  isDark
                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                }`}
              />
            </div>
            
            {/* Note about Authorization */}
            <div className={`mt-3 p-3 rounded-xl border flex flex-col gap-1 ${
              isDark ? 'bg-zinc-950/60 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
                {isRtl ? 'تفويض صلاحيات النشر' : 'Publisher Authorization Rule'}
              </p>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                {isRtl 
                  ? 'ملاحظة: صلاحيات النشر مقتصرة على حسابات المطورين والمدراء المعتمدين والمسجلين مسبقاً.' 
                  : 'Note: Publishing credentials are strictly reserved for registered admin & developer accounts.'}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-sans uppercase tracking-wider ${
              isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حفظ وتحديث الملف الشخصي' : 'Save & Update Profile'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
