"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Camera, Globe, Link2, Shield, Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'bn';
  const isBangla = locale === 'bn';

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarMode, setAvatarMode] = useState<'url' | 'upload'>('url');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: { bn: '', en: '' },
    role: { bn: '', en: '' },
    avatar: '',
    social: { twitter: '', facebook: '', linkedin: '', website: '' },
  });

  const [security, setSecurity] = useState({
    adminUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || { bn: '', en: '' },
          role: data.role || { bn: '', en: '' },
          avatar: data.avatar || '',
          social: data.social || { twitter: '', facebook: '', linkedin: '', website: '' },
        });
        setSecurity(prev => ({ ...prev, adminUsername: data.adminUsername || 'admin' }));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(isBangla ? 'শুধুমাত্র ছবি ফাইল আপলোড করা যাবে!' : 'Only image files are allowed!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isBangla ? 'ছবির সাইজ সর্বোচ্চ ৫ MB হতে হবে!' : 'Image size must be under 5 MB!');
      return;
    }
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfile(p => ({ ...p, avatar: data.url }));
        toast.success(isBangla ? 'ছবি সফলভাবে আপলোড হয়েছে!' : 'Image uploaded successfully!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isBangla ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      toast.error(isBangla ? 'নতুন পাসওয়ার্ড মিলছে না!' : 'New passwords do not match!');
      return;
    }
    if (security.newPassword && security.newPassword.length < 6) {
      toast.error(isBangla ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!' : 'Password must be at least 6 characters!');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          adminUsername: security.adminUsername,
          currentPassword: security.currentPassword,
          newPassword: security.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isBangla ? 'নিরাপত্তা তথ্য আপডেট হয়েছে!' : 'Security settings updated!');
        setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-body">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-title">{isBangla ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}</h1>
        <p className="text-caption mt-1">{isBangla ? 'আপনার প্রোফাইল এবং নিরাপত্তা তথ্য পরিচালনা করুন।' : 'Manage your public profile and admin security credentials.'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-2xl p-1 w-fit">
        {[
          { key: 'profile', icon: User, label: isBangla ? 'প্রোফাইল' : 'Profile' },
          { key: 'security', icon: Shield, label: isBangla ? 'নিরাপত্তা' : 'Security' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer",
              activeTab === tab.key ? "bg-primary text-white shadow-md" : "text-caption hover:text-title"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── PROFILE TAB ─── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <div className="bg-card border border-border rounded-[2rem] p-8 flex flex-col items-center gap-5 h-fit">
            {/* Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-[1.5rem] overflow-hidden border-4 border-border shadow-xl bg-surface">
                {isUploading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-caption font-bold">{isBangla ? 'আপলোড...' : 'Uploading...'}</span>
                  </div>
                ) : profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary">
                    {profile.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
                <Camera size={14} />
              </div>
              {profile.avatar && (
                <button
                  onClick={() => setProfile(p => ({ ...p, avatar: '' }))}
                  className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                  title={isBangla ? 'ছবি মুছুন' : 'Remove image'}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-1 w-full bg-surface border border-border rounded-xl p-1">
              <button
                onClick={() => setAvatarMode('url')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  avatarMode === 'url' ? 'bg-primary text-white shadow-sm' : 'text-caption hover:text-title'
                )}
              >
                <Link2 size={12} />
                {isBangla ? 'লিংক' : 'URL Link'}
              </button>
              <button
                onClick={() => setAvatarMode('upload')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  avatarMode === 'upload' ? 'bg-primary text-white shadow-sm' : 'text-caption hover:text-title'
                )}
              >
                <Upload size={12} />
                {isBangla ? 'আপলোড' : 'Upload'}
              </button>
            </div>

            {/* URL Mode */}
            {avatarMode === 'url' && (
              <div className="w-full space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">
                  {isBangla ? 'ছবির লিংক (URL)' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={profile.avatar}
                  onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-surface border border-border text-title px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            {/* Upload Mode */}
            {avatarMode === 'upload' && (
              <div className="w-full space-y-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                {/* Drag & drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all",
                    dragOver
                      ? 'border-primary bg-primary/5 scale-[1.02]'
                      : 'border-border hover:border-primary/50 hover:bg-surface'
                  )}
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImageIcon size={28} className={cn('transition-colors', dragOver ? 'text-primary' : 'text-caption/40')} />
                  )}
                  <div className="text-center">
                    <p className="text-xs font-bold text-title">
                      {isBangla ? 'ছবি টেনে আনুন বা ক্লিক করুন' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[10px] text-caption mt-1">
                      {isBangla ? 'JPG, PNG, WEBP — সর্বোচ্চ ৫ MB' : 'JPG, PNG, WEBP — Max 5 MB'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-[2rem] p-8 space-y-6">
            <h2 className="font-serif font-bold text-xl text-title">{isBangla ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'পূর্ণ নাম' : 'Full Name'}</label>
                <input
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'ইমেইল' : 'Email Address'}</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'পদবী (বাংলা)' : 'Role (Bengali)'}</label>
                <input
                  value={profile.role?.bn || ''}
                  onChange={e => setProfile(p => ({ ...p, role: { ...p.role, bn: e.target.value } }))}
                  placeholder="সম্পাদক-প্রধান"
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'পদবী (ইংরেজি)' : 'Role (English)'}</label>
                <input
                  value={profile.role?.en || ''}
                  onChange={e => setProfile(p => ({ ...p, role: { ...p.role, en: e.target.value } }))}
                  placeholder="Editor-in-Chief"
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'পরিচিতি (বাংলা)' : 'Bio (Bengali)'}</label>
                <textarea
                  rows={4}
                  value={profile.bio?.bn || ''}
                  onChange={e => setProfile(p => ({ ...p, bio: { ...p.bio, bn: e.target.value } }))}
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'পরিচিতি (ইংরেজি)' : 'Bio (English)'}</label>
                <textarea
                  rows={4}
                  value={profile.bio?.en || ''}
                  onChange={e => setProfile(p => ({ ...p, bio: { ...p.bio, en: e.target.value } }))}
                  className="w-full bg-surface border border-border text-title px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-sm text-title mb-4">{isBangla ? 'সোশ্যাল মিডিয়া লিংক' : 'Social Media Links'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'twitter', label: '𝕏 Twitter', placeholder: 'https://twitter.com/...' },
                  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                  { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-[10px] font-bold">{label.charAt(0)}</span>
                    <input
                      type="url"
                      value={(profile.social as any)[key] || ''}
                      onChange={e => setProfile(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))}
                      placeholder={placeholder}
                      className="w-full bg-surface border border-border text-title pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-primary/10"
            >
              <Save size={18} />
              {isSaving ? (isBangla ? 'সেভ হচ্ছে...' : 'Saving...') : (isBangla ? 'প্রোফাইল সেভ করুন' : 'Save Profile')}
            </button>
          </div>
        </div>
      )}

      {/* ─── SECURITY TAB ─── */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-title">{isBangla ? 'এডমিন লগইন তথ্য' : 'Admin Login Credentials'}</h2>
                <p className="text-caption text-xs">{isBangla ? 'এই তথ্য পরিবর্তন করলে এডমিন প্যানেলে প্রবেশের নিয়ম বদলে যাবে।' : 'Changing these will update how you access the admin panel.'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'এডমিন ইউজারনেম' : 'Admin Username'}</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                <input
                  value={security.adminUsername}
                  onChange={e => setSecurity(p => ({ ...p, adminUsername: e.target.value }))}
                  className="w-full bg-surface border border-border text-title pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={security.currentPassword}
                  onChange={e => setSecurity(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border text-title pl-9 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-title transition-colors cursor-pointer">
                  {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={security.newPassword}
                  onChange={e => setSecurity(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder={isBangla ? 'কমপক্ষে ৬ অক্ষর' : 'Min. 6 characters'}
                  className="w-full bg-surface border border-border text-title pl-9 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-title transition-colors cursor-pointer">
                  {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={security.confirmPassword}
                  onChange={e => setSecurity(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-surface border text-title pl-9 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all",
                    security.confirmPassword && security.newPassword !== security.confirmPassword
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-border focus:ring-primary/20 focus:border-primary"
                  )}
                />
                <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-title transition-colors cursor-pointer">
                  {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {security.confirmPassword && security.newPassword !== security.confirmPassword && (
                <p className="text-red-500 text-xs font-bold">{isBangla ? 'পাসওয়ার্ড মিলছে না!' : 'Passwords do not match!'}</p>
              )}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-600 dark:text-amber-400">
              ⚠️ {isBangla ? 'পাসওয়ার্ড বা ইউজারনেম পরিবর্তন করলে আপনাকে আবার লগইন করতে হবে।' : 'After changing credentials, you will need to log in again.'}
            </div>

            <button
              onClick={handleSaveSecurity}
              disabled={isSaving}
              className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-amber-600/10"
            >
              <Shield size={18} />
              {isSaving ? (isBangla ? 'আপডেট হচ্ছে...' : 'Updating...') : (isBangla ? 'নিরাপত্তা তথ্য আপডেট করুন' : 'Update Security Settings')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
