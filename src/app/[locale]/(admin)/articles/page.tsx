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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { mockArticles } from '@/lib/data';



const statusStyles: Record<string, string> = {
  'Published': 'bg-green-50 text-green-700 border-green-200',
  'Draft': 'bg-gray-50 text-gray-600 border-gray-200',
  'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
  'Archived': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

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

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => a._id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Error deleting article');
    }
  };



  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy">Articles</h1>
          <p className="text-gray-500 mt-1">Manage and publish your editorial content.</p>
        </div>
        <Link 
          href="/admin/articles/create"
          className="flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-red-100"
        >
          <Plus size={20} />
          Create New Article
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, author or category..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
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
                  ? "bg-brand-navy text-white border-brand-navy" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-brand-navy hover:text-brand-navy"
              )}
            >
              {status}
            </button>
          ))}
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Author</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Views</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                       <p className="font-bold uppercase tracking-widest text-[10px]">Loading Articles...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    No articles found
                  </td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article._id || article.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-navy group-hover:text-brand-red transition-colors line-clamp-1">{article.title}</span>
                      <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><ExternalLink size={10} /> news/{article.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold border",
                      statusStyles[article.status]
                    )}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600">{article.views}</td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{new Date(article.createdAt || article.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/articles/edit/${article._id}`}
                        className="p-2 text-gray-400 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-all" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article._id)}
                        className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Showing <span className="font-bold text-brand-navy">1-8</span> of <span className="font-bold text-brand-navy">1,284</span> articles</p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50" disabled><ChevronLeft size={18} /></button>
            <button className="p-2 border border-gray-200 rounded-lg bg-white text-brand-navy font-bold hover:bg-gray-50 transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
