import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useRef } from "react";

const DashedBorderWithHeatmap = () => {
  const map = useMap();
  const [boundaryCoords, setBoundaryCoords] = useState([]);

  useEffect(() => {
    console.log("Fetching geojson data...");
    fetch("/export.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((geojson) => {
        const coordinates =
          geojson.features[0]?.geometry?.coordinates?.[0] || [];
        const coords = coordinates.map(([lng, lat]) => ({ lat, lng }));

        if (
          coords.length &&
          (coords[0].lat !== coords[coords.length - 1].lat ||
            coords[0].lng !== coords[coords.length - 1].lng)
        ) {
          coords.push(coords[0]);
        }

        setBoundaryCoords(coords);
      })
      .catch((error) => console.error("Error loading geojson:", error));
  }, []);

  useEffect(() => {
    if (!map || !window.google || !window.google.maps || boundaryCoords.length === 0) return;

    const heatmapPoints = [
      new window.google.maps.LatLng(14.5175, 121.0321),
      new window.google.maps.LatLng(14.518, 121.033),
      new window.google.maps.LatLng(14.516, 121.031),
    ];

    const dashedLine = new window.google.maps.Polyline({
      path: boundaryCoords,
      strokeOpacity: 0,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 3,
          },
          offset: "0",
          repeat: "10px",
        },
      ],
      map: map,
    });

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapPoints,
      radius: 30,
      map: map,
    });

    return () => {
      dashedLine.setMap(null);
      heatmap.setMap(null);
    };
  }, [map, boundaryCoords]);

  return null;
};

const HeatMap = () => {
  const [mapCenter] = useState({ lat: 14.5172, lng: 121.0364 });
  const [mapZoom] = useState(14);
  const mapRef = useRef(null); // Reference to the Google Maps instance

  const handleMapIdle = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      console.log("Map idle at center:", center.toJSON(), "Zoom:", zoom);
    }
  };

  // Custom map style to show only street and barangay names
  const mapStyle = [
    {
      featureType: "poi", // Points of interest (e.g., restaurants, schools)
      stylers: [{ visibility: "off" }], // Hide them
    },
    {
      featureType: "transit", // Transit stations
      stylers: [{ visibility: "off" }], // Hide them
    },
    {
      featureType: "administrative.neighborhood", // Barangay names
      stylers: [{ visibility: "on" }], // Show them
    },
    {
      featureType: "road", // Roads and street names
      elementType: "labels",
      stylers: [{ visibility: "on" }], // Show them
    },
  ];

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["visualization"]}
    >
      <Map
        defaultCenter={mapCenter} // Use defaultCenter instead of center
        defaultZoom={mapZoom} // Use defaultZoom instead of zoom
        style={{ width: "100%", height: "100vh" }}
        options={{
          gestureHandling: "auto", // Allow default gestures (dragging, zooming, etc.)
          disableDefaultUI: false, // Show default UI controls
          zoomControl: true, // Enable zoom control
          scrollwheel: true, // Allow zooming with the scroll wheel
          draggable: true, // Allow dragging the map
          fullscreenControl: true, // Enable fullscreen control
          styles: mapStyle, // Apply the custom map style
        }}
        onLoad={(map) => (mapRef.current = map)} // Store the map instance in the ref
        onIdle={handleMapIdle} // Log center and zoom on idle
      >
        <DashedBorderWithHeatmap />
      </Map>
    </APIProvider>
  );
};

export default HeatMap;