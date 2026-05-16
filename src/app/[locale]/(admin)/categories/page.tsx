"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  BarChart2,
  Layers,
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', slug: '', color: '#8B0000' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (cat: any = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, slug: cat.slug, color: cat.color || '#8B0000' });
    } else {
      setEditingCat(null);
      setFormData({ name: '', slug: '', color: '#8B0000' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return alert('Name and Slug are required');
    
    setIsSubmitting(true);
    try {
      const method = editingCat ? 'PUT' : 'POST';
      const body = editingCat ? { ...formData, id: editingCat._id } : formData;

      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowModal(false);
        fetchCategories();
      }
    } catch (err) {
      alert('Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy">Editorial Categories</h1>
          <p className="text-gray-500 mt-1">Organize your journalism into sections and topics.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/10"
        >
          <Plus size={20} />
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[24px] outline-none shadow-sm font-medium"
              />
           </div>

           <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Name</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Articles</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {isLoading ? (
                         [1,2,3,4,5].map(i => (
                           <tr key={i} className="animate-pulse">
                              <td colSpan={3} className="px-8 py-6 h-16 bg-gray-50/20"></td>
                           </tr>
                         ))
                       ) : filteredCategories.map((cat) => (
                         <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: cat.color || '#8B0000' }}>
                                     {cat.name.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="font-bold text-brand-navy">{cat.name}</p>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/{cat.slug}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                  {cat.articleCount || 0} items
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-gray-400 hover:text-brand-navy hover:bg-white rounded-lg transition-all"><Edit size={16} /></button>
                                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-brand-navy p-8 rounded-[32px] text-white space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                    <BarChart2 className="text-brand-gold" size={24} />
                    <h3 className="font-bold text-xs uppercase tracking-widest">Category Stats</h3>
                 </div>
                 <p className="text-sm text-white/60">Total Categories: <span className="text-white font-bold">{categories.length}</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
           <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-xl font-serif font-bold text-brand-navy">{editingCat ? 'Edit Category' : 'New Category'}</h3>
                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-brand-red"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Slug</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Brand Color</label>
                    <input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl p-1 cursor-pointer" />
                 </div>
                 <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-brand-navy text-white rounded-2xl font-bold hover:bg-brand-navy/90 transition-all shadow-lg flex items-center justify-center gap-2">
                   {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (editingCat ? 'Update' : 'Create')}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
