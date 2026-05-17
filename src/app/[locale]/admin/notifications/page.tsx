'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Bell, RefreshCw, Send, CheckCircle2, AlertTriangle, Globe, Calendar, Link as LinkIcon, Smartphone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';

interface NotificationLog {
  _id: string;
  title: string;
  body: string;
  url: string;
  sentDate: string;
  sentCount: number;
  failedCount: number;
  language: string;
  status: string;
}

export default function NotificationsAdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'bn';
  const isBangla = locale === 'bn';

  const [history, setHistory] = useState<NotificationLog[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistoryAndStats = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch history logs
      const res = await fetch('/api/push/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }

      // 2. Fetch subscriber statistics (can count active subscriptions from a quick db check)
      // For now we count active push subscriptions
      const subRes = await fetch('/api/push/subscribe'); // Let's use the API or fallback
      // Alternatively, we can calculate active subscribers by fetching and displaying stats
      const totalSent = history.reduce((acc, curr) => acc + curr.sentCount, 0);
      
    } catch (err) {
      console.error('Failed to load notification history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryAndStats();
    
    // Fetch subscription count from database (endpoint can be integrated)
    fetch('/api/push/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Simple call to a subcount API or count from active subs
    fetch('/api/push/subscribe-stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.activeSubscribers === 'number') {
          setSubscriberCount(data.activeSubscribers);
        }
      })
      .catch(() => setSubscriberCount(0));
  }, []);

  const totalNotificationsSent = history.reduce((acc, curr) => acc + curr.sentCount, 0);
  const totalNotificationsFailed = history.reduce((acc, curr) => acc + curr.failedCount, 0);
  const totalSubscribers = subscriberCount || (history.length > 0 ? Math.max(...history.map(h => h.sentCount + h.failedCount)) : 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary animate-spin" size={36} />
        <p className="text-caption text-sm font-semibold">
          {isBangla ? 'রিয়েল-টাইম নোটিফিকেশন হিস্ট্রি লোড হচ্ছে...' : 'Loading notification log history...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-title flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Bell size={22} />
            </div>
            {isBangla ? 'পুশ নোটিফিকেশন হিস্ট্রি' : 'Push Notification History'}
          </h1>
          <p className="text-caption text-xs md:text-sm mt-1">
            {isBangla 
              ? 'আপনার সাইটের সক্রিয় পাঠকদের কাছে পাঠানো নোটিফিকেশনগুলোর স্থিতি দেখুন।' 
              : 'Monitor the transmission delivery status of push campaigns dispatched to your readers.'}
          </p>
        </div>

        <button
          onClick={fetchHistoryAndStats}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-border text-title text-sm font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {isBangla ? 'রিফ্রেশ করুন' : 'Refresh Logs'}
        </button>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-caption tracking-widest">{isBangla ? 'মোট সক্রিয় গ্রাহক' : 'Active Subscribers'}</p>
          <h2 className="text-4xl font-serif font-black text-title mt-2 flex items-baseline gap-2">
            {totalSubscribers}
            <span className="text-xs text-primary font-bold">{isBangla ? 'ডিভাইস' : 'Devices'}</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-green-500 font-semibold mt-3">
            <Smartphone size={14} />
            {isBangla ? 'ব্রাউজার পুশ রিসিভার' : 'Receiving instant alerts'}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-caption tracking-widest">{isBangla ? 'সাফল্যের হার' : 'Total Broadcasts'}</p>
          <h2 className="text-4xl font-serif font-black text-title mt-2 flex items-baseline gap-2">
            {totalNotificationsSent}
            <span className="text-xs text-green-500 font-bold">{isBangla ? 'সফল' : 'Delivered'}</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-caption font-semibold mt-3">
            <CheckCircle2 size={14} className="text-green-500" />
            {isBangla ? 'সরাসরি ডিভাইসে পৌঁছানো মেইল' : 'Delivered directly to subscriber screens'}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          <p className="text-[10px] uppercase font-bold text-caption tracking-widest">{isBangla ? 'ব্যর্থ ডেলিভারি' : 'Failed Attempts'}</p>
          <h2 className="text-4xl font-serif font-black text-title mt-2 flex items-baseline gap-2">
            {totalNotificationsFailed}
            <span className="text-xs text-rose-500 font-bold">{isBangla ? 'ব্যর্থ' : 'Failed'}</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-caption font-semibold mt-3">
            <AlertTriangle size={14} className="text-yellow-500" />
            {isBangla ? 'নিষ্ক্রিয়/অনুপস্থিত সাবস্ক্রিপশন' : 'Expired/revoked browser permissions'}
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-title">
            {isBangla ? 'ডেলিভারি ক্যাম্পেইন বিবরণ' : 'Delivery Campaign Logs'}
          </h3>
          <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">
            {history.length} {isBangla ? 'টি নোটিফিকেশন' : 'Campaigns'}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center text-caption mx-auto">
              <Send size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-bold text-title">{isBangla ? 'কোনো নোটিফিকেশন পাঠানো হয়নি' : 'No notifications dispatched yet'}</h4>
              <p className="text-caption text-xs leading-relaxed">
                {isBangla 
                  ? 'যখনই আপনি কোনো নতুন সংবাদ প্রকাশিত করবেন এবং পুশ অপশনটি সিলেক্ট করবেন, তা স্বয়ংক্রিয়ভাবে এখানে লগ হয়ে যাবে।' 
                  : 'Whenever you publish articles with push notifications enabled, their execution history report will populate right here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border text-[10px] font-black text-caption uppercase tracking-wider">
                  <th className="py-4 px-6">{isBangla ? 'নোটিফিকেশন টাইটেল' : 'Notification Title'}</th>
                  <th className="py-4 px-6">{isBangla ? 'ল্যাঙ্গুয়েজ' : 'Language'}</th>
                  <th className="py-4 px-6">{isBangla ? 'ডেলিভারি স্থিতি' : 'Delivery Status'}</th>
                  <th className="py-4 px-6">{isBangla ? 'পাঠানোর তারিখ' : 'Sent Date'}</th>
                  <th className="py-4 px-6">{isBangla ? 'সফল' : 'Delivered'}</th>
                  <th className="py-4 px-6">{isBangla ? 'ব্যর্থ' : 'Expired'}</th>
                  <th className="py-4 px-6 text-right">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs md:text-sm">
                {history.map((log) => {
                  const sentDate = log.sentDate ? new Date(log.sentDate) : new Date();
                  const formattedDate = isBangla
                    ? format(sentDate, 'dd MMMM yyyy, hh:mm a', { locale: bnLocale })
                    : format(sentDate, 'MMM dd, yyyy, hh:mm a');

                  return (
                    <tr key={log._id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <div className="font-bold text-title truncate">{log.title}</div>
                        <div className="text-[10px] text-caption truncate mt-0.5">{log.body}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-title">
                          <Globe size={12} className="text-primary shrink-0" />
                          {log.language === 'bn' ? 'বাংলা' : log.language === 'en' ? 'English' : log.language}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.status === 'Delivered'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-caption text-xs font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formattedDate}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-green-500">{log.sentCount}</td>
                      <td className="py-4 px-6 font-bold text-rose-500/80">{log.failedCount}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {log.url && (
                          <a
                            href={log.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-surface hover:bg-surface-hover border border-border text-title text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all"
                          >
                            <LinkIcon size={12} />
                            {isBangla ? 'লিংক' : 'View Link'}
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
