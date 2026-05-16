"use client";

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Settings, 
  Search,
  Globe,
  ChevronLeft,
  Info,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useRouter } from 'next/navigation';

export default function CreateArticlePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    mainImage: '',
    isFeatured: false,
    isBreaking: false,
    allowComments: true,
    language: 'en',
    status: 'Published'
  });

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    }
    fetchCats();
  }, []);

  const handlePublish = async () => {
    if (!formData.title) return alert('Title is required');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          createdAt: new Date(),
          author: "Salman Ahmed" // Simulation
        })
      });
      if (res.ok) {
        alert('Article Published Successfully!');
        router.push('/admin/articles');
      }
    } catch (err) {
      alert('Failed to publish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/articles" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-brand-navy">
              <ChevronLeft size={24} />
            </Link>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Publishing Center</p>
               <h1 className="text-xl font-serif font-bold text-brand-navy flex items-center gap-2">
                 Drafting Content <Sparkles size={16} className="text-brand-gold" />
               </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
              <Save size={18} />
              Save Draft
            </button>
            <button 
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/10 disabled:opacity-50"
            >
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={18} />}
              {isSubmitting ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Headline Card */}
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm transition-all hover:shadow-md group">
               <textarea 
                  placeholder="Enter a compelling headline..."
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({...formData, title: e.target.value});
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  className="w-full bg-transparent border-none text-4xl md:text-5xl font-serif font-bold text-brand-navy placeholder:text-slate-200 outline-none resize-none overflow-hidden min-h-[60px]"
                  rows={1}
               />
               <div className="mt-6 flex items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                     <Clock size={14} /> 2 Min Read
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                     <CheckCircle2 size={14} className="text-green-500" /> Auto-saved
                  </div>
               </div>
            </div>

            {/* Excerpt Card */}
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
               <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                  <Info size={14} className="text-brand-navy" />
                  Short Summary (Excerpt)
               </label>
               <textarea 
                placeholder="Write a compelling summary for home page and social media..."
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full min-h-[100px] bg-slate-50 border border-slate-100 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-brand-navy/5 focus:border-brand-navy transition-all text-slate-700 leading-relaxed italic"
               />
            </div>

            {/* Content Tabs & Editor */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
               <div className="flex border-b border-slate-100 bg-slate-50/50">
                  {['Content', 'Media', 'SEO'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={cn(
                        "px-10 py-5 text-sm font-bold tracking-widest uppercase transition-all relative",
                        activeTab === tab.toLowerCase() ? "text-brand-navy bg-white" : "text-slate-400 hover:text-brand-navy"
                      )}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-navy"></div>}
                    </button>
                  ))}
               </div>

               <div className="p-10 min-h-[600px]">
                  {activeTab === 'content' && (
                    <RichTextEditor 
                      content={formData.content} 
                      onChange={(html) => setFormData({...formData, content: html})} 
                    />
                  )}
                  {activeTab === 'media' && (
                    <div className="space-y-6">
                       <label className="text-sm font-bold text-slate-700">Cover Image URL</label>
                       <input 
                         type="text" 
                         placeholder="Paste image URL here..."
                         value={formData.mainImage}
                         onChange={(e) => setFormData({...formData, mainImage: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none"
                       />
                       {formData.mainImage && (
                         <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200">
                            <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Right Sidebar - Publishing Options */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-4">Home Page Positioning</h3>
               
               <div className="space-y-6">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="font-bold text-slate-800">Featured Story</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Show in hero section</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-navy"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="font-bold text-slate-800">Breaking News</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Show in top ticker</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={formData.isBreaking} onChange={(e) => setFormData({...formData, isBreaking: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-navy"></div>
                    </label>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100 space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Primary Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none font-bold text-brand-navy"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="bg-brand-navy p-8 rounded-[32px] text-white space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <Globe size={20} className="text-brand-gold" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visibility</p>
                     <p className="font-bold">Publicly Accessible</p>
                  </div>
               </div>
               <p className="text-sm text-white/60 leading-relaxed">
                 Once published, this article will be available to all readers worldwide across English and Bengali platforms.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
