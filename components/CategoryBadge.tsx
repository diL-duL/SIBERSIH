import { Trash2, Wrench } from "lucide-react";

interface CategoryBadgeProps {
  kategori?: string | null;
  className?: string;
  size?: "sm" | "md";
}

export default function CategoryBadge({
  kategori,
  className = "",
  size = "sm",
}: CategoryBadgeProps) {
  const isSarana = kategori === "SARANA_PRASARANA";

  const sizeClass =
    size === "md"
      ? "text-xs py-1 px-2.5 gap-1.5"
      : "text-[11px] py-0.5 px-2 gap-1";

  if (isSarana) {
    return (
      <span
        className={`inline-flex items-center font-medium text-slate-800 bg-slate-100 rounded-md border border-slate-200 shrink-0 select-none ${sizeClass} ${className}`}
      >
        <Wrench size={size === "md" ? 12 : 10} className="text-slate-600 shrink-0" />
        <span>Sarana Prasarana</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium text-emerald-900 bg-emerald-50 rounded-md border border-emerald-200/90 shrink-0 select-none ${sizeClass} ${className}`}
    >
      <Trash2 size={size === "md" ? 12 : 10} className="text-emerald-700 shrink-0" />
      <span>Sampah</span>
    </span>
  );
}
