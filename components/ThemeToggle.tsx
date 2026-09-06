"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`w-9 h-9 rounded-xl border border-sibersih-primary/10 bg-white/50 dark:bg-white/5 opacity-0 ${className}`} 
        aria-hidden="true" 
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2.5 rounded-xl border border-sibersih-primary/10 bg-white/70 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-sibersih-primary transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 flex items-center justify-center ${className}`}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon size={18} className="text-sibersih-primary/80 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
