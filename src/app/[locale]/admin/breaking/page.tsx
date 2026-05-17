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
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const statusStyles: Record<string, string> = {
  'Published': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Draft': 'bg-gray-500/10 text-caption border-border',
  'Pending Review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Scheduled': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Archived': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export default function BreakingNewsPage() {
  const params = useParams();
  const locale = params?.locale as string || 'bn';
  const isBangla = locale === 'bn';

  const typeName = "Breaking News";
  const sectionTitle = isBangla ? "ব্রেকিং নিউজ ডেস্ক" : "Breaking News Desk";
  const sectionDesc = isBangla ? "তাত্ক্ষণিক এবং জরুরি ব্রেকিং নিউজ ম্যানেজ করুন।" : "Manage immediate and high-alert breaking dispatches.";

  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchArticles();
  }, [selectedStatus]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/articles?type=${typeName}&status=${selectedStatus}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
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
    const result = await Swal.fire({
      title: isBangla ? 'আপনি কি নিশ্চিত?' : 'Are you sure?',
      text: isBangla ? 'এই ব্রেকিং নিউজটি ডিলিট করতে চান?' : 'Do you want to delete this breaking dispatch?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: isBangla ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, delete it'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => (a._id || a.id) !== id));
        toast.success(isBangla ? 'ব্রেকিং নিউজটি সফলভাবে ডিলিট করা হয়েছে!' : 'Breaking news deleted successfully!');
      } else {
        toast.error('Action failed');
      }
    } catch (err) {
      toast.error('Action failed');
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
        toast.success(isBangla ? 'স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!' : 'Status updated successfully!');
      } else {
        toast.error('Action failed');
      }
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-10 text-body relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-1.5 animate-pulse">
            <Flame size={16} /> Live Desk
          </div>
          <h1 className="text-3xl font-serif font-bold text-title">{sectionTitle}</h1>
          <p className="text-caption mt-1">{sectionDesc}</p>
        </div>
        <Link 
          href={`/${locale}/admin/articles/create?type=${typeName}`}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-rose-600/10 cursor-pointer"
        >
          <Plus size={20} />
          {isBangla ? 'ব্রেকিং নিউজ তৈরি করুন' : 'Dispatch Breaking'}
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 border border-border rounded-[24px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center"><Flame size={24} /></div>
          <div>
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">Total Dispatches</p>
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
            <p className="text-[10px] font-bold text-caption uppercase tracking-widest">Draft Dispatches</p>
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
                  ? "bg-rose-600 text-white border-rose-600 shadow-md" 
                  : "bg-card text-caption border-border hover:border-rose-600 hover:text-title"
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
                    No breaking news found.
                  </td>
                </tr>
              ) : filteredArticles.map((article) => {
                const articleId = article._id || article.id;
                return (
                  <tr key={articleId} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-title group-hover:text-rose-500 transition-colors line-clamp-1">
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
