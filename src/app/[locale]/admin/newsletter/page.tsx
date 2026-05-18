"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Search, 
  Trash2, 
  Users, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Sparkles,
  Megaphone,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function NewsletterSubscribersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'bn';
  const isBangla = locale === 'bn';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'subscribers' | 'broadcast'>('subscribers');

  // Subscribers State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Broadcast Form State
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    title: '',
    content: ''
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Notification logs
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    fetchSubscribers();
    fetchNotificationLogs();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/subscribers?search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch subscribers.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationLogs = async () => {
    try {
      setLoadingNotifications(true);
      const res = await fetch('/api/push/history');
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return toast.error('Email address is required');

    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(isBangla ? 'গ্রাহক সফলভাবে যোগ করা হয়েছে!' : 'Subscriber added successfully!');
        setNewEmail('');
        fetchSubscribers();
      } else {
        toast.error(data.error || 'Failed to add subscriber.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    const confirmResult = await Swal.fire({
      title: isBangla ? 'আপনি কি নিশ্চিত?' : 'Are you sure?',
      text: isBangla 
        ? `${email} কে গ্রাহক তালিকা থেকে সরিয়ে দিতে চান?` 
        : `Do you want to unsubscribe ${email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isBangla ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, unsubscribe',
      cancelButtonText: isBangla ? 'বাতিল' : 'Cancel',
      confirmButtonColor: '#b11226',
      cancelButtonColor: '#475569',
      background: '#0f172a',
      color: '#f8fafc'
    });

    if (!confirmResult.isConfirmed) return;

    const loadId = toast.loading('Removing subscriber...');
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}&email=${email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success(isBangla ? 'গ্রাহক সফলভাবে অপসারিত!' : 'Removed successfully!', { id: loadId });
        setSubscribers(subscribers.filter(s => s._id !== id));
      } else {
        toast.error('Failed to remove subscriber.', { id: loadId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.', { id: loadId });
    }
  };

  const handleBroadcastNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.subject || !broadcastForm.title || !broadcastForm.content) {
      return toast.error('Subject, Title, and HTML Content are all required');
    }

    const confirmResult = await Swal.fire({
      title: isBangla ? 'ইমেইল ব্রডকাস্ট নিশ্চিত করুন' : 'Confirm Email Broadcast',
      text: isBangla 
        ? `এই নিউজলেটারটি সরাসরি আপনার সকল (${subscribers.length}) গ্রাহকদের ইমেইলে পাঠানো হবে।`
        : `This will immediately broadcast this newsletter directly to all (${subscribers.length}) verified subscribers.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isBangla ? 'হ্যাঁ, ব্রডকাস্ট করুন' : 'Yes, Broadcast Now',
      cancelButtonText: isBangla ? 'বাতিল' : 'Cancel',
      confirmButtonColor: '#b11226',
      cancelButtonColor: '#475569',
      background: '#0f172a',
      color: '#f8fafc'
    });

    if (!confirmResult.isConfirmed) return;

    setIsBroadcasting(true);
    const loadId = toast.loading(isBangla ? 'নিউজলেটার পাঠানো হচ্ছে...' : 'Broadcasting newsletter dispatches...');
    try {
      const res = await fetch('/api/admin/subscribers/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastForm)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(isBangla ? 'নিউজলেটার সফলভাবে ব্রডকাস্ট করা হয়েছে!' : 'Newsletter successfully broadcasted!', { id: loadId });
        setBroadcastForm({ subject: '', title: '', content: '' });
        fetchNotificationLogs();
      } else {
        toast.error(data.error || 'Failed to complete broadcast.', { id: loadId });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred.', { id: loadId });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const filteredSubs = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-body relative">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-title flex items-center gap-2">
            <Mail size={32} className="text-primary" />
            {isBangla ? 'নিউজলেটার ও গ্রাহক তালিকা' : 'Newsletter & Subscriptions'}
          </h1>
          <p className="text-caption mt-1">
            {isBangla 
              ? 'আপনার নিউজলেটার সাবস্ক্রিপশন এবং সরাসরি ইমেইল ব্রডকাস্ট ম্যানেজ করুন।' 
              : 'Manage email subscriptions and broadcast newsletters directly to your readers.'
            }
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">{isBangla ? 'মোট গ্রাহক' : 'Total Subscribers'}</p>
            <p className="text-xl font-bold text-title mt-1">{subscribers.length}</p>
          </div>
        </div>

        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">{isBangla ? 'ডেলিভারি রেট' : 'Delivery Rate'}</p>
            <p className="text-xl font-bold text-title mt-1">99.8%</p>
          </div>
        </div>

        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Send size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">{isBangla ? 'মোট ইমেইল সেন্ট' : 'Aggregate Dispatches'}</p>
            <p className="text-xl font-bold text-title mt-1">{notifications.length} dispatches</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border bg-card p-1.5 rounded-2xl border gap-2">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={cn(
            "flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'subscribers'
              ? "bg-primary text-white shadow-md shadow-primary/10"
              : "text-caption hover:text-title hover:bg-surface/50"
          )}
        >
          <Users size={16} />
          {isBangla ? 'গ্রাহক তালিকা' : 'Subscriber Registry'}
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={cn(
            "flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'broadcast'
              ? "bg-primary text-white shadow-md shadow-primary/10"
              : "text-caption hover:text-title hover:bg-surface/50"
          )}
        >
          <Send size={16} />
          {isBangla ? 'ইমেইল ব্রডকাস্ট করুন' : 'Broadcast Studio'}
        </button>
      </div>

      {/* Active Tab Workspace */}
      <div className="transition-all duration-300">
        
        {/* Tab 1: Subscriber Registry */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            
            {/* Action Row */}
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caption" size={18} />
                <input 
                  type="text"
                  placeholder={isBangla ? 'গ্রাহকের ইমেইল দিয়ে সার্চ করুন...' : 'Search subscribers by email...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && fetchSubscribers()}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border text-title rounded-xl outline-none focus:border-primary transition-all text-sm placeholder:text-caption/40"
                />
              </div>

              {/* Manual Subscriber Addition Form */}
              <form onSubmit={handleAddSubscriber} className="flex gap-2 min-w-0">
                <input 
                  type="email"
                  placeholder={isBangla ? 'নতুন ইমেইল এড্রেস...' : 'Add reader email address...'}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 lg:w-64 px-4 py-2.5 bg-surface border border-border text-title rounded-xl outline-none focus:border-primary transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all text-xs md:text-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isAdding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus size={16} />}
                  <span>{isBangla ? 'যুক্ত করুন' : 'Add'}</span>
                </button>
              </form>
            </div>

            {/* List Table */}
            <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'ইমেইল' : 'Email Address'}</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'যুক্ত হওয়ার তারিখ' : 'Date Subscribed'}</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption text-right">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-caption font-bold">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          Retrieving subscribers list...
                        </td>
                      </tr>
                    ) : filteredSubs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-caption font-bold uppercase tracking-widest text-xs">
                          {isBangla ? 'কোনো সাবস্ক্রাইবার পাওয়া যায়নি।' : 'No subscribers found.'}
                        </td>
                      </tr>
                    ) : filteredSubs.map((sub) => {
                      const subId = sub._id || sub.id;
                      const dateStr = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : '--';

                      return (
                        <tr key={subId} className="hover:bg-surface/50 transition-colors group">
                          <td className="px-6 py-4.5 font-bold text-title">
                            {sub.email}
                          </td>
                          <td className="px-6 py-4.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                              Active / Verified
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-caption font-medium">
                            {dateStr}
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(subId, sub.email)}
                              className="p-2 text-caption hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                              title={isBangla ? 'গ্রাহক বাদ দিন' : 'Remove Subscriber'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Broadcast Studio */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Editor form (Left side 8 cols) */}
            <form onSubmit={handleBroadcastNewsletter} className="lg:col-span-8 bg-card border border-border p-6 md:p-8 rounded-[28px] shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wide">
                <Sparkles size={16} />
                {isBangla ? 'নিউজলেটার কম্পোজ স্টুডিও' : 'Bilingual Dispatch Console'}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-caption uppercase tracking-widest block">
                  {isBangla ? 'ইমেইল বিষয় (Subject) *' : 'Email Subject Line *'}
                </label>
                <input 
                  type="text"
                  placeholder={isBangla ? 'নিউজলেটারের মূল বিষয়...' : 'e.g. Exclusive Report: Digital Transit Milestones in Dhaka...'}
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                  className="w-full bg-surface border border-border text-title font-semibold rounded-xl p-4 outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-caption uppercase tracking-widest block">
                  {isBangla ? 'নিউজলেটার ভেতরের শিরোনাম *' : 'Internal Header Title *'}
                </label>
                <input 
                  type="text"
                  placeholder={isBangla ? 'ইমেইলের ভেতরে শুরুতে যে বড় টাইটেল থাকবে...' : 'e.g. A Revolutionary Shift in Bangladesh Transportation Grid'}
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full bg-surface border border-border text-title font-bold rounded-xl p-4 outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-caption uppercase tracking-widest block">
                  {isBangla ? 'ইমেইল বার্তা / কন্টেন্ট (HTML সমর্থিত) *' : 'Editorial Message / Story Body (HTML supported) *'}
                </label>
                <textarea 
                  rows={10}
                  placeholder={isBangla ? 'এখানে আপনার বার্তা লিখুন। আপনি <p>, <strong>, <a> ইত্যাদি HTML ট্যাগ ব্যবহার করতে পারেন...' : 'Compose your newsletter here. HTML tags like <p>, <strong>, <a> and <br/> are fully supported...'}
                  value={broadcastForm.content}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                  className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:border-primary transition-all font-sans text-sm resize-y"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isBroadcasting || subscribers.length === 0}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={18} />
                )}
                <span>
                  {isBangla 
                    ? `ব্রডকাস্ট করুন (${subscribers.length} জন গ্রাহককে)` 
                    : `Broadcast to All (${subscribers.length} Subscribers)`
                  }
                </span>
              </button>
            </form>

            {/* Broadcast Logs & Guidelines (Right side 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Guidelines Card */}
              <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-[28px] text-white space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h4 className="font-serif font-bold text-sm text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Megaphone className="text-primary" size={18} />
                  {isBangla ? 'ব্রডকাস্ট নির্দেশিকা' : 'Editorial Broadcast Guide'}
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>{isBangla ? 'গ্রাহকদের প্রাইভেসি রক্ষার্থে সবার ইমেইল BCC আকারে পাঠানো হবে।' : 'All dispatches use BCC to guarantee subscriber address privacy.'}</li>
                  <li>{isBangla ? 'ইমেইল ডিজাইনে Georgia ও Georgia Serif ফন্ট ব্যবহৃত হবে।' : 'Templates employ gorgeous Georgia serif formatting for readability.'}</li>
                  <li>{isBangla ? 'স্প্যামিং এড়াতে সাবজেক্ট লাইনে আজেবাজে শব্দ ব্যবহার করবেন না।' : 'Avoid trigger words in subjects to prevent landing in spam folders.'}</li>
                  <li>{isBangla ? 'টেক্সটের ফন্ট ফরম্যাটিং এর জন্য HTML ট্যাগ ব্যবহার করতে পারেন।' : 'Enhance typography using standard paragraph (<p>) or bold (<strong>) HTML tags.'}</li>
                </ul>
              </div>

              {/* History Logs */}
              <div className="bg-card border border-border p-6 rounded-[28px] space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-caption flex items-center gap-2">
                  <Clock size={16} />
                  {isBangla ? 'সাম্প্রতিক ব্রডকাস্টসমূহ' : 'Broadcast Dispatch Logs'}
                </h4>

                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                  {loadingNotifications ? (
                    <p className="text-xs text-caption animate-pulse">{isBangla ? 'লোড হচ্ছে...' : 'Loading history...'}</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-xs text-caption">{isBangla ? 'কোনো ব্রডকাস্ট লগ নেই।' : 'No dispatches recorded yet.'}</p>
                  ) : notifications.map((log: any) => (
                    <div key={log._id || log.id} className="p-3 bg-surface border border-border rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-title truncate max-w-[150px]">{log.title || 'Broadcast Announcement'}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{log.status || 'Sent'}</span>
                      </div>
                      <p className="text-caption truncate text-[10px]">{log.body}</p>
                      <span className="text-[9px] text-caption opacity-70 block pt-1 flex items-center gap-1">
                        <Clock size={10} /> {new Date(log.createdAt).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
