"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}) {
  if (!position) return null;

  const DraggableMarker = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 15, { animate: true });
      }
    }, [position, map]);

    return (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      >
        {" "}
        <Popup>You are here</Popup>{" "}
      </Marker>
    );
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      {" "}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />{" "}
      <DraggableMarker />{" "}
    </MapContainer>
  );
}
