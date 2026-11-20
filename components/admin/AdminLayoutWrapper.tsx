'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import AdminLoginScreen from './AdminLoginScreen';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useAdmin();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication on client mount
    const auth = localStorage.getItem('dailys_cms_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dailys_cms_auth');
    localStorage.removeItem('dailys_cms_user');
    document.cookie = 'dailys_cms_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAuthenticated(false);
  };

  // Prevent layout shift during initial auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading CMS Workspace...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show password login screen
  if (!isAuthenticated) {
    return <AdminLoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-900 antialiased">
      {/* 48px Top Bar */}
      <AdminTopBar onLogout={handleLogout} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AdminSidebar />

        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Toast Notifications Stack */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in duration-200 ${
              toast.type === 'error'
                ? 'bg-white text-rose-800 border-rose-200 shadow-rose-500/10'
                : toast.type === 'info'
                ? 'bg-white text-slate-800 border-slate-200 shadow-slate-500/10'
                : 'bg-white text-emerald-800 border-emerald-200 shadow-emerald-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <div className="p-1 rounded-full bg-rose-50 text-rose-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                </div>
              ) : toast.type === 'info' ? (
                <div className="p-1 rounded-full bg-blue-50 text-blue-600">
                  <Info className="w-4 h-4 shrink-0" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                </div>
              )}
              <span className="leading-snug text-slate-800">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
