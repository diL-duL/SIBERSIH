"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Rectangle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertCircle, MapPin } from "lucide-react";
import {
  FATEK_CENTER,
  FATEK_BOUNDS,
  FATEK_CROP_MASKS,
  FATEK_PAN_BOUNDS,
  FATEK_MIN_ZOOM,
  FATEK_MAX_ZOOM,
  FATEK_DEFAULT_ZOOM,
  isWithinFatekBounds,
} from "@/lib/mapConstants";

// Create inline SVG Data URI for marker icon (no external unpkg.com network dependency)
const svgIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

interface MapPickerProps {
  onPositionChange: (lat: number, lng: number) => void;
  defaultPosition?: [number, number];
}

function MapEvents({
  onSelectPosition,
  onOutOfBounds,
}: {
  onSelectPosition: (pos: L.LatLng) => void;
  onOutOfBounds: () => void;
}) {
  useMapEvents({
    click(e) {
      if (isWithinFatekBounds(e.latlng.lat, e.latlng.lng)) {
        onSelectPosition(e.latlng);
      } else {
        onOutOfBounds();
      }
    },
  });
  return null;
}

export default function MapPicker({ onPositionChange, defaultPosition }: MapPickerProps) {
  // Pastikan posisi awal berada di dalam batas Fatek
  const initialCoords = useMemo<[number, number]>(() => {
    if (defaultPosition && isWithinFatekBounds(defaultPosition[0], defaultPosition[1])) {
      return defaultPosition;
    }
    return FATEK_CENTER;
  }, [defaultPosition]);

  const [position, setPosition] = useState<L.LatLng>(() => L.latLng(initialCoords[0], initialCoords[1]));
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const markerRef = useRef<L.Marker>(null);

  const showWarning = useCallback((msg: string) => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setWarningMessage(msg);
    warningTimerRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, []);

  // Create icon synchronously to prevent React Strict Mode _leaflet_pos error
  const icon = typeof window !== "undefined" ? new L.Icon({
    iconUrl: svgIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  }) : null;

  useEffect(() => {
    onPositionChange(position.lat, position.lng);
  }, [position, onPositionChange]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const rawLatLng = marker.getLatLng();
          if (isWithinFatekBounds(rawLatLng.lat, rawLatLng.lng)) {
            setPosition(rawLatLng);
          } else {
            // Kembalikan pin ke posisi valid sebelumnya jika dilepas di luar area Fatek
            marker.setLatLng(position);
            showWarning("Titik lokasi hanya dapat dipilih di dalam kawasan Fakultas Teknik Untad.");
          }
        }
      },
    }),
    [position, showWarning]
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
      {/* Peringatan jika memilih titik di luar area */}
      {warningMessage && (
        <div className="absolute top-2 left-2 right-2 z-1000 bg-amber-600/95 backdrop-blur-xs text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{warningMessage}</span>
        </div>
      )}

      {/* Label Area Pelaporan Fatek Untad */}
      <div className="absolute bottom-2 left-2 z-1000 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-sibersih-primary/20 text-sibersih-primary dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded shadow-xs flex items-center gap-1.5 pointer-events-none">
        <MapPin size={11} className="text-sibersih-primary dark:text-emerald-400" />
        <span>Area Pelaporan: Fakultas Teknik Untad</span>
      </div>

      <MapContainer
        center={initialCoords}
        zoom={FATEK_DEFAULT_ZOOM}
        minZoom={FATEK_MIN_ZOOM}
        maxZoom={FATEK_MAX_ZOOM}
        maxBounds={FATEK_PAN_BOUNDS}
        maxBoundsViscosity={0.7}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={FATEK_MAX_ZOOM}
        />

        {/* Pemotong Visual Area Luar (Crop Mask): menggelapkan / memotong area di luar Fatek */}
        {FATEK_CROP_MASKS.map((maskBounds, idx) => (
          <Rectangle
            key={`crop-mask-${idx}`}
            bounds={maskBounds}
            pathOptions={{
              fillColor: "#0f172a",
              fillOpacity: 0.72,
              stroke: false,
              interactive: false,
            }}
          />
        ))}

        {/* Garis batas panduan area Fakultas Teknik Untad */}
        <Rectangle
          bounds={FATEK_BOUNDS}
          pathOptions={{
            color: "#059669",
            weight: 2.5,
            dashArray: "6, 8",
            fill: false,
            interactive: false,
          }}
        />

        <MapEvents
          onSelectPosition={(pos) => setPosition(pos)}
          onOutOfBounds={() => showWarning("Titik lokasi hanya dapat dipilih di dalam kawasan Fakultas Teknik Untad.")}
        />

        {icon && (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef as React.Ref<L.Marker>}
            icon={icon}
          />
        )}
      </MapContainer>
    </div>
  );
}
