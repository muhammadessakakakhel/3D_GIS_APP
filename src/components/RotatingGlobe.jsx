import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import globe_ from '../assets/globe2.jpg'

const RotatingGlobe = () => {

    const containerRef = useRef();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();


    useEffect(() => {
        // Set up Three.js scene
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a sphere (globe)
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    // geometry.scale(-1, 1, 1); // Invert the geometry to make the texture display correctly
    const texture = new THREE.TextureLoader().load(globe_); // Replace with your texture
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight);



    // Position the camera
    camera.position.z = 3;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the globe
      globe.rotation.y += 0.005; //speed

      renderer.render(scene, camera);
    };

    animate();

 
      return () => {
        renderer.dispose();
        
      }
    }, [])
    
  return (
     <div ref={containerRef}></div>
  )
}

export default RotatingGlobe