"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Eye,
  FileEdit,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const statusStyles: Record<string, string> = {
  'Published': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Draft': 'bg-gray-500/10 text-caption border-border',
  'Pending Review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Scheduled': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Archived': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export default function OpinionsPage() {
  const params = useParams();
  const locale = params?.locale as string || 'bn';
  const isBangla = locale === 'bn';

  const typeName = "Opinion";
  const sectionTitle = isBangla ? "মতামত ও সম্পাদকীয় ডেস্ক" : "Opinions & Editorials";
  const sectionDesc = isBangla ? "কলাম, সম্পাদকীয় এবং এডিটোরিয়াল মতামত কন্টেন্ট প্রকাশ করুন।" : "Manage commentary columns, op-eds, and expert editorial perspectives.";

  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    fetchArticles();
  }, [selectedStatus]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      // Retrieve both Opinions and Editorial types for Opinions desk
      const res = await fetch(`/api/articles?status=${selectedStatus}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : []).filter(a => a.type === 'Opinion' || a.type === 'Editorial');
      setArticles(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => {
    const titleText = typeof a.title === 'string' ? a.title : `${a.title?.bn || ''} ${a.title?.en || ''}`;
    const authorText = typeof a.author === 'string' 
      ? a.author 
      : (typeof a.author === 'object' && a.author ? (a.author.name || '') : '');
      
    return (
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getArticleTitle = (article: any) => {
    if (!article.title) return 'Untitled';
    if (typeof article.title === 'string') return article.title;
    return article.title[locale] || article.title.bn || article.title.en || 'Untitled';
  };

  const getArticleSlug = (article: any) => {
    if (!article.slug) return '';
    if (typeof article.slug === 'string') return article.slug;
    return article.slug[locale] || article.slug.bn || article.slug.en || '';
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isBangla ? 'আপনি কি নিশ্চিত যে এই মতামত নিবন্ধটি ডিলিট করতে চান?' : 'Are you sure you want to delete this commentary column?')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => (a._id || a.id) !== id));
        setAlert({ 
          type: 'success', 
          message: isBangla ? 'নিবন্ধটি সফলভাবে ডিলিট করা হয়েছে!' : 'Commentary column deleted successfully!' 
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Action failed' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setArticles(articles.map(a => (a._id || a.id) === id ? { ...a, status: newStatus } : a));
        setAlert({ 
          type: 'success', 
          message: isBangla ? 'স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!' : 'Status updated successfully!' 
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Action failed' });
    }
  };

  return (
    <div className="space-y-10 text-body relative">
      {alert && (
        <div className={cn(
          "fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-top-4 duration-300 backdrop-blur-md",
          alert.type === 'success' 
            ? "bg-green-500/10 text-green-500 border-green-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        )}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-bold text-sm">{alert.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-500 font-bold text-xs uppercase tracking-widest mb-1.5">
            <MessageSquare size={16} /> Editorial Think Tank
          </div>
          <h1 className="text-3xl font-serif font-bold text-title">{sectionTitle}</h1>
          <p className="text-caption mt-1">{sectionDesc}</p>
        </div>
        <Link 
          href={`/${locale}/admin/articles/create?type=${typeName}`}
          className="flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-violet-600/10 cursor-pointer"
        >
          <Plus size={20} />
          {isBangla ? 'নতুন মতামত কলাম লিখুন' : 'New Opinion Column'}
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center"><MessageSquare size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">Total Columns</p>
            <p className="text-xl font-bold text-title mt-1">{articles.length}</p>
          </div>
        </div>
        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Eye size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">Aggregate Traffic</p>
            <p className="text-xl font-bold text-title mt-1">
              {articles.reduce((sum, a) => sum + (a.views || 0), 0)} views
            </p>
          </div>
        </div>
        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><FileEdit size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">Draft Columns</p>
            <p className="text-xl font-bold text-title mt-1">
              {articles.filter(a => a.status === 'Draft').length} pending
            </p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" size={18} />
          <input 
            type="text" 
            placeholder={isBangla ? 'শিরোনাম বা কন্টেন্ট দিয়ে সার্চ করুন...' : 'Search by title or author...'} 
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border text-title rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-caption/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Published', 'Draft'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all border cursor-pointer",
                selectedStatus === status 
                  ? "bg-violet-600 text-white border-violet-600 shadow-md" 
                  : "bg-card text-caption border-border hover:border-violet-600 hover:text-title"
              )}
            >
              {isBangla ? (status === 'All' ? 'সব' : status === 'Published' ? 'প্রকাশিত' : 'খসড়া') : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'শিরোনাম' : 'Title'}</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'অবস্থা' : 'Status'}</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption text-center">{isBangla ? 'ভিউস' : 'Views'}</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-caption text-right">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-caption font-bold">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-caption font-bold uppercase tracking-widest text-xs">
                    No opinion columns found.
                  </td>
                </tr>
              ) : filteredArticles.map((article) => {
                const articleId = article._id || article.id;
                return (
                  <tr key={articleId} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-title group-hover:text-violet-500 transition-colors line-clamp-1">
                          {getArticleTitle(article)}
                        </span>
                        <span className="text-xs text-caption mt-1 flex items-center gap-1">
                          <ExternalLink size={10} /> news/{getArticleSlug(article)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={article.status}
                        onChange={(e) => handleStatusChange(articleId, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer bg-card hover:border-primary/50",
                          statusStyles[article.status] || 'bg-gray-500/10 text-caption border-border'
                        )}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending Review">Pending Review</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-title">{article.views || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/${locale}/admin/articles/edit/${articleId}`}
                          className="p-2 text-caption hover:text-title hover:bg-surface rounded-lg transition-all"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(articleId)}
                          className="p-2 text-caption hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
