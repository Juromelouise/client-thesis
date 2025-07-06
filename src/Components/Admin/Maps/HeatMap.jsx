import { 
  APIProvider, 
  Map,
  useMap,
  useMapsLibrary 
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import apiClient from "../../../utils/apiClient";

const HeatMapContent = ({ 
  selectedMonth, 
  selectedYear, 
  months, 
  years, 
  onMonthChange, 
  onYearChange 
}) => {
  const [boundaryCoords, setBoundaryCoords] = useState([]);
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [polyline, setPolyline] = useState(null);

  const map = useMap();
  const mapsLib = useMapsLibrary("maps");
  const visualizationLib = useMapsLibrary("visualization");

  useEffect(() => {
    if (!map || !mapsLib || !visualizationLib) return;

    // Load boundary coordinates
    fetch("/export.geojson")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((geojson) => {
        const coordinates = geojson.features[0]?.geometry?.coordinates?.[0] || [];
        const coords = coordinates.map(([lng, lat]) => ({ lat, lng }));

        if (coords.length && (coords[0].lat !== coords[coords.length - 1].lat ||
            coords[0].lng !== coords[coords.length - 1].lng)) {
          coords.push(coords[0]);
        }

        setBoundaryCoords(coords);
      })
      .catch((error) => console.error("Error loading geojson:", error));
  }, [map, mapsLib, visualizationLib]);

  useEffect(() => {
    if (!map || !visualizationLib) return;

    // Fetch heatmap data with month/year filter
    apiClient.get(`/map/coordinates`, {
      params: { month: selectedMonth, year: selectedYear }
    })
    .then((response) => {
      const points = response.data
        .filter(coord => coord.lat && coord.lng)
        .map(coord => new google.maps.LatLng(coord.lat, coord.lng));

      // Clear previous heatmap layer if exists
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
      }

      // Create new heatmap layer
      const newHeatmap = new visualizationLib.HeatmapLayer({
        data: points,
        map: map,
        radius: 20,
        dissipating: true,
      });

      setHeatmapLayer(newHeatmap);
    })
    .catch((error) => console.error("Error fetching coordinates:", error));

    return () => {
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
      }
    };
  }, [selectedMonth, selectedYear, map, visualizationLib]);

  useEffect(() => {
    if (!map || !mapsLib || !boundaryCoords.length) return;

    // Clear previous polyline if exists
    if (polyline) {
      polyline.setMap(null);
    }

    // Create new polyline for boundary
    const newPolyline = new mapsLib.Polyline({
      path: boundaryCoords,
      strokeOpacity: 0,
      strokeWeight: 2,
      icons: [{
        icon: {
          path: "M 0,-1 0,1",
          strokeOpacity: 1,
          scale: 3,
        },
        offset: "0",
        repeat: "10px",
      }],
      map: map,
    });

    setPolyline(newPolyline);

    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [boundaryCoords, map, mapsLib]);

  return null; // All rendering is handled by the parent component
};

const HeatMap = () => {
  const [mapCenter] = useState({ lat: 14.5172, lng: 121.0364 });
  const [mapZoom] = useState(14);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate year options (last 5 years and current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div style={{ position: "relative", width: "100%", height: "70vh" }}>
      {/* Month/Year Selector */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
      }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="month" style={{ marginRight: "10px" }}>Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" style={{ marginRight: "10px" }}>Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Google Map */}
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <HeatMapContent 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            months={months}
            years={years}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default HeatMap;