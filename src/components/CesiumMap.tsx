


import React, { useEffect, useRef, useCallback } from 'react';
import * as Cesium from 'cesium';

interface CesiumMapProps {
  content: string;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ content }) => {
  const mapviewer = useRef<Cesium.Viewer | null>(null);

  // Define loadGeoJsonData function outside useEffect
  const loadGeoJsonData = useCallback((styleType: string) => {
    if (!mapviewer.current) return;

    const viewer = mapviewer.current;
    const geoJsonUrl = '/ne_10m_us_states.topojson'; // Replace with your GeoJSON URL

    viewer.dataSources.removeAll(); // Clear previous data sources

    if (styleType === 'default') {
      viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geoJsonUrl));
    } else if (styleType === 'basic') {
      viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(geoJsonUrl, {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          strokeWidth: 3,
        })
      );
    } else if (styleType === 'custom') {
      Cesium.Math.setRandomNumberSeed(0);

      Cesium.GeoJsonDataSource.load(geoJsonUrl)
        .then((dataSource) => {
          viewer.dataSources.add(dataSource);

          const entities = dataSource.entities.values;
          const colorHash: { [key: string]: Cesium.Color } = {};

          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const name = entity.name;

            let color = colorHash[name];
            if (!color) {
              color = Cesium.Color.fromRandom({ alpha: 1.0 });
              colorHash[name] = color;
            }

            if (entity.polygon) {
              entity.polygon.material = color;
              entity.polygon.outline = false;

              if (entity.properties && entity.properties.Population) {
                entity.polygon.extrudedHeight =
                  entity.properties.Population / 50.0;
              }
            }
          }
        })
        .catch((error) => {
          window.alert(error);
        });
    }
  }, []);

  // Define resetScene function outside useEffect
  const resetScene = useCallback(() => {
    if (!mapviewer.current) return;

    const viewer = mapviewer.current;
    viewer.dataSources.removeAll();
    viewer.camera.lookAt(
      Cesium.Cartesian3.fromDegrees(-98.0, 40.0),
      new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0)
    );
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }, []);

  useEffect(() => {
    // Set Cesium's Ion access token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjFmNWRmMy01NmY3LTQ1NmUtOGFjNi05YWM4NjBjZGJmY2MiLCJpZCI6ODczNDYsImlhdCI6MTY0ODQ2NzgyM30.8FSjWsdsgMu9yXTEQypFlKYFFu197BWytpcgzhT63Yc';

    // Initialize the Cesium Viewer
    const viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: true,
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://your-tileserver-url/{z}/{x}/{y}.png',
      }),
      baseUrl: '/node_modules/cesium/Build/Cesium/',
    });
    mapviewer.current = viewer;

    // Create an InfoBox entity with the provided content
    const infoBox = new Cesium.Entity({
      description: new Cesium.ConstantProperty(content),
    });
    viewer.selectedEntity = infoBox;

    // Initial loading with default styling
    loadGeoJsonData('default');

    // Clean up on component unmount
    return () => {
      if (mapviewer.current) {
        mapviewer.current.destroy();
        mapviewer.current = null;
      }
    };
  }, [content, loadGeoJsonData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '93vh' }}>
      <div id="cesiumContainer" style={{ width: '100%', height: '100%' }}></div>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button onClick={() => loadGeoJsonData('default')}>Default Styling</button>
        <button onClick={() => loadGeoJsonData('basic')}>Basic Styling</button>
        <button onClick={() => loadGeoJsonData('custom')}>3D Modeling</button>
        <button onClick={resetScene}>Reset</button>
      </div>
    </div>
  );
};

export default CesiumMap;





