import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  dark?: boolean;
}

export function SectionHeader({ title, subtitle, linkText, linkHref, className, dark = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4", dark ? "border-white/20" : "border-gray-200", className)}>
      <div>
        <h2 className={cn("font-serif font-bold text-3xl md:text-4xl", dark ? "text-white" : "text-brand-navy")}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-2 text-sm max-w-2xl", dark ? "text-gray-400" : "text-gray-600")}>
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <Link 
          href={linkHref} 
          className={cn(
            "flex items-center gap-1 text-sm font-semibold transition-colors group",
            dark ? "text-brand-red hover:text-white" : "text-brand-red hover:text-brand-navy"
          )}
        >
          {linkText}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
