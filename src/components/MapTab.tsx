// import { Tabs, rem } from '@mantine/core';
// // import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
// import CesiumMap from './CesiumMap';
// import MapboxView from './MapboxView';
// import MapboxView2 from './MapBoxView2';
// import PotreeView from './PotreeView';

// function MapTab() {

//   return (
//     <Tabs defaultValue="gallery">
//       <Tabs.List>
//         <Tabs.Tab value="Cesium" >
//           Cesium
//         </Tabs.Tab>
//         <Tabs.Tab value="MapboxView" >
//         MapboxView
//         </Tabs.Tab>
//         <Tabs.Tab value="PotreeView" >
//         PotreeView
//         </Tabs.Tab>
//       </Tabs.List>

//       <Tabs.Panel value="Cesium">
//        <CesiumMap/>
//       </Tabs.Panel>

//       <Tabs.Panel value="MapboxView">
//        {/* <MapboxView/> */}
//        <MapboxView2/>
//       </Tabs.Panel>

//       <Tabs.Panel value="PotreeView">
//         <PotreeView/>
//       </Tabs.Panel>
//     </Tabs>
//   );
// }

// export default MapTab;

// import React from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

// import PotreeViewer from './PotreeView';
// import MapboxView from './MapboxView';
// import CesiumMap from './CesiumMap';

// const MapTab: React.FC = () => {
//   return (
//     <div className="fullscreen-container">
//       <Tabs className="react-tabs">
//         <TabList className="react-tabs__tab-list">
//         <Tab className="react-tabs__tab">Cesium GL</Tab>
//           <Tab className="react-tabs__tab">Potree Viewer</Tab>
//           <Tab className="react-tabs__tab">Mapbox GL</Tab>
          
//         </TabList>



//         <TabPanel className="react-tabs__tab-panel">
//           <div className="fullscreen-container">
//             <CesiumMap />
//           </div>
//         </TabPanel>
//         <TabPanel className="react-tabs__tab-panel">
//           <div className="fullscreen-container">
//             <PotreeViewer />
//           </div>
//         </TabPanel>

//         <TabPanel className="react-tabs__tab-panel">
//           <div className="fullscreen-container">
//             <MapboxView />
//           </div>
//         </TabPanel>
//       </Tabs>
//     </div>
//   );
// };

// export default MapTab;


import React, { lazy, Suspense, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MapboxView from './MapboxView';
import CesiumMap from './CesiumMap';

// Lazy load PotreeViewer
const PotreeViewer = lazy(() => import('./PotreeView'));

const MapTab: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle tab change
  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    if (index === 1) {
      // Trigger Potree resize or re-render when activated
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  };

  return (
    <div className="fullscreen-container">
      <Tabs
        className="react-tabs"
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      >
        <TabList className="react-tabs__tab-list">
          <Tab className="react-tabs__tab">Cesium GL</Tab>
          <Tab className="react-tabs__tab">Potree Viewer</Tab>
          <Tab className="react-tabs__tab">Mapbox GL</Tab>
        </TabList>

        <TabPanel className="react-tabs__tab-panel">
          <div className="fullscreen-container">
            <CesiumMap />
          </div>
        </TabPanel>

        <TabPanel className="react-tabs__tab-panel">
          <div className="fullscreen-container">
            <Suspense fallback={<div>Loading Potree Viewer...</div>}>
              <PotreeViewer />
            </Suspense>
          </div>
        </TabPanel>

        <TabPanel className="react-tabs__tab-panel">
          <div className="fullscreen-container">
            <MapboxView />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MapTab;

