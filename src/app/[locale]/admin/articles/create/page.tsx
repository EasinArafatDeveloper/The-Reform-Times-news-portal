"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Save, ChevronLeft, Info, CheckCircle2, Clock, Sparkles, Globe, 
  AlertTriangle, Eye, ShieldAlert, Check, Plus, Image as ImageIcon, 
  PlusCircle, Trash2, Layout, Sliders, Settings, Monitor, Smartphone, Maximize2, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { generateSlug } from '@/lib/article-helpers';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CreateArticlePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string || 'bn';
  
  // App States
  const [activeLang, setActiveLang] = useState<'bn' | 'en'>('bn');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const typeFromUrl = searchParams?.get('type');
    if (typeFromUrl) {
      setFormData(prev => ({
        ...prev,
        type: typeFromUrl,
        breaking: typeFromUrl === 'Breaking News' ? true : prev.breaking
      }));
    }
  }, [searchParams]);
  const [autosaveStatus, setAutosaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved'>('Saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('just now');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewLang, setPreviewLang] = useState<'bn' | 'en'>('bn');

  // Main Form State
  const [formData, setFormData] = useState({
    title: { bn: '', en: '' },
    slug: { bn: '', en: '' },
    excerpt: { bn: '', en: '' },
    content: { bn: '', en: '' },
    seoTitle: { bn: '', en: '' },
    metaDescription: { bn: '', en: '' },
    category: '',
    subCategory: '',
    authorId: 'author-1',
    mainImage: '',
    imageAlt: '',
    imageCaption: '',
    imageCredit: '',
    gallery: [] as string[],
    tags: '',
    location: { country: 'Bangladesh', division: '', district: '', upazila: '' },
    type: 'Standard News',
    status: 'Draft',
    featured: false,
    breaking: false,
    trending: false,
    readTime: '5 min read',
    visibility: 'Public',
    sendPush: false
  });

  // Simulated content blocks
  const [contentBlocks, setContentBlocks] = useState<Array<{id: string, type: string, value: string}>>([]);

  // File Upload References & Drag states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAutosaveStatus('Saving...');
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFieldChange('mainImage', reader.result as string);
      setAutosaveStatus('Saved');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setAutosaveStatus('Saving...');
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFieldChange('mainImage', reader.result as string);
      setAutosaveStatus('Saved');
    };
    reader.readAsDataURL(file);
  };

  // Load categories
  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) { console.error(err); }
    }
    fetchCats();
  }, []);

  // Autosave Simulator
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (formData.title.bn || formData.title.en) {
      setAutosaveStatus('Unsaved');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setAutosaveStatus('Saving...');
        setTimeout(() => {
          setAutosaveStatus('Saved');
          const now = new Date();
          setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [formData]);

  // Keyboard Shortcuts (Ctrl + S & Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handlePublish('Draft');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handlePublish('Published');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleTitleChange = (val: string, lang: 'bn' | 'en') => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: val },
      slug: { ...prev.slug, [lang]: prev.slug[lang] || generateSlug(val) }
    }));
  };

  const handleFieldChange = (field: string, val: any, lang?: 'bn' | 'en') => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...(prev as any)[field], [lang]: val }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: val }));
    }
  };

  // Add Content Block
  const addContentBlock = (type: string) => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: ''
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const handlePublish = async (status: string) => {
    if (!formData.title.bn) return toast.error('Bangla title is required');
    if (!formData.title.en) return toast.error('English title is required');
    if (!formData.content.bn) return toast.error('Bangla content is required');
    if (!formData.content.en) return toast.error('English content is required');
    if (!formData.category) return toast.error('Category is required');
    if (!formData.mainImage) return toast.error('Featured image is required');

    const confirmResult = await Swal.fire({
      title: status === 'Published' ? 'Publish Dispatch?' : 'Save Draft?',
      text: status === 'Published' 
        ? 'This article will be instantly broadcast to the public bilingual network.'
        : 'This article will be securely saved as an editorial draft.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: status === 'Published' ? 'Yes, Publish Dispatch' : 'Yes, Save Draft',
      cancelButtonText: 'Cancel',
      confirmButtonColor: status === 'Published' ? '#8B0000' : '#3b82f6',
      cancelButtonColor: '#475569',
      background: '#151c2c',
      color: '#f8fafc',
    });

    if (!confirmResult.isConfirmed) return;

    const loadId = toast.loading(status === 'Published' ? 'Publishing dispatch...' : 'Saving draft...');
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        publishedAt: status === 'Published' ? new Date().toISOString() : undefined,
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success(`Article successfully saved as ${status}!`, { id: loadId });
        setTimeout(() => {
          router.push(`/${locale}/admin/articles`);
        }, 1200);
      } else {
        toast.dismiss(loadId);
        const errData = await res.json().catch(() => ({}));
        const isConnErr = errData.error?.includes('Mongo') || errData.error?.includes('connect') || errData.error?.includes('Refused') || errData.error?.includes('Database');

        if (isConnErr) {
          Swal.fire({
            title: 'Database Whitelist Error',
            html: `
              <div class="text-left space-y-3 font-sans text-sm">
                <p class="text-rose-400 font-bold">❌ Connection refused by MongoDB Atlas Firewall.</p>
                <p>Your current client IP address is not whitelisted to connect to this cluster.</p>
                <div class="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 mt-2">
                  <p class="text-slate-400 font-bold text-xs uppercase tracking-wide">How to resolve:</p>
                  <ol class="list-decimal pl-4.5 space-y-1.5 text-slate-300 text-xs leading-relaxed">
                    <li>Log into your <b>MongoDB Atlas</b> console.</li>
                    <li>Navigate to <b>Security → Network Access</b> in the left sidebar.</li>
                    <li>Click <b>+ Add IP Address</b>.</li>
                    <li>Select <b>Add Current IP Address</b> or add <b>0.0.0.0/0</b> for anywhere.</li>
                    <li>Click <b>Confirm</b> and wait 1 minute for deployment!</li>
                  </ol>
                </div>
              </div>
            `,
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#8B0000',
            background: '#151c2c',
            color: '#f8fafc',
          });
        } else {
          toast.error(`Failed to save article: ${errData.error || 'Server error'}`);
        }
      }
    } catch (err: any) {
      toast.error(`Failed to publish: ${err.message || 'Network error'}`, { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion Status Calculations
  const bnComplete = !!formData.title.bn && !!formData.content.bn;
  const enComplete = !!formData.title.en && !!formData.content.en;
  const bnSeoComplete = !!formData.seoTitle.bn && !!formData.metaDescription.bn;
  const enSeoComplete = !!formData.seoTitle.en && !!formData.metaDescription.en;

  // Percentage Score
  let score = 0;
  if (formData.title.bn) score += 15;
  if (formData.content.bn) score += 20;
  if (formData.title.en) score += 15;
  if (formData.content.en) score += 20;
  if (formData.category) score += 10;
  if (formData.mainImage) score += 10;
  if (bnSeoComplete && enSeoComplete) score += 10;

  return (
    <div className="min-h-screen bg-background pb-24 text-body">
      
      {/* Studio Header Sticky Bar */}
      <div className="md:sticky md:top-0 relative z-[60] bg-[#0F172A] text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-850 shadow-xl transition-all duration-300">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
            <Link href={`/${locale}/admin/articles`} className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white shrink-0">
              <ChevronLeft size={22} />
            </Link>
            <div className="h-6 w-[1px] bg-slate-800 shrink-0"></div>
            <div className="min-w-0">
               <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-bold uppercase tracking-widest text-primary">Newsroom Studio</span>
                 {autosaveStatus === 'Unsaved' && <span className="text-[10px] text-amber-400 font-medium">Unsaved changes</span>}
                 {autosaveStatus === 'Saving...' && <span className="text-[10px] text-slate-400 animate-pulse">Saving...</span>}
                 {autosaveStatus === 'Saved' && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 size={10} /> Auto-saved {lastSavedTime}</span>}
               </div>
               <h1 className="text-sm md:text-lg font-serif font-bold tracking-wide truncate">
                 Publishing Center: New Bilingual Dispatch
               </h1>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0 w-full sm:w-auto">
            <button 
              onClick={() => { setPreviewLang(activeLang); setShowPreviewModal(true); }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs md:text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-all cursor-pointer"
            >
              <Eye size={16} /> Preview
            </button>
            <button 
              onClick={() => handlePublish('Draft')} 
              disabled={isSubmitting} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs md:text-sm text-slate-300 bg-slate-800/40 hover:bg-slate-800 hover:text-white border border-slate-750 transition-all cursor-pointer"
            >
              <Save size={16} /> Save Draft
            </button>
            <button 
              onClick={() => handlePublish('Published')} 
              disabled={isSubmitting} 
              className="flex-2 sm:flex-none flex items-center justify-center gap-1.5 px-5 md:px-7 py-2 rounded-xl bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary/95 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={16} />
              )}
              <span>Publish Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        
        {/* Validation Warnings Panel */}
        {(!formData.title.bn || !formData.title.en || !formData.content.bn || !formData.content.en || !formData.category || !formData.mainImage) && (
          <div className="mb-6 p-4.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3.5 text-amber-500 shadow-sm">
            <ShieldAlert size={20} className="shrink-0 mt-0.5 text-amber-600" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs md:text-sm">Bilingual Compliance Verification Checklist</h5>
              <p className="text-[11px] md:text-xs text-amber-500/90 leading-relaxed">
                Before this dispatch can be live on the public network, ensure these criteria are met:
                <span className="font-bold block mt-1">
                  {!formData.title.bn && '• Bangla Title required '}
                  {!formData.content.bn && '• Bangla Content required '}
                  {!formData.title.en && '• English Title required '}
                  {!formData.content.en && '• English Content required '}
                  {!formData.category && '• Category Selection required '}
                  {!formData.mainImage && '• Cover Media required '}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main workspace editor (Left Side) */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <div className="bg-card rounded-2xl sm:rounded-[24px] border border-border shadow-sm overflow-hidden">
               
               {/* Language Tabs Selector */}
               <div className="flex border-b border-border bg-surface p-1.5 md:p-2 gap-1.5">
                  <button 
                    onClick={() => setActiveLang('bn')} 
                    className={cn(
                      "flex-1 px-4 py-4 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-xl relative flex items-center justify-center gap-2 cursor-pointer", 
                      activeLang === 'bn' 
                        ? "text-primary bg-card shadow-sm border border-border" 
                        : "text-caption hover:text-primary hover:bg-card/30"
                    )}
                  >
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", bnComplete ? "bg-emerald-500" : "bg-amber-400 animate-pulse")} />
                    বাংলা Content 
                    <span className="text-[10px] opacity-85 lowercase font-normal hidden xs:inline-block">({bnComplete ? '✓ Complete' : '⚠ Missing'})</span>
                  </button>
                  <button 
                    onClick={() => setActiveLang('en')} 
                    className={cn(
                      "flex-1 px-4 py-4 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-xl relative flex items-center justify-center gap-2 cursor-pointer", 
                      activeLang === 'en' 
                        ? "text-primary bg-card shadow-sm border border-border" 
                        : "text-caption hover:text-primary hover:bg-card/30"
                    )}
                  >
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", enComplete ? "bg-emerald-500" : "bg-amber-400 animate-pulse")} />
                    English Content
                    <span className="text-[10px] opacity-85 lowercase font-normal hidden xs:inline-block">({enComplete ? '✓ Complete' : '⚠ Missing'})</span>
                  </button>
               </div>

               {/* Form Editor Details */}
               <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
                 <div>
                   <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-caption mb-2">Headline ({activeLang === 'bn' ? 'বাংলা' : 'English'}) <span className="text-primary">*</span></label>
                   <input 
                     type="text" 
                     placeholder="Enter a compelling news headline..." 
                     value={formData.title[activeLang]} 
                     onChange={(e) => handleTitleChange(e.target.value, activeLang)} 
                     className="w-full text-lg sm:text-2xl md:text-3xl font-serif font-bold text-title bg-transparent border-b border-border pb-3 outline-none focus:border-primary transition-all placeholder:text-caption/35" 
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                   <div>
                     <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-caption mb-2">Route Slug ({activeLang.toUpperCase()})</label>
                     <input 
                       type="text" 
                       placeholder="auto-generated-url-slug..." 
                       value={formData.slug[activeLang]} 
                       onChange={(e) => handleFieldChange('slug', e.target.value, activeLang)} 
                       className="w-full bg-surface border border-border text-title rounded-xl p-3 md:p-4 outline-none text-xs md:text-sm font-medium transition-all focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-card" 
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-caption mb-2">Short Summary / Excerpt ({activeLang.toUpperCase()})</label>
                     <input 
                       type="text"
                       placeholder="Enter quick lead sentence for highlights..." 
                       value={formData.excerpt[activeLang]} 
                       onChange={(e) => handleFieldChange('excerpt', e.target.value, activeLang)} 
                       className="w-full bg-surface border border-border text-title rounded-xl p-3 md:p-4 outline-none text-xs md:text-sm font-medium transition-all focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-card" 
                     />
                   </div>
                 </div>

                 {/* Rich Text Editor Wrapper */}
                 <div>
                   <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-caption mb-2.5">Editorial Body Content ({activeLang.toUpperCase()}) <span className="text-primary">*</span></label>
                   <div className="min-h-[420px] border border-border rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all bg-card shadow-xs flex flex-col">
                     <RichTextEditor content={formData.content[activeLang]} onChange={(html) => handleFieldChange('content', html, activeLang)} />
                   </div>
                 </div>

                 {/* Simulated Content Blocks Studio */}
                 <div className="pt-4 border-t border-border space-y-4">
                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                     <div>
                       <h4 className="font-bold text-title text-xs md:text-sm uppercase tracking-wider">Newsroom Content Blocks</h4>
                       <p className="text-[10px] text-caption">Add advanced editorial components directly to your story stream</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       <button onClick={() => addContentBlock('quote')} className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-card text-[10px] font-bold text-body flex items-center gap-1 transition-all cursor-pointer"><Plus size={12} /> Pull Quote</button>
                       <button onClick={() => addContentBlock('factbox')} className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-card text-[10px] font-bold text-body flex items-center gap-1 transition-all cursor-pointer"><Plus size={12} /> Fact Box</button>
                       <button onClick={() => addContentBlock('timeline')} className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-card text-[10px] font-bold text-body flex items-center gap-1 transition-all cursor-pointer"><Plus size={12} /> Timeline</button>
                       <button onClick={() => addContentBlock('stats')} className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-card text-[10px] font-bold text-body flex items-center gap-1 transition-all cursor-pointer"><Plus size={12} /> Statistics</button>
                     </div>
                   </div>

                   {contentBlocks.length > 0 && (
                     <div className="space-y-4 pt-2">
                       {contentBlocks.map((block) => (
                         <div key={block.id} className="p-4 bg-surface rounded-xl border border-border flex gap-4 items-start relative group">
                           <div className="shrink-0 w-8 h-8 rounded-full bg-surface border border-border text-title flex items-center justify-center font-bold text-xs uppercase">{block.type.substring(0, 2)}</div>
                           <div className="flex-1 space-y-2">
                             <span className="text-[10px] font-extrabold uppercase tracking-widest text-caption">{block.type} block</span>
                             <textarea 
                               placeholder={`Type content block ${block.type} data here...`} 
                               value={block.value}
                               onChange={(e) => {
                                 const updated = contentBlocks.map(b => b.id === block.id ? { ...b, value: e.target.value } : b);
                                 setContentBlocks(updated);
                               }}
                               className="w-full bg-card border border-border text-title rounded-lg p-2.5 text-xs outline-none focus:border-primary transition-all resize-y min-h-[60px]" 
                             />
                           </div>
                           <button 
                             onClick={() => setContentBlocks(contentBlocks.filter(b => b.id !== block.id))}
                             className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>

                 {/* Google Search Engine Preview Interface */}
                 <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border space-y-5">
                   <h4 className="font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2 text-xs md:text-sm">
                     <Globe size={18} className="text-slate-400" />
                     Bilingual Google Search Preview ({activeLang.toUpperCase()})
                   </h4>
                   
                   {/* Simulated Google Listing Card */}
                   <div className="bg-card p-4.5 rounded-xl border border-border shadow-sm space-y-1">
                     <span className="text-xs text-caption block truncate">
                       https://reformtimes.com/{activeLang}/news/{formData.slug[activeLang] || 'slug'}
                     </span>
                     <h3 className="text-lg text-[#1a0dab] font-sans hover:underline cursor-pointer truncate font-medium">
                       {formData.seoTitle[activeLang] || formData.title[activeLang] || 'Draft Title | The Reform Times'}
                     </h3>
                     <p className="text-xs text-body/90 leading-relaxed line-clamp-2">
                       {formData.metaDescription[activeLang] || formData.excerpt[activeLang] || 'Enter custom meta description fields to control your snippet content structure.'}
                     </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                     <div>
                       <div className="flex justify-between items-center mb-1.5">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-caption">SEO Meta Title</label>
                         <span className={cn("text-[9px] font-bold", formData.seoTitle[activeLang].length > 60 ? "text-rose-500" : "text-slate-400")}>
                           {formData.seoTitle[activeLang].length}/60 chars
                         </span>
                       </div>
                       <input 
                         type="text" 
                         placeholder="Optimized headline..."
                         value={formData.seoTitle[activeLang]} 
                         onChange={(e) => handleFieldChange('seoTitle', e.target.value, activeLang)} 
                         className="w-full bg-card border border-border text-title rounded-xl p-3 outline-none text-xs font-semibold focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                       />
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-1.5">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-caption">SEO Meta Description</label>
                         <span className={cn("text-[9px] font-bold", formData.metaDescription[activeLang].length > 160 ? "text-rose-500" : "text-slate-400")}>
                           {formData.metaDescription[activeLang].length}/160 chars
                         </span>
                       </div>
                       <input 
                         type="text" 
                         placeholder="Search snippet summary..."
                         value={formData.metaDescription[activeLang]} 
                         onChange={(e) => handleFieldChange('metaDescription', e.target.value, activeLang)} 
                         className="w-full bg-card border border-border text-title rounded-xl p-3 outline-none text-xs font-semibold focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                       />
                     </div>
                   </div>
                 </div>

               </div>
            </div>
          </div>

          {/* Sticky Publishing Studio Sidebar (Right Side) */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="lg:sticky lg:top-[90px] space-y-6 md:space-y-8 h-fit">
              
              {/* Card 1: Publish Settings */}
              <div className="bg-card p-6 rounded-2xl sm:rounded-[24px] border border-border shadow-sm space-y-4">
                <h3 className="text-xs md:text-sm font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2">
                  <Settings size={16} className="text-slate-400" />
                  Dispatch Registry
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-caption mb-1.5 block">State Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => handleFieldChange('status', e.target.value)} 
                      className="w-full bg-surface border border-border rounded-xl p-2.5 outline-none text-xs md:text-sm font-bold text-title focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                    <input 
                      type="checkbox" 
                      id="sendPush"
                      checked={formData.sendPush}
                      onChange={(e) => handleFieldChange('sendPush', e.target.checked)}
                      className="w-4 h-4 rounded text-primary border-border bg-surface focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <label htmlFor="sendPush" className="text-xs font-bold text-title cursor-pointer select-none">
                      Send push notification to subscribers
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 2: Metrics & Translation Audit */}
              <div className="bg-card p-6 rounded-2xl sm:rounded-[24px] border border-border shadow-sm space-y-4">
                <h3 className="text-xs md:text-sm font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-slate-400" />
                  Translation & Quality Score
                </h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-caption font-medium">Bilingual Verification Score</span>
                    <span className={cn("font-bold", score > 70 ? "text-emerald-600" : "text-amber-600")}>{score}%</span>
                  </div>
                  <div className="w-full bg-surface border border-border h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-500", score > 70 ? "bg-emerald-500" : "bg-amber-400")} style={{ width: `${score}%` }}></div>
                  </div>

                  <div className="space-y-2 pt-2 text-[11px] font-semibold text-body border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className={cn("w-2 h-2 rounded-full", bnComplete ? "bg-emerald-500" : "bg-surface border border-border")} /> বাংলা Content Status</span>
                      <span className="opacity-75">{bnComplete ? 'Complete' : 'Incomplete'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className={cn("w-2 h-2 rounded-full", enComplete ? "bg-emerald-500" : "bg-surface border border-border")} /> English Content Status</span>
                      <span className="opacity-75">{enComplete ? 'Complete' : 'Incomplete'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className={cn("w-2 h-2 rounded-full", bnSeoComplete && enSeoComplete ? "bg-emerald-500" : "bg-surface border border-border")} /> SEO Metadata Index</span>
                      <span className="opacity-75">{bnSeoComplete && enSeoComplete ? 'Configured' : 'Missing'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Media Upload Studio */}
              <div className="bg-card p-6 rounded-2xl sm:rounded-[24px] border border-border shadow-sm space-y-4">
                <h3 className="text-xs md:text-sm font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2">
                  <ImageIcon size={16} className="text-slate-400" />
                  Bilingual Cover Media <span className="text-primary">*</span>
                </h3>
                <div className="space-y-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  {formData.mainImage ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-border group">
                      <img src={formData.mainImage} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" alt="Preview" />
                      <button 
                        onClick={() => handleFieldChange('mainImage', '')}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group",
                        isDragging 
                          ? "border-primary bg-primary/5 scale-102 shadow-md shadow-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-surface"
                      )}
                    >
                      <ImageIcon className={cn("mx-auto transition-colors", isDragging ? "text-primary" : "text-slate-400 group-hover:text-primary")} size={28} />
                      <div className={cn("text-xs font-bold transition-colors", isDragging ? "text-primary" : "text-body group-hover:text-primary")}>
                        {isDragging ? 'Drop Image Here!' : 'Drag Image or Click to Upload'}
                      </div>
                      <p className="text-[10px] text-caption">Supports PNG, JPG, WEBP formats</p>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Or paste direct image URL here..." 
                        value={formData.mainImage.startsWith('data:') ? '' : formData.mainImage} 
                        onChange={(e) => handleFieldChange('mainImage', e.target.value)} 
                        className="w-full bg-surface border border-border text-title rounded-lg p-2 text-[11px] outline-none focus:bg-card focus:border-primary transition-all" 
                      />
                      {formData.mainImage.startsWith('data:') && (
                        <span className="px-2 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 flex items-center">Uploaded File</span>
                      )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Image Alt text (Bilingual accessibility)..." 
                      value={formData.imageAlt} 
                      onChange={(e) => handleFieldChange('imageAlt', e.target.value)} 
                      className="w-full bg-surface border border-border text-title rounded-lg p-2 text-[11px] outline-none focus:bg-card focus:border-primary transition-all" 
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Caption..." 
                        value={formData.imageCaption} 
                        onChange={(e) => handleFieldChange('imageCaption', e.target.value)} 
                        className="w-full bg-surface border border-border text-title rounded-lg p-2 text-[11px] outline-none focus:bg-card focus:border-primary transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="Photographer Credit..." 
                        value={formData.imageCredit} 
                        onChange={(e) => handleFieldChange('imageCredit', e.target.value)} 
                        className="w-full bg-surface border border-border text-title rounded-lg p-2 text-[11px] outline-none focus:bg-card focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Editorial Settings */}
              <div className="bg-card p-6 rounded-2xl sm:rounded-[24px] border border-border shadow-sm space-y-4">
                <h3 className="text-xs md:text-sm font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2">
                  <Sliders size={16} className="text-slate-400" />
                  Editorial Metadata
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-caption mb-1.5 block">Article Dispatch Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => handleFieldChange('type', e.target.value)} 
                      className="w-full bg-surface border border-border rounded-xl p-2.5 outline-none text-xs md:text-sm font-bold text-title focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      <option value="Standard News">Standard News</option>
                      <option value="Breaking News">Breaking News</option>
                      <option value="Investigation">Investigation</option>
                      <option value="Opinion">Opinion</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Feature Story">Feature Story</option>
                      <option value="Fact Check">Fact Check</option>
                      <option value="Video Report">Video Report</option>
                      <option value="Photo Story">Photo Story</option>
                      <option value="Analysis">Analysis</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-caption mb-1.5 block">Category Designation <span className="text-primary">*</span></label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => handleFieldChange('category', e.target.value)} 
                      className="w-full bg-surface border border-border rounded-xl p-2.5 outline-none text-xs md:text-sm font-bold text-title focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      <option value="">Assign Category...</option>
                      <option value="politics">Politics</option>
                      <option value="national">National</option>
                      <option value="international">International</option>
                      <option value="investigations">Investigations</option>
                      <option value="environment">Environment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-caption mb-1.5 block">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. climate, elections, un..." 
                      value={formData.tags} 
                      onChange={(e) => handleFieldChange('tags', e.target.value)} 
                      className="w-full bg-surface border border-border text-title rounded-xl p-2.5 outline-none text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Card 5: Placement & iOS Switches */}
              <div className="bg-card p-6 rounded-2xl sm:rounded-[24px] border border-border shadow-sm space-y-4">
                <h3 className="text-xs md:text-sm font-serif font-bold text-title border-b border-border pb-3 flex items-center gap-2">
                  <Layout size={16} className="text-slate-400" />
                  Homepage Layout Placement
                </h3>
                
                <div className="space-y-4.5 pt-1">
                  <label className="flex items-center justify-between cursor-pointer group py-0.5">
                    <span className="font-bold text-title text-xs md:text-sm group-hover:text-primary transition-colors">Featured Story</span>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.featured} 
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface border border-border rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group py-0.5">
                    <span className="font-bold text-title text-xs md:text-sm group-hover:text-primary transition-colors">Breaking Banner</span>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.breaking} 
                        onChange={(e) => setFormData({...formData, breaking: e.target.checked})} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface border border-border rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group py-0.5">
                    <span className="font-bold text-title text-xs md:text-sm group-hover:text-primary transition-colors">Trending Section</span>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.trending} 
                        onChange={(e) => setFormData({...formData, trending: e.target.checked})} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface border border-border rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Real-time Bilingual Preview Modal Overlay */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 overflow-hidden">
          <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[92vh] w-full border border-slate-800/80 max-w-[1400px]">
            
            {/* Modal Control Panel - Highly Polished, Sticky & Wrap-friendly */}
            <div className="bg-slate-955 text-white px-4 sm:px-6 py-4 flex flex-wrap gap-4 items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                <div className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-md text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                  Preview Mode
                </div>
                <div className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700/60 rounded text-[9px] font-bold uppercase tracking-widest shrink-0">
                  Not Published Yet
                </div>
                <span className="text-xs text-slate-400 font-medium truncate max-w-[180px] xs:max-w-[280px] hidden md:inline">
                  Dispatch: {formData.title[previewLang] || 'Headline Draft'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Language Mode Toggle */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-1 flex gap-1">
                  <button 
                    onClick={() => setPreviewLang('bn')} 
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[10px] md:text-xs font-bold rounded-lg cursor-pointer transition-all duration-300", 
                      previewLang === 'bn' ? "bg-primary text-white shadow-md shadow-primary/10" : "text-slate-400 hover:text-white"
                    )}
                  >
                    বাংলা
                  </button>
                  <button 
                    onClick={() => setPreviewLang('en')} 
                    className={cn(
                      "px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg cursor-pointer transition-all duration-300", 
                      previewLang === 'en' ? "bg-primary text-white shadow-md shadow-primary/10" : "text-slate-400 hover:text-white"
                    )}
                  >
                    English
                  </button>
                </div>

                {/* Device Mode Selector [ Desktop ] [ Tablet ] [ Mobile ] */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-1 flex gap-1">
                  <button 
                    onClick={() => setPreviewMode('desktop')} 
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1", 
                      previewMode === 'desktop' ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Monitor size={12} /> Desktop
                  </button>
                  <button 
                    onClick={() => setPreviewMode('tablet')} 
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1", 
                      previewMode === 'tablet' ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Smartphone size={12} className="rotate-90" /> Tablet
                  </button>
                  <button 
                    onClick={() => setPreviewMode('mobile')} 
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1", 
                      previewMode === 'mobile' ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Smartphone size={12} /> Mobile
                  </button>
                </div>

                <div className="h-5 w-[1px] bg-slate-800"></div>

                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Preview Frame Wrapper - Only this area scrolls vertically */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-6 md:p-8 scrollbar-thin flex justify-center items-start">
              <div 
                className={cn(
                  "bg-card text-title transition-all duration-350 w-full shadow-2xl border border-border overflow-visible break-words", 
                  previewMode === 'desktop' && "max-w-[900px] rounded-2xl md:rounded-[32px] p-6 sm:p-12 md:p-14", 
                  previewMode === 'tablet' && "max-w-[720px] rounded-2xl p-6 md:p-10", 
                  previewMode === 'mobile' && "max-w-[390px] rounded-xl p-5"
                )}
                style={{ boxSizing: 'border-box' }}
              >
                {/* Article Header & Typography */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-extrabold uppercase tracking-widest shrink-0">
                      {formData.category || 'Politics'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-surface text-caption border border-border rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
                      {formData.type}
                    </span>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 font-sans">
                      {previewLang === 'bn' ? 'বাংলা সংস্করণ' : 'English Edition'}
                    </span>
                  </div>

                  {/* Serious Newspaper Title headline - State-toggled responsive font sizes */}
                  <h1 
                    className={cn(
                      "font-serif font-extrabold text-title leading-tight tracking-tight break-words",
                      previewMode === 'desktop' && "text-3xl md:text-[38px] mb-6", 
                      previewMode === 'tablet' && "text-2xl md:text-[32px] mb-4", 
                      previewMode === 'mobile' && "text-[24px] mb-3 leading-snug"
                    )}
                  >
                    {formData.title[previewLang] || 'Enter headline content to live preview...'}
                  </h1>
                </div>

                {/* Premium Author & Editorial Tools row - Dynamic Stack for Mobile */}
                <div 
                  className={cn(
                    "flex py-5 border-y border-border my-6 gap-4",
                    previewMode === 'mobile' ? "flex-col items-start" : "flex-row items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border shrink-0 overflow-hidden flex items-center justify-center font-bold text-caption text-sm">
                      KS
                    </div>
                    <div>
                      <p className="font-extrabold text-title text-xs sm:text-sm font-sans">Kazi Salman</p>
                      <p className="text-[10px] text-caption font-bold uppercase mt-0.5 font-sans">
                        Political Dispatcher • {formData.readTime}
                      </p>
                    </div>
                  </div>

                  {/* Reading & Print Tools toolbar */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => toast.success("Draft link copied successfully!")}
                      className="px-2.5 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-body hover:bg-card hover:border-border transition-all flex items-center gap-1 cursor-pointer font-sans"
                    >
                      Copy Link
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="px-2.5 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-body hover:bg-card hover:border-border transition-all flex items-center gap-1 cursor-pointer font-sans"
                    >
                      Print
                    </button>
                  </div>
                </div>

                {/* Excerpt / Lead Editorial Paragraph - State-toggled leading and margins */}
                {formData.excerpt[previewLang] && (
                  <div 
                    className={cn(
                      "border-l-4 border-primary pl-4 py-2 my-5 bg-primary/2.5 rounded-r-xl break-words",
                      previewMode === 'mobile' 
                        ? "text-xs italic leading-relaxed text-body font-serif" 
                        : "text-base md:text-lg leading-relaxed text-body/90 italic font-serif"
                    )}
                  >
                    {formData.excerpt[previewLang]}
                  </div>
                )}

                {/* Cinematic Featured Cover Media */}
                {formData.mainImage ? (
                  <div className="space-y-2 my-6">
                    <div className="rounded-xl overflow-hidden aspect-video border border-border shadow-sm w-full max-w-full">
                      <img src={formData.mainImage} className="w-full h-auto object-cover max-w-full block" alt={formData.imageAlt || 'Featured cover'} />
                    </div>
                    {(formData.imageCaption || formData.imageCredit) && (
                      <div className="flex justify-between items-start text-[10px] text-caption font-semibold px-1 gap-4 font-sans">
                        <span className="line-clamp-2">{formData.imageCaption}</span>
                        {formData.imageCredit && <span className="italic font-bold text-caption shrink-0">Photo: {formData.imageCredit}</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[180px] bg-surface border border-border rounded-xl flex items-center justify-center text-caption text-xs italic font-medium my-6">Cover image is currently missing...</div>
                )}

                {/* Highly readable article body text stream - State-toggled sizing & spacing */}
                <div 
                  className={cn(
                    "prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-title prose-p:leading-relaxed break-words text-body font-serif",
                    previewMode === 'mobile' 
                      ? "text-[15px] leading-[1.75] space-y-4 prose-p:my-3" 
                      : "text-base md:text-[17px] leading-loose space-y-6 prose-p:my-5"
                  )}
                  dangerouslySetInnerHTML={{ __html: formData.content[previewLang] || '<p className="text-caption italic">No content blocks written yet. Use the Rich Editor to write dispatch details.</p>' }}
                />

                {/* Inline Quote / Fact Box Simulator */}
                <div 
                  className={cn(
                    "my-6 bg-surface border border-border rounded-2xl space-y-1.5 shadow-xs font-sans",
                    previewMode === 'mobile' ? "p-4" : "p-6"
                  )}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Info size={12} /> Newsroom Fact Box
                  </span>
                  <p className="text-xs leading-relaxed text-body font-medium font-sans">
                    This bilingual dispatch has been validated by The Reform Times editorial audit department and is certified compliant under current newsroom guidelines.
                  </p>
                </div>

                {/* Premium Footer section */}
                <div className="border-t border-border pt-6 mt-8 space-y-6 font-sans">
                  
                  {/* Article Tags */}
                  {formData.tags && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-caption">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-surface hover:bg-card border border-border rounded-full text-[10px] font-bold text-body transition-colors cursor-pointer font-sans">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Articles Placeholder Grid - Stacks nicely in mobile */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="font-serif font-bold text-sm text-title uppercase tracking-wider">Related Dispatches</h4>
                    <div 
                      className={cn(
                        "grid gap-4",
                        previewMode === 'mobile' ? "grid-cols-1" : "grid-cols-2"
                      )}
                    >
                      <div className="p-3 bg-surface border border-border rounded-xl flex gap-3 items-center hover:bg-card transition-colors cursor-pointer">
                        <div className="w-11 h-11 rounded-lg bg-surface border border-border shrink-0 flex items-center justify-center font-bold text-caption">RT</div>
                        <div className="space-y-1 min-w-0">
                          <h5 className="font-serif font-bold text-[11px] leading-tight text-title truncate">Historic Judicial Climate Reform Passed Today</h5>
                          <span className="text-[9px] font-bold uppercase text-primary">Politics</span>
                        </div>
                      </div>
                      <div className="p-3 bg-surface border border-border rounded-xl flex gap-3 items-center hover:bg-card transition-colors cursor-pointer">
                        <div className="w-11 h-11 rounded-lg bg-surface border border-border shrink-0 flex items-center justify-center font-bold text-caption">RT</div>
                        <div className="space-y-1 min-w-0">
                          <h5 className="font-serif font-bold text-[11px] leading-tight text-title truncate">Investigations into Hidden Distribution Supply Networks</h5>
                          <span className="text-[9px] font-bold uppercase text-primary">Investigative</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Signup Banner */}
                  <div 
                    className={cn(
                      "bg-slate-950 text-white rounded-2xl text-center space-y-2.5 relative overflow-hidden shadow-md",
                      previewMode === 'mobile' ? "p-4.5" : "p-6"
                    )}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary font-sans">The Reform Times</span>
                    <h5 className="font-serif font-bold text-xs sm:text-sm leading-tight font-sans">Stay Informed, Support Uncompromised Truth</h5>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto font-sans">Get investigative stories and policy dispatches sent directly to your inbox.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
