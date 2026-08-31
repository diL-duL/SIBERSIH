"use client";

import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface ImageLightboxModalProps {
  src: string | null;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightboxModal({
  src,
  alt = "Pratinjau Foto",
  isOpen,
  onClose,
}: ImageLightboxModalProps) {
  if (!isOpen || !src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Lightbox Content */}
      <div className="relative z-50 max-w-4xl w-full max-h-[90vh] bg-transparent flex flex-col items-center justify-center animate-in zoom-in-95 duration-150 p-2">
        <div className="absolute -top-12 right-0 flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium flex items-center gap-1">
            <ZoomIn size={14} /> Inspeksi Foto Full
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
