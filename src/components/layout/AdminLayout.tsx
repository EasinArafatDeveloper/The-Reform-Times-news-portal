"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18n } from '@/i18n/config';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  FolderTree, 
  Users, 
  Zap, 
  Search as SearchIcon, 
  ShieldCheck, 
  Video, 
  MessageSquare, 
  Inbox, 
  FileSearch, 
  Image as ImageIcon, 
  Mail, 
  Megaphone, 
  BarChart3, 
  UserPlus, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavLinks = [
  { group: "Main", links: [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Articles', icon: FileText, href: '/admin/articles' },
    { name: 'Create Article', icon: PlusCircle, href: '/admin/articles/create' },
    { name: 'Categories', icon: FolderTree, href: '/admin/categories' },
    { name: 'Journalists', icon: Users, href: '/admin/journalists' },
  ]},
  { group: "Editorial", links: [
    { name: 'Breaking News', icon: Zap, href: '/admin/breaking' },
    { name: 'Investigations', icon: FileSearch, href: '/admin/investigations' },
    { name: 'Fact Checks', icon: ShieldCheck, href: '/admin/fact-checks' },
    { name: 'Video Reports', icon: Video, href: '/admin/videos' },
    { name: 'Opinions', icon: MessageSquare, href: '/admin/opinions' },
  ]},
  { group: "Submissions", links: [
    { name: 'Story Submissions', icon: Inbox, href: '/admin/submissions' },
    { name: 'Anonymous Tips', icon: SearchIcon, href: '/admin/tips' },
    { name: 'Comments', icon: MessageSquare, href: '/admin/comments' },
  ]},
  { group: "Management", links: [
    { name: 'Media Library', icon: ImageIcon, href: '/admin/media' },
    { name: 'Newsletter', icon: Mail, href: '/admin/newsletter' },
    { name: 'Advertisements', icon: Megaphone, href: '/admin/ads' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  ]},
  { group: "System", links: [
    { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { name: 'Roles & Permissions', icon: UserPlus, href: '/admin/roles' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ]}
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState<{ name: string; avatar: string; role?: any } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setOwnerProfile({ name: data.name || 'Admin', avatar: data.avatar || '', role: data.role }))
      .catch(() => setOwnerProfile({ name: 'Admin', avatar: '' }));
  }, []);

  const segments = pathname.split('/');
  const locale = i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale;

  // Hide sidebar on login page
  if (pathname === `/${locale}/admin/login` || pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-secondary text-white transition-all duration-300 fixed inset-y-0 left-0 z-50 lg:relative",
          isSidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href={`/${locale}/admin/dashboard`} className={cn("font-serif font-bold text-xl transition-opacity", !isSidebarOpen && "lg:opacity-0")}>
            Reform<span className="text-primary">Admin</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-8 h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-10">
          {adminNavLinks.map((group) => (
            <div key={group.group}>
              <h3 className={cn("text-[10px] uppercase font-bold text-white/40 tracking-widest mb-4 px-2", !isSidebarOpen && "lg:hidden")}>
                {group.group}
              </h3>
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const linkUrl = `/${locale}${link.href}`;
                  const isActive = pathname === linkUrl || pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link 
                        href={linkUrl}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                          isActive 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-white/60 hover:bg-white/5 hover:text-white",
                          !isSidebarOpen && "justify-center px-0"
                        )}
                        title={!isSidebarOpen ? link.name : ""}
                      >
                        <link.icon size={22} className={cn(isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                        <span className={cn("transition-opacity duration-300", !isSidebarOpen && "lg:hidden")}>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            <LogOut size={18} />
            <span className={cn(!isSidebarOpen && "lg:hidden")}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-surface text-body transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 w-64">
              <Search size={16} className="text-caption" />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="bg-transparent border-none outline-none text-sm w-full text-body"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={`/${locale}/admin/articles/create`}
              className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
            >
              <PlusCircle size={16} />
              Quick Post
            </Link>
            <button className="relative p-2 text-body hover:bg-surface rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end hidden md:block">
                <span className="text-sm font-bold text-title leading-none">{ownerProfile?.name || 'Admin'}</span>
                <span className="text-[10px] text-caption font-bold uppercase tracking-wider">Super Admin</span>
              </div>
              <Link href={`/${locale}/admin/settings`} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-background shadow-sm cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all">
                 {ownerProfile?.avatar
                   ? <img src={ownerProfile.avatar} alt={ownerProfile.name} className="w-full h-full object-cover" />
                   : <span className="text-sm font-bold">{(ownerProfile?.name || 'A').charAt(0)}</span>
                 }
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 md:p-10 flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
