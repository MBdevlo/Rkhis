import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@rkhiss.ma') &&
      (password === 'admin123' || password === 'rkhiss2026')
    ) {
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة (استخدم زر الدخول التجريبي السريع أدناه)');
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin@rkhiss.ma');
    setPassword('rkhiss2026');
    setTimeout(() => {
      onLoginSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">جلسة المسؤول | Admin</h3>
              <p className="text-[11px] text-slate-300">لوحة تحكم وتعديل الأسعار والإعلانات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المستخدم / البريد الإلكتروني
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@rkhiss.ma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>تسجيل الدخول إلى لوحة التحكم</span>
          </button>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>دخول تجريبي فوري كمسؤول (Demo 1-Click)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              بيانات الدخول: admin@rkhiss.ma / rkhiss2026
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
