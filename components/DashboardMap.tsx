"use client";

import { MapContainer, TileLayer, Marker, Popup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  FATEK_CENTER,
  FATEK_BOUNDS,
  FATEK_CROP_MASKS,
  FATEK_PAN_BOUNDS,
  FATEK_MIN_ZOOM,
  FATEK_MAX_ZOOM,
  FATEK_DEFAULT_ZOOM,
} from "@/lib/mapConstants";

export interface MapReportItem {
  id: string;
  lokasi: string;
  deskripsi?: string | null;
  kategori?: string | null;
  status?: string;
  fotoLaporanUrl: string;
  latitude: number;
  longitude: number;
  createdAt?: Date | string;
}

interface DashboardMapProps {
  reports?: MapReportItem[];
  actionPathPrefix?: string;
}

// Inline SVG for the pin (solid red #ef4444)
const svgIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="34" height="34"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

export default function DashboardMap({ reports = [], actionPathPrefix }: DashboardMapProps) {
  // Memoize valid reports filtering to prevent recalculation on unrelated re-renders
  const validReports = useMemo(
    () =>
      reports.filter(
        (rep) =>
          typeof rep.latitude === "number" &&
          typeof rep.longitude === "number" &&
          !isNaN(rep.latitude) &&
          !isNaN(rep.longitude)
      ),
    [reports]
  );

  const [icon] = useState<L.Icon | null>(() => {
    if (typeof window !== "undefined") {
      return new L.Icon({
        iconUrl: svgIcon,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });
    }
    return null;
  });

  // Center map on the latest report if available, otherwise default to Fatek
  const initialCenter = useMemo<L.LatLngTuple>(() => {
    return validReports.length > 0
      ? [validReports[0].latitude, validReports[0].longitude]
      : (FATEK_CENTER as L.LatLngTuple);
  }, [validReports]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={initialCenter}
        zoom={FATEK_DEFAULT_ZOOM}
        minZoom={FATEK_MIN_ZOOM}
        maxZoom={FATEK_MAX_ZOOM}
        maxBounds={FATEK_PAN_BOUNDS}
        maxBoundsViscosity={0.7}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Pemotong Visual Area Luar (Crop Mask): menggelapkan area luar Fatek */}
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

        {/* Garis batas area Fakultas Teknik Untad */}
        <Rectangle
          bounds={FATEK_BOUNDS}
          pathOptions={{
            color: "#059669",
            weight: 2,
            dashArray: "6, 8",
            fill: false,
            interactive: false,
          }}
        />

        {/* If no reports have coordinates, display default center marker */}
        {icon && validReports.length === 0 && (
          <Marker position={FATEK_CENTER as L.LatLngTuple} icon={icon}>
            <Popup>
              <div className="p-1 text-center font-sans">
                <p className="font-bold text-xs text-sibersih-primary">Fakultas Teknik Untad</p>
                <p className="text-[10px] text-sibersih-primary/60 mt-0.5">Belum ada titik laporan dengan koordinat.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render markers for each report with coordinates */}
        {icon &&
          validReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="w-52 p-2 flex flex-col gap-2 font-sans select-none text-left">
                  {/* Baris Informasi Utama: Thumbnail & Teks */}
                  <div className="flex items-start gap-2.5">
                    {/* Thumbnail foto bersih */}
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-sibersih-primary/10">
                      <Image
                        src={report.fotoLaporanUrl}
                        alt={report.lokasi}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>

                    {/* Metadata Lokasi & Kategori */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 leading-none">
                          {report.kategori === "SARANA_PRASARANA" ? "Sarpras" : "Sampah"}
                        </span>
                        {report.createdAt && (
                          <span className="text-[10px] text-sibersih-primary/50 whitespace-nowrap">
                            {new Date(report.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-sibersih-primary truncate mt-1 leading-snug" title={report.lokasi}>
                        {report.lokasi}
                      </h4>

                      <p className="text-[10px] text-sibersih-primary/60 truncate mt-0.5">
                        {report.deskripsi || "Laporan masuk"}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi jika actionPathPrefix diset */}
                  {actionPathPrefix && (
                    <Link
                      href={`${actionPathPrefix}/${report.id}`}
                      className="flex items-center justify-center gap-1.5 py-1 px-2.5 bg-sibersih-primary/5 text-sibersih-primary rounded-md text-[11px] font-medium border border-sibersih-primary/10 mt-0.5"
                    >
                      <span>Tinjau Detail</span>
                      <ExternalLink size={10} />
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
