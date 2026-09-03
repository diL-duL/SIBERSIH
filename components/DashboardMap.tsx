"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Inline SVG for the pin (solid red)
const svgIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

export default function DashboardMap() {
  const center: L.LatLngTuple = [-0.840622, 119.893536];
  
  const [icon] = useState<L.Icon | null>(() => {
    if (typeof window !== "undefined") {
      return new L.Icon({
        iconUrl: svgIcon,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });
    }
    return null;
  });

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={false}
        zoomControl={false} // Menyembunyikan tombol + - agar UI bersih
        attributionControl={false} // Menyembunyikan teks OpenStreetMap agar minimalis
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {icon && (
          <Marker position={center} icon={icon} />
        )}
      </MapContainer>
    </div>
  );
}
