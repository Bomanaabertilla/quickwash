import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Store, 
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface OwnerAuthScreenProps {
  onLoginSuccess: () => void;
  onBackToApp: () => void;
}

export default function OwnerAuthScreen({
  onLoginSuccess,
  onBackToApp
}: OwnerAuthScreenProps) {
  const [email, setEmail] = useState('owner@sparkleexpress.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc] justify-between p-5 relative overflow-y-auto custom-scrollbar">
      
      {/* Top Header Back Button */}
      <div className="w-full flex items-center justify-between pt-2 z-10">
        <button
          onClick={onBackToApp}
          className="bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer App</span>
        </button>

        <span className="bg-teal-50 text-[#006a60] text-[11px] font-extrabold px-3 py-1 rounded-full border border-teal-100 flex items-center gap-1">
          <Store className="w-3 h-3" />
          <span>Hub v2.4</span>
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 max-w-sm mx-auto w-full">
        
        {/* QuickWash Emblem Logo */}
        <div className="w-14 h-14 bg-[#006a60] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#006a60]/25 transition-transform hover:scale-105">
          <svg className="w-8 h-8 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 3"></path>
            <path d="M8 12a4 4 0 0 1 8 0"></path>
          </svg>
        </div>

        {/* Welcome Back Headers */}
        <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight mt-4 text-center">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 text-center font-medium mt-1">
          Sign in to QuickWash Owner Hub
        </p>

        {/* Login Form Card */}
        <Card className="rounded-3xl p-5 border border-slate-200/80 shadow-md w-full mt-6 flex flex-col gap-4">
          
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            
            {/* Email / Store ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">
                Email address or Store ID
              </label>
              <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-3 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@sparkleexpress.com"
                  required
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password / Store PIN */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800">Security Password</label>
                <button 
                  type="button" 
                  onClick={() => alert('PIN reset code sent to registered store manager phone.')}
                  className="text-[11px] font-semibold text-[#006a60] hover:underline cursor-pointer"
                >
                  Forgot PIN?
                </button>
              </div>

              <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-3 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#006a60] rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">Remember this store session</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all mt-2 disabled:opacity-80 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating store...</span>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In to Owner Hub</span>
                </>
              )}
            </Button>

          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-100 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider absolute">
              OR
            </span>
          </div>

          {/* 1-Click Instant Demo Login */}
          <button
            type="button"
            onClick={() => handleLogin()}
            className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-[#006a60] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-teal-100/80 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#006a60]" />
            <span>⚡ Instant Demo Access (Sparkle Express Hub)</span>
          </button>

        </Card>

      </div>

      {/* Footer Security Note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pb-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span className="font-medium">Protected by QuickWash Enterprise 256-bit SSL</span>
      </div>

    </div>
  );
}
