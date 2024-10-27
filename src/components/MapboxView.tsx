import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRlc3Nha2FrYWtoZWw5NjYiLCJhIjoiY2x2aHZyeXFtMThmODJpcGUybTU4am92bSJ9.BvyI0TitDCFSTYDcPTLdVA';

const MapboxView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [style, setStyle] = useState<string>('mapbox://styles/mapbox/satellite-streets-v12');

  const lng = -122.486052;
  const lat = 37.830348;
  const zoom = 14;

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      // Initialize the map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [lng, lat],
        zoom: zoom,
        projection: 'mercator'
      });

      // Add navigation controls to the map
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add the custom source and layer initially
      map.current.on('style.load', addAdditionalSourceAndLayer);

      // Add marker with popup
      addMarkerWithPopup();
    } else if (map.current) {
      // Set the new style and re-add sources/layers when style changes
      map.current.setStyle(style);
      map.current.once('style.load', addAdditionalSourceAndLayer);
    }
  }, [style]);

  // Function to add custom source and layer
  const addAdditionalSourceAndLayer = () => {
    if (map.current?.getSource('routeSource')) return; // Prevent duplicate source addition

    map.current?.addSource('routeSource', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [-122.48369693756104, 37.83381888486939],
            [-122.48348236083984, 37.83317489144141],
            [-122.48339653015138, 37.83270036637107],
            [-122.48356819152832, 37.832056363179625],
            [-122.48404026031496, 37.83114119107971],
            [-122.48404026031496, 37.83049717427869],
            [-122.48348236083984, 37.829920943955045],
            [-122.48356819152832, 37.82954808664175],
            [-122.48507022857666, 37.82944639795659],
            [-122.48610019683838, 37.82880236636284],
            [-122.48695850372314, 37.82931081282506],
            [-122.48700141906738, 37.83080223556934],
            [-122.48751640319824, 37.83168351665737],
            [-122.48803138732912, 37.832158048267786],
            [-122.48888969421387, 37.83297152392784],
            [-122.48987674713133, 37.83263257682617],
            [-122.49043464660643, 37.832937629287755],
            [-122.49125003814696, 37.832429207817725],
            [-122.49163627624512, 37.832564787218985],
            [-122.49223709106445, 37.83337825839438],
            [-122.49378204345702, 37.83368330777276]
          ]
        }
      }
    });

    map.current?.addLayer({
      'id': 'routeLayer',
      'type': 'line',
      'source': 'routeSource',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#33bb6a',
        'line-width': 8
      }
    });
  };

  // Function to add a marker with a popup
  const addMarkerWithPopup = () => {
    if (map.current) {
      // Create a new popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText('Hello! This is a popup.');

      // Create a new marker
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([lng, lat])
        .setPopup(popup) // Set the popup on the marker
        .addTo(map.current);
    }
  };

  // Base map options
  const basemapOptions = [
    { id: 'satellite-streets-v12', label: 'Satellite Streets' },
    { id: 'light-v11', label: 'Light' },
    { id: 'dark-v11', label: 'Dark' },
    { id: 'streets-v12', label: 'Streets' },
    { id: 'outdoors-v12', label: 'Outdoors' }
  ];

  return (
     <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          width: '100%',
        }}
      />

      {/* Base Map Toggle */} 
      <div
        id="menu"
        style={{
          position: 'absolute',
          top: 60,
          left: 10,
          background: '#efefef',
          padding: '10px',
          zIndex: 1
        }}
      >
        {basemapOptions.map((option) => (
          <label key={option.id} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="radio"
              name="rtoggle"
              value={option.id}
              checked={style.includes(option.id)}
              onChange={() => setStyle(`mapbox://styles/mapbox/${option.id}`)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapboxView;
