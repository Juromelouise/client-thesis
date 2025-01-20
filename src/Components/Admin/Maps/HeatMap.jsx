import { GoogleMap, useLoadScript, HeatmapLayer } from "@react-google-maps/api";

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

const HeatMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization"],
  });

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
    </GoogleMap>
  );
};

export default HeatMap;
