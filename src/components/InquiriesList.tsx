import React, { useState } from 'react';
import { Mail, Briefcase, DollarSign, Calendar, MessageSquare, ChevronRight, CheckCircle2, Trash2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Inquiry } from '../types';
import { formatDate } from '../utils';
import { translations } from '../translations';

interface InquiriesListProps {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: Inquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  theme?: 'dark' | 'light';
  lang?: 'en' | 'ar';
}

export default function InquiriesList({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
  theme = 'dark',
  lang = 'en',
}: InquiriesListProps) {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccessId, setReplySuccessId] = useState<string | null>(null);

  const t = translations[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedInquiryId) return;

    setIsSendingReply(true);

    setTimeout(() => {
      // update state to responded
      onUpdateStatus(selectedInquiryId, 'responded');
      setIsSendingReply(false);
      setReplySuccessId(selectedInquiryId);
      setReplyText('');

      // Auto clear success indicator
      setTimeout(() => setReplySuccessId(null), 3000);
    }, 1200);
  };

  const getStatusBadge = (status: Inquiry['status'], isSelected: boolean) => {
    switch (status) {
      case 'pending':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
            isSelected
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-amber-950/40 text-amber-300 border-amber-900/60'
          }`}>
            {t.newLeadBadge}
          </span>
        );
      case 'reviewed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
            isSelected
              ? 'bg-sky-100 text-sky-850 border-sky-200'
              : 'bg-sky-950/40 text-sky-300 border-sky-900/60'
          }`}>
            {t.reviewedBadge}
          </span>
        );
      case 'responded':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border flex items-center gap-1 ${
            isSelected
              ? 'bg-emerald-100 text-emerald-850 border-emerald-200'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            {t.respondedBadge}
          </span>
        );
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isRtl ? 'direction-rtl' : ''}`} id="inquiries-panel">
      {/* Inquiries Sidebar / List */}
      <div className="lg:col-span-5 space-y-3">
        <div className={`flex items-center justify-between mb-2 px-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.inquiriesPipeline} ({inquiries.length})
          </h3>
          <span className="text-[11px] text-zinc-500">{t.selectToReply}</span>
        </div>

        {inquiries.length === 0 ? (
          <div className={`border p-8 rounded-3xl text-center ${
            isDark ? 'bg-zinc-900/20 border-zinc-800/80 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}>
            <Mail className="w-10 h-10 mx-auto stroke-zinc-650 mb-3" />
            <p className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.noInquiriesTitle}</p>
            <p className={`text-xs mt-1 max-w-[250px] mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t.noInquiriesSub}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-none">
            {inquiries.map((inquiry) => {
              const isSelected = inquiry.id === selectedInquiryId;
              return (
                <motion.div
                  key={inquiry.id}
                  onClick={() => {
                    setSelectedInquiryId(inquiry.id);
                    if (inquiry.status === 'pending') {
                      onUpdateStatus(inquiry.id, 'reviewed');
                    }
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${
                    isSelected
                      ? (isDark ? 'bg-white text-zinc-950 border-white shadow-md' : 'bg-zinc-900 text-white border-zinc-900 shadow-md')
                      : (isDark ? 'bg-zinc-900/40 text-zinc-100 border-zinc-800/80 hover:bg-zinc-900/80' : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50')
                  }`}
                  whileHover={{ y: -1 }}
                  id={`inquiry-card-${inquiry.id}`}
                >
                  <div className={`flex items-start justify-between gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h4 className={`font-bold text-sm leading-snug ${
                        isSelected 
                          ? (isDark ? 'text-zinc-950' : 'text-white') 
                          : (isDark ? 'text-white' : 'text-zinc-900')
                      }`}>{inquiry.customerName}</h4>
                      <p className={`text-[11px] mt-0.5 ${
                        isSelected 
                          ? (isDark ? 'text-zinc-600 font-semibold' : 'text-zinc-300') 
                          : (isDark ? 'text-zinc-400' : 'text-zinc-500')
                      }`}>
                        {inquiry.customerCompany ? `${inquiry.customerCompany}` : (lang === 'ar' ? 'عميل مستقل' : 'Independent Client')}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(inquiry.status, isSelected)}
                    </div>
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                    isSelected 
                      ? (isDark ? 'text-zinc-800 font-medium' : 'text-zinc-100') 
                      : (isDark ? 'text-zinc-300' : 'text-zinc-600')
                  }`}>
                    {inquiry.message}
                  </p>

                  <div className={`flex items-center justify-between border-t pt-3 text-[10px] ${
                    isRtl ? 'flex-row-reverse' : ''
                  } ${
                    isSelected 
                      ? (isDark ? 'border-zinc-200 text-zinc-500 font-semibold' : 'border-zinc-750 text-zinc-300') 
                      : (isDark ? 'border-zinc-800/60 text-zinc-500' : 'border-zinc-150 text-zinc-400')
                  }`}>
                    <span className={`flex items-center gap-1 font-mono ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-3 h-3" />
                      {formatDate(inquiry.createdAt)}
                    </span>
                    {inquiry.designTitle && (
                      <span className="font-semibold truncate max-w-[150px]">
                        {lang === 'ar' ? 'بخصوص: ' : 'Re: '}{inquiry.designTitle}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inquiry Detail & Composer View */}
      <div className="lg:col-span-7 font-sans">
        <AnimatePresence mode="wait">
          {selectedInquiry ? (
            <motion.div
              key={selectedInquiry.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className={`border rounded-3xl p-6 sm:p-8 flex flex-col h-full min-h-[450px] ${
                isRtl ? 'text-right' : 'text-left'
              } ${
                isDark
                  ? 'bg-zinc-900/40 border-zinc-800 text-zinc-100'
                  : 'bg-white border-zinc-200 text-zinc-900 shadow-md'
              }`}
              id="inquiry-detail-view"
            >
              {/* Header Details */}
              <div className={`border-b pb-6 mb-6 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                  <div>
                    <span className={`text-[9px] font-bold tracking-widest uppercase font-mono ${
                      isDark ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {t.inquiryDetailsTitle}
                    </span>
                    <h2 className={`text-xl font-bold tracking-tight mt-1 font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {selectedInquiry.customerName}
                    </h2>
                    <p className={`text-xs mt-1 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className={`font-semibold font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedInquiry.customerEmail}</span>
                      <span>•</span>
                      <span>{selectedInquiry.customerCompany || (lang === 'ar' ? 'لم يحدد شركة' : 'No Company Specified')}</span>
                    </p>
                  </div>
                  <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <a
                      href={`mailto:${selectedInquiry.customerEmail}?subject=RE: Design Marketplace - ${selectedInquiry.designTitle || 'Custom Project'}`}
                      className={`p-2.5 rounded-full border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isDark 
                          ? 'bg-[#030303] hover:bg-zinc-900 text-zinc-200 border-zinc-800/80' 
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
                      }`}
                      title={lang === 'ar' ? 'فتح في تطبيق البريد الإلكتروني' : 'Open in email client'}
                    >
                      <span className="px-1 font-mono">{t.clientEmail}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        onDeleteInquiry(selectedInquiry.id);
                        setSelectedInquiryId(null);
                      }}
                      className={`p-2.5 rounded-full transition-all cursor-pointer border ${
                        isDark
                          ? 'bg-zinc-950 hover:bg-[#1a1113] border-zinc-850 hover:border-rose-950 text-rose-400'
                          : 'bg-white hover:bg-rose-50/50 border-zinc-200 hover:border-rose-250 text-rose-600'
                      }`}
                      title={lang === 'ar' ? 'أرشفة الطلب' : 'Archive/Delete request'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid details block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {selectedInquiry.designTitle && (
                    <div className={`flex items-start gap-2.5 border p-3.5 rounded-2xl ${
                      isRtl ? 'flex-row-reverse' : ''
                    } ${
                      isDark ? 'bg-[#030303]/60 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <Briefcase className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h5 className={`text-[8px] font-bold uppercase tracking-widest font-mono ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>{lang === 'ar' ? 'مرجع التصميم' : 'Design Reference'}</h5>
                        <p className={`text-xs font-semibold mt-0.5 truncate ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>{selectedInquiry.designTitle}</p>
                      </div>
                    </div>
                  )}

                  <div className={`flex items-start gap-2.5 border p-3.5 rounded-2xl ${
                    isRtl ? 'flex-row-reverse' : ''
                  } ${
                    isDark ? 'bg-[#030303]/60 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <DollarSign className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h5 className={`text-[8px] font-bold uppercase tracking-widest font-mono ${
                        isDark ? 'text-zinc-500' : 'text-zinc-400'
                      }`}>{t.budgetLabel}</h5>
                      <p className={`text-xs font-semibold mt-0.5 font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>{selectedInquiry.budget || (lang === 'ar' ? 'غير متوفر' : 'Not provided')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message requirements content */}
              <div className="flex-1 space-y-4 mb-6 text-left">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h4 className={`text-[9px] font-bold uppercase tracking-widest font-mono mb-2 ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>{t.clientMessage}</h4>
                  <div className={`border rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line ${
                    isDark ? 'bg-[#030303]/60 border-zinc-850 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                    {selectedInquiry.message}
                  </div>
                </div>
              </div>

              {/* Reply draft zone */}
              <div className={`border-t pt-6 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
                {replySuccessId === selectedInquiry.id ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-2xl p-4 text-center text-xs font-semibold ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-250' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                    }`}
                  >
                    {lang === 'ar' 
                      ? `تم حفظ الرد في السجلات! تم إجراء محاكاة لإرسال البريد الإلكتروني المباشر للعميل على عنوان: ${selectedInquiry.customerEmail}.`
                      : `Reply saved to records! Direct email delivery simulation processed for ${selectedInquiry.customerEmail}.`}
                  </motion.div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider font-mono ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        {lang === 'ar' ? 'صياغة رد على العميل' : 'Draft a response'}
                      </label>
                      <span className="text-[9px] font-bold text-zinc-500 font-mono uppercase">
                        {lang === 'ar' ? 'يتم تسجيل هذا الإجراء مباشرة في السجل' : 'Direct action recorded in system logs'}
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        placeholder={lang === 'ar' ? `اكتب ردك الإلكتروني على العميل ${selectedInquiry.customerName}...` : `Write response email to ${selectedInquiry.customerName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className={`w-full text-xs rounded-xl p-3.5 focus:outline-none focus:ring-2 resize-none leading-relaxed border ${
                          isDark
                            ? 'bg-[#030303]/80 text-zinc-200 border-zinc-850 focus:ring-zinc-700'
                            : 'bg-white text-zinc-900 border-zinc-300 focus:ring-zinc-400'
                        }`}
                      />
                    </div>

                    <div className={`flex justify-between items-center pt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(selectedInquiry.id, 'responded')}
                        className={`text-xs font-semibold underline cursor-pointer ${
                          isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {lang === 'ar' ? 'تحديد كمرود عليه (دون مسودة بريد)' : 'Mark Responded (No Email Draft)'}
                      </button>

                      <button
                        type="submit"
                        disabled={isSendingReply || !replyText}
                        className={`font-bold text-xs px-5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer font-sans ${
                          isDark
                            ? 'bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950'
                            : 'bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-450 text-white'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isSendingReply ? (lang === 'ar' ? 'جاري التسجيل...' : 'Recording...') : (lang === 'ar' ? 'تسجيل الرد' : 'Record response')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          ) : (
            <div className={`border border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[450px] ${
              isDark ? 'bg-zinc-900/20 border-zinc-800/80 text-zinc-400' : 'bg-zinc-50 border-zinc-250 text-zinc-600'
            }`}>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm mb-4 ${
                isDark ? 'bg-zinc-950 border-zinc-850 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <p className={`text-sm font-bold font-display uppercase tracking-widest ${isDark ? 'text-zinc-250' : 'text-zinc-850'}`}>
                {lang === 'ar' ? 'لم يتم تحديد طلب' : 'No Inquiry Selected'}
              </p>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-[280px] leading-relaxed">
                {lang === 'ar'
                  ? 'انقر على أي من طلبات العملاء الاستفسارية في القائمة الجانبية لعرض التفاصيل وتتبع حالة التواصل وتسجيل ردك عليها.'
                  : 'Click on any client inquiry on the sidebar card stack to view details, track communication metrics, and record developer responses.'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
