"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create inline SVG Data URI for marker icon (no external unpkg.com network dependency)
const svgIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

interface MapPickerProps {
  onPositionChange: (lat: number, lng: number) => void;
  defaultPosition?: [number, number];
}

function MapEvents({ setPosition }: { setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({ onPositionChange, defaultPosition }: MapPickerProps) {
  // Center at Fakultas Teknik Universitas Tadulako
  const center = defaultPosition || [-0.840622, 119.893536];
  const [position, setPosition] = useState<L.LatLng>(L.latLng(center[0], center[1]));
  const markerRef = useRef<L.Marker>(null);
  
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
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
      <MapContainer
        center={center as L.LatLngTuple}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents setPosition={setPosition} />
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
