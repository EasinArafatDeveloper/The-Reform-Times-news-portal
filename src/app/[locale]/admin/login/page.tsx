"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'bn';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameOrEmail,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful login - Next.js middleware will now allow access
      router.push(`/${locale}/admin/dashboard`);
      router.refresh(); // Refresh router to update middleware state
    } catch (err: any) {
      setError('A connection error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] relative">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-caption hover:text-primary transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to website
        </Link>

        <div className="bg-card rounded-[32px] shadow-2xl border border-border p-10 md:p-12">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-secondary/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-title mb-2">Newsroom Login</h1>
            <p className="text-caption text-sm font-medium">Access the control center of The Reform Times.</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3 mb-6 text-destructive">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-normal">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-caption uppercase tracking-widest ml-1">Username or Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-caption group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin or name@reformtimes.com"
                  className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold text-caption uppercase tracking-widest">Password</label>
                 <Link href="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-caption group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-title"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface" />
              <label htmlFor="remember" className="text-sm font-medium text-body cursor-pointer">Remember this device</label>
            </div>

            <button 
              disabled={isLoading}
              className={cn(
                "w-full bg-primary text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group relative overflow-hidden",
                isLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              <span className={cn("flex items-center gap-2 transition-all", isLoading ? "translate-y-10 opacity-0" : "opacity-100")}>
                Authorized Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
             <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold border border-primary/20">
                <AlertCircle size={14} />
                Restricted access for newsroom staff only
             </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-caption text-xs font-medium">
          &copy; {new Date().getFullYear()} The Reform Times System. Version 2.4.0
        </p>
      </div>
    </div>
  );
}
