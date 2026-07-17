import React, { useState, useRef } from 'react';
import { Upload, X, Tag, DollarSign, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Design, Category } from '../types';
import { compressImage } from '../utils';
import { translations, getCategoryName } from '../translations';

interface DesignUploadFormProps {
  onPublish: (design: Omit<Design, 'id' | 'createdAt' | 'likes' | 'views' | 'designerName' | 'designerAvatar'>) => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, desc: string) => void;
  theme?: 'dark' | 'light';
  lang?: 'en' | 'ar';
}

const CATEGORIES: Exclude<Category, 'All'>[] = [
  'UI/UX Design',
  'Graphic Design',
  '3D Art',
  'Brand Identity',
  'Illustration',
  'Motion Graphics',
];

export default function DesignUploadForm({
  onPublish,
  onAddToast,
  theme = 'dark',
  lang = 'en',
}: DesignUploadFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('UI/UX Design');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [price, setPrice] = useState('');
  const [allowCustomQuotes, setAllowCustomQuotes] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  // Trigger file selection
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Convert and compress file to Base64
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      if (lang === 'ar') {
        onAddToast('error', 'نوع ملف غير صالح', 'يرجى تحميل ملف صورة صالح (PNG, JPG, WEBP).');
      } else {
        onAddToast('error', 'Invalid File Type', 'Please upload a valid image file (PNG, JPG, WEBP).');
      }
      return;
    }

    setIsCompiling(true);
    try {
      const base64 = await compressImage(file, 1000, 1000, 0.75);
      setImageFile(file);
      setImagePreview(base64);
      if (lang === 'ar') {
        onAddToast('success', 'الصورة جاهزة', 'تم تحسين صورة الغلاف الفني بنجاح لسرعة التحميل.');
      } else {
        onAddToast('success', 'Image Ready', 'Your design showcase image was optimized successfully.');
      }
    } catch (err) {
      if (lang === 'ar') {
        onAddToast('error', 'فشل التحسين', 'تعذر ضغط الصورة الحالية. يرجى تجربة ملف آخر.');
      } else {
        onAddToast('error', 'Optimization Failed', "We couldn't compress the image. Try another file.");
      }
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imagePreview) {
      if (lang === 'ar') {
        onAddToast('error', 'متطلبات ناقصة', 'عنوان التصميم والوصف الفني وصورة الغلاف مطلوبة لإتمام النشر.');
      } else {
        onAddToast('error', 'Missing Requirements', 'A design title, description, and preview image are required.');
      }
      return;
    }

    // Split and filter tags
    const tags = tagsInput
      .split(/[\s,]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onPublish({
      title,
      description,
      category,
      tags: tags.length > 0 ? tags : ['Creative'],
      imageUrl: imagePreview,
      price: price ? Math.max(0, parseFloat(price)) : undefined,
      allowCustomQuotes,
      featured: isFeatured,
    });

    // Reset Form
    setTitle('');
    setCategory('UI/UX Design');
    setDescription('');
    setTagsInput('');
    setPrice('');
    setAllowCustomQuotes(true);
    setIsFeatured(false);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border ${
      isRtl ? 'text-right' : 'text-left'
    } ${
      isDark
        ? 'bg-zinc-900/40 border-zinc-800 text-zinc-100'
        : 'bg-white border-zinc-200 text-zinc-900 shadow-md'
    }`} id="design-upload-form">
      <div className={`mb-6 flex items-start gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 ${
          isDark ? 'bg-[#030303] border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
        }`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className={`text-lg font-bold tracking-tight font-display uppercase tracking-widest ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            {t.publishNewTitle}
          </h2>
          <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {lang === 'ar' 
              ? 'أدخل المواصفات الخاصة بتصميمك الرقمي، وحدد تكلفة ترخيص العمل، وقم بتحميل صورة غلاف مذهلة لجذب المشترين وطلبات تسعير المشاريع المخصصة.' 
              : 'Fill in specs about your visual design, setup license costs, and upload a pristine cover graphics preview display to attract buyers and Custom Quote contract inquiries.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isRtl ? 'direction-rtl' : ''}`}>
          
          {/* Left Column: Image Drag & Drop Uploader */}
          <div className="lg:col-span-5 flex flex-col">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {lang === 'ar' ? 'صورة الغلاف الفني *' : 'Showcase Cover Graphics *'}
            </label>
            
            <div className="flex-1 flex flex-col justify-center">
              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleSelectClick}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[300px] transition-all duration-200 ${
                    isDragging
                      ? (isDark ? 'border-white bg-zinc-900/60 scale-[0.99]' : 'border-zinc-900 bg-zinc-50 scale-[0.99]')
                      : (isDark ? 'border-zinc-800 hover:border-zinc-700 hover:bg-[#050505]/50' : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50')
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {isCompiling ? (
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 border-3 rounded-full animate-spin mb-4 ${
                        isDark ? 'border-zinc-800 border-t-white' : 'border-zinc-200 border-t-zinc-900'
                      }`} />
                      <p className={`text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {lang === 'ar' ? 'جاري تحسين صورة الغلاف...' : 'Optimizing cover art...'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {lang === 'ar' ? 'جاري تعديل حجم الملف بدون فقدان الجودة' : 'Applying lossless size adjustments'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center shadow-sm mb-4 ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-800'
                      }`}>
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.uploadDragDrop}</p>
                      <p className={`text-xs mt-1.5 max-w-[200px] leading-relaxed mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {lang === 'ar' ? (
                          <>أو <span className="text-zinc-900 dark:text-white font-bold underline">تصفح ملفاتك المحلية</span> (JPG, PNG, WEBP)</>
                        ) : (
                          <>or <span className="text-zinc-900 dark:text-white font-bold underline">browse local files</span> (JPG, PNG, WEBP)</>
                        )}
                      </p>
                      <div className="mt-4 text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                        {t.uploadSupports}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`relative rounded-2xl overflow-hidden border aspect-[4/3] group shadow-inner ${
                  isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'
                }`}>
                  <img
                    src={imagePreview}
                    alt="Preview cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-zinc-900 hover:bg-zinc-850 text-rose-400 border border-zinc-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-all scale-95 group-hover:scale-100 duration-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      {lang === 'ar' ? 'إزالة الصورة' : 'Remove Image'}
                    </button>
                  </div>
                  <div className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-1.5 border border-zinc-800/80`}>
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
                    {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB raw` : 'Imported Preview'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Category, Quote, Price, Tag specs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Design Title */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {t.formAssetTitle} *
              </label>
              <input
                type="text"
                required
                maxLength={70}
                placeholder={lang === 'ar' ? 'مثال: تصميم نموذج واجهات مستخدم مذهل' : 'e.g., Ultra Skincare Packaging Mockups'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 border ${
                  isDark
                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                }`}
              />
            </div>

            {/* Category selection */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {t.formCategory} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={`w-full text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 border ${
                  isDark
                    ? 'bg-[#030303]/80 text-zinc-350 border-zinc-850 focus:ring-zinc-700'
                    : 'bg-white text-zinc-800 border-zinc-300 focus:ring-zinc-400'
                }`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryName(cat, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Model configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Asset License Price */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {t.formPrice}
                </label>
                <div className="relative">
                  <span className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-zinc-500`}>
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder={t.formPriceNote}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full text-sm rounded-xl py-3 focus:outline-none focus:ring-2 font-mono border ${
                      isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                    } ${
                      isDark
                        ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                        : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  {lang === 'ar' ? 'يسمح بالشراء المباشر للرخصة. تركه فارغاً يجعل العمل متاحاً للاستفسار والطلب فقط.' : 'Allows direct checkout. Empty forces custom inquiries only.'}
                </span>
              </div>

              {/* Toggles */}
              <div className="flex flex-col justify-center space-y-2.5 pt-3 sm:pt-0">
                <label className={`flex items-center gap-2.5 cursor-pointer select-none ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={allowCustomQuotes}
                    onChange={(e) => setAllowCustomQuotes(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#030303] border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                  />
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <span className={`text-xs font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.formQuotesOption}</span>
                    <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">{t.formQuotesNote}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 cursor-pointer select-none ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#030303] border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                  />
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <span className={`text-xs font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{lang === 'ar' ? 'تمييز كاختيار المحرر' : 'Pin as Staff Pick'}</span>
                    <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">{lang === 'ar' ? 'لتسليط الضوء على هذا المشروع في المعرض الرئيسي' : 'Highlights this project on the homepage grid'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <div className={`flex items-center justify-between mb-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <label className={`block text-[10px] font-bold uppercase tracking-widest font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {t.formTags}
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">{t.formTagsNote}</span>
              </div>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-zinc-500`}>
                  <Tag className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g., branding poster typography packaging"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className={`w-full text-sm rounded-xl py-3 focus:outline-none focus:ring-2 border ${
                    isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  } ${
                    isDark
                      ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                      : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                  }`}
                />
              </div>
            </div>

            {/* Description Details */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {t.formDesc} *
              </label>
              <textarea
                required
                rows={4}
                maxLength={1000}
                placeholder={lang === 'ar' ? 'قدم تفاصيل حول الأدوات المستخدمة (Figma, Blender, Photoshop)، والمخططات الهندسية، وما هو مدرج في حزمة الأصول المرخصة، وكيف يمكن للعملاء الاستفادة من هذا العمل.' : 'Give background about the tools used (Figma, Blender, Photoshop), grid layouts, what is included in the assets bundle, and how customers can apply this work.'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 resize-none leading-relaxed border ${
                  isDark
                    ? 'bg-[#030303]/60 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                    : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                }`}
              />
            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className={`border-t pt-5 mt-6 flex ${isRtl ? 'justify-start border-zinc-800' : 'justify-end border-zinc-800/80'}`}>
          <button
            type="submit"
            className={`font-bold text-xs px-8 py-3.5 rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer font-sans uppercase tracking-wider ${
              isDark
                ? 'bg-white hover:bg-zinc-200 text-zinc-950'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t.publishToMarketplace}
          </button>
        </div>
      </form>
    </div>
  );
}
