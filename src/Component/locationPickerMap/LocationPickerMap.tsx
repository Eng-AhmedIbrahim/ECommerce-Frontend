import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_KEY = "ZX708GJRLvoviT0zc9eI";

// --------- Types ----------
interface Location {
  lat: number;
  lng: number;
}

interface Props {
  value: Location;
  onChange: (loc: Location) => void;
}

const LocationPickerMap: React.FC<Props> = ({ value, onChange }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [selectedLocation, setSelectedLocation] = useState({
    lat: value.lat,
    lng: value.lng,
    address: "",
    street: "",
  });

  // -------- REVERSE GEOCODE ----------
  const reverseGeocode = async (lat: number, lng: number) => {
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAP_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data?.features?.length) return null;

    const info = data.features[0].properties as {
      address?: string;
      name?: string;
      street?: string;
    };

    return {
      address: info.address || info.name || "",
      street: info.street || "",
    };
  };

  // -------- INITIALIZE MAP ----------
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAP_KEY}`,
      center: [value.lng, value.lat],
      zoom: 14,
    });

    // Create marker once
    markerRef.current = new maplibregl.Marker({ color: "#ff3344" })
      .setLngLat([value.lng, value.lat])
      .addTo(map.current);

    // Map click listener
    map.current.on("click", async (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;

      // Move marker
      markerRef.current!.setLngLat([lng, lat]);

      // Reverse geocode
      const details = await reverseGeocode(lat, lng);

      const updated = {
        lat,
        lng,
        address: details?.address || "",
        street: details?.street || "",
      };

      setSelectedLocation(updated);

      // Send Lat/Lng back to parent page
      onChange({ lat, lng });
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />

      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        <p>
          <strong>العنوان:</strong> {selectedLocation.address}
        </p>
        <p>
          <strong>الشارع:</strong> {selectedLocation.street}
        </p>
        <p>
          <strong>Lat:</strong> {selectedLocation.lat}
        </p>
        <p>
          <strong>Lng:</strong> {selectedLocation.lng}
        </p>
      </div>
    </div>
  );
};

export default LocationPickerMap;
