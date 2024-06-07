// Ensure Three.js and WebXR Polyfill are loaded correctly
if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded');
  }
  
  // Setup WebXR
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  // Add VR button to enable VR mode
  document.body.appendChild(VRButton.createButton(renderer));
  
  // Adjust camera position
  camera.position.set(0, 0, 5);
  
  // Add ambient light to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light to the scene
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Add a green box to the scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // WebSocket setup
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onopen = () => {
    console.log('Connected to WebSocket server');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data from rvizweb:', data);
  
    // Update WebXR scene with received data
    cube.position.set(data.x, data.y, data.z);
  };
  
  ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };
  
  // Set up rendering loop
  function animate() {
    renderer.setAnimationLoop(render);
  }
  
  function render() {
    renderer.render(scene, camera);
  }
  
  animate();
  