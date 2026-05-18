"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, RefreshCw, ArrowLeft, Image as ImageIcon, Globe, User, Palette, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18n } from '@/i18n/config';

// Pre-packaged placeholder image
const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='800' height='450' fill='%23e2e8f0'/><path d='M350 200 L410 270 L450 230 L500 290 H300 Z' fill='%23cbd5e1'/><circle cx='470' cy='190' r='20' fill='%23cbd5e1'/><text x='400' y='330' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2394a3b8' text-anchor='middle'>IMAGE / PHOTO PLACEHOLDER</text></svg>";

export default function PhotocardGenerator() {
  const pathname = usePathname();
  
  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale;
  const isBangla = locale === 'bn';

  // State for form controls
  const [headline, setHeadline] = useState(isBangla ? 'এখানে আপনার শক্তিশালী শিরোনামটি দুই বা তিন লাইনে লিখুন' : 'Your Powerful Headline Goes Here in Two or Three Lines');
  const [summary, setSummary] = useState(isBangla ? 'খবরের সংক্ষিপ্ত বিবরণ বা মূল বক্তব্য এখানে থাকবে। এটি সংক্ষিপ্ত, স্পষ্ট এবং প্রভাবশালী রাখুন।' : 'Brief summary or key highlight of the news goes here. Keep it short, clear, and impactful.');
  const [category, setCategory] = useState(isBangla ? 'রাজনীতি' : 'POLITICS');
  const [badgeType, setBadgeType] = useState('BREAKING');
  const [badgeText, setBadgeText] = useState('NEWS');
  const [dateText, setDateText] = useState('');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [reporterName, setReporterName] = useState(isBangla ? 'স্টাফ রিপোর্টার' : 'By Staff Reporter');
  const [reporterTitle, setReporterTitle] = useState(isBangla ? 'দ্য রিফর্ম টাইমস' : 'The Reform Times');
  const [reporterAvatar, setReporterAvatar] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState('www.thereformtimes.com');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColor] = useState('#b91c1c'); // Default red
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch active admin profile settings on mount to auto-populate reporter details
  useEffect(() => {
    async function fetchAdminSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            setReporterName(data.name);
          }
          if (data.role) {
            const roleText = isBangla 
              ? (data.role.bn || data.role.en) 
              : (data.role.en || data.role.bn);
            if (roleText) {
              setReporterTitle(roleText);
            }
          }
          if (data.avatar) {
            setReporterAvatar(data.avatar);
          }
        }
      } catch (err) {
        console.error("Failed to fetch active admin settings for photocard auto-population:", err);
      }
    }
    fetchAdminSettings();
  }, [isBangla]);

  // Hidden canvas reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-format date on mount
  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
    setDateText(formatted);
  }, []);

  // Handle local image file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to load an image safely inside canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  // Wrap text on canvas with support for newlines
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const paragraphs = text.split('\n');
    let currentY = y;

    for (let p = 0; p < paragraphs.length; p++) {
      const words = paragraphs[p].split(' ');
      let line = '';
      let testLine = '';
      let testWidth = 0;

      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
    
    return currentY;
  };

  // Generate and download high-resolution 1080x1080 photocard
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Set canvas dimensions to 1080x1080 high-res
      canvas.width = 1080;
      canvas.height = 1080;

      // 2. Draw Background
      const isDark = themeMode === 'dark';
      ctx.fillStyle = isDark ? '#0b0f19' : '#ffffff';
      ctx.fillRect(0, 0, 1080, 1080);

      // 3. Draw Header Logo
      try {
        const logoPath = isDark ? '/dark mode logo.png' : '/the reform times logo.png';
        const logo = await loadImage(logoPath);
        // Draw logo nicely on top-left
        const logoHeight = 125;
        const logoWidth = logo.width * (logoHeight / logo.height);
        ctx.drawImage(logo, 50, 20, logoWidth, logoHeight);
      } catch (err) {
        console.error("Failed to load header logo on canvas, falling back to text representation", err);
        ctx.fillStyle = isDark ? '#ffffff' : '#0b0f19';
        ctx.font = "bold 32px Georgia, serif";
        ctx.fillText("The Reform Times", 50, 95);
      }

      // 4. Draw Header Badges (BREAKING NEWS / SPECIAL REPORT)
      const badgeY = 60;
      const badgeHeight = 35;
      
      // Calculate widths and right align to 1030
      ctx.font = "bold 15px sans-serif";
      const b1Text = badgeType.toUpperCase();
      const b1Width = ctx.measureText(b1Text).width + 24;

      const b2Text = badgeText.toUpperCase();
      const b2Width = ctx.measureText(b2Text).width + 24;

      const badgeRightBound = 1030;
      const b2X = badgeRightBound - b2Width;
      const b1X = b2X - b1Width;

      ctx.textBaseline = 'top';

      // Draw first box (BREAKING / RED)
      ctx.fillStyle = accentColor;
      ctx.fillRect(b1X, badgeY, b1Width, badgeHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(b1Text, b1X + 12, badgeY + (badgeHeight - 15) / 2);

      // Draw second box (NEWS / BLUE)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(b2X, badgeY, b2Width, badgeHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(b2Text, b2X + 12, badgeY + (badgeHeight - 15) / 2);

      // 5. Draw Header Date & Vertical Bar (placed on the next line below badges)
      const dateY = 110;
      const dateTextString = dateText.toUpperCase();
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = "bold 14px sans-serif";
      const dateTextWidth = ctx.measureText(dateTextString).width;

      const redBarWidth = 3;
      const gap = 10;
      const redBarX = badgeRightBound - redBarWidth;
      const dateTextX = redBarX - gap - dateTextWidth;

      // Draw date text
      ctx.fillText(dateTextString, dateTextX, dateY + (20 - 14) / 2);

      // Draw red vertical bar next to date
      ctx.fillStyle = accentColor;
      ctx.fillRect(redBarX, dateY, redBarWidth, 20);

      // 6. Draw Divider Line
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(50, 160, 980, 2);

      // 7. Draw Dotted Grid Pattern on the right of photo
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)';
      const dotGridX = 990;
      const dotGridY = 240;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          ctx.arc(dotGridX + c * 12, dotGridY + r * 12, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // 8. Draw Main News Image (Cover logic inside container)
      const imgX = 50;
      const imgY = 195;
      const imgW = 980;
      const imgH = 430;
      const imgRadius = 8;

      ctx.save();
      // Clip to rounded rectangle
      ctx.beginPath();
      ctx.roundRect?.(imgX, imgY, imgW, imgH, imgRadius);
      ctx.clip();

      try {
        const mainImg = await loadImage(imageSrc || DEFAULT_PLACEHOLDER);
        
        // Calculate standard "object-fit: cover" scales
        const imgRatio = mainImg.width / mainImg.height;
        const containerRatio = imgW / imgH;
        let drawW = imgW;
        let drawH = imgH;
        let drawX = imgX;
        let drawY = imgY;

        if (imgRatio > containerRatio) {
          // Image is wider than container
          drawW = mainImg.width * (imgH / mainImg.height);
          drawX = imgX - (drawW - imgW) / 2;
        } else {
          // Image is taller than container
          drawH = mainImg.height * (imgW / mainImg.width);
          drawY = imgY - (drawH - imgH) / 2;
        }

        ctx.drawImage(mainImg, drawX, drawY, drawW, drawH);
      } catch (err) {
        console.error("Failed to load news image, drawing background only", err);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(imgX, imgY, imgW, imgH);
      }
      ctx.restore();

      // 9. Draw Corner Accent Box Frame on top-left of image
      ctx.fillStyle = accentColor;
      const accentThickness = 6;
      const accentLength = 40;
      // Top horizontal line
      ctx.fillRect(imgX - 8, imgY - 8, accentLength, accentThickness);
      // Left vertical line
      ctx.fillRect(imgX - 8, imgY - 8, accentThickness, accentLength);

      // 10. Draw Category Badge below the photo
      const catY = 660;
      const catHeight = 32;
      ctx.fillStyle = '#0f172a'; // Navy Blue block
      
      const hasCatBengali = /[৳-৿]/.test(category);
      const catFontFamily = hasCatBengali ? "'Hind Siliguri', sans-serif" : "sans-serif";
      ctx.font = `bold 13px ${catFontFamily}`;
      
      const catText = category.toUpperCase();
      const catWidth = ctx.measureText(catText).width + 24;
      ctx.fillRect(imgX, catY, catWidth, catHeight);
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'top';
      ctx.fillText(catText, imgX + 12, catY + (catHeight - 13) / 2);

      // 11. Draw Category Accent line below category badge
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(imgX + catWidth, catY + 31, 980 - catWidth, 1);

      // 12. Draw Vertical Accent Line next to titles
      const contentY = 720;
      ctx.fillStyle = accentColor;
      ctx.fillRect(imgX, contentY, 6, 170);

      // 13. Draw Title (Merriweather / Bengali Serif font)
      ctx.fillStyle = isDark ? '#ffffff' : '#0b0f19';
      // Detect Bengali text
      const hasBengali = /[৳-৿]/.test(headline);
      const titleFontFamily = hasBengali ? "'Noto Serif Bengali', serif" : "Merriweather, Georgia, serif";
      ctx.font = `bold 38px ${titleFontFamily}`;
      ctx.textBaseline = 'top';
      
      const wrappedTitleEndY = wrapText(
        ctx,
        headline,
        imgX + 30,
        contentY + 5,
        900,
        50
      );

      // 14. Draw Subtitle (Inter / Bengali Sans font)
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      const subFontFamily = hasBengali ? "'Hind Siliguri', sans-serif" : "Inter, sans-serif";
      ctx.font = `500 20px ${subFontFamily}`;
      
      wrapText(
        ctx,
        summary,
        imgX + 30,
        wrappedTitleEndY + 10,
        900,
        30
      );

      // 15. Draw Footer Line Divider
      const footerY = 930;
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(imgX, footerY, 980, 2);

      // 16. Draw Footer Contents (Reporter / Source / Logo TRT)
      const footerItemY = 970;

      // Left: Reporter Avatar and Info
      // Avatar Bubble background
      ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
      ctx.beginPath();
      ctx.arc(imgX + 22, footerItemY + 22, 22, 0, 2 * Math.PI);
      ctx.fill();
      
      let drewAvatar = false;
      if (reporterAvatar) {
        try {
          const avatarImg = await loadImage(reporterAvatar);
          ctx.save();
          ctx.beginPath();
          ctx.arc(imgX + 22, footerItemY + 22, 22, 0, 2 * Math.PI);
          ctx.clip();
          // Draw image centered in the 44x44 square area
          ctx.drawImage(avatarImg, imgX, footerItemY, 44, 44);
          ctx.restore();
          drewAvatar = true;
        } catch (err) {
          console.error("Failed to load reporter avatar on canvas, drawing fallback icon", err);
        }
      }

      if (!drewAvatar) {
        // Avatar Icon (Mini user fallback)
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.beginPath();
        ctx.arc(imgX + 22, footerItemY + 16, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(imgX + 22, footerItemY + 36, 14, Math.PI, 2 * Math.PI);
        ctx.fill();
      }

      // Reporter Text
      const hasReporterBengali = /[৳-৿]/.test(reporterName) || /[৳-৿]/.test(reporterTitle);
      const reporterFontFamily = hasReporterBengali ? "'Hind Siliguri', sans-serif" : "sans-serif";

      ctx.fillStyle = isDark ? '#ffffff' : '#0b0f19';
      ctx.font = `bold 16px ${reporterFontFamily}`;
      ctx.textBaseline = 'top';
      ctx.fillText(reporterName, imgX + 60, footerItemY + 6);
      
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = `500 14px ${reporterFontFamily}`;
      ctx.fillText(reporterTitle, imgX + 60, footerItemY + 28);

      // Draw Separator line in footer
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(imgX + 300, footerItemY, 2, 44);

      // Center: Source Icon and Info
      // Globe icon sphere
      const globeX = imgX + 340;
      ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(globeX + 22, footerItemY + 22, 16, 0, 2 * Math.PI);
      ctx.stroke();
      // Globe grid lines
      ctx.beginPath();
      ctx.ellipse(globeX + 22, footerItemY + 22, 8, 16, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(globeX + 6, footerItemY + 22);
      ctx.lineTo(globeX + 38, footerItemY + 22);
      ctx.stroke();

      // Source Text
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("Source", globeX + 55, footerItemY + 6);
      
      ctx.fillStyle = isDark ? '#ffffff' : '#0b0f19';
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(sourceUrl, globeX + 55, footerItemY + 28);

      // Right: TRT Logo Badge block (renders favicon icon instead of text with transparent bg)
      const trtW = 84;
      const trtH = 84;
      const trtX = 1030 - trtW;
      const trtY = footerItemY - 20; // Aligned centered with square layout
      
      try {
        const logoImg = await loadImage('/favicon.ico');
        // Render logo icon directly with transparent background and larger size
        ctx.drawImage(logoImg, trtX, trtY, trtW, trtH);
      } catch (err) {
        console.error("Failed to load footer logo on canvas, falling back to text", err);
        // Fallback TRT Text
        ctx.fillStyle = accentColor;
        ctx.font = "bold 28px Georgia, serif";
        ctx.textAlign = 'center';
        ctx.fillText("TRT", trtX + trtW / 2, trtY + 30);
        ctx.textAlign = 'left'; // Reset
      }

      // 17. Trigger client download of the image
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `photocard-${category.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error("Failed to generate and download photocard:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-title flex items-center gap-2">
            <Palette className="text-primary" />
            {isBangla ? 'ফটোকার্ড জেনারেটর' : 'Photocard Generator'}
          </h1>
          <p className="text-caption mt-1 text-sm">
            {isBangla 
              ? 'সামাজিক যোগাযোগ মাধ্যমে শেয়ার করার জন্য চমৎকার ও পেশাদার নিউজ ফটোকার্ড তৈরি করুন।' 
              : 'Create beautiful, professional news photocards for direct social media sharing.'}
          </p>
        </div>
        <Link 
          href={`/${locale}/admin/dashboard`} 
          className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-semibold text-body hover:bg-surface transition-colors"
        >
          <ArrowLeft size={16} />
          {isBangla ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="xl:col-span-5 bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold text-title flex items-center gap-2">
              <Palette size={18} className="text-primary" />
              {isBangla ? 'কার্ড কাস্টমাইজেশন' : 'Card Customization'}
            </h2>
          </div>

          {/* Theme Mode and Color Theme */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'কার্ডের থিম' : 'Card Theme'}
              </label>
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`flex-1 py-2 text-xs font-bold transition-all ${themeMode === 'light' ? 'bg-primary text-white' : 'bg-surface text-caption hover:text-body'}`}
                >
                  {isBangla ? 'লাইট (সাদা)' : 'Light (White)'}
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`flex-1 py-2 text-xs font-bold transition-all ${themeMode === 'dark' ? 'bg-primary text-white' : 'bg-surface text-caption hover:text-body'}`}
                >
                  {isBangla ? 'ডার্ক (কালো)' : 'Dark (Black)'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'অ্যাকসেন্ট কালার' : 'Accent Color'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 border border-border rounded-lg cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-caption">{accentColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Badge Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'ব্যাজ ১ (লাল অংশ)' : 'Badge 1 (Red Part)'}
              </label>
              <input
                type="text"
                value={badgeType}
                onChange={(e) => setBadgeType(e.target.value)}
                placeholder="e.g. BREAKING"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'ব্যাজ ২ (কালো অংশ)' : 'Badge 2 (Black Part)'}
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. NEWS"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-semibold"
              />
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. POLITICS"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
                {isBangla ? 'তারিখ' : 'Date'}
              </label>
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="e.g. MAY 25, 2025"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-semibold"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-caption mb-2">
              {isBangla ? 'খবরের ছবি আপলোড করুন' : 'News Photo Image'}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition-all bg-surface/50 group"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden" 
              />
              <Upload size={32} className="mx-auto text-caption group-hover:text-primary transition-colors mb-3" />
              <p className="text-sm font-semibold text-title">
                {imageFile ? imageFile.name : (isBangla ? 'কম্পিউটার থেকে ছবি নির্বাচন করুন' : 'Select photo from computer')}
              </p>
              <p className="text-xs text-caption mt-1">PNG, JPG, or WEBP (Standard layout matches ~16:9)</p>
            </div>
            {imageSrc && (
              <div className="flex items-center justify-between mt-3 bg-surface border border-border px-4 py-2 rounded-xl">
                <span className="text-xs font-semibold text-caption truncate max-w-[200px]">Photo Loaded</span>
                <button 
                  type="button" 
                  onClick={() => { setImageSrc(''); setImageFile(null); }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {isBangla ? 'রিমুভ করুন' : 'Remove'}
                </button>
              </div>
            )}
          </div>

          {/* Headline / Title */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-caption">
                {isBangla ? 'শিরোনাম / হেডলাইন' : 'Headline / News Title'}
              </label>
              <span className="text-[10px] font-bold text-caption">{headline.length} chars</span>
            </div>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={3}
              placeholder={isBangla ? 'এখানে ২-৩ লাইনে খবরের শক্তিশালী হেডলাইনটি লিখুন...' : 'Enter your 2-3 lines catchy, powerful headline...'}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold leading-relaxed resize-none"
            />
          </div>

          {/* Subtitle / Summary */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-caption">
                {isBangla ? 'সংক্ষিপ্ত বিবরণ / সাবটাইটেল' : 'Subtitle / Highlights Summary'}
              </label>
              <span className="text-[10px] font-bold text-caption">{summary.length} chars</span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder={isBangla ? 'খবরের একটি চমৎকার সংক্ষিপ্ত সারাংশ ১-২ লাইনে লিখুন...' : 'Enter a beautiful, brief summary or key news highlights...'}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-medium leading-relaxed resize-none text-body/80"
            />
          </div>

          {/* Footer customizations */}
          <div className="border-t border-border pt-4 mt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-caption mb-4">
              {isBangla ? 'ফুটার বা ব্র্যান্ড কাস্টমাইজেশন' : 'Footer & Brand Info'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-caption mb-2">
                  {isBangla ? 'রিপোর্টার নাম' : 'Reporter Name'}
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-caption mb-2">
                  {isBangla ? 'রিপোর্টার পদবি' : 'Reporter Subtitle'}
                </label>
                <input
                  type="text"
                  value={reporterTitle}
                  onChange={(e) => setReporterTitle(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-xs font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-caption mb-2">
                  {isBangla ? 'উৎস / ওয়েবসাইট লিঙ্ক' : 'Source Website URL'}
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-xs font-bold font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Premium Interactive HTML/CSS Preview */}
        <div className="xl:col-span-7 flex flex-col items-center justify-center space-y-6">
          <div className="border-b border-border pb-4 w-full flex justify-between items-center">
            <h2 className="text-lg font-bold text-title flex items-center gap-2">
              <Eye size={18} className="text-primary" />
              {isBangla ? 'লাইভ প্রিভিউ' : 'Live Digital Preview'}
            </h2>
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              Instagram Square (1:1)
            </span>
          </div>

          {/* Beautifully rendered card matching screenshot */}
          <div 
            id="photocard-preview"
            style={{
              borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0',
              backgroundColor: themeMode === 'dark' ? '#0b0f19' : '#ffffff'
            }}
            className={`aspect-square w-full max-w-[500px] border shadow-2xl rounded-2xl flex flex-col p-[22px] justify-between relative overflow-hidden transition-all duration-300 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}
          >
            {/* 1. Header Row */}
            <div className="flex justify-between items-start shrink-0">
              {/* Logo block */}
              <div className="flex items-center pt-1">
                <img 
                  src={themeMode === 'dark' ? "/dark mode logo.png" : "/the reform times logo.png"} 
                  alt="The Reform Times Logo"
                  className="h-[58px] w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image loading fails locally
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Badges and Date block (Vertical Stack) */}
              <div className="flex flex-col items-end shrink-0">
                {/* Badges row */}
                <div className="flex items-center gap-0">
                  {/* Breaking / Red badge */}
                  <div 
                    style={{ backgroundColor: accentColor }}
                    className="px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider rounded-l-sm"
                  >
                    {badgeType}
                  </div>
                  {/* News / Blue badge */}
                  <div className="bg-slate-950 px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider rounded-r-sm">
                    {badgeText}
                  </div>
                </div>

                {/* Date stamp row (placed below the badges) */}
                <div className="flex items-center gap-1.5 mt-1 pr-1">
                  <span className={`text-[8px] font-extrabold uppercase tracking-widest ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {dateText}
                  </span>
                  {/* Little red indicator vertical bar */}
                  <div 
                    style={{ backgroundColor: accentColor }}
                    className="w-[1.5px] h-[10px]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Top Header Divider */}
            <hr 
              style={{ borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0' }} 
              className="mt-1.5 mb-1.5 border-t w-full opacity-80" 
            />

            {/* 3. Main Body: Photo Wrapper */}
            <div className="relative w-full shrink-0 flex items-center justify-center overflow-visible my-0.5 group">
              {/* Top-Left Red Corner Accent Frame */}
              <div 
                style={{ 
                  borderTop: `3px solid ${accentColor}`,
                  borderLeft: `3px solid ${accentColor}`,
                }}
                className="absolute -top-[3px] -left-[3px] w-[18px] h-[18px] z-10 pointer-events-none"
              />

              {/* Dotted texture decoration in background */}
              <div 
                className={`absolute -top-3 -right-2 w-10 h-14 bg-grid-dots pointer-events-none opacity-20 ${themeMode === 'dark' ? 'invert' : ''}`}
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                  backgroundSize: '8px 8px'
                }}
              />

              {/* Actual Image Render */}
              <div 
                style={{ borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0' }}
                className="w-full rounded-md overflow-hidden bg-slate-100 border relative flex items-center justify-center aspect-[16/6] shrink-0"
              >
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt="News highlight photocard cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center select-none bg-slate-100 text-slate-400 w-full h-full">
                    <ImageIcon size={44} className="text-slate-300 animate-pulse mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">IMAGE / PHOTO PLACEHOLDER</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Category Tag & Accent horizontal line */}
            <div className="flex items-center shrink-0 mt-1.5 mb-1">
              <span className="bg-slate-950 text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                {category}
              </span>
              <hr 
                style={{ borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0' }} 
                className="flex-1 border-t ml-3 opacity-60" 
              />
            </div>

            {/* 5. Title & Vertical Red bar */}
            <div className="flex items-start gap-3 w-full shrink-0 min-h-[60px] overflow-hidden">
              {/* Left red thick bar */}
              <div 
                style={{ backgroundColor: accentColor }}
                className="w-[3px] h-[55px] shrink-0 self-stretch rounded-sm"
              />

              {/* Title Text and Summary details */}
              <div className="flex flex-col gap-1 w-full text-left">
                {/* Title headline with Merriweather Serif or Bengali font */}
                <h3 
                  className={`font-bold leading-[1.2] text-[18px] md:text-[20px] ${
                    /[৳-৿]/.test(headline) ? 'font-bengali-serif' : 'font-serif'
                  }`}
                  style={{ color: themeMode === 'dark' ? '#ffffff' : '#0f172a' }}
                >
                  {headline}
                </h3>
                {/* Highlights description summary */}
                <p 
                  className={`text-[9.5px] leading-relaxed font-medium ${
                    /[৳-৿]/.test(summary) ? 'font-bengali-sans' : 'font-sans'
                  } ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  {summary}
                </p>
              </div>
            </div>

            {/* 6. Footer Divider Line */}
            <hr 
              style={{ borderColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0' }} 
              className="my-1.5 border-t w-full opacity-80" 
            />

            {/* 7. Footer section (Reporter, source, brand box) */}
            <div className="flex justify-between items-center shrink-0">
              {/* Left & Center elements grouped together for perfect spacing and alignment */}
              <div className="flex items-center gap-3.5">
                {/* Reporter Info */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} overflow-hidden relative`}>
                    {reporterAvatar ? (
                      <img 
                        src={reporterAvatar} 
                        alt={reporterName} 
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <User size={14} className={themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className={`text-[8.5px] font-extrabold ${/[৳-৿]/.test(reporterName) ? 'font-bengali-sans' : ''} ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                      {reporterName}
                    </span>
                    <span className={`text-[7.5px] font-bold text-slate-400 tracking-wide mt-0.5 ${/[৳-৿]/.test(reporterTitle) ? 'font-bengali-sans' : ''}`}>
                      {reporterTitle}
                    </span>
                  </div>
                </div>

                {/* Vertical small divider */}
                <div 
                  style={{ backgroundColor: themeMode === 'dark' ? '#1e293b' : '#e2e8f0' }}
                  className="w-[1px] h-6"
                />

                {/* Source Info */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Globe size={14} className={themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                  </div>
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-widest">Source</span>
                    <span className={`text-[8.5px] font-extrabold mt-0.5 ${/[৳-৿]/.test(sourceUrl) ? 'font-bengali-sans' : ''} ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                      {sourceUrl}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand block badge (displays transparent square favicon icon) */}
              <div className="w-[42px] h-[42px] flex items-center justify-center select-none overflow-hidden relative shrink-0">
                <img 
                  src="/favicon.ico" 
                  alt="TRT Logo Icon" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <span style={{ display: 'none' }} className="text-primary font-serif font-black text-xs tracking-wider absolute inset-0 flex items-center justify-center">
                  TRT
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="w-full max-w-[500px] flex flex-col gap-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/70 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  {isBangla ? 'ফটোকার্ড তৈরি হচ্ছে...' : 'Generating Premium Card...'}
                </>
              ) : (
                <>
                  <Download size={18} />
                  {isBangla ? 'হাই-রেস ফটোকার্ড ডাউনলোড করুন' : 'Download High-Res Photocard'}
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-caption font-bold uppercase tracking-wider">
              {isBangla 
                ? 'এটি সামাজিক যোগাযোগ মাধ্যমে (১০৮০x১০৮০ পিক্সেল) শেয়ার করার জন্য প্রস্তুত।' 
                : 'Generates a pixel-perfect 1080x1080 high-resolution square print.'}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden high-res canvas used for compiling base images */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
