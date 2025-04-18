// HeatMap.jsx
import React from "react";
import {
  GoogleMap,
  LoadScript,
  HeatmapLayer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 14.5167779,
  lng: 121.039416,
};

const HeatMap = () => {
  const heatmapData = [
    new window.google.maps.LatLng(14.5172195, 121.0363768),
    // Add more LatLng points here as needed
  ];

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["visualization"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        <HeatmapLayer data={heatmapData} />
      </GoogleMap>
    </LoadScript>
  );
};

export default HeatMap;
