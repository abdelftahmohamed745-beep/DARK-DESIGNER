import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface NotificationProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastMessage;
  removeToast: (id: string) => void;
  key?: React.Key;
}

export default function Notification({ toasts, removeToast }: NotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full" id="toaster-system">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-white" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      layout
      className="flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl border bg-[#0d0d0f]/95 border-zinc-800 text-zinc-100 backdrop-blur-md max-w-sm w-full"
      id={`toast-${toast.id}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{toast.title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">{toast.description}</p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
