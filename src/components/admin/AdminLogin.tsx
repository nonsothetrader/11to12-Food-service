import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';

interface AdminLoginProps {
  onBackToSite: () => void;
  onLoginSuccess?: () => void;
}

export default function AdminLogin({ onBackToSite, onLoginSuccess }: AdminLoginProps) {
  const { actions } = useAppStore();
  const [email, setEmail] = useState('admin@11to12.com');
  const [password, setPassword] = useState('PASSWORDadmin123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = actions.loginAsAdmin(email, password);
      setIsSubmitting(false);

      if (!result.success) {
        setAuthError(result.message);
      } else {
        setLoginSuccessMessage(result.message);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    }, 250);
  };

  const handleFillCredentials = (demoEmail = 'admin@11to12.com', demoPassword = 'PASSWORDadmin123') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF4EB] text-[#1E140A] flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-[#FF5500]/20">
      
      {/* Background Ambience Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF5500]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF5500]/10 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#1E140A]/15 text-center space-y-6 relative z-10"
      >
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center mx-auto shadow-inner border border-[#FF5500]/20">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] text-[11px] font-black uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" />
            <span>HQ Master Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display">
            Admin Sign In
          </h2>
          <p className="text-xs text-[#1E140A]/70 mt-2 leading-relaxed">
            Enter authorized master credentials to access real-time dispatch routes, kitchen cook batches, and subscriber management.
          </p>
        </div>

        {/* Quick Credentials Info Box */}
        <div className="p-3.5 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-[#FF5500]" />
              Authorized Credentials
            </span>
            <button
              type="button"
              onClick={() => handleFillCredentials()}
              className="text-[11px] font-bold text-[#FF5500] hover:text-[#E04B00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Fill</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1 text-[11px] font-mono text-[#1E140A]">
            <div className="flex items-center justify-between bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#1E140A]/5">
              <span className="text-[#1E140A]/60 font-sans">Email:</span>
              <span className="font-bold text-[#1E140A]">admin@11to12.com</span>
            </div>
            <div className="flex items-center justify-between bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#1E140A]/5">
              <span className="text-[#1E140A]/60 font-sans">Password:</span>
              <span className="font-bold text-[#FF5500]">PASSWORDadmin123</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-[#1E140A] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#1E140A]/60" />
              <span>Admin Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@11to12.com"
              className="w-full px-4 py-3 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-sm text-[#1E140A] font-medium focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all placeholder:text-[#1E140A]/40"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-[#1E140A] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#1E140A]/60" />
              <span>Master Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-sm text-[#1E140A] font-mono tracking-wider focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#1E140A]/50 hover:text-[#1E140A] rounded-lg transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {loginSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{loginSuccessMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] active:scale-[0.99] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Command</span>
              </>
            )}
          </button>
        </form>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#1E140A]/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-[#1E140A]/70 hover:text-[#1E140A] flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </button>

          <span className="text-[11px] text-[#1E140A]/40 font-mono">
            v2.4 Live Sync
          </span>
        </div>
      </motion.div>
    </div>
  );
}
