import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Eye, Calendar, Mail, Tag, DollarSign, Send, ShoppingBag, Trash2, MessageSquare, CreditCard } from 'lucide-react';
import { Design, Inquiry } from '../types';
import { formatDate, formatCurrency } from '../utils';
import { translations, getCategoryName } from '../translations';

interface DesignDetailsModalProps {
  design: Design;
  onClose: () => void;
  onLike: () => void;
  isLikedByUser: boolean;
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  onDeleteDesign?: () => void;
  isDesignerMode: boolean;
  theme?: 'dark' | 'light';
  lang?: 'en' | 'ar';
}

export default function DesignDetailsModal({
  design,
  onClose,
  onLike,
  isLikedByUser,
  onAddInquiry,
  onDeleteDesign,
  isDesignerMode,
  theme = 'dark',
  lang = 'en',
}: DesignDetailsModalProps) {
  const [formType, setFormType] = useState<'inquiry' | 'purchase' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'vodafone' | 'card'>('vodafone');
  const [vodafoneWalletNumber, setVodafoneWalletNumber] = useState('');

  // Simulated card details for purchase form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  // Initialize message draft
  useEffect(() => {
    if (formType === 'inquiry') {
      if (lang === 'ar') {
        setMessage(`مرحباً ${design.designerName === 'You (Studio Owner)' || design.designerName.includes('You') ? 'أنت (مالك الاستوديو)' : design.designerName}،\n\nأعجبني عملك "${design.title}" المعروض في معرض "المصمم المظلم" وأود العمل معك في مشروع مخصص بناءً على هذا الأسلوب الجمالي!`);
      } else {
        setMessage(`Hi ${design.designerName},\n\nI love your "${design.title}" work on DARK DESIGNER and would love to work with you on a custom project based on this style!`);
      }
    } else if (formType === 'purchase') {
      if (lang === 'ar') {
        setMessage(`مرحباً ${design.designerName === 'You (Studio Owner)' || design.designerName.includes('You') ? 'أنت (مالك الاستوديو)' : design.designerName}،\n\nأنا بصدد شراء ترخيص استخدام رقمي لتصميمك "${design.title}". يرجى إرسال حزمة الملفات المصدرية عالية الدقة بعد معالجة الطلب.`);
      } else {
        setMessage(`Hi ${design.designerName},\n\nI am purchasing a digital usage license for your design "${design.title}". Please send over the high-resolution source file package.`);
      }
    }
  }, [formType, design, lang]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || (formType === 'inquiry' && !message)) return;

    setIsSubmitting(true);

    // Simulate standard server-side processing delay
    setTimeout(() => {
      onAddInquiry({
        designId: design.id,
        designTitle: design.title,
        customerName: name,
        customerEmail: email,
        customerCompany: company || undefined,
        budget: formType === 'purchase'
          ? `${formatCurrency(design.price)} (${paymentMethod === 'vodafone' ? `Vodafone Cash: ${vodafoneWalletNumber}` : 'Credit Card'})`
          : (budget || 'Not specified'),
        message: message + (formType === 'purchase' && paymentMethod === 'vodafone' 
          ? `\n\n[Vodafone Cash payment sent from wallet number: ${vodafoneWalletNumber} to 01035592514]` 
          : ''),
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear form inputs
      setName('');
      setEmail('');
      setCompany('');
      setBudget('');
      setMessage('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setVodafoneWalletNumber('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        id="modal-backdrop"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`relative rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[85vh] border ${
          isRtl ? 'md:flex-row-reverse' : ''
        } ${
          isDark
            ? 'bg-[#0d0d0f] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
        id={`design-modal-${design.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} md:top-6 md:${
            isRtl ? 'left-6' : 'right-6'
          } p-2 rounded-full border shadow-md transition-all duration-200 z-20 cursor-pointer ${
            isDark
              ? 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
              : 'bg-zinc-100/90 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-850 border-zinc-200'
          }`}
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Dynamic Image Gallery */}
        <div className={`w-full md:w-1/2 relative flex items-center justify-center border-b md:border-b-0 max-h-[300px] md:max-h-full overflow-hidden ${
          isRtl ? 'md:border-l' : 'md:border-r'
        } ${
          isDark
            ? 'bg-[#050505] border-zinc-900'
            : 'bg-zinc-50 border-zinc-150'
        }`}>
          <img
            src={design.imageUrl}
            alt={design.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover md:object-contain max-h-[300px] md:max-h-[85vh] select-none"
          />
        </div>

        {/* Right Side: Showcase info & Interaction flow */}
        <div className={`w-full md:w-1/2 flex flex-col overflow-y-auto p-6 md:p-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex-1">
            {/* Header: Title and Pricing */}
            <div className="mb-4">
              <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {getCategoryName(design.category, lang)}
              </span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight mt-1 font-display ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {design.title}
              </h2>
              <div className={`flex items-center gap-2 mt-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {design.price !== undefined ? formatCurrency(design.price) : t.customQuote}
                </span>
                {design.price !== undefined && (
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest font-mono ${
                    isDark
                      ? 'text-zinc-300 bg-zinc-900 border-zinc-800'
                      : 'text-zinc-700 bg-zinc-100 border-zinc-200'
                  }`}>
                    {t.digitalLicense}
                  </span>
                )}
              </div>
            </div>

            {/* Designer Bio Card */}
            <div className={`flex items-center gap-3 p-3 rounded-2xl border mb-6 ${
              isRtl ? 'flex-row-reverse' : ''
            } ${
              isDark
                ? 'bg-zinc-900/40 border-zinc-800/80'
                : 'bg-zinc-50 border-zinc-200'
            }`}>
              <img
                src={design.designerAvatar}
                alt={design.designerName}
                className={`w-10 h-10 rounded-full object-cover shadow-sm ring-2 ${
                  isDark ? 'ring-zinc-800' : 'ring-zinc-200'
                }`}
              />
              <div className="flex-1 min-w-0">
                <h4 className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>{lang === 'ar' ? 'المصمم' : 'Creator'}</h4>
                <p className={`text-xs font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {lang === 'ar' && design.designerName === 'You (Studio Owner)' ? 'أنت (مالك الاستوديو)' : design.designerName}
                </p>
              </div>
              <div>
                <button
                  onClick={onLike}
                  className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    isLikedByUser
                      ? (isDark ? 'bg-white text-zinc-950 border-white shadow-sm' : 'bg-zinc-900 text-white border-zinc-900 shadow-sm')
                      : (isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800' : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-850 hover:bg-zinc-50')
                  }`}
                  title={isLikedByUser ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-4 h-4 ${isLikedByUser ? (isDark ? 'fill-zinc-950 stroke-zinc-950' : 'fill-white stroke-white') : ''}`} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className={`text-[9px] font-bold uppercase tracking-wider font-mono mb-2 ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>{lang === 'ar' ? 'عن العمل الفني' : 'About the design'}</h4>
              <p className={`text-xs leading-relaxed whitespace-pre-line ${
                isDark ? 'text-zinc-300' : 'text-zinc-655'
              }`}>
                {design.description}
              </p>
            </div>

            {/* Tags */}
            <div className={`mb-6 flex flex-wrap gap-1.5 items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Tag className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'} ${isRtl ? 'ml-1' : 'mr-1'}`} />
              {design.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border font-mono ${
                    isDark
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800/60'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-250'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className={`flex items-center gap-6 text-xs mb-8 border-t pt-4 ${
              isRtl ? 'flex-row-reverse' : ''
            } ${
              isDark ? 'text-zinc-500 border-zinc-800/80' : 'text-zinc-400 border-zinc-200'
            }`}>
              <div className={`flex items-center gap-1.5 font-mono ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Eye className="w-4 h-4" />
                <span><strong className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{design.views}</strong> {t.views}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Heart className="w-4 h-4" />
                <span><strong className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{design.likes}</strong> {t.likes}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تاريخ النشر ' : 'Published '}{formatDate(design.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Interface Container */}
          <div className={`border-t pt-6 mt-auto ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
            {onDeleteDesign ? (
              <div className={`border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isRtl ? 'sm:flex-row-reverse' : ''
              } ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className={`text-xs font-bold uppercase tracking-widest font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {lang === 'ar' ? 'أدوات الإزالة والتحكم' : 'Asset Deletion Controls'}
                  </p>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                    {lang === 'ar' ? 'إذا لم يعجبك هذا العمل الفني، يمكنك حذفه وإزالته تماماً من المعرض.' : 'If you do not like this post, you can delete it and remove it from the directory.'}
                  </p>
                </div>
                <button
                  onClick={onDeleteDesign}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center cursor-pointer ${
                    isDark
                      ? 'bg-zinc-900 hover:bg-[#1a1113] text-rose-400 border-zinc-800 hover:border-rose-950'
                      : 'bg-white hover:bg-rose-50/50 text-rose-600 border-zinc-250 hover:border-rose-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {lang === 'ar' ? 'حذف هذا المنشور' : 'Delete Post'}
                </button>
              </div>
            ) : formType === null ? (
              <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                {design.price !== undefined && (
                  <button
                    onClick={() => {
                      setFormType('purchase');
                      setIsSuccess(false);
                    }}
                    className={`flex-1 font-bold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer font-sans ${
                      isDark
                        ? 'bg-white hover:bg-zinc-200 text-zinc-950'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t.licenseAsset} ({formatCurrency(design.price)})
                  </button>
                )}
                <button
                  onClick={() => {
                    setFormType('inquiry');
                    setIsSuccess(false);
                  }}
                  className={`flex-1 font-bold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer font-sans ${
                    design.price !== undefined
                      ? (isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800' : 'bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200')
                      : (isDark ? 'bg-white hover:bg-zinc-200 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white')
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  {t.inquireCustom}
                </button>
              </div>
            ) : (
              /* Transaction or Inquiry Form */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-2xl p-5 ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {formType === 'purchase' ? t.purchaseTitle : t.inquiryTitle}
                  </h3>
                  <button
                    onClick={() => setFormType(null)}
                    className={`text-xs font-semibold underline cursor-pointer ${
                      isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 px-4"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isDark ? 'bg-white text-zinc-950' : 'bg-zinc-900 text-white'
                    }`}>
                      <Send className="w-5 h-5" />
                    </div>
                    <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {t.successTitle}
                    </h4>
                    <p className={`text-xs mt-2 max-w-sm mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                      {t.successBody}
                    </p>
                    <button
                      onClick={() => setFormType(null)}
                      className={`mt-4 font-bold text-xs px-5 py-2 rounded-full transition-colors cursor-pointer font-sans ${
                        isDark ? 'bg-white hover:bg-zinc-200 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
                    >
                      {t.closeGallery}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                          isDark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>{t.formName} *</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 border ${
                            isDark
                              ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700 focus:border-zinc-600'
                              : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400 focus:border-zinc-400'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                          isDark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>{t.formEmail} *</label>
                        <input
                          type="email"
                          required
                          placeholder="jane@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 border ${
                            isDark
                              ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700 focus:border-zinc-600'
                              : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400 focus:border-zinc-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                          isDark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>{t.formCompany}</label>
                        <input
                          type="text"
                          placeholder="Acme Inc."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 border ${
                            isDark
                              ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700 focus:border-zinc-600'
                              : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400 focus:border-zinc-400'
                          }`}
                        />
                      </div>
                      {formType === 'inquiry' ? (
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                            isDark ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>{t.formBudget}</label>
                          <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 border ${
                              isDark
                                ? 'bg-[#030303]/80 text-zinc-350 border-zinc-850 focus:ring-zinc-700'
                                : 'bg-white text-zinc-800 border-zinc-300 focus:ring-zinc-400'
                            }`}
                          >
                            <option value="">{lang === 'ar' ? 'اختر النطاق السعري...' : 'Select budget range...'}</option>
                            <option value="Under $500">{lang === 'ar' ? 'أقل من 500$' : 'Under $500'}</option>
                            <option value="$500 - $2,000">500$ - 2,000$</option>
                            <option value="$2,000 - $5,000">2,000$ - 5,000$</option>
                            <option value="$5,000+">5,000$+</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                            isDark ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>{lang === 'ar' ? 'سعر ترخيص العمل' : 'Product Price'}</label>
                          <div className={`flex items-center gap-1 w-full border rounded-xl px-3 py-2.5 text-xs font-bold font-mono ${
                            isRtl ? 'flex-row-reverse' : ''
                          } ${
                            isDark
                              ? 'bg-zinc-950 text-zinc-200 border-zinc-850'
                              : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                          }`}>
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{formatCurrency(design.price)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                     {formType === 'purchase' && (
                      <div className={`border p-4 rounded-xl space-y-4 ${
                        isDark ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-100 border-zinc-200'
                      }`}>
                        {/* Payment Selection Tabs */}
                        <div className="flex border rounded-lg overflow-hidden p-0.5 bg-black/10 dark:bg-black/40 border-zinc-200 dark:border-zinc-850">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('vodafone')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                              paymentMethod === 'vodafone'
                                ? (isDark ? 'bg-white text-zinc-950 font-black' : 'bg-zinc-900 text-white font-black')
                                : (isDark ? 'text-zinc-450 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900')
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'فودافون كاش / واتساب' : 'Vodafone Cash / WA'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                              paymentMethod === 'card'
                                ? (isDark ? 'bg-white text-zinc-950 font-black' : 'bg-zinc-900 text-white font-black')
                                : (isDark ? 'text-zinc-450 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900')
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card'}</span>
                          </button>
                        </div>

                        {paymentMethod === 'vodafone' ? (
                          <div className="space-y-3">
                            <div className={`p-3 rounded-xl border ${
                              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-250 shadow-xs'
                            }`}>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-350' : 'text-zinc-650'}`}>
                                {lang === 'ar' 
                                  ? 'يرجى تحويل قيمة التصميم إلى رقم فودافون كاش التالي:' 
                                  : 'Please transfer the design amount to the following Vodafone Cash wallet:'}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2.5 p-2 rounded-lg bg-[#e11d48]/10 border border-[#e11d48]/25">
                                <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider">
                                  {lang === 'ar' ? 'رقم الكاش' : 'Vodafone Cash'}
                                </span>
                                <code className="text-sm font-black font-mono text-zinc-900 dark:text-white select-all">
                                  01035592514
                                </code>
                              </div>
                            </div>

                            {/* Direct WhatsApp trigger */}
                            <a
                              href={`https://wa.me/201035592514?text=${encodeURIComponent(
                                lang === 'ar'
                                  ? `مرحباً، أود شراء تصميمك "${design.title}" بقيمة ${formatCurrency(design.price)} عبر فودافون كاش.`
                                  : `Hello, I want to purchase your design "${design.title}" for ${formatCurrency(design.price)} via Vodafone Cash.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2 px-3 border rounded-xl font-bold text-[10px] uppercase tracking-wider text-emerald-600 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4 fill-emerald-600 text-transparent" />
                              <span>{lang === 'ar' ? 'تأكيد الدفع عبر واتساب' : 'Confirm via WhatsApp'}</span>
                            </a>

                            <div>
                              <label className={`block text-[9px] font-bold mb-1.5 font-mono uppercase tracking-wider ${
                                isDark ? 'text-zinc-400' : 'text-zinc-650'
                              }`}>
                                {lang === 'ar' ? 'رقم محفظتك (المُرسِل منه) *' : 'Your Wallet Number (Sent From) *'}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="01012345678"
                                value={vodafoneWalletNumber}
                                onChange={(e) => setVodafoneWalletNumber(e.target.value.replace(/[^\d]/g, ''))}
                                className={`w-full text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 border ${
                                  isDark
                                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className={`block text-[9px] font-bold mb-1 font-mono uppercase ${
                                isDark ? 'text-zinc-400' : 'text-zinc-650'
                              }`}>{t.cardNumber}</label>
                              <input
                                type="text"
                                required
                                placeholder="•••• •••• •••• ••••"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                                className={`w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 border ${
                                  isDark
                                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={`block text-[9px] font-bold mb-1 font-mono uppercase ${
                                  isDark ? 'text-zinc-400' : 'text-zinc-650'
                                }}`}>{t.cardExpiry}</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className={`w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 border ${
                                    isDark
                                      ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                                      : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className={`block text-[9px] font-bold mb-1 font-mono uppercase ${
                                  isDark ? 'text-zinc-400' : 'text-zinc-650'
                                }}`}>{t.cardCvc}</label>
                                <input
                                  type="password"
                                  required
                                  placeholder="•••"
                                  maxLength={4}
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                                  className={`w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 border ${
                                    isDark
                                      ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                                      : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>{t.formMessage}</label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 resize-none leading-relaxed border ${
                          isDark
                            ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                            : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer font-sans ${
                        isDark
                          ? 'bg-white hover:bg-zinc-250 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950'
                          : 'bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
                            isDark ? 'border-zinc-400 border-t-zinc-950' : 'border-zinc-400 border-t-white'
                          }`} />
                          <span>{lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{formType === 'purchase' ? t.submitPurchase : t.submitInquiry}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
