"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  MoreHorizontal,
  ShieldCheck,
  Award,
  ExternalLink,
  Users,
  X,
  UserCheck
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
];

export default function JournalistsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [journalists, setJournalists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJournalist, setEditingJournalist] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: { bn: '', en: '' },
    email: '',
    avatar: '',
    status: 'Active',
    articles: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJournalists();
  }, []);

  const fetchJournalists = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/journalists');
      const data = await res.json();
      setJournalists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to resolve localized name/role
  const getBilingualValue = (field: any, fallback: string = '') => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field[locale] || field['en'] || field['bn'] || fallback;
  };

  const handleOpenModal = (journalist: any = null) => {
    if (journalist) {
      setEditingJournalist(journalist);
      setFormData({
        name: journalist.name || '',
        role: typeof journalist.role === 'string' ? { bn: journalist.role, en: journalist.role } : { bn: journalist.role?.bn || '', en: journalist.role?.en || '' },
        email: journalist.email || '',
        avatar: journalist.avatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        status: journalist.status || 'Active',
        articles: journalist.articles || 0
      });
    } else {
      setEditingJournalist(null);
      setFormData({
        name: '',
        role: { bn: '', en: '' },
        email: '',
        avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        status: 'Active',
        articles: 0
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role.bn || !formData.role.en || !formData.email) {
      return alert('Name, Bangla Role, English Role, and Email are required.');
    }

    setIsSubmitting(true);
    try {
      const method = editingJournalist ? 'PUT' : 'POST';
      const body = editingJournalist ? { ...formData, id: editingJournalist._id } : formData;

      const res = await fetch('/api/journalists', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowModal(false);
        fetchJournalists();
      } else {
        alert('Action failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journalist?')) return;
    try {
      const res = await fetch(`/api/journalists?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchJournalists();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filteredJournalists = (Array.isArray(journalists) ? journalists : []).filter(j => {
    const nameStr = j.name || '';
    const roleStr = getBilingualValue(j.role);
    const emailStr = j.email || '';
    return nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
           roleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
           emailStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-10 text-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-title">Journalists & Authors</h1>
          <p className="text-caption mt-1">Manage your editorial team, their roles, and bios.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/95 transition-all shadow-lg cursor-pointer"
        >
          <UserPlus size={20} />
          Add Journalist
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-caption" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, role or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border text-title rounded-[24px] outline-none shadow-sm font-medium focus:border-primary transition-all placeholder:text-caption/40"
            />
         </div>
         <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800 rounded-[24px] p-4 flex items-center justify-around text-white shadow-lg">
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Team</p>
               <p className="text-2xl font-bold text-white mt-1">{journalists.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Now</p>
               <p className="text-2xl font-bold text-green-400 mt-1">
                 {journalists.filter(j => j.status === 'Active').length}
               </p>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Dispatches</p>
               <p className="text-2xl font-bold text-amber-400 mt-1">
                 {journalists.reduce((sum, j) => sum + (j.articles || 0), 0)}
               </p>
            </div>
         </div>
      </div>

      {/* Journalists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1,2,3].map(i => (
            <div key={i} className="bg-card rounded-[32px] p-8 border border-border animate-pulse">
               <div className="w-20 h-20 bg-surface rounded-2xl mb-6"></div>
               <div className="h-6 bg-surface rounded w-3/4 mb-2"></div>
               <div className="h-4 bg-surface rounded w-1/2"></div>
            </div>
          ))
        ) : filteredJournalists.map((journalist) => {
          const journalistRole = getBilingualValue(journalist.role);
          return (
            <div key={journalist._id} className="bg-card rounded-[32px] p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-surface rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors"></div>
              
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <img 
                        src={journalist.avatar || AVATAR_PRESETS[0]} 
                        alt={journalist.name} 
                        className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-border"
                      />
                      {journalist.status === 'Active' && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-card rounded-full flex items-center justify-center">
                          <UserCheck size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleOpenModal(journalist)} className="p-2 text-caption hover:text-primary hover:bg-surface rounded-xl transition-all cursor-pointer"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(journalist._id)} className="p-2 text-caption hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                 </div>

                 <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-serif font-bold text-title group-hover:text-primary transition-colors">{journalist.name}</h3>
                    <p className="text-xs font-bold text-caption uppercase tracking-widest">{journalistRole}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface p-3 rounded-2xl text-center border border-border">
                       <p className="text-[10px] font-bold text-caption uppercase tracking-widest mb-1">Articles</p>
                       <p className="text-lg font-bold text-title">{journalist.articles || 0}</p>
                    </div>
                    <div className="bg-surface p-3 rounded-2xl text-center border border-border">
                       <p className="text-[10px] font-bold text-caption uppercase tracking-widest mb-1">Status</p>
                       <p className={cn(
                         "text-[10px] font-bold uppercase mt-1",
                         journalist.status === 'Active' ? "text-emerald-500" : "text-caption"
                       )}>{journalist.status}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-border">
                    <a href={`mailto:${journalist.email}`} className="text-xs text-caption hover:text-primary flex items-center gap-1.5">
                      <Mail size={14} /> {journalist.email}
                    </a>
                 </div>
              </div>
            </div>
          );
        })}

        {!isLoading && filteredJournalists.length === 0 && (
          <div className="col-span-full py-20 text-center text-caption">
             <Users size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold uppercase tracking-widest text-sm">No journalists found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
           <div className="bg-card w-full max-w-lg rounded-[32px] border border-border shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-border flex items-center justify-between">
                 <h3 className="text-xl font-serif font-bold text-title">{editingJournalist ? 'Edit Journalist' : 'Add Journalist'}</h3>
                 <button onClick={() => setShowModal(false)} className="text-caption hover:text-rose-500 cursor-pointer"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="e.g. Nusrat Jahan"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-widest">Role (Bangla)</label>
                    <input 
                      type="text" 
                      value={formData.role.bn}
                      onChange={(e) => setFormData({
                        ...formData,
                        role: { ...formData.role, bn: e.target.value }
                      })}
                      className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="e.g. অনুসন্ধানী প্রতিবেদক"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-widest">Role (English)</label>
                    <input 
                      type="text" 
                      value={formData.role.en}
                      onChange={(e) => setFormData({
                        ...formData,
                        role: { ...formData.role, en: e.target.value }
                      })}
                      className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="e.g. Investigative Reporter"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="e.g. nusrat@reformtimes.com"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-widest">Avatar Image URL</label>
                    <div className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        value={formData.avatar}
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                        placeholder="Paste image URL here"
                      />
                      <img src={formData.avatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-caption uppercase tracking-widest">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-caption uppercase tracking-widest">Articles Count</label>
                      <input 
                        type="number" 
                        value={formData.articles}
                        onChange={(e) => setFormData({...formData, articles: parseInt(e.target.value) || 0})}
                        className="w-full bg-surface border border-border text-title rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                   </div>
                 </div>

                 <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4">
                   {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (editingJournalist ? 'Update' : 'Add Team Member')}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
