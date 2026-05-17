'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldCheck } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

export default function PushNotificationPrompt() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || 'bn';
  const isBangla = locale === 'bn';

  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Do not show inside admin panel or login pages
  if (pathname && (pathname.includes('/admin') || pathname.includes('/login'))) {
    return null;
  }

  // Helper to convert base64 VAPID public key to Uint8Array for browser subscription registration
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  useEffect(() => {
    // 1. Detect if Web Push and Service Workers are supported by the browser
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    ) {
      setIsSupported(true);
      checkPromptEligibility();
    }
  }, []);

  const checkPromptEligibility = () => {
    // 2. Check if notification permission is already granted or blocked
    if (Notification.permission === 'granted') {
      return; // Already allowed
    }

    if (Notification.permission === 'denied') {
      localStorage.setItem('notification_prompt_status', 'denied');
      return; // Explicitly blocked in browser settings
    }

    const status = localStorage.getItem('notification_prompt_status');
    const lastDismissedStr = localStorage.getItem('notification_prompt_dismissed_at');

    if (status === 'allowed') {
      return;
    }
    if (status === 'denied') {
      return;
    }

    if (status === 'later' && lastDismissedStr) {
      const lastDismissed = new Date(lastDismissedStr).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastDismissed < sevenDays) {
        return; // Wait 7 days before showing again
      }
    }

    // 3. Show prompt after a short delay (e.g. 4 seconds) or after user scrolls
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    const handleScroll = () => {
      setIsVisible(true);
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    localStorage.setItem('notification_prompt_status', 'later');
    localStorage.setItem('notification_prompt_dismissed_at', new Date().toISOString());
  };

  const handleAllowNotifications = async () => {
    setIsVisible(false);

    try {
      // 4. Request Browser Notification Permission
      const permission = await Notification.requestPermission();

      if (permission === 'denied') {
        localStorage.setItem('notification_prompt_status', 'denied');
        return;
      }

      if (permission === 'granted') {
        localStorage.setItem('notification_prompt_status', 'allowed');
        
        // 5. Register Service Worker and Subscribe for Push
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Get public VAPID key
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.error('VAPID public key environment variable is not defined.');
          return;
        }

        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        };

        const subscription = await registration.pushManager.subscribe(subscribeOptions);

        // 6. Send subscription to our backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            language: locale,
            userAgent: navigator.userAgent
          })
        });
      }
    } catch (err) {
      console.error('Web Push subscription activation failed:', err);
    }
  };

  if (!isSupported || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[380px] z-[9999] animate-slide-up">
      <div className="bg-card/95 backdrop-blur-xl border border-border/80 p-6 rounded-[2rem] shadow-premium relative overflow-hidden group">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/15 transition-all"></div>
        
        {/* Close Button */}
        <button 
          onClick={handleMaybeLater}
          className="absolute top-4 right-4 text-caption hover:text-title p-1.5 hover:bg-surface rounded-full transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative">
            <Bell size={22} className="animate-bounce" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></div>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-title pr-6 leading-tight">
              {isBangla ? 'দি রিফর্ম টাইমসের সাথে যুক্ত থাকুন' : 'Stay updated with The Reform Times'}
            </h4>
            <p className="text-caption text-xs leading-relaxed">
              {isBangla 
                ? 'সরাসরি আপনার ডিভাইসে ব্রেকিং নিউজ এবং গুরুত্বপূর্ণ তথ্যগুলো পান।' 
                : 'Get breaking news and important updates directly on your device.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAllowNotifications}
            className="flex-1 bg-primary text-white text-xs font-bold py-3 px-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} />
            {isBangla ? 'অনুমতি দিন' : 'Allow Notifications'}
          </button>
          
          <button
            onClick={handleMaybeLater}
            className="flex-1 bg-surface border border-border text-title text-xs font-bold py-3 px-4 rounded-xl hover:bg-surface-hover hover:border-title/30 transition-all cursor-pointer"
          >
            {isBangla ? 'পরে দেখব' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </div>
  );
}
