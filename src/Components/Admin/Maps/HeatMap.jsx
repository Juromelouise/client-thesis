import { GoogleMap, useLoadScript, Polygon } from "@react-google-maps/api";
import { useRef } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 14.5176,
  lng: 121.0453,
};

// Large outer polygon covering a big area
const outerBounds = [
  { lat: 15.0, lng: 120.5 },
  { lat: 15.0, lng: 121.5 },
  { lat: 14.0, lng: 121.5 },
  { lat: 14.0, lng: 120.5 },
  { lat: 15.0, lng: 120.5 }, // Close the polygon
];

// Updated coordinates for Barangay Western Bicutan boundary
const westernBicutanCoords = [
  { lat: 14.5231, lng: 121.0359 },
  { lat: 14.5208, lng: 121.0365 },
  { lat: 14.5192, lng: 121.0378 },
  { lat: 14.5181, lng: 121.0392 },
  { lat: 14.5168, lng: 121.0410 },
  { lat: 14.5156, lng: 121.0432 },
  { lat: 14.5148, lng: 121.0450 },
  { lat: 14.5145, lng: 121.0472 },
  { lat: 14.5153, lng: 121.0490 },
  { lat: 14.5167, lng: 121.0503 },
  { lat: 14.5185, lng: 121.0508 },
  { lat: 14.5202, lng: 121.0498 },
  { lat: 14.5220, lng: 121.0480 },
  { lat: 14.5231, lng: 121.0359 }, // Close the polygon
];

const maskOptions = {
  fillColor: "#000000", // Black mask
  fillOpacity: 0.6, // Semi-transparent mask
  strokeColor: "transparent",
  strokeOpacity: 0,
};

const bicutanOptions = {
  fillColor: "#FF0000", // Highlight Barangay Western Bicutan
  fillOpacity: 0.7,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
};

const HeatMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization"],
  });

  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    westernBicutanCoords.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      onLoad={onLoad}
      options={{ mapTypeControl: false }}
    >
      {/* Mask effect */}
      <Polygon paths={[outerBounds, westernBicutanCoords]} options={maskOptions} />

      {/* Highlight Barangay Western Bicutan */}
      <Polygon paths={westernBicutanCoords} options={bicutanOptions} />
    </GoogleMap>
  );
};

export default HeatMap;