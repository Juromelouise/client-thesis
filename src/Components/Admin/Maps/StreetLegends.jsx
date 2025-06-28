import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useRef } from "react";
import apiClient from "../../../utils/apiClient";

const DashedBorder = () => {
  const map = useMap();
  const [boundaryCoords, setBoundaryCoords] = useState([]);

  useEffect(() => {
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
    if (
      !map ||
      !window.google ||
      !window.google.maps ||
      boundaryCoords.length === 0
    )
      return;

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

    return () => {
      dashedLine.setMap(null);
    };
  }, [map, boundaryCoords]);

  return null;
};

const StreetsPolylines = ({ streets }) => {
  const map = useMap();
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    // Remove previous polylines
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];

    // Remove previous InfoWindow
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    if (!map || !window.google || !window.google.maps) return;
    if (!Array.isArray(streets)) return;

    // Draw new polylines for each segment of each street
    streets.forEach((street) => {
      if (Array.isArray(street.segments)) {
        street.segments.forEach((segment) => {
          if (Array.isArray(segment) && segment.length > 1) {
            const path = segment.map((c) => ({ lat: c.lat, lng: c.lng }));
            const polyline = new window.google.maps.Polyline({
              path,
              strokeColor: street.color || "#808080",
              strokeOpacity: 1,
              strokeWeight: 3,
              map: map,
            });

            // Show InfoWindow on mouseover
            polyline.addListener("mouseover", (e) => {
              if (!infoWindowRef.current) {
                infoWindowRef.current = new window.google.maps.InfoWindow();
              }
              infoWindowRef.current.setContent(`
    <div style="
      font-size:13px;
      font-weight:bold;
      padding:4px 10px;
      border-radius:4px;
      background:#fff;
      box-shadow:0 1px 4px rgba(0,0,0,0.12);
      min-width:80px;
      max-width:160px;
      text-align:center;
    "> 
      ${street.streetName}, ${street.segments[0][0].lat} 
      
    </div>
    <style>
      .gm-ui-hover-effect { display: none !important; }
    </style>
  `);
              infoWindowRef.current.setPosition(e.latLng);
              infoWindowRef.current.open(map);
            });

            // Hide InfoWindow on mouseout
            polyline.addListener("mouseout", () => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
            });

            polylinesRef.current.push(polyline);
          }
        });
      }
    });

    return () => {
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [map, streets]);

  return null;
};

const violationColors = {
  "All Violations": "#808080",           // Gray
  "Overnight parking": "#4B6CB7",        // Blue
  "Hazard parking": "#e57373",           // Red
  "Illegal parking": "#fbc02d",          // Yellow
  "Towing Zone": "#1976d2",              // Deep Blue
  "Loading and Unloading": "#388e3c",    // Green
  "Illegal Sidewalk Use": "#8e24aa",     // Purple
};

const violationsList = [
  { value: "All Violations", label: "All Violations" },
  { value: "Overnight parking", label: "Overnight Parking" },
  { value: "Hazard parking", label: "Hazard parking" },
  { value: "Illegal parking", label: "Illegal parking" },
  { value: "Towing Zone", label: "Towing Zone" },
  { value: "Loading and Unloading", label: "Loading and Unloading" },
  { value: "Illegal Sidewalk Use", label: "Illegal Sidewalk Use" },
];

const Legend = () => (
  <div
    style={{
      position: "fixed",
      top: "50%",
      right: "32px",
      transform: "translateY(-50%)",
      background: "rgba(255,255,255,0.95)",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      padding: "10px 14px",
      zIndex: 1000,
      minWidth: "150px",
      maxWidth: "180px",
    }}
  >
    <div style={{ fontWeight: "bold", marginBottom: 8, fontSize: 15 }}>
      Violations
    </div>
    {violationsList.map((v) => (
      <div
        key={v.value}
        style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
      >
        <span
          style={{
            display: "inline-block",
            width: 18,
            height: 8,
            background: violationColors[v.value],
            borderRadius: 2,
            marginRight: 8,
            border: "1px solid #ccc",
          }}
        />
        <span style={{ fontSize: 13 }}>{v.label}</span>
      </div>
    ))}
  </div>
);

const StreetLegends = () => {
  const [mapCenter] = useState({ lat: 14.5172, lng: 121.0364 });
  const [mapZoom] = useState(14);
  const mapRef = useRef(null);
  const [streets, setStreets] = useState([]);

  const handleMapIdle = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      console.log("Map idle at center:", center.toJSON(), "Zoom:", zoom);
    }
  };

  // Fetch street data from backend
  useEffect(() => {
    apiClient
      .get(`/street/street`)
      .then((response) => {
        const streetData = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setStreets(streetData || []);
        console.log("Fetched streets:", streetData);
      })
      .catch((error) => console.error("Error fetching coordinates:", error));
  }, []);

  const mapStyle = [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
  ];

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["visualization"]}
    >
      <Map
        defaultCenter={mapCenter}
        defaultZoom={mapZoom}
        style={{ width: "100%", height: "100vh" }}
        options={{
          gestureHandling: "auto",
          disableDefaultUI: false,
          zoomControl: true,
          scrollwheel: true,
          draggable: true,
          fullscreenControl: true,
          styles: mapStyle,
        }}
        onLoad={(map) => (mapRef.current = map)}
        onIdle={handleMapIdle}
      >
        <DashedBorder />
        <StreetsPolylines streets={streets} />
      </Map>
      <Legend />
    </APIProvider>
  );
};

export default StreetLegends;
