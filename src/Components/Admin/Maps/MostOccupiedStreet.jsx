import React, { useEffect, useState, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  Marker,
} from "@vis.gl/react-google-maps";
import {
  Slider,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import apiClient from "../../../utils/apiClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const STREET_COLORS = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
];

const ControlsContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "20px",
  left: "20px",
  backgroundColor: "white",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  zIndex: 1,
  width: "300px",
}));

const ColorLegend = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  right: "20px",
  backgroundColor: "white",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  zIndex: 1,
  width: "300px",
  maxHeight: "400px",
}));
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {payload[0].payload.fullName}
        </p>
        <p style={{ margin: 0 }}>Cases: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const StreetPolylines = ({ streets, streetColors, opacity }) => {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map || !streets?.length) return;

    // Clear previous polylines
    polylinesRef.current.forEach((polyline) => {
      if (polyline && polyline.setMap) polyline.setMap(null);
    });
    polylinesRef.current = [];

    // Draw new polylines
    streets.forEach((street) => {
      try {
        if (street?.geometry?.coordinates) {
          const path = street.geometry.coordinates.map((coord) => ({
            lat: coord[1],
            lng: coord[0],
          }));

          if (path.length > 0) {
            const polyline = new window.google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: streetColors[street.streetName] || "#FF0000",
              strokeOpacity: opacity,
              strokeWeight: 6,
              map: map,
            });
            polylinesRef.current.push(polyline);
          }
        }
      } catch (err) {
        console.error("Error creating polyline:", err);
      }
    });

    return () => {
      polylinesRef.current.forEach((polyline) => {
        if (polyline && polyline.setMap) polyline.setMap(null);
      });
    };
  }, [map, streets, streetColors, opacity]);

  return null;
};

function MostOccupiedStreet() {
  const [streets, setStreets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opacity, setOpacity] = useState(0.7);
  const [useAdvancedMarkers, setUseAdvancedMarkers] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [streetColors, setStreetColors] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await apiClient.get("/map/coordinates");
        const years = [...new Set(response.data.map((item) => item.year))]
          .filter(Boolean)
          .sort();
        setAvailableYears(years.length ? years : [new Date().getFullYear()]);
      } catch (err) {
        console.error("Failed to fetch available years:", err);
        setAvailableYears([new Date().getFullYear()]);
      }
    };
    fetchAvailableYears();
  }, []);

  const fetchData = async (month = null, year = null) => {
    try {
      setLoading(true);
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await apiClient.get("/map/street-occupied-most", {
        params,
      });

      if (!response?.data?.features || !Array.isArray(response.data.features)) {
        throw new Error("Invalid data structure received from API");
      }

      const validStreets = response.data.features.filter(
        (street) =>
          street?.pointLocation?.latitude &&
          street?.pointLocation?.longitude &&
          street?.geometry?.coordinates?.length > 0
      );

      if (validStreets.length === 0) {
        throw new Error("No valid street data found");
      }

      const sortedStreets = [...validStreets].sort(
        (a, b) => (b.totalCases || 0) - (a.totalCases || 0)
      );
      setStreets(sortedStreets);

      const colors = {};
      sortedStreets.forEach((street, index) => {
        colors[street.streetName] = STREET_COLORS[index % STREET_COLORS.length];
      });
      setStreetColors(colors);

      const pieChartData = sortedStreets.slice(0, 8).map((street, index) => ({
        name:
          street.streetName.length > 15
            ? `${street.streetName.substring(0, 12)}...`
            : street.streetName,
        fullName: street.streetName,
        value: street.totalCases,
        color: STREET_COLORS[index % STREET_COLORS.length],
      }));
      setPieData(pieChartData);

      setUseAdvancedMarkers(!!import.meta.env.VITE_GOOGLE_MAPS_MAP_ID);
    } catch (err) {
      console.error("Failed to fetch street data:", err);
      setError(err.message);
      setStreets([]);
      setPieData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue / 100);
  };
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  const renderDateFilters = () => {
    return (
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Year"
              sx={{
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth || ""}
              onChange={(e) => handleMonthChange(e.target.value || null)}
              label="Month"
              sx={{
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  const renderMarker = (street, index) => {
    const position = {
      lat: street.pointLocation.latitude,
      lng: street.pointLocation.longitude,
    };

    return (
      <Marker
        key={`${street.streetName}-${index}`}
        position={position}
        title={`${street.streetName}: ${street.totalCases} cases`}
        options={{
          icon: {
            path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
            fillColor: streetColors[street.streetName] || "#FF0000",
            fillOpacity: opacity,
            strokeWeight: 0,
            scale: 0.8,
          },
        }}
      />
    );
  };

  if (loading) return <div>Loading street data...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%", position: "relative" }}>
        <Map
          defaultCenter={{ lat: 14.5095, lng: 121.038 }}
          defaultZoom={15}
          mapId={
            useAdvancedMarkers
              ? import.meta.env.VITE_GOOGLE_MAPS_MAP_ID
              : undefined
          }
        >
          <StreetPolylines
            streets={streets}
            streetColors={streetColors}
            opacity={opacity}
          />
          {streets.map((street, index) => renderMarker(street, index))}
        </Map>

        <ControlsContainer>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Filter by Date
          </Typography>
          {renderDateFilters()}
        </ControlsContainer>

        {/* Legend at bottom right */}
        <ColorLegend>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Top Streets by Occupancy
            {selectedMonth &&
              ` (${new Date(selectedYear, selectedMonth - 1).toLocaleString(
                "default",
                { month: "long" }
              )} ${selectedYear})`}
          </Typography>

          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Line Opacity: {Math.round(opacity * 100)}%
            </Typography>
            <Slider
              value={opacity * 100}
              onChange={handleOpacityChange}
              aria-labelledby="opacity-slider"
              min={10}
              max={100}
              size="small"
            />
          </Box>
        </ColorLegend>
      </div>
    </APIProvider>
  );
}

export default MostOccupiedStreet;
