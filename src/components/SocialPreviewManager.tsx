import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Trash2, Image as ImageIcon, Eye, RefreshCw, 
  Sparkles, CheckCircle, Smartphone, AlertCircle, X, ShieldAlert 
} from 'lucide-react';

interface SocialPreviewConfig {
  imageUrl: string;
  width: number;
  height: number;
  type: string;
  hasCustomImage: boolean;
}

interface SocialPreviewManagerProps {
  theme: 'dark' | 'light';
  lang: 'en' | 'ar';
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export default function SocialPreviewManager({
  theme,
  lang,
  onAddToast
}: SocialPreviewManagerProps) {
  const [config, setConfig] = useState<SocialPreviewConfig>({
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    hasCustomImage: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'discord'>('whatsapp');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  // Fetch current config on load
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/social-preview');
      if (res.ok) {
        const data = await res.json();
        // Since `/og-image.jpg` might be cached, let's append a timestamp query param to bypass cache in live preview
        if (data.hasCustomImage) {
          data.imageUrl = `${data.imageUrl}?t=${Date.now()}`;
        }
        setConfig(data);
      }
    } catch (e) {
      console.error('Error fetching social config:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onAddToast(
        'error',
        isRtl ? 'تنسيق غير مدعوم' : 'Unsupported format',
        isRtl ? 'يرجى اختيار صورة بتنسيق JPG أو PNG أو WEBP' : 'Please select a JPG, PNG, or WEBP image.'
      );
      return;
    }

    setIsUploading(true);

    try {
      // Read dimensions
      const imageDimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = URL.createObjectURL(file);
      });

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          const res = await fetch('/api/social-preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64String,
              width: imageDimensions.width,
              height: imageDimensions.height,
              type: file.type
            })
          });

          if (res.ok) {
            const updatedConfig = await res.json();
            updatedConfig.imageUrl = `${updatedConfig.imageUrl}?t=${Date.now()}`;
            setConfig(updatedConfig);
            onAddToast(
              'success',
              isRtl ? 'تم تحديث صورة المعاينة' : 'Social Preview Updated',
              isRtl 
                ? 'تم بنجاح تحميل وحفظ صورة المعاينة وتحديث جميع بيانات Open Graph!' 
                : 'The social preview image was successfully uploaded and all metadata tags were updated!'
            );
          } else {
            throw new Error('Upload failed');
          }
        } catch (uploadError) {
          console.error(uploadError);
          onAddToast(
            'error',
            isRtl ? 'خطأ في الحفظ' : 'Save Error',
            isRtl ? 'فشل إرسال وحفظ الصورة على الخادم' : 'Failed to upload and save the image on the server.'
          );
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      onAddToast(
        'error',
        isRtl ? 'خطأ في معالجة الصورة' : 'Image Process Error',
        isRtl ? 'حدث خطأ أثناء قراءة أبعاد الصورة' : 'An error occurred while reading image dimensions.'
      );
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/social-preview', {
        method: 'DELETE'
      });
      if (res.ok) {
        const defaultData = await res.json();
        setConfig(defaultData);
        onAddToast(
          'success',
          isRtl ? 'تمت إزالة الصورة بنجاح' : 'Image Removed Successfully',
          isRtl ? 'تمت إعادة تعيين صورة المعاينة الاجتماعية الافتراضية بنجاح.' : 'The custom social preview image has been reset to default.'
        );
      } else {
        throw new Error('Reset failed');
      }
    } catch (e) {
      console.error(e);
      onAddToast(
        'error',
        isRtl ? 'خطأ في الإزالة' : 'Removal Error',
        isRtl ? 'فشل في إعادة تعيين الصورة الافتراضية' : 'Failed to reset to default image.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Mock site details for render
  const siteDomain = 'asta-design-web.com';
  const siteUrl = 'https://asta-design-web.com';
  const siteTitle = lang === 'ar' ? 'ASTA DESIGN WEB | منصة التصاميم الاحترافية' : 'ASTA DESIGN WEB - Premium Creative Portfolio Hub';
  const siteDescription = lang === 'ar' 
    ? 'منصة راقية ومبسطة لعرض وترخيص المخططات التفاعلية، الأصول، ومفاهيم التغليف العالمية. احصل على قوالب مميزة أو اطلب مشاريع مخصصة.'
    : 'An ultra-premium dark-themed design marketplace and creative portfolio hub where elite artists publish high-quality visual designs.';

  return (
    <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden transition-all ${
      isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
    }`}>
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.015),transparent_50%)] pointer-events-none" />

      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
        <div className="space-y-1">
          <h2 className={`text-lg font-bold font-display uppercase tracking-wider flex items-center gap-2 ${
            isRtl ? 'flex-row-reverse' : ''
          } ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            <ImageIcon className="w-5 h-5 text-zinc-500" />
            {isRtl ? 'صورة معاينة الشبكات الاجتماعية' : 'Social Preview Image'}
          </h2>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {isRtl 
              ? 'قم بتهيئة الصورة المصغرة التي تظهر للمستخدمين عند مشاركة رابط الموقع على شبكات التواصل مثل WhatsApp و Discord و Telegram و Facebook و X.' 
              : 'Configure the default rich thumbnail card that appears when your platform link is shared on major platforms.'}
          </p>
        </div>

        {/* Action Quick Badge */}
        <div className={`flex items-center gap-2 self-start sm:self-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          {config.hasCustomImage ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
              <CheckCircle className="w-3.5 h-3.5" />
              {isRtl ? 'نشط ومخصص' : 'Active & Custom'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-500 border border-zinc-500/25">
              <AlertCircle className="w-3.5 h-3.5" />
              {isRtl ? 'الافتراضي نشط' : 'Default Active'}
            </span>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      {/* Manager Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Dynamic Live Thumbnail Preview Card */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`relative aspect-video rounded-2xl overflow-hidden border group shadow-lg ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm z-10">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
                <span className="text-xs text-zinc-400 font-mono">Loading config...</span>
              </div>
            ) : isUploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm z-10">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
                <span className="text-xs text-zinc-400 font-mono">Uploading image...</span>
              </div>
            ) : null}

            {/* Displaying Image */}
            <img 
              src={config.imageUrl} 
              alt="Social Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If local route fails, fallback to standard Unsplash image
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {/* Absolute Overlay metadata badge */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/75 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
              <div className="space-y-0.5 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                  {isRtl ? 'رابط الصورة النشط' : 'Active File'}
                </p>
                <p className="text-xs font-bold text-white font-mono truncate max-w-[180px] sm:max-w-[280px]">
                  {config.hasCustomImage ? '/og-image.jpg' : 'Unsplash (Default)'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                  {isRtl ? 'الأبعاد والنوع' : 'Dimensions & Type'}
                </p>
                <p className="text-xs font-bold text-white font-mono">
                  {config.width} × {config.height} px • {config.type.split('/')[1]?.toUpperCase() || 'JPEG'}
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines info box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            isDark ? 'bg-zinc-950/40 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
          }`}>
            <Sparkles className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-zinc-350 dark:text-zinc-200">
                {isRtl ? 'المواصفات المثالية الموصى بها:' : 'Recommended Specifications:'}
              </p>
              <ul className={`list-disc pl-4 space-y-0.5 ${isRtl ? 'pr-4 pl-0 text-right' : 'text-left'}`}>
                <li>{isRtl ? 'النسبة المثالية: 1.91:1 (لتجنب الاقتصاص التلقائي)' : 'Optimal Aspect Ratio: 1.91:1 (To prevent automatic cropping)'}</li>
                <li>{isRtl ? 'الحجم الموصى به: 1200 × 630 بكسل' : 'Recommended Dimensions: 1200 × 630 pixels'}</li>
                <li>{isRtl ? 'التنسيقات المدعومة: PNG, JPG, WEBP فقط' : 'Supported File Formats: PNG, JPG, WEBP only'}</li>
                <li>{isRtl ? 'تتم معالجة الصورة وإضافتها محلياً وتحديث ملفات التعريف ديناميكياً' : 'Images are processed locally, saved securely on our servers, and instantly distributed.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Action Control Buttons & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {isRtl ? 'خيارات الإدارة والتحكم' : 'Management Controls'}
            </label>
            
            <div className="flex flex-col gap-3">
              {/* UPLOAD / REPLACE BUTTON */}
              {!config.hasCustomImage ? (
                <button
                  type="button"
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                    isDark 
                      ? 'bg-white text-zinc-950 hover:bg-zinc-200' 
                      : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {isRtl ? 'تحميل صورة جديدة' : 'Upload Image'}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={triggerUpload}
                    disabled={isUploading}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] ${
                      isDark 
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                        : 'bg-zinc-150 text-zinc-900 hover:bg-zinc-200 border border-zinc-250'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {isRtl ? 'استبدال الصورة' : 'Replace Image'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/15 border border-red-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isRtl ? 'إزالة واستعادة' : 'Remove Image'}
                  </button>
                </div>
              )}

              {/* PREVIEW SOCIAL CARD BUTTON */}
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border shadow-sm hover:scale-[1.01] active:scale-[0.99] ${
                  isDark 
                    ? 'bg-[#030303]/40 hover:bg-[#030303]/80 border-zinc-800 text-zinc-300' 
                    : 'bg-white hover:bg-zinc-50 border-zinc-250 text-zinc-700'
                }`}
              >
                <Eye className="w-4 h-4 text-zinc-500" />
                {isRtl ? 'معاينة شكل الرابط على المنصات' : 'Preview Social Card'}
              </button>
            </div>
          </div>

          {/* Quick verification / SEO status checklist */}
          <div className="space-y-3 pt-2">
            <h4 className={`text-[10px] font-black uppercase tracking-widest font-mono ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              {isRtl ? 'التحقق من البيانات الفوقية النشطة' : 'Active Metadata Distribution'}
            </h4>
            
            <div className={`rounded-xl border p-4 space-y-3 text-xs ${
              isDark ? 'bg-zinc-950/20 border-zinc-850/80' : 'bg-zinc-50/50 border-zinc-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono">og:image</span>
                <span className="font-mono font-bold text-emerald-500 text-[11px] truncate max-w-[150px]">
                  {config.hasCustomImage ? `${siteDomain}/og-image.jpg` : 'Fallback Active'}
                </span>
              </div>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-850" />
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono">twitter:image</span>
                <span className="font-mono font-bold text-emerald-500 text-[11px] truncate max-w-[150px]">
                  {config.hasCustomImage ? `${siteDomain}/og-image.jpg` : 'Fallback Active'}
                </span>
              </div>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-850" />
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono">og:image:width</span>
                <span className="font-mono font-bold text-zinc-450 dark:text-zinc-300">{config.width} px</span>
              </div>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-850" />
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono">og:image:height</span>
                <span className="font-mono font-bold text-zinc-450 dark:text-zinc-300">{config.height} px</span>
              </div>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-850" />
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono">og:image:type</span>
                <span className="font-mono font-bold text-zinc-450 dark:text-zinc-300">{config.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SOCIAL PREVIEW LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 z-10 border ${
                isDark ? 'bg-[#0d0d0f] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              } ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPreviewModalOpen(false)}
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
                  <Smartphone className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display uppercase tracking-wider">
                    {isRtl ? 'مستعرض البطاقات الاجتماعية' : 'Social Card Feed Emulator'}
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {isRtl ? 'شاهد كيف يبدو رابط موقعك عند مشاركته على تطبيقات ومنصات مختلفة' : 'Preview exactly how your link thumbnail will render across major chat & social feeds'}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs for Platforms */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-px mb-6 overflow-x-auto gap-2 scrollbar-none">
                {(['whatsapp', 'facebook', 'twitter', 'telegram', 'discord'] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setActivePreviewTab(plat)}
                    className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 relative cursor-pointer whitespace-nowrap capitalize ${
                      activePreviewTab === plat
                        ? (isDark ? 'border-white text-white font-black' : 'border-zinc-950 text-zinc-950 font-black')
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    {plat === 'twitter' ? 'X (Twitter)' : plat}
                  </button>
                ))}
              </div>

              {/* Platform Emulators Render Grid */}
              <div className="min-h-[280px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  
                  {/* WhatsApp Emulator */}
                  {activePreviewTab === 'whatsapp' && (
                    <motion.div
                      key="whatsapp"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full max-w-md p-4 rounded-2xl bg-[#0b141a] text-[#e9edef] border border-zinc-800 font-sans shadow-md"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8696a0] font-mono mb-2">
                        <span>ASTA DESIGN STUDIO • 10:42 AM</span>
                      </div>
                      
                      {/* Chat Bubble */}
                      <div className="bg-[#1f2c34] rounded-2xl rounded-tl-none p-3 max-w-[85%] relative border border-white/5 text-left">
                        {/* URL Link */}
                        <p className="text-[#53bdeb] text-xs underline mb-1 hover:text-[#53bdeb]/80 break-all">
                          {siteUrl}
                        </p>
                        
                        {/* Rich Link Card inside Bubble */}
                        <div className="bg-[#111b21] rounded-xl overflow-hidden border border-white/5 mt-2 flex flex-col">
                          {/* Rich Image */}
                          <div className="aspect-[1.91/1] w-full bg-zinc-950 overflow-hidden relative">
                            <img src={config.imageUrl} alt="WhatsApp OG" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          {/* Rich Content Metadata */}
                          <div className="p-3 bg-[#1c272e] space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#8696a0] font-mono">{siteDomain}</p>
                            <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{siteTitle}</h4>
                            <p className="text-[11px] text-[#8696a0] leading-relaxed line-clamp-2">{siteDescription}</p>
                          </div>
                        </div>
                        
                        <span className="absolute bottom-1 right-2 text-[9px] text-[#8696a0] flex items-center gap-0.5">
                          10:42 AM
                          <span className="text-[#53bdeb]">✓✓</span>
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Facebook Emulator */}
                  {activePreviewTab === 'facebook' && (
                    <motion.div
                      key="facebook"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full max-w-lg rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18191a] text-zinc-900 dark:text-[#e4e6eb] font-sans shadow-md"
                    >
                      {/* Post Header */}
                      <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-600 dark:text-zinc-350">
                          A
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold">Asta Design Community</p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Sponsored • 🌐</p>
                        </div>
                      </div>

                      {/* Post Body text */}
                      <div className="px-4 pb-3 text-xs text-left">
                        {lang === 'ar' ? 'أطلقنا للتو المنصة الإبداعية الجديدة! شاهد تصميماتنا الحصرية والراقية...' : 'Our high-end design workspace is now live! Explore world-class layouts, digital components, and exclusive mockups.'}
                      </div>

                      {/* Embedded Link Preview Card */}
                      <div className="border-t border-b border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-[#242526] cursor-pointer hover:opacity-95 transition-opacity text-left">
                        <div className="aspect-[1.91/1] w-full overflow-hidden bg-zinc-950 relative">
                          <img src={config.imageUrl} alt="Facebook OG" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-4 space-y-1">
                          <span className="text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-mono">{siteDomain}</span>
                          <h4 className="text-xs font-bold leading-snug text-zinc-900 dark:text-white line-clamp-1">{siteTitle}</h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">{siteDescription}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* X (Twitter) Emulator */}
                  {activePreviewTab === 'twitter' && (
                    <motion.div
                      key="twitter"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full max-w-lg p-4 rounded-2xl bg-black text-[#e7e9ea] border border-zinc-800 font-sans shadow-md"
                    >
                      {/* Post Header */}
                      <div className="flex gap-3 text-left">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-white">
                          A
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white hover:underline cursor-pointer">ASTA Design</span>
                            <span className="text-[11px] text-zinc-500">@AstaDesignWeb • 2h</span>
                          </div>
                          <p className="text-xs leading-normal">
                            {lang === 'ar' ? 'تصاميم رقمية مذهلة صنعت خصيصاً للمطورين والشركات الرائدة.' : 'Minimalist aesthetics and luxury packaging mockups. Build beautiful digital products today.'}
                          </p>

                          {/* Large Image Summary Card */}
                          <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-850 hover:bg-zinc-900/40 transition-colors cursor-pointer relative flex flex-col">
                            <div className="aspect-[1.91/1] w-full overflow-hidden bg-zinc-950 relative">
                              <img src={config.imageUrl} alt="Twitter Card" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="p-3 bg-black space-y-1 text-left border-t border-zinc-850">
                              <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                                <span>🔗</span>
                                <span>{siteDomain}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{siteTitle}</h4>
                              <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{siteDescription}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Telegram Emulator */}
                  {activePreviewTab === 'telegram' && (
                    <motion.div
                      key="telegram"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full max-w-md p-4 rounded-2xl bg-[#17212b] text-[#f5f5f5] border border-zinc-800 font-sans shadow-md"
                    >
                      {/* Chat Header */}
                      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
                        <div className="w-8 h-8 rounded-full bg-[#3b88c3] flex items-center justify-center text-xs font-black text-white">
                          A
                        </div>
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-white">ASTA Public Hub</h4>
                          <span className="text-[9px] text-[#6c7883]">1,452 subscribers</span>
                        </div>
                      </div>

                      {/* Link Preview Bubble */}
                      <div className="bg-[#182533] rounded-xl rounded-tr-none p-3 max-w-[90%] border border-zinc-800 text-left relative">
                        <p className="text-[#3fc0f2] text-xs underline break-all mb-1.5">{siteUrl}</p>
                        
                        {/* Left vertical border link metadata preview */}
                        <div className="border-l-[3px] border-[#3fc0f2] pl-3 py-0.5 space-y-1.5">
                          <p className="text-[11px] font-black text-[#3fc0f2] tracking-wider uppercase font-mono">ASTA DESIGN WEB</p>
                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{siteTitle}</h4>
                          <p className="text-[11px] text-[#a9b6c1] leading-relaxed line-clamp-3">{siteDescription}</p>
                          
                          {/* Image */}
                          <div className="aspect-[1.91/1] w-full rounded-lg overflow-hidden bg-zinc-950 border border-white/5 relative">
                            <img src={config.imageUrl} alt="Telegram OG" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        <span className="absolute bottom-1 right-2 text-[8px] text-[#6c7883]">10:43 AM</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Discord Emulator */}
                  {activePreviewTab === 'discord' && (
                    <motion.div
                      key="discord"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full max-w-lg p-4 rounded-2xl bg-[#313338] text-[#dbdee1] border border-zinc-850 font-sans shadow-md"
                    >
                      {/* Channel Header message */}
                      <div className="flex gap-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center font-black text-xs text-white">
                          ASTA
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">ServerBot</span>
                            <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase font-mono">BOT</span>
                            <span className="text-[10px] text-zinc-400">Today at 10:43 AM</span>
                          </div>
                          
                          <p className="text-xs text-[#dbdee1]">
                            {isRtl ? 'تم تحديث معاينة المظهر والمقاييس:' : 'Here is the current metadata rich card output for our web platform:'}
                          </p>

                          {/* Discord Rich Embed */}
                          <div className="bg-[#1e1f22] rounded-lg border-l-4 border-[#5865f2] p-4 max-w-md space-y-2 shadow-sm">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">{siteDomain}</span>
                            
                            <h4 className="text-xs font-extrabold text-[#00a8fc] hover:underline cursor-pointer leading-snug line-clamp-1">
                              {siteTitle}
                            </h4>
                            
                            <p className="text-[11px] text-[#dbdee1] leading-relaxed line-clamp-3">
                              {siteDescription}
                            </p>

                            {/* Embed Image */}
                            <div className="aspect-[1.91/1] w-full rounded-md overflow-hidden bg-zinc-950 border border-zinc-800 mt-2 relative">
                              <img src={config.imageUrl} alt="Discord embed" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Action Close footer button */}
              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className={`font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer border ${
                    isDark 
                      ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white' 
                      : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-250 text-zinc-800'
                  }`}
                >
                  {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
