"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-sibersih-primary px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-sibersih-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] duration-200 ${className}`}
    >
      {pending ? "Memproses..." : children}
    </button>
  );
}
