"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  }, [stopCamera, onClose]);

  // Start camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        console.error("Camera access error:", err);
        setCameraError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan pada peramban Anda.");
      }
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, stopCamera]);

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleConfirmCapturedPhoto = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const timestamp = new Date().getTime();
          const file = new File([blob], `kamera_${timestamp}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
          handleClose();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sibersih-primary/10 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-sibersih-primary/10 flex justify-between items-center bg-sibersih-bg">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-sibersih-primary" />
            <h3 className="font-semibold text-sibersih-primary text-sm sm:text-base">
              Ambil Foto dari Kamera
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-sibersih-primary/60 hover:text-sibersih-primary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col items-center justify-center min-h-[320px] bg-black relative">
          <canvas ref={canvasRef} className="hidden" />

          {cameraError ? (
            <div className="p-6 text-center text-white flex flex-col items-center gap-3">
              <AlertCircle size={40} className="text-red-400" />
              <p className="text-sm leading-relaxed">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Foto Tangkapan"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                title="Beralih Kamera Depan/Belakang"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-sibersih-primary/10 bg-sibersih-bg flex justify-between items-center gap-3">
          {capturedImage ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetake}
                className="flex-1 gap-2 text-xs font-semibold"
              >
                <RefreshCw size={14} /> Ulangi Foto
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmCapturedPhoto}
                className="flex-1 gap-2 text-xs font-semibold"
              >
                <Check size={14} /> Gunakan Foto Ini
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 text-xs"
              >
                Batal
              </Button>
              {!cameraError && (
                <Button
                  type="button"
                  variant="default"
                  onClick={handleTakeSnapshot}
                  className="flex-1 gap-2 text-xs font-semibold shadow-md"
                >
                  <Camera size={16} /> Jepret Foto
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
