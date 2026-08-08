import React, { useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

export function Test() {
  const markerRef = useRef<L.Marker>(null);
  return <Marker position={[0,0]} eventHandlers={{ dragend: () => {} }} />;
}
