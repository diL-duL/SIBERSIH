"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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
  // Center roughly at Fakultas Teknik Universitas Tadulako
  const center = defaultPosition || [-0.8365, 119.8935];
  const [position, setPosition] = useState<L.LatLng>(L.latLng(center[0], center[1]));
  const markerRef = useRef<L.Marker>(null);

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
    <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={center as L.LatLngTuple}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents setPosition={setPosition} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef as React.Ref<L.Marker>}
          icon={customIcon}
        />
      </MapContainer>
    </div>
  );
}
