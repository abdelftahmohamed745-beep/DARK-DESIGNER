import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Compass,
  Laptop,
  Sparkles,
  Search,
  SlidersHorizontal,
  Plus,
  Palette,
  Heart,
  Globe,
  Sun,
  Moon,
  Trash2,
  Lock,
  UserCheck
} from 'lucide-react';
import { Design, Inquiry, Category, ToastMessage } from './types';
import { INITIAL_DESIGNS } from './initialData';
import DesignCard from './components/DesignCard';
import DesignDetailsModal from './components/DesignDetailsModal';
import DesignUploadForm from './components/DesignUploadForm';
import InquiriesList from './components/InquiriesList';
import Notification from './components/Notification';
import ProfileModal from './components/ProfileModal';
import { translations, getCategoryName } from './translations';

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'inquiry-1',
    designId: 'design-2',
    designTitle: 'Fintech Mobile Banking Dashboard',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sjenkins@fintechlabs.io',
    customerCompany: 'Fintech Labs',
    message: 'Hi! We loved your banking dashboard concept. We are building a retail investing platform for Gen-Z and would love to hire you to adapt this exact layout to support fractional share trading flows. Are you available for a 4-week freelance contract starting next month?',
    budget: '$5,000+',
    createdAt: '2026-07-16T15:20:00.000Z',
    status: 'pending'
  },
  {
    id: 'inquiry-2',
    designId: 'design-3',
    designTitle: 'Nectar Organics - Brand Identity & Packaging',
    customerName: 'Derrick Vance',
    customerEmail: 'dvance@pinnaclecosmetics.com',
    customerCompany: 'Pinnacle Cosmetics',
    message: 'Greetings! Your packaging design is absolutely stunning. We are launching a new organic body-wash line and would love to license your identity package. Could you provide details on what source files are included in the $299 license, and if you offer custom brand guidelines customization services?',
    budget: '$2,000 - $5,000',
    createdAt: '2026-07-17T01:10:00.000Z',
    status: 'reviewed'
  }
];

