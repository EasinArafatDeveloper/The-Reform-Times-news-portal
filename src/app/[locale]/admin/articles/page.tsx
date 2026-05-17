"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Archive, 
  Copy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { mockArticles } from '@/lib/data';
import { useParams } from 'next/navigation';

const statusStyles: Record<string, string> = {
  'Published': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Draft': 'bg-gray-500/10 text-caption border-border',
  'Pending Review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Scheduled': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Archived': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export default function ArticlesPage() {
  const params = useParams();
  const locale = params?.locale as string || 'bn';
  const isBangla = locale === 'bn';
  
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
    async function fetchArticles() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/articles?status=${selectedStatus}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setArticles(Array.isArray(data) && data.length > 0 ? data : mockArticles.map(a => ({...a, status: 'Published', views: Math.floor(Math.random() * 1000)})));
      } catch (err) {
        setError('Error loading articles');
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticles();
  }, [selectedStatus]);

  const filteredArticles = articles.filter(a => {
    const titleText = typeof a.title === 'string' ? a.title : `${a.title?.bn || ''} ${a.title?.en || ''}`;
    
    // Safety check for author
    const authorText = typeof a.author === 'string' 
      ? a.author 
      : (typeof a.author === 'object' && a.author ? (a.author.name || '') : '');
      
    return (
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!window.confirm(isBangla ? 'আপনি কি নিশ্চিত যে আপনি এই আর্টিকেলটি ডিলিট করতে চান?' : 'Are you sure you want to delete this article? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => (a._id || a.id) !== id));
        setAlert({ 
          type: 'success', 
          message: isBangla ? 'আর্টিকেলটি সফলভাবে ডিলিট করা হয়েছে!' : 'Article deleted successfully!' 
        });
      } else {
        setAlert({ 
          type: 'error', 
          message: isBangla ? 'ডিলিট করতে ব্যর্থ হয়েছে!' : 'Failed to delete article!' 
        });
      }
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: isBangla ? 'ডিলিট করার সময় সমস্যা হয়েছে!' : 'Error deleting article!' 
      });
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
          message: isBangla ? 'আর্টিকেলের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!' : 'Article status updated successfully!' 
        });
      } else {
        setAlert({ 
          type: 'error', 
          message: isBangla ? 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে!' : 'Failed to update status!' 
        });
      }
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: isBangla ? 'আপডেট করার সময় সমস্যা হয়েছে!' : 'Error updating status!' 
      });
    }
  };

  return (
    <div className="space-y-8 text-body relative">
      {/* Toast Alert */}
      {alert && (
        <div className={cn(
          "fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-top-4 duration-300 backdrop-blur-md",
          alert.type === 'success' 
            ? "bg-green-500/10 text-green-500 border-green-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        )}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-bold text-sm">{alert.message}</span>
          <button 
            onClick={() => setAlert(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-title">{isBangla ? 'নিউজ আর্টিকেলসমূহ' : 'Articles'}</h1>
          <p className="text-caption mt-1">
            {isBangla ? 'আপনার এডিটোরিয়াল কন্টেন্ট ম্যানেজ ও পাবলিশ করুন।' : 'Manage and publish your editorial content.'}
          </p>
        </div>
        <Link 
          href={`/${locale}/admin/articles/create`}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/10"
        >
          <Plus size={20} />
          {isBangla ? 'নতুন আর্টিকেল তৈরি করুন' : 'Create New Article'}
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 transition-colors">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" size={18} />
          <input 
            type="text" 
            placeholder={isBangla ? 'শিরোনাম, লেখক বা ক্যাটাগরি দিয়ে খুঁজুন...' : 'Search by title, author or category...'} 
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border text-title rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-caption/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'Published', 'Draft', 'Pending', 'Scheduled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
                selectedStatus === status 
                  ? "bg-secondary text-white border-secondary shadow-md" 
                  : "bg-card text-caption border-border hover:border-secondary hover:text-title"
              )}
            >
              {isBangla 
                ? (status === 'All' ? 'সব' : status === 'Published' ? 'প্রকাশিত' : status === 'Draft' ? 'খসড়া' : status === 'Pending' ? 'পর্যালোচাধীন' : 'তফসিলীকৃত')
                : status}
            </button>
          ))}
          <button className="p-2.5 bg-card border border-border rounded-xl text-caption hover:bg-surface transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border transition-colors">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'শিরোনাম' : 'Title'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'লেখক' : 'Author'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'অবস্থা' : 'Status'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption text-center">{isBangla ? 'ভিউস' : 'Views'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption">{isBangla ? 'তারিখ' : 'Date'}</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-caption text-right">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm transition-colors">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-caption">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       <p className="font-bold uppercase tracking-widest text-[10px]">{isBangla ? 'লোড হচ্ছে...' : 'Loading Articles...'}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-caption font-bold uppercase tracking-widest text-xs">
                    {isBangla ? 'কোনো আর্টিকেল পাওয়া যায়নি' : 'No articles found'}
                  </td>
                </tr>
              ) : filteredArticles.map((article) => {
                const articleId = article._id || article.id;
                
                return (
                  <tr key={articleId} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-title group-hover:text-primary transition-colors line-clamp-1">
                          {getArticleTitle(article)}
                        </span>
                        <span className="text-xs text-caption mt-1 flex items-center gap-1">
                          <ExternalLink size={10} /> news/{getArticleSlug(article)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-surface border border-border text-caption rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-body">
                      {typeof article.author === 'string' 
                        ? article.author 
                        : (typeof article.author === 'object' && article.author ? (article.author.name || 'Staff Reporter') : 'Staff Reporter')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={article.status}
                        onChange={(e) => handleStatusChange(articleId, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer outline-none bg-card hover:border-primary/50",
                          statusStyles[article.status] || 'bg-gray-500/10 text-caption border-border'
                        )}
                      >
                        <option value="Published" className="bg-card text-body">{isBangla ? 'Published (প্রকাশিত)' : 'Published'}</option>
                        <option value="Draft" className="bg-card text-body">{isBangla ? 'Draft (খসড়া)' : 'Draft'}</option>
                        <option value="Pending Review" className="bg-card text-body">{isBangla ? 'Pending (পর্যালোচাধীন)' : 'Pending Review'}</option>
                        <option value="Scheduled" className="bg-card text-body">{isBangla ? 'Scheduled (তফসিলীকৃত)' : 'Scheduled'}</option>
                        <option value="Archived" className="bg-card text-body">{isBangla ? 'Archived (আর্কাইভ)' : 'Archived'}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-body">{article.views || 0}</td>
                    <td className="px-6 py-4 text-caption font-medium">
                      {new Date(article.createdAt || article.date || new Date()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/${locale}/admin/articles/edit/${articleId}`}
                          className="p-2 text-caption hover:text-title hover:bg-surface rounded-lg transition-all" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(articleId)}
                          className="p-2 text-caption hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-caption hover:text-title hover:bg-surface rounded-lg transition-all"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface border-t border-border flex items-center justify-between transition-colors">
          <p className="text-sm text-caption font-medium">
            {isBangla 
              ? <>প্রদর্শিত হচ্ছে <span className="font-bold text-title">১-৮</span> টি মোট <span className="font-bold text-title">১,২৮৪</span> টি আর্টিকেলের মধ্যে</>
              : <>Showing <span className="font-bold text-title">1-8</span> of <span className="font-bold text-title">1,284</span> articles</>}
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-border rounded-lg bg-card text-caption hover:bg-surface transition-all disabled:opacity-50" disabled><ChevronLeft size={18} /></button>
            <button className="p-2 border border-border rounded-lg bg-card text-title font-bold hover:bg-surface transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
