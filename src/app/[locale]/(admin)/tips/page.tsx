"use client";

import React from 'react';
import { 
  ShieldAlert, 
  FileSearch, 
  Lock, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  AlertTriangle,
  Download,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for Tips
const mockTips = [
  { id: 'TIP-842', topic: 'Municipal Corruption', location: 'Dhaka North', risk: 'High', date: '2 hours ago', status: 'New', content: 'There is a systematic misappropriation of funds in the local city council regarding the new road construction project...' },
  { id: 'TIP-839', topic: 'Environmental Violation', location: 'Gazipur', risk: 'Medium', date: '5 hours ago', status: 'Investigating', content: 'A local textile factory is dumping chemicals into the river at midnight. I have recorded the video...' },
  { id: 'TIP-835', topic: 'Police Misconduct', location: 'Chittagong', risk: 'Critical', date: 'Yesterday', status: 'Verified', content: 'Police officers at the local station are accepting bribes to release suspects involved in human trafficking...' },
  { id: 'TIP-830', topic: 'Education Fraud', location: 'Sylhet', risk: 'Low', date: '2 days ago', status: 'Archived', content: 'A private college is issuing fake certificates for a fee. Many people are using them for jobs...' },
];

export default function AnonymousTipsPage() {
  return (
    <div className="space-y-10">
      {/* Warning Header */}
      <div className="bg-brand-navy p-6 md:p-8 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
           <Lock size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
           <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">Secure Tips Management</h1>
           <p className="text-white/60 text-sm max-w-2xl">
              Protect source identity at all costs. Do not expose sensitive information on unsecured channels. All tips are end-to-end encrypted in our database.
           </p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Active</span>
              <span className="text-xl font-bold">12</span>
           </div>
           <div className="px-4 py-2 bg-brand-red rounded-xl flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase text-white/60 tracking-widest">New</span>
              <span className="text-xl font-bold">3</span>
           </div>
        </div>
      </div>

      {/* Filter / Actions */}
      <div className="flex flex-wrap items-center gap-4">
         {['All Tips', 'New', 'Investigating', 'Verified', 'Not Useful', 'Archived'].map((status) => (
           <button key={status} className={cn(
             "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
             status === 'All Tips' ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-gray-500 border-gray-100 hover:border-brand-navy hover:text-brand-navy"
           )}>
             {status}
           </button>
         ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockTips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                        tip.risk === 'Critical' ? "bg-red-50 text-red-700 border-red-200 animate-pulse" : 
                        tip.risk === 'High' ? "bg-orange-50 text-orange-700 border-orange-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      )}>
                         {tip.risk} Risk
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{tip.id}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tip.date}</span>
                      <button className="p-2 text-gray-300 hover:text-brand-navy transition-colors"><MoreVertical size={16} /></button>
                   </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-brand-navy mb-3 group-hover:text-brand-red transition-colors">{tip.topic}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                   <FileSearch size={14} /> {tip.location}
                </p>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 line-clamp-3 text-sm text-gray-600 leading-relaxed italic">
                   "{tip.content}"
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center gap-4">
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                        tip.status === 'New' ? "text-brand-red" : 
                        tip.status === 'Investigating' ? "text-amber-600" : "text-green-600"
                      )}>
                        {tip.status === 'New' ? <AlertCircle size={14} /> : 
                         tip.status === 'Investigating' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                        {tip.status}
                      </span>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-xl text-xs font-bold hover:bg-brand-navy/90 transition-all">
                         <Eye size={14} /> Read Tip
                      </button>
                      <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-brand-navy hover:bg-gray-50 transition-all">
                         <Download size={14} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Quick Protection Tip */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-[24px] flex items-start gap-4">
         <div className="p-2 bg-amber-200 rounded-lg text-amber-900">
            <AlertTriangle size={20} />
         </div>
         <div>
            <h4 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-widest">Safety Protocol</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
               When communicating with anonymous sources, always use encrypted channels like Signal or ProtonMail. Never download files from tips on a machine connected to our primary newsroom network.
            </p>
         </div>
      </div>
    </div>
  );
}
