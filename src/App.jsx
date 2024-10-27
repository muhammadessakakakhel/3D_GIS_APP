import { useState } from 'react'
import FirstScene from './components/firstScene'
import RotatingGlobe from './components/RotatingGlobe'
// import CesiumMap from './components/CesiumMap'
import '@mantine/core/styles/global.css';
import '@mantine/core/styles/Tabs.css';
import { createTheme, MantineProvider } from '@mantine/core';
import MapTab from './components/MapTab';




import './App.css'

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

function App() {
  

  return (
    <>
     <MantineProvider theme={theme}>
      <MapTab/>
     {/* <CesiumMap /> */}
    </MantineProvider>
    
   
     
    </>
  )
}

export default App
