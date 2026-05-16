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
  ShieldAlert,
  ShieldCheck,
  Award,
  ExternalLink,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function JournalistsPage() {
  const [journalists, setJournalists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchJournalists() {
      try {
        const res = await fetch('/api/journalists');
        const data = await res.json();
        setJournalists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJournalists();
  }, []);

  const filteredJournalists = (Array.isArray(journalists) ? journalists : []).filter(j => 
    j.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy">Journalists & Authors</h1>
          <p className="text-gray-500 mt-1">Manage your editorial team and their roles.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-red-100">
          <UserPlus size={20} />
          Invite Journalist
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, role or expertise..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[24px] outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all shadow-sm font-medium"
            />
         </div>
         <div className="lg:col-span-4 bg-brand-navy rounded-[24px] p-4 flex items-center justify-around text-white shadow-lg">
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Team</p>
               <p className="text-2xl font-bold">{journalists.length}</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Now</p>
               <p className="text-2xl font-bold text-green-400">12</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Open Roles</p>
               <p className="text-2xl font-bold text-brand-gold">2</p>
            </div>
         </div>
      </div>

      {/* Journalists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1,2,3].map(i => (
            <div key={i} className="bg-white rounded-[32px] p-8 border border-gray-100 animate-pulse">
               <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-6"></div>
               <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
               <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredJournalists.map((journalist) => (
          <div key={journalist._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-brand-red/5 transition-colors"></div>
            
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <img 
                      src={journalist.avatar} 
                      alt={journalist.name} 
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-brand-navy transition-colors"><MoreHorizontal size={20} /></button>
               </div>

               <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-serif font-bold text-brand-navy group-hover:text-brand-red transition-colors">{journalist.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{journalist.role}</p>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Articles</p>
                     <p className="text-lg font-bold text-brand-navy">{journalist.articles}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                     <p className={cn(
                       "text-[10px] font-bold uppercase",
                       journalist.status === 'Active' ? "text-green-600" : "text-gray-400"
                     )}>{journalist.status}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-brand-navy hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"><Mail size={16} /></button>
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-brand-red hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"><Edit size={16} /></button>
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-brand-red hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-red transition-colors">
                     View Profile <ExternalLink size={14} />
                  </button>
               </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredJournalists.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
             <Users size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold uppercase tracking-widest text-sm">No journalists found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
