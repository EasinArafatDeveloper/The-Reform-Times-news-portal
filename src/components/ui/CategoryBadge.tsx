import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span 
      className={cn(
        "text-[10px] font-bold uppercase tracking-widest text-brand-red mb-3 block",
        className
      )}
    >
      {category}
    </span>
  );
}
