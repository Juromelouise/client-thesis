import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, Marker } from '@vis.gl/react-google-maps';
import { Slider, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import apiClient from '../../../utils/apiClient';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const ColorLegend = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  zIndex: 1,
  width: '300px',
});

const StreetPolylines = ({ streets, getColorForCases, opacity }) => {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map || !streets?.length) return;

    // Clear previous polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    // Draw new polylines
    streets.forEach(street => {
      if (street?.geometry?.coordinates) {
        const path = street.geometry.coordinates.map(coord => ({
          lat: coord[1],
          lng: coord[0]
        }));

        const polyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: getColorForCases(street.totalCases),
          strokeOpacity: opacity,
          strokeWeight: 6,
          map: map
        });
        polylinesRef.current.push(polyline);
      }
    });

    return () => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
    };
  }, [map, streets, getColorForCases, opacity]);

  return null;
};

function MostOccupiedStreet() {
  const [streets, setStreets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxCases, setMaxCases] = useState(0);
  const [opacity, setOpacity] = useState(0.7);
  const [useAdvancedMarkers, setUseAdvancedMarkers] = useState(false);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/map/street-occupied-most');
        
        if (!response?.data?.features || !Array.isArray(response.data.features)) {
          throw new Error('Invalid data structure received from API');
        }

        const validStreets = response.data.features
          .filter(street => 
            street?.pointLocation?.latitude && 
            street?.pointLocation?.longitude &&
            street?.geometry?.coordinates
          );
          
        if (validStreets.length === 0) {
          throw new Error('No valid street data found');
        }

        const sortedStreets = [...validStreets].sort((a, b) => (b.totalCases || 0) - (a.totalCases || 0));
        setStreets(sortedStreets);
        setMaxCases(sortedStreets[0]?.totalCases || 1);
        
        // Prepare pie chart data
        const pieChartData = sortedStreets.slice(0, 10).map(street => ({
          name: street.streetName,
          value: street.totalCases,
          color: getColorForCases(street.totalCases)
        }));
        setPieData(pieChartData);
        
        setUseAdvancedMarkers(!!import.meta.env.VITE_GOOGLE_MAPS_MAP_ID);
      } catch (err) {
        console.error('Failed to fetch street data:', err);
        setError(err.message);
        setStreets([]);
        setPieData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColorForCases = (cases) => {
    const ratio = (cases || 0) / (maxCases || 1);
    const hue = (1 - ratio) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue / 100);
  };

  const renderMarker = (street, index) => {
    const position = {
      lat: street.pointLocation.latitude,
      lng: street.pointLocation.longitude
    };

    const markerContent = (
      <div style={{
        backgroundColor: getColorForCases(street.totalCases),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }}>
        {street.streetName}: {street.totalCases}
      </div>
    );

    return useAdvancedMarkers ? (
      <AdvancedMarker
        key={index}
        position={position}
        title={`${street.streetName}: ${street.totalCases} cases`}
      >
        {markerContent}
      </AdvancedMarker>
    ) : (
      <Marker
        key={index}
        position={position}
        title={`${street.streetName}: ${street.totalCases} cases`}
        label={{
          text: `${street.totalCases}`,
          color: 'white',
          fontWeight: 'bold'
        }}
        options={{
          icon: {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: getColorForCases(street.totalCases),
            fillOpacity: opacity,
            strokeWeight: 0,
            scale: 0.8
          }
        }}
      />
    );
  };

  if (loading) return <div>Loading street data...</div>;
  if (error) return <div>Error loading data: {error}</div>;
  if (streets.length === 0) return <div>No street data available</div>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
        <Map
          defaultCenter={{ lat: 14.5095, lng: 121.0380 }}
          defaultZoom={15}
          mapId={useAdvancedMarkers ? import.meta.env.VITE_GOOGLE_MAPS_MAP_ID : undefined}
        >
          <StreetPolylines streets={streets} getColorForCases={getColorForCases} opacity={opacity} />
          {streets.map((street, index) => renderMarker(street, index))}
        </Map>

        <ColorLegend>
          <Typography variant="subtitle2" gutterBottom>
            Street Occupancy Distribution
          </Typography>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Typography variant="caption" display="block" gutterBottom>
            Opacity Control
          </Typography>
          <Slider
            value={opacity * 100}
            onChange={handleOpacityChange}
            aria-labelledby="opacity-slider"
            min={10}
            max={100}
            size="small"
          />
        </ColorLegend>
      </div>
    </APIProvider>
  );
}

export default MostOccupiedStreet;