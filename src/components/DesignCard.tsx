import React from 'react';
import { Heart, Eye, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Design } from '../types';
import { formatCurrency } from '../utils';
import { getCategoryName } from '../translations';

interface DesignCardProps {
  design: Design;
  onView: () => void;
  onLike: () => void;
  isLikedByUser: boolean;
  onDelete?: () => void;
  theme?: 'dark' | 'light';
  lang?: 'en' | 'ar';
  key?: React.Key;
}

export default function DesignCard({
  design,
  onView,
  onLike,
  isLikedByUser,
  onDelete,
  theme = 'dark',
  lang = 'en',
}: DesignCardProps) {
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onView}
      className={`group cursor-pointer flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700 text-zinc-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
          : 'bg-white border-zinc-200 hover:bg-zinc-50/20 hover:border-zinc-300 text-zinc-900 hover:shadow-[0_8px_30px_rgb(244,244,245,0.5)]'
      }`}
      id={`design-card-${design.id}`}
    >
      {/* Image Showcase Container */}
      <div className={`relative aspect-[4/3] overflow-hidden ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
        <img
          src={design.imageUrl}
          alt={design.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Label overlay */}
        <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border shadow-sm font-mono ${
          isDark
            ? 'bg-[#09090b]/90 text-zinc-300 border-zinc-800'
            : 'bg-white/95 text-zinc-700 border-zinc-200'
        }`}>
          {getCategoryName(design.category, lang)}
        </div>

        {/* Featured Badge */}
        {design.featured && (
          <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm font-mono ${
            isDark ? 'bg-white text-zinc-950' : 'bg-zinc-900 text-white'
          }`}>
            {lang === 'ar' ? 'مميز' : 'Staff Pick'}
          </div>
        )}
      </div>

      {/* Card Information */}
      <div className="flex-1 flex flex-col p-5">
        <div className={`flex items-start justify-between gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <h3 className={`text-sm font-bold transition-colors line-clamp-1 font-sans ${
            isDark ? 'text-white group-hover:text-zinc-300' : 'text-zinc-900 group-hover:text-zinc-700'
          }`}>
            {design.title}
          </h3>
          <div className="shrink-0">
            {design.price !== undefined ? (
              <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {formatCurrency(design.price)}
              </span>
            ) : (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border ${
                isDark
                  ? 'text-zinc-300 bg-zinc-900 border-zinc-800'
                  : 'text-zinc-700 bg-zinc-100 border-zinc-200'
              }`}>
                {lang === 'ar' ? 'طلب تسعير' : 'Quote'}
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs line-clamp-2 leading-relaxed mb-4 flex-1 ${isRtl ? 'text-right' : 'text-left'} ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          {design.description}
        </p>

        <div className={`flex items-center justify-between border-t pt-4 mt-auto ${
          isDark ? 'border-zinc-800/80' : 'border-zinc-150'
        } ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Designer info */}
          <div className="flex items-center gap-2">
            <img
              src={design.designerAvatar}
              alt={design.designerName}
              className={`w-6 h-6 rounded-full object-cover ring-2 ${isDark ? 'ring-zinc-800' : 'ring-zinc-200'}`}
            />
            <span className={`text-[11px] font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {lang === 'ar' && design.designerName === 'You (Studio Owner)' ? 'أنت (مالك الاستوديو)' : design.designerName}
            </span>
          </div>

          {/* Engagement stats */}
          <div className={`flex items-center gap-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <div className="flex items-center gap-1 text-[11px]">
              <Eye className="w-3.5 h-3.5" />
              <span>{design.views}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className={`flex items-center gap-1 text-[11px] transition-colors p-1 -m-1 rounded-lg ${
                isDark ? 'hover:bg-zinc-850' : 'hover:bg-zinc-100'
              } ${
                isLikedByUser
                  ? (isDark ? 'text-white font-bold' : 'text-zinc-900 font-bold')
                  : (isDark ? 'hover:text-zinc-300' : 'hover:text-zinc-700')
              }`}
              title={isLikedByUser ? 'Unlike' : 'Like design'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLikedByUser ? (isDark ? 'fill-white stroke-white' : 'fill-zinc-900 stroke-zinc-900') : ''}`} />
              <span>{design.likes}</span>
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`flex items-center justify-center p-1 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300' 
                    : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
                title={lang === 'ar' ? 'حذف المنشور' : 'Delete Post'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
