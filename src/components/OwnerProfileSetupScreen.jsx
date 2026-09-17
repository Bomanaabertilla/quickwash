import React, { useState } from 'react';
import { ArrowLeft, LogOut, HelpCircle } from 'lucide-react';
import OwnerShopProfileScreen from './OwnerShopProfileScreen';

export default function OwnerProfileSetupScreen({
  onBackToDashboard,
  onBackToApp,
  onLogout,
  onSupportClick
}) {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col">
      {/* Top Navigation Bar when accessed standalone */}
      <div className="bg-white border-b border-stone-200/80 px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#006a60]" />
          <span>Back to Owner Hub</span>
        </button>

        <div className="flex items-center gap-3">
          {onSupportClick && (
            <button
              onClick={onSupportClick}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Support</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Clean Shop Profile Screen */}
      <OwnerShopProfileScreen
        onBackToDashboard={onBackToDashboard}
        onBackToApp={onBackToApp}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
