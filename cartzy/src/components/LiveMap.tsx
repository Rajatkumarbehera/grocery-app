import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";

// const Map = dynamic(() => import("@/components/MapView"), {
//   ssr: false,
// });

interface Location {
  latitude: number;
  longitude: number;
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);

  return null;
}

export default function LiveMap({
  userLocation,
  deliveryBoyLocation,
}: {
  userLocation: Location;
  deliveryBoyLocation: Location;
}) {
  const deliveryBoyIcon = L.icon({
    iconUrl: "/scooter.png",
    iconSize: [45, 45],
  });
  const userIcon = L.icon({
    iconUrl: "/location.png",
    iconSize: [45, 45],
  });

  const linePositions =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  const center = [userLocation.latitude, userLocation.longitude];
  //   const center = deliveryBoyLocation
  //     ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
  //     : [userLocation.latitude, userLocation.longitude];

  console.log(center);

  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
        <Recenter position={center as any} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <DraggableMarker /> */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={userIcon}
      >
        <Popup>Delivery address</Popup>
      </Marker>

      {deliveryBoyLocation && (
        <Marker
          position={[
            deliveryBoyLocation.latitude,
            deliveryBoyLocation.longitude,
          ]}
          icon={deliveryBoyIcon}
        ></Marker>
      )}
      <Polyline positions={linePositions as any} color="green" />
    </MapContainer>
  );
}
