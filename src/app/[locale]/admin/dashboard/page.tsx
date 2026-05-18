"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Search,
  ChevronRight,
  X,
  PlusCircle,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Real-time Dashboard with MongoDB Dynamic Data

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statsList = [
    { label: 'Total Articles', value: data?.stats?.totalArticles || '0', icon: FileText, change: '+12%', trend: 'up' },
    { label: 'Total Visitors', value: data?.stats?.visitors || '0', icon: Eye, change: '+24%', trend: 'up' },
    { label: 'Newsletter Subscriptions', value: data?.stats?.subscriptions || '0', icon: Mail, change: '+5%', trend: 'up' },
    { label: 'Story Submissions', value: data?.stats?.submissions || '0', icon: Search, change: '-2%', trend: 'down' },
  ];

  const articleStatsList = [
    { label: 'Published', value: data?.stats?.publishedCount || '0', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Drafts', value: data?.stats?.draftCount || '0', color: 'text-body', bg: 'bg-surface' },
    { label: 'Pending Review', value: data?.stats?.pendingCount || '0', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Investigations', value: data?.stats?.investigationsCount || '0', color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-title">Welcome back, Kazi</h1>
        <p className="text-caption mt-1">Here is what is happening with The Reform Times today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors text-body">
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-caption text-sm font-semibold mb-1">{stat.label}</h3>
            {loading ? (
              <div className="h-8 w-20 bg-surface animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-title">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Creator Panel */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-lg font-serif font-bold text-title mb-4">Quick Creator Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/admin/articles/create" className="flex items-center gap-4 p-4 rounded-xl bg-surface hover:bg-primary hover:text-white transition-all border border-border group shadow-sm">
            <div className="p-3 rounded-lg bg-card group-hover:bg-white/10 transition-colors text-primary group-hover:text-white">
              <PlusCircle size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-title group-hover:text-white leading-none mb-1">Create Article</h4>
              <p className="text-xs text-caption group-hover:text-white/80">Draft a new news article</p>
            </div>
          </Link>
          <Link href="/admin/photocard" className="flex items-center gap-4 p-4 rounded-xl bg-surface hover:bg-primary hover:text-white transition-all border border-border group shadow-sm">
            <div className="p-3 rounded-lg bg-card group-hover:bg-white/10 transition-colors text-primary group-hover:text-white">
              <ImageIcon size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-title group-hover:text-white leading-none mb-1">Photocard Generator</h4>
              <p className="text-xs text-caption group-hover:text-white/80">Create social media cards</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editorial Overview */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-serif font-bold text-title">Editorial Workflow</h2>
            <button className="text-primary text-sm font-bold hover:underline">View All &rarr;</button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {articleStatsList.map((item) => (
              <div key={item.label} className={cn("p-4 rounded-xl", item.bg)}>
                <p className="text-xs font-bold uppercase tracking-wider text-caption mb-2">{item.label}</p>
                {loading ? (
                  <div className="h-9 w-12 bg-white/50 animate-pulse rounded"></div>
                ) : (
                  <p className={cn("text-3xl font-bold", item.color)}>{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-caption uppercase tracking-widest border-b border-border pb-2">Recent Activity</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-surface animate-pulse rounded-xl"></div>)}
                </div>
              ) : (data?.activity || []).map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-4 group text-body">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-caption" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">
                      <span className="font-bold text-title">{activity.user}</span> {activity.action} <span className="font-semibold text-primary">{activity.target}</span>
                    </p>
                    <p className="text-[10px] text-caption font-bold uppercase mt-1">{activity.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-caption opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing */}
        <div className="bg-secondary text-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-serif font-bold mb-8">Top Performing</h2>
          <div className="space-y-8">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-3 w-16 bg-white/10 rounded"></div>
                    <div className="h-5 w-full bg-white/10 rounded"></div>
                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (data?.topArticles || []).length > 0 ? (
              (data.topArticles).map((article: any) => (
                <div key={article.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{article.category}</span>
                    <span className={cn(
                      "text-xs font-bold text-green-400"
                    )}>{article.trend}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <Eye size={14} />
                    <span>{article.views} views</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-xs py-4 text-center">No published articles yet.</p>
            )}
          </div>
          <button className="w-full mt-10 py-4 border border-white/20 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
            View Analytics Report
          </button>
        </div>
      </div>

      {/* Quick Actions & Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-title mb-6 flex items-center justify-between">
              <span>Pending Moderation</span>
              {!loading && (data?.pendingArticles || []).length > 0 && (
                <span className="text-xs bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  {data.pendingArticles.length} new
                </span>
              )}
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-surface animate-pulse rounded-xl border border-border"></div>
                  ))}
                </div>
              ) : (data?.pendingArticles || []).length > 0 ? (
                (data.pendingArticles).map((article: any) => (
                  <div key={article.id} className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border group hover:border-amber-300 transition-all">
                    <MessageSquare size={18} className="text-amber-500 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-title mb-1 line-clamp-1 group-hover:text-primary transition-colors">{article.title}</p>
                      <p className="text-xs text-caption">by <span className="font-semibold text-title">{article.author}</span> • {article.time}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link 
                        href={`/admin/articles/edit/${article.id}`}
                        className="p-2 bg-card hover:bg-primary hover:text-white text-caption rounded-lg transition-all shadow-sm border border-border flex items-center justify-center"
                        title="Review and Publish"
                      >
                        <CheckCircle2 size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-green-50/50 border border-green-100 rounded-xl">
                  <CheckCircle2 className="text-green-500 w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-bold text-green-700">All caught up!</p>
                  <p className="text-[10px] text-green-600 mt-0.5">No articles are pending review right now.</p>
                </div>
              )}
            </div>
          </div>

         <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-title mb-6">Anonymous Tips</h2>
            <div className="space-y-4">
               {[1, 2].map((i) => (
                 <div key={i} className="p-4 bg-primary/5 rounded-xl border border-primary/20 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-2">
                       <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-primary tracking-widest">
                          <AlertCircle size={14} /> High Risk
                       </span>
                       <span className="text-[10px] text-caption font-bold uppercase tracking-widest">Received: Today</span>
                    </div>
                    <h4 className="font-bold text-title text-sm mb-2">Corruption at local municipal council regarding...</h4>
                    <button className="text-xs font-bold text-title hover:text-primary transition-colors underline">Open Evidence Folder</button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
