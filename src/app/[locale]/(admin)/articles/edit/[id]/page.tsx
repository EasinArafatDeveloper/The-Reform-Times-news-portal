"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Send, 
  Eye, 
  Image as ImageIcon, 
  Tag, 
  Link as LinkIcon, 
  Clock, 
  Globe, 
  ShieldCheck,
  Plus,
  X,
  ChevronDown,
  Info,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('content');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Investigations',
    author: 'Salman Ahmed',
    status: 'Published',
    language: 'en',
    mainImage: '',
    isFeatured: false,
    isBreaking: false,
    allowComments: true
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'Investigations',
            author: data.author || 'Salman Ahmed',
            status: data.status || 'Published',
            language: data.language || 'en',
            mainImage: data.mainImage || '',
            isFeatured: data.isFeatured || false,
            isBreaking: data.isBreaking || false,
            allowComments: data.allowComments !== undefined ? data.allowComments : true
          });
          setTags(data.tags || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticle();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!formData.title) return alert('Title is required');
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags })
      });
      if (res.ok) {
        router.push('/admin/articles');
      } else {
        alert('Failed to update article');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
       <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
       <p className="font-serif font-bold text-brand-navy uppercase tracking-widest text-sm">Fetching Content...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            <Link href="/admin/articles" className="hover:text-brand-red transition-colors">Articles</Link>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="text-brand-navy">Edit Content</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy line-clamp-1">{formData.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/10 disabled:opacity-50"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
            {isSubmitting ? 'Saving Changes...' : 'Save & Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Headline..." 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full text-4xl font-serif font-bold text-brand-navy bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
             <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Summary</label>
             <textarea 
               value={formData.excerpt}
               onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
               className="w-full h-20 bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all text-sm resize-none"
             ></textarea>
          </div>

          <div className="flex border-b border-gray-200">
             {['Content', 'Media', 'Settings', 'SEO'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab.toLowerCase())}
                 className={cn(
                   "px-6 py-4 text-sm font-bold transition-all relative",
                   activeTab === tab.toLowerCase() ? "text-brand-red" : "text-gray-400 hover:text-brand-navy"
                 )}
               >
                 {tab}
                 {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red"></div>}
               </button>
             ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
             {activeTab === 'content' && (
                <RichTextEditor 
                  content={formData.content} 
                  onChange={(html) => setFormData({...formData, content: html})} 
                />
             )}

             {activeTab === 'media' && (
                <div className="space-y-4">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                   <input 
                     type="text" 
                     value={formData.mainImage}
                     onChange={(e) => setFormData({...formData, mainImage: e.target.value})}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-sm" 
                   />
                   {formData.mainImage && <img src={formData.mainImage} className="mt-4 rounded-2xl w-full aspect-video object-cover" />}
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                      <select 
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none text-sm font-bold"
                       >
                         <option>National</option>
                         <option>International</option>
                         <option>Investigations</option>
                         <option>Politics</option>
                         <option>Human Rights</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Language</label>
                      <select 
                         value={formData.language}
                         onChange={(e) => setFormData({...formData, language: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none text-sm font-bold text-brand-red"
                       >
                         <option value="en">English (ENG)</option>
                         <option value="bn">Bengali (BAN)</option>
                      </select>
                   </div>
                </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8">
              <h3 className="font-bold text-brand-navy border-b border-gray-50 pb-4 uppercase tracking-widest text-xs">Page Settings</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-navy">Featured</span>
                    <button onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})} className={cn("w-12 h-6 rounded-full relative transition-all", formData.isFeatured ? "bg-brand-red" : "bg-gray-200")}>
                       <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.isFeatured ? "right-1" : "left-1")}></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-navy">Breaking</span>
                    <button onClick={() => setFormData({...formData, isBreaking: !formData.isBreaking})} className={cn("w-12 h-6 rounded-full relative transition-all", formData.isBreaking ? "bg-brand-red" : "bg-gray-200")}>
                       <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.isBreaking ? "right-1" : "left-1")}></div>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
