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

  useEffect(() => {
    // Remove previous polylines
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];

    if (!map || !window.google || !window.google.maps) return;
    if (!Array.isArray(streets)) return;

    // Draw new polylines for each segment of each street
    streets.forEach((street) => {
      if (Array.isArray(street.segments)) {
        street.segments.forEach((segment) => {
          // segment is an array of coordinates: [{lat, lng, _id}, ...]
          if (Array.isArray(segment) && segment.length > 1) {
            const path = segment.map((c) => ({ lat: c.lat, lng: c.lng }));
            const polyline = new window.google.maps.Polyline({
              path,
              strokeColor: street.color || "#808080",
              strokeOpacity: 1,
              strokeWeight: 3,
              map: map,
            });
            polylinesRef.current.push(polyline);
          }
        });
      }
    });

    return () => {
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, streets]);

  return null;
};

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
    </APIProvider>
  );
};

export default StreetLegends;