export default function App() {
  // Core persistence state
  const [designs, setDesigns] = useState<Design[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);

  // Theme & Language State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('marketplace_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('marketplace_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'en';
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<'browse' | 'studio'>('browse');
  const [studioSubTab, setStudioSubTab] = useState<'portfolio' | 'publish' | 'inquiries'>('portfolio');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'likes' | 'views' | 'newest'>('newest');

  // Detailed modal interaction
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  // Toast message queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dynamic profile configuration (persisted in local storage)
  const [profile, setProfile] = useState<{ name: string; email: string; avatar: string }>(() => {
    const saved = localStorage.getItem('marketplace_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.email) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      name: '',
      email: '',
      avatar: ''
    };
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isAuthorizedToPost = profile.email === 'abdelftahmohamed745@gmail.com' || profile.email === 'mohsenjake99@gmail.com';

  const t = translations[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  // --- Initial Mount & Sync ---
  useEffect(() => {
    // Set document title
    document.title = lang === 'ar' ? 'Dark Designer | منصة التصاميم الاحترافية' : 'Dark Designer - Premium Creative Portfolio Hub';

    // 1. Designs
    const savedDesigns = localStorage.getItem('marketplace_designs');
    if (savedDesigns) {
      try {
        setDesigns(JSON.parse(savedDesigns));
      } catch (e) {
        setDesigns(INITIAL_DESIGNS);
      }
    } else {
      setDesigns(INITIAL_DESIGNS);
      localStorage.setItem('marketplace_designs', JSON.stringify(INITIAL_DESIGNS));
    }

    // 2. Inquiries
    const savedInquiries = localStorage.getItem('marketplace_inquiries');
    if (savedInquiries) {
      try {
        setInquiries(JSON.parse(savedInquiries));
      } catch (e) {
        setInquiries(DEFAULT_INQUIRIES);
      }
    } else {
      setInquiries(DEFAULT_INQUIRIES);
      localStorage.setItem('marketplace_inquiries', JSON.stringify(DEFAULT_INQUIRIES));
    }

    // 3. Likes
    const savedLikes = localStorage.getItem('marketplace_liked');
    if (savedLikes) {
      try {
        setLikedDesigns(JSON.parse(savedLikes));
      } catch (e) {}
    }
  }, []);

  // Update HTML Dir and Theme Attribute on changes
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' ? 'Dark Designer | منصة التصاميم الاحترافية' : 'Dark Designer - Premium Creative Portfolio Hub';
  }, [lang, isRtl]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Sync to local storage helper
  const syncDesigns = (updated: Design[]) => {
    setDesigns(updated);
    localStorage.setItem('marketplace_designs', JSON.stringify(updated));
  };

  const syncInquiries = (updated: Inquiry[]) => {
    setInquiries(updated);
    localStorage.setItem('marketplace_inquiries', JSON.stringify(updated));
  };

  // --- Theme / Language Switch Toggles ---
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('marketplace_theme', nextTheme);
    if (lang === 'ar') {
      addToast('info', 'تم تغيير السمة', `تم التبديل بنجاح إلى الوضع ${nextTheme === 'dark' ? 'الداكن' : 'المضيء'}.`);
    } else {
      addToast('info', 'Theme Toggled', `Successfully switched to ${nextTheme} mode.`);
    }
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    localStorage.setItem('marketplace_lang', nextLang);
    if (nextLang === 'ar') {
      addToast('success', 'تم تغيير اللغة', 'الموقع يدعم اللغة العربية الآن بشكل كامل.');
    } else {
      addToast('success', 'Language Switched', 'Dark Designer is now displayed in English.');
    }
  };

  // --- Toast helper ---
  const addToast = (type: 'success' | 'error' | 'info', title: string, description: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Operations ---
  
  // Toggle design liking
  const handleLikeDesign = (designId: string) => {
    const isLiked = likedDesigns.includes(designId);
    let updatedLikes = [...likedDesigns];
    
    if (isLiked) {
      updatedLikes = updatedLikes.filter((id) => id !== designId);
      if (lang === 'ar') {
        addToast('info', 'تم الإزالة من المفضلة', 'تم إزالة هذا العمل من قائمة العناصر المحفوظة لديك.');
      } else {
        addToast('info', 'Removed from likes', 'This design was removed from your saved items.');
      }
    } else {
      updatedLikes.push(designId);
      if (lang === 'ar') {
        addToast('success', 'تم الحفظ في المفضلة', 'أضفنا هذا العمل الفني الرائع إلى العناصر المحببة لديك!');
      } else {
        addToast('success', 'Added to saved items', 'We added this design showcase to your favorites!');
      }
    }

    setLikedDesigns(updatedLikes);
    localStorage.setItem('marketplace_liked', JSON.stringify(updatedLikes));

    // Update design's likes count
    const updatedDesigns = designs.map((d) => {
      if (d.id === designId) {
        return {
          ...d,
          likes: isLiked ? Math.max(0, d.likes - 1) : d.likes + 1
        };
      }
      return d;
    });
    syncDesigns(updatedDesigns);

    // Sync selected design reference if modal is open
    if (selectedDesign && selectedDesign.id === designId) {
      setSelectedDesign(updatedDesigns.find((d) => d.id === designId) || null);
    }
  };

  // Increment view counts on design inspection
  const handleInspectDesign = (design: Design) => {
    const updatedDesigns = designs.map((d) => {
      if (d.id === design.id) {
        return { ...d, views: d.views + 1 };
      }
      return d;
    });
    syncDesigns(updatedDesigns);
    setSelectedDesign(updatedDesigns.find((d) => d.id === design.id) || null);
  };

  // Create custom lead / inquiry
  const handleAddInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inquiry-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const updated = [newInquiry, ...inquiries];
    syncInquiries(updated);
    if (lang === 'ar') {
      addToast(
        'success',
        'تم إرسال طلبك بنجاح',
        `تم إخطار المصمم بخصوص استفسارك عن "${inquiryData.designTitle || 'العمل المخصص'}".`
      );
    } else {
      addToast(
        'success',
        'Inquiry Submitted',
        `Your request regarding "${inquiryData.designTitle || 'Custom design work'}" has been sent!`
      );
    }
  };

  // Update Inquiry communication status
  const handleUpdateInquiryStatus = (id: string, status: Inquiry['status']) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return { ...inq, status };
      }
      return inq;
    });
    syncInquiries(updated);
  };

  // Delete/Archive inquiry
  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    syncInquiries(updated);
    if (lang === 'ar') {
      addToast('info', 'تم أرشفة الاستفسار', 'تم مسح طلب العميل من قائمة الاستفسارات النشطة.');
    } else {
      addToast('info', 'Inquiry archived', 'The client request has been cleared from your active list.');
    }
  };

  // Create design publication
  const handlePublishDesign = (
    designData: Omit<
      Design,
      'id' | 'createdAt' | 'likes' | 'views' | 'designerName' | 'designerAvatar'
    >
  ) => {
    const newDesign: Design = {
      ...designData,
      id: `design-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      designerName: profile.name || (lang === 'ar' ? 'مصمم معتمد' : 'Verified Designer'),
      designerAvatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };

    const updated = [newDesign, ...designs];
    syncDesigns(updated);
    if (lang === 'ar') {
      addToast('success', 'تم النشر بنجاح!', `أصبح مشروعك "${designData.title}" متاحاً الآن في المعرض العام!`);
    } else {
      addToast('success', 'Design Published!', `Your project "${designData.title}" is now live in the marketplace!`);
    }
    
    // Auto-focus on portfolio tab to let them see their post
    setStudioSubTab('portfolio');
  };

  // Delete own design showcase
  const handleDeleteDesign = (designId: string) => {
    const updated = designs.filter((d) => d.id !== designId);
    syncDesigns(updated);
    setSelectedDesign(null);
    if (lang === 'ar') {
      addToast('info', 'تم حذف العمل', 'تم إزالة مشروعك ومصنفك الفني من المعرض العام للموقع.');
    } else {
      addToast('info', 'Design removed', 'Your design project has been taken down from the marketplace.');
    }
  };

  // --- Filter Logic ---
  const filteredDesigns = useMemo(() => {
    return designs
      .filter((d) => {
        const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
        const matchesSearch =
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'views') return b.views - a.views;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [designs, searchQuery, selectedCategory, sortBy]);

  // Designer's published items subset
  const designerPortfolio = useMemo(() => {
    return designs.filter((d) => d.designerName === profile.name || (profile.name && d.designerName === 'You (Studio Owner)'));
  }, [designs, profile.name]);

  // Count active pending leads for badge notification
  const pendingLeadsCount = useMemo(() => {
    return inquiries.filter((i) => i.status === 'pending').length;
  }, [inquiries]);

  const categories: Category[] = [
    'All',
    'UI/UX Design',
    'Graphic Design',
    '3D Art',
    'Brand Identity',
    'Illustration',
    'Motion Graphics'
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-zinc-200 selection:text-zinc-950 transition-colors duration-250 ${
      isDark ? 'bg-[#09090b] text-zinc-200' : 'bg-[#fcfcfd] text-zinc-800'
    }`}>
      {/* --- Top Global Header --- */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${
        isDark ? 'bg-[#09090b]/80 border-zinc-900' : 'bg-white/85 border-zinc-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
            
            {/* Branding Logo */}
            <div className={`flex items-center gap-3 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`} onClick={() => setActiveTab('browse')}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm tracking-wider shadow-sm transition-all ${
                isDark ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'
              }`}>
                {isRtl ? 'م' : 'D'}
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h1 className={`text-xs font-black tracking-widest uppercase font-display ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}>
                  {t.footerTitle}
                </h1>
                <p className={`text-[8px] font-bold uppercase tracking-widest leading-none mt-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  {isRtl ? 'تجمع الإبداع والجمال المتميز' : 'Curated Collective'}
                </p>
              </div>
            </div>

            {/* Main Tabs */}
            <nav className={`flex items-center gap-1 p-1 rounded-full border transition-all ${
              isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'
            }`}>
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isRtl ? 'flex-row-reverse' : ''
                } ${
                  activeTab === 'browse'
                    ? (isDark ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-zinc-950 text-white font-bold shadow-sm')
                    : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900')
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {t.browse}
              </button>
              <button
                onClick={() => {
                  setActiveTab('studio');
                  setStudioSubTab('portfolio');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 relative cursor-pointer ${
                  isRtl ? 'flex-row-reverse' : ''
                } ${
                  activeTab === 'studio'
                    ? (isDark ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-zinc-950 text-white font-bold shadow-sm')
                    : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900')
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                {t.studio}
                {pendingLeadsCount > 0 && (
                  <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ring-2 ${
                    isDark ? 'bg-white text-zinc-950 ring-zinc-950' : 'bg-zinc-950 text-white ring-white'
                  }`}>
                    {pendingLeadsCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Quick Settings: Language & Theme Toggles */}
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              
              {/* Language Switch Button */}
              <button
                onClick={handleToggleLang}
                className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border-zinc-250'
                }`}
                title={isRtl ? 'Switch to English' : 'تحويل للعربية'}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider font-mono ml-1.5 mr-1.5">
                  {isRtl ? 'EN' : 'عربي'}
                </span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={handleToggleTheme}
                className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border-zinc-250'
                }`}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-900" />}
              </button>

              <div className="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1 hidden sm:block" />

              {/* Designer Avatar & Profile Configurator */}
              <div className={`hidden sm:flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {profile.name ? (
                  <>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className={`text-right ${isRtl ? 'text-left' : 'text-right'} hover:opacity-85 transition-opacity cursor-pointer`}
                    >
                      <p className={`text-xs font-bold leading-none ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {profile.name}
                      </p>
                      <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${
                        isAuthorizedToPost ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {isAuthorizedToPost 
                          ? (isRtl ? 'ناشر معتمد' : 'Verified Publisher') 
                          : (isRtl ? 'حساب زائر' : 'Guest Account')
                        }
                      </p>
                    </button>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    >
                      <img
                        src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={profile.name}
                        className={`w-8 h-8 rounded-full object-cover ring-2 ${
                          isAuthorizedToPost 
                            ? (isDark ? 'ring-emerald-500/40' : 'ring-emerald-500') 
                            : 'ring-zinc-850'
                        }`}
                      />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border shadow-sm transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider ${
                      isDark
                        ? 'bg-white hover:bg-zinc-200 text-zinc-950 border-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إعداد الحساب' : 'Create Profile'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Layout --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* ================= tab: BROWSE ================= */}
          {activeTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Hero Showcase Title */}
              <div className="text-center py-6 sm:py-8 max-w-3xl mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`inline-flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-350' 
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  {t.heroBadge}
                </motion.div>
                <h1 className={`text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight leading-none font-display ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}>
                  {t.heroHeading}
                </h1>
                <p className={`text-sm sm:text-base mt-5 leading-relaxed max-w-2xl mx-auto ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {t.heroSubheading}
                </p>
              </div>

              {/* Dynamic Filter Tool Strip */}
              <div className={`rounded-2xl border p-4 flex flex-col md:flex-row items-center gap-4 ${
                isRtl ? 'md:flex-row-reverse' : ''
              } ${
                isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                
                {/* Search Bar Input */}
                <div className="relative w-full md:flex-1">
                  <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full text-sm rounded-full py-2.5 focus:outline-none focus:ring-2 border ${
                      isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                    } ${
                      isDark
                        ? 'bg-[#030303]/60 border-zinc-850 text-zinc-200 placeholder:text-zinc-500 focus:ring-zinc-700 focus:border-zinc-600'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:ring-zinc-400 focus:border-zinc-400'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer`}
                    >
                      {t.clear}
                    </button>
                  )}
                </div>

                {/* Sorter Selection */}
                <div className={`flex items-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 ${
                  isRtl ? 'flex-row-reverse border-zinc-800' : 'border-zinc-200'
                }`}>
                  <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                  <span className={`text-xs font-bold uppercase tracking-widest font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t.sortLabel}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`text-xs font-bold rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 border ${
                      isDark
                        ? 'bg-[#030303]/60 text-zinc-300 border-zinc-850 focus:ring-zinc-700'
                        : 'bg-white border-zinc-300 text-zinc-800 focus:ring-zinc-450'
                    }`}
                  >
                    <option value="newest">{t.sortNewest}</option>
                    <option value="likes">{t.sortLikes}</option>
                    <option value="views">{t.sortViews}</option>
                  </select>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-none ${isRtl ? 'flex-row-reverse' : ''}`}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? (isDark ? 'bg-white text-zinc-950 shadow-md' : 'bg-zinc-950 text-white shadow-md')
                        : (isDark ? 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 border border-zinc-800/60' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200/80')
                    }`}
                  >
                    {getCategoryName(cat, lang)}
                  </button>
                ))}
              </div>

              {/* Grid Listing View */}
              {filteredDesigns.length === 0 ? (
                <div className={`border rounded-3xl py-16 px-4 text-center max-w-xl mx-auto ${
                  isDark ? 'bg-zinc-900/20 border-zinc-800/80' : 'bg-white border-zinc-200 shadow-sm'
                }`}>
                  <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-250 text-zinc-400'
                  }`}>
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>
                    {t.noDesignsFound}
                  </h3>
                  <p className={`text-xs mt-2 max-w-xs mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t.noDesignsSub}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className={`mt-5 font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer ${
                      isDark ? 'bg-white hover:bg-zinc-100 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {t.resetFilters}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredDesigns.map((design) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      theme={theme}
                      lang={lang}
                      onView={() => handleInspectDesign(design)}
                      onLike={() => handleLikeDesign(design.id)}
                      isLikedByUser={likedDesigns.includes(design.id)}
                      onDelete={() => handleDeleteDesign(design.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ================= tab: STUDIO ================= */}
          {activeTab === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Studio Header Card */}
              <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden ${
                isRtl ? 'md:flex-row-reverse text-right' : 'text-left'
              } ${
                isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
              }`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_50%)]" />
                
                <div className="space-y-2 relative">
                  <span className={`text-[9px] font-bold tracking-widest uppercase font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {lang === 'ar' ? 'مساحة عمل الناشر' : 'Publisher Workspace'}
                  </span>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                    {t.studioWelcomeTitle}
                  </h1>
                  <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t.studioWelcomeSub}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 relative w-full md:w-auto">
                  <button
                    onClick={() => setStudioSubTab('publish')}
                    className={`font-bold text-xs px-6 py-3 rounded-full flex items-center justify-center gap-1.5 flex-1 md:flex-none shadow-md transition-colors cursor-pointer font-sans ${
                      isRtl ? 'flex-row-reverse' : ''
                    } ${
                      isDark ? 'bg-white hover:bg-zinc-200 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t.publishAssetBtn}
                  </button>
                </div>
              </div>

              {/* Studio Navigation & Tabs bar */}
              <div className={`flex border-b pt-2 items-center justify-between ${
                isRtl ? 'flex-row-reverse' : ''
              } ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}>
                <div className={`flex gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setStudioSubTab('portfolio')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 relative cursor-pointer ${
                      studioSubTab === 'portfolio'
                        ? (isDark ? 'border-white text-white' : 'border-zinc-950 text-zinc-950')
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-350'
                    }`}
                  >
                    {t.portfolioTab} ({designerPortfolio.length})
                  </button>
                  <button
                    onClick={() => setStudioSubTab('publish')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 cursor-pointer ${
                      studioSubTab === 'publish'
                        ? (isDark ? 'border-white text-white' : 'border-zinc-950 text-zinc-950')
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-350'
                    }`}
                  >
                    {t.publishTab}
                  </button>
                  <button
                    onClick={() => setStudioSubTab('inquiries')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 relative cursor-pointer ${
                      studioSubTab === 'inquiries'
                        ? (isDark ? 'border-white text-white' : 'border-zinc-950 text-zinc-950')
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-350'
                    }`}
                  >
                    {t.inquiriesTab}
                    {pendingLeadsCount > 0 && (
                      <span className={`ml-1.5 font-black text-[9px] px-1.5 py-0.5 rounded-full ${
                        isDark ? 'bg-white text-zinc-950' : 'bg-zinc-900 text-white'
                      }`}>
                        {pendingLeadsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Studio Switch Grid */}
              <div className="pt-4">
                <AnimatePresence mode="wait">
                  
                  {/* subtab: PORTFOLIO */}
                  {studioSubTab === 'portfolio' && (
                    <motion.div
                      key="portfolio"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-6"
                    >
                      {designerPortfolio.length === 0 ? (
                        <div className={`border rounded-3xl p-12 text-center max-w-xl mx-auto ${
                          isDark ? 'bg-zinc-900/20 border-zinc-800/80 text-zinc-400' : 'bg-white border-zinc-200 shadow-sm'
                        }`}>
                          <Palette className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                          <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.emptyPortfolio}</h3>
                          <p className={`text-xs mt-1.5 max-w-xs mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            {t.emptyPortfolioSub}
                          </p>
                          <button
                            onClick={() => setStudioSubTab('publish')}
                            className={`mt-5 font-bold text-xs px-6 py-2.5 rounded-full transition-colors cursor-pointer ${
                              isDark ? 'bg-white hover:bg-zinc-200 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                            }`}
                          >
                            {t.publishFirstAsset}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {designerPortfolio.map((design) => (
                              <DesignCard
                                key={design.id}
                                design={design}
                                theme={theme}
                                lang={lang}
                                onView={() => handleInspectDesign(design)}
                                onLike={() => handleLikeDesign(design.id)}
                                isLikedByUser={likedDesigns.includes(design.id)}
                                onDelete={() => handleDeleteDesign(design.id)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                   {/* subtab: PUBLISH FORM */}
                  {studioSubTab === 'publish' && (
                    <motion.div
                      key="publish"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {!isAuthorizedToPost ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 ${
                            isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                          }`}
                        >
                          <div className={`w-14 h-14 border rounded-2xl flex items-center justify-center mx-auto ${
                            isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-amber-500/5 border-amber-500/15 text-amber-600'
                          }`}>
                            <Lock className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <h3 className={`text-lg font-black tracking-tight font-display ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                              {isRtl ? 'الوصول مقيد - حساب غير مصرح به' : 'Restricted Access - Unauthorized Account'}
                            </h3>
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                              {isRtl 
                                ? 'صلاحيات نشر التصاميم والأصول الجديدة مقتصرة فقط على حسابات المطورين المعتمدة لتفادي الإغراق العشوائي. يرجى تهيئة بريدك الإلكتروني المصرح به في إعدادات ملفك الشخصي لتفعيل خيارات النشر.' 
                                : 'Publishing capabilities are exclusively reserved for verified designer emails. Please configure an authorized publisher email in your profile to unlock.'}
                            </p>
                          </div>

                          {/* Secure badge info */}
                          <div className={`p-4 rounded-xl border inline-block text-left w-full sm:w-auto ${
                            isDark ? 'bg-[#030303]/60 border-zinc-850' : 'bg-zinc-50 border-zinc-250'
                          }`}>
                            <p className="text-[10px] leading-relaxed text-zinc-500 text-center">
                              {isRtl 
                                ? 'يرجى التأكد من ضبط بريدك الإلكتروني في الملف الشخصي على بريد معتمد لمطور أو مسؤول مسجل لدينا.' 
                                : 'Please ensure your profile is set to a verified administrator or team developer email address.'}
                            </p>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => setIsProfileModalOpen(true)}
                              className={`font-bold text-xs px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-md ${
                                isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                              }`}
                            >
                              {isRtl ? 'إعداد الملف الشخصي والمحفظة' : 'Configure Profile / Set Email'}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <DesignUploadForm onPublish={handlePublishDesign} onAddToast={addToast} theme={theme} lang={lang} />
                      )}
                    </motion.div>
                  )}

                  {/* subtab: CLIENT INQUIRIES */}
                  {studioSubTab === 'inquiries' && (
                    <motion.div
                      key="inquiries"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <InquiriesList
                        inquiries={inquiries}
                        onUpdateStatus={handleUpdateInquiryStatus}
                        onDeleteInquiry={handleDeleteInquiry}
                        theme={theme}
                        lang={lang}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- Footer bar --- */}
      <footer className={`border-t py-12 mt-20 transition-all ${
        isDark ? 'bg-[#09090b] border-zinc-900' : 'bg-zinc-100/60 border-zinc-200'
      }`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6 ${
          isRtl ? 'sm:flex-row-reverse' : ''
        }`}>
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
              isDark ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'
            }`}>
              {isRtl ? 'م' : 'D'}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {t.footerTitle}
              </p>
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {t.footerSub}
              </p>
            </div>
          </div>
          <div className={`text-xs font-medium flex items-center gap-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'} ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{t.verifiedEnvironment}</span>
            <span>•</span>
            <span>{t.monochromeActive}</span>
          </div>
        </div>
      </footer>

       {/* --- Global Details Modal --- */}
       <AnimatePresence>
         {selectedDesign && (
           <DesignDetailsModal
             design={selectedDesign}
             onClose={() => setSelectedDesign(null)}
             onLike={() => handleLikeDesign(selectedDesign.id)}
             isLikedByUser={likedDesigns.includes(selectedDesign.id)}
             onAddInquiry={handleAddInquiry}
             isDesignerMode={selectedDesign.designerName === profile.name || selectedDesign.designerName === 'You (Studio Owner)'}
             onDeleteDesign={() => handleDeleteDesign(selectedDesign.id)}
             theme={theme}
             lang={lang}
           />
         )}
       </AnimatePresence>
 
       {/* --- Profile Configuration Modal --- */}
       <AnimatePresence>
         {isProfileModalOpen && (
           <ProfileModal
             isOpen={isProfileModalOpen}
             onClose={() => setIsProfileModalOpen(false)}
             profile={profile}
             onSave={(updated) => {
               setProfile(updated);
               localStorage.setItem('marketplace_profile', JSON.stringify(updated));
               if (lang === 'ar') {
                 addToast('success', 'تم حفظ الملف الشخصي', 'تم تحديث معلومات المصمم هويتك بنجاح.');
               } else {
                 addToast('success', 'Profile Updated', 'Your designer profile details have been saved successfully.');
               }
             }}
             theme={theme}
             lang={lang}
           />
         )}
       </AnimatePresence>
 
       {/* --- Floating WhatsApp Quick Connect Badge --- */}
       <a
         href="https://wa.me/201035592514"
         target="_blank"
         rel="noreferrer"
         className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-all hover:scale-115 flex items-center gap-2 group cursor-pointer"
         title={isRtl ? 'تواصل معنا على واتساب' : 'Contact on WhatsApp'}
       >
         <span className="relative flex h-2.5 w-2.5">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
         </span>
         <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider font-sans whitespace-nowrap">
           {isRtl ? 'واتساب 01035592514' : 'WA 01035592514'}
         </span>
         <svg
           className="w-4 h-4 fill-current"
           viewBox="0 0 24 24"
         >
           <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.904-6.99C16.546 1.874 14.068.831 11.435.831c-5.44 0-9.865 4.42-9.869 9.865-.001 1.716.463 3.39 1.34 4.873l-.997 3.642 3.738-.981zm12.39-6.223c-.303-.151-1.793-.884-2.059-.982-.266-.099-.459-.148-.654.149-.193.299-.753.982-.921 1.178-.168.197-.337.221-.64.071-.303-.15-1.28-.472-2.438-1.504-.901-.803-1.51-1.795-1.687-2.1-.178-.303-.019-.466.13-.615.136-.134.303-.351.455-.527.15-.176.201-.299.302-.502.102-.201.05-.378-.025-.526-.075-.149-.654-1.579-.896-2.162-.236-.569-.475-.49-.654-.5-.169-.008-.364-.01-.559-.01-.195 0-.514.073-.783.364-.269.299-1.026 1.002-1.026 2.445 0 1.443 1.05 2.837 1.196 3.037.146.197 2.067 3.157 5.006 4.43.7.303 1.246.484 1.672.62.704.223 1.346.191 1.854.115.565-.084 1.793-.733 2.048-1.442.256-.709.256-1.315.18-1.442-.075-.126-.27-.201-.573-.351z"/>
         </svg>
       </a>
 
       {/* --- Toast System Portal --- */}
       <Notification toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
