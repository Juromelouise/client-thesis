import { GoogleMap, useLoadScript, HeatmapLayer, Marker, Circle, Polygon } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const heatmapData = [
  { lat: 14.5176, lng: 121.0453 },
  { lat: 14.518, lng: 121.0455 },
  { lat: 14.5178, lng: 121.0457 },
  // Add more data points as needed
];

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 14.5176,
  lng: 121.0453,
};

const options = {
  radius: 20,
  opacity: 0.6,
};

const markerPosition = {
  lat: 14.5176,
  lng: 121.0453,
};

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  center: markerPosition,
  radius: 100,
};

// Define the coordinates for the boundary of Barangay Western Bicutan
const westernBicutanCoords = [
  { lat: 14.5226, lng: 121.0432 },
  { lat: 14.5205, lng: 121.0376 },
  { lat: 14.5183, lng: 121.0381 },
  { lat: 14.5161, lng: 121.0394 },
  { lat: 14.5152, lng: 121.0415 },
  { lat: 14.5143, lng: 121.0438 },
  { lat: 14.5135, lng: 121.0451 },
  { lat: 14.5142, lng: 121.0483 },
  { lat: 14.5156, lng: 121.0497 },
  { lat: 14.5173, lng: 121.0508 },
  { lat: 14.5192, lng: 121.0503 },
  { lat: 14.5210, lng: 121.0495 },
  { lat: 14.5224, lng: 121.0478 },
  { lat: 14.5226, lng: 121.0432 },
];

const polygonOptions = {
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
};

const HeatMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization"],
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true);
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
      <HeatmapLayer
        data={heatmapData.map(
          (point) => new window.google.maps.LatLng(point.lat, point.lng)
        )}
        options={options}
      />
      {mapLoaded && (
        <>
          <Marker position={markerPosition} />
          <Circle options={circleOptions} />
          <Polygon paths={westernBicutanCoords} options={polygonOptions} />
        </>
      )}
    </GoogleMap>
  );
};

export default HeatMap;