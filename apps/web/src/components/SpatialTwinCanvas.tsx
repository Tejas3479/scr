'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { motion } from 'framer-motion'
import { Activity, Shield, Cpu, RefreshCw } from 'lucide-react'
import { playSound } from '@/services/sound'

// Custom GLSL Shader for the animated, glowing soil nutrient heatmap
const HeatmapShader = {
  vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      
      // Topographical wave deformation (simulate hills/valleys)
      vec3 newPosition = position;
      float elevation = sin(position.x * 2.0 + uTime * 0.5) * cos(position.y * 2.0 + uTime * 0.5) * 0.15;
      newPosition.z += elevation;
      
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uBaseGlow;
    uniform vec3 uAlertGlow;
    uniform float uHeatmapIntensity;

    void main() {
      // Create animated pulsing matrix lines
      float gridX = step(0.97, fract(vUv.x * 30.0 + uTime * 0.1));
      float gridY = step(0.97, fract(vUv.y * 30.0 + uTime * 0.15));
      float gridLine = max(gridX, gridY);

      // Interpolate colors based on terrain elevation and active intensity
      vec3 color = mix(uBaseGlow, uAlertGlow, (vElevation + 0.15) * 3.3 * uHeatmapIntensity);
      
      // Inject scanning matrix green/cyan line highlights
      color += vec3(0.0, 0.8, 1.0) * gridLine * 0.45;
      
      // Soft alpha drop at borders for smooth integration
      float edgeAlpha = sin(vUv.x * 3.14159) * sin(vUv.y * 3.14159);
      
      gl_FragColor = vec4(color, (0.4 + gridLine * 0.3) * edgeAlpha);
    }
  `
}

export default function SpatialTwinCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSensor, setSelectedSensor] = useState<any>(null)
  const [heatmapMode, setHeatmapMode] = useState<'moisture' | 'ph' | 'nitrogen'>('moisture')
  const shaderMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  // Reactive updates for 3D Shader Heatmap Colors
  useEffect(() => {
    if (!shaderMaterialRef.current) return
    
    const colors = {
      moisture: { base: new THREE.Color(0x0055ff), alert: new THREE.Color(0x00f0ff) },
      ph: { base: new THREE.Color(0x9900ff), alert: new THREE.Color(0xff00ff) },
      nitrogen: { base: new THREE.Color(0x00aa00), alert: new THREE.Color(0x00ff41) }
    }
    
    const selected = colors[heatmapMode]
    
    // Smoothly update the shader colors
    shaderMaterialRef.current.uniforms.uBaseGlow.value = selected.base
    shaderMaterialRef.current.uniforms.uAlertGlow.value = selected.alert
  }, [heatmapMode])

  useEffect(() => {
    if (!mountRef.current) return

    // --- Scene Setup ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050810, 0.08)

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    camera.position.set(4, 3, 5)

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2.1 // Prevent going below ground

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1.5)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    // --- Ground Mesh with Heatmap Shader ---
    const groundGeometry = new THREE.PlaneGeometry(6, 6, 64, 64)
    
    // Cyber-Agri glowing colors
    const colors = {
      moisture: { base: new THREE.Color(0x0055ff), alert: new THREE.Color(0x00f0ff) },
      ph: { base: new THREE.Color(0x9900ff), alert: new THREE.Color(0xff00ff) },
      nitrogen: { base: new THREE.Color(0x00aa00), alert: new THREE.Color(0x00ff41) }
    }

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: HeatmapShader.vertexShader,
      fragmentShader: HeatmapShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0.0 },
        uBaseGlow: { value: colors.moisture.base },
        uAlertGlow: { value: colors.moisture.alert },
        uHeatmapIntensity: { value: 0.85 }
      }
    })
    shaderMaterialRef.current = shaderMaterial

    const groundMesh = new THREE.Mesh(groundGeometry, shaderMaterial)
    groundMesh.rotation.x = -Math.PI / 2
    scene.add(groundMesh)

    // --- Glowing Wireframe Grid Overlay ---
    const gridHelper = new THREE.GridHelper(6, 30, 0x00ff41, 0x00f0ff / 2)
    gridHelper.position.y = -0.01
    // Apply slight transparency
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m: any) => {
        m.transparent = true
        m.opacity = 0.15
      })
    } else {
      gridHelper.material.transparent = true
      gridHelper.material.opacity = 0.15
    }
    scene.add(gridHelper)

    // --- Holographic Crop Wireframe Mesh Models ---
    const cropsGroup = new THREE.Group()
    const cropGeometry = new THREE.ConeGeometry(0.12, 0.4, 4)
    const cropMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    })

    // Populate rows
    for (let x = -2.2; x <= 2.2; x += 0.8) {
      for (let z = -2.2; z <= 2.2; z += 0.8) {
        const crop = new THREE.Mesh(cropGeometry, cropMaterial)
        crop.position.set(x, 0.2 + Math.sin(x * z) * 0.05, z)
        cropsGroup.add(crop)
      }
    }
    scene.add(cropsGroup)

    // --- Floating Sensor Beacons ---
    const sensorsGroup = new THREE.Group()
    const beaconGeometry = new THREE.SphereGeometry(0.08, 16, 16)
    const beaconsData = [
      { id: '1', name: 'Alpha Probe', type: 'Moisture', pos: [-1.5, 0.3, 1.2], val: '64%' },
      { id: '2', name: 'Gamma Probe', type: 'pH Sensor', pos: [1.8, 0.3, -1.0], val: '6.8 pH' },
      { id: '3', name: 'Zeta Bio-probe', type: 'Nitrogen Sensor', pos: [0.2, 0.3, 0.8], val: '92 ppm' }
    ]

    beaconsData.forEach((data) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.9
      })
      const beacon = new THREE.Mesh(beaconGeometry, material)
      beacon.position.set(data.pos[0], data.pos[1], data.pos[2])
      
      // Floating animation offset
      beacon.userData = { ...data, baseHeight: data.pos[1] }
      sensorsGroup.add(beacon)
    })
    scene.add(sensorsGroup)

    // --- Autonomous Drone Flight Path ---
    const pathPoints = [
      new THREE.Vector3(-2, 0.8, -2),
      new THREE.Vector3(-1, 1.2, 0),
      new THREE.Vector3(1, 1.0, 1.5),
      new THREE.Vector3(2, 0.7, -1),
      new THREE.Vector3(-2, 0.8, -2) // Loop
    ]
    const curve = new THREE.CatmullRomCurve3(pathPoints)
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50))
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 })
    const flightPath = new THREE.Line(pathGeometry, pathMaterial)
    scene.add(flightPath)

    // --- Holographic Drone ---
    const droneGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.15)
    const droneMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
    const drone = new THREE.Mesh(droneGeometry, droneMaterial)
    scene.add(drone)

    // --- Raycaster for Beacons Selection ---
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handlePointerDown = (event: MouseEvent) => {
      if (!mountRef.current) return
      
      // Calculate normalized coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(sensorsGroup.children)

      if (intersects.length > 0) {
        const beacon = intersects[0].object as THREE.Mesh
        setSelectedSensor(beacon.userData)
        // Set color highlight
        if (Array.isArray(beacon.material)) {
          (beacon.material[0] as THREE.MeshBasicMaterial).color.setHex(0xff00ff)
        } else {
          (beacon.material as THREE.MeshBasicMaterial).color.setHex(0xff00ff)
        }
      } else {
        // Reset colors
        sensorsGroup.children.forEach((c: any) => c.material.color.setHex(0x00f0ff))
        setSelectedSensor(null)
      }
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)

    // --- Animation Loop ---
    const clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      const elapsed = clock.getElapsedTime()

      // 1. Update ground heatmap shader
      shaderMaterial.uniforms.uTime.value = elapsed

      // 2. Float and pulse sensors
      sensorsGroup.children.forEach((c: any) => {
        c.position.y = c.userData.baseHeight + Math.sin(elapsed * 2.5 + c.userData.id) * 0.06
        c.rotation.y += 0.015
      })

      // 3. Rotate holographic crops
      cropsGroup.children.forEach((crop) => {
        crop.rotation.y += 0.005
      })

      // 4. Update drone coordinates along path
      const loopTime = 12 // 12 seconds per loop
      const progress = (elapsed % loopTime) / loopTime
      const position = curve.getPointAt(progress)
      drone.position.copy(position)
      drone.rotation.y = elapsed * 3

      controls.update()
      renderer.render(scene, camera)
    }

    animate()
    setLoading(false)

    // --- Resize Handler ---
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // --- Clean Up ---
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement && mountRef.current) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
        mountRef.current.removeChild(renderer.domElement)
      }
      groundGeometry.dispose()
      shaderMaterial.dispose()
      cropGeometry.dispose()
      cropMaterial.dispose()
      beaconGeometry.dispose()
      pathGeometry.dispose()
      pathMaterial.dispose()
      droneGeometry.dispose()
      droneMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-[500px] bg-cyber-darker border border-neon-cyan/30 rounded-2xl overflow-hidden glass-panel hover:border-neon-cyan/60 transition-all duration-300">
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-darker/80 z-20">
          <div className="text-center">
            <RefreshCw className="w-10 h-10 text-neon-cyan animate-spin mx-auto mb-3" />
            <p className="text-neon-cyan text-sm tech-mono">HYPER-DIMENSIONAL DIGITAL TWIN INTEGRATION...</p>
          </div>
        </div>
      )}

      {/* Visual Overlay: HUD Control Deck */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onMouseEnter={playSound.hover}
            onClick={() => { playSound.tick(); setHeatmapMode('moisture'); }}
            className={`px-3 py-1 text-xs tech-mono rounded-lg border transition-all ${
              heatmapMode === 'moisture'
                ? 'bg-blue-600/30 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-800/40 border-neon-cyan/20 text-neon-cyan/60 hover:border-neon-cyan/40'
            }`}
          >
            💧 Moisture Index
          </button>
          <button
            onMouseEnter={playSound.hover}
            onClick={() => { playSound.tick(); setHeatmapMode('ph'); }}
            className={`px-3 py-1 text-xs tech-mono rounded-lg border transition-all ${
              heatmapMode === 'ph'
                ? 'bg-purple-600/30 border-purple-500 text-purple-400 font-bold'
                : 'bg-slate-800/40 border-neon-cyan/20 text-neon-cyan/60 hover:border-neon-cyan/40'
            }`}
          >
            🧪 Soil pH
          </button>
          <button
            onMouseEnter={playSound.hover}
            onClick={() => { playSound.tick(); setHeatmapMode('nitrogen'); }}
            className={`px-3 py-1 text-xs tech-mono rounded-lg border transition-all ${
              heatmapMode === 'nitrogen'
                ? 'bg-green-600/30 border-green-500 text-neon-green/90'
                : 'bg-slate-800/40 border-neon-cyan/20 text-neon-cyan/60 hover:border-neon-cyan/40'
            }`}
          >
            🌿 Nitrogen
          </button>
        </div>
      </div>

      {/* Visual Overlay: Floating Sensor Stats HUD */}
      {selectedSensor && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 z-10 bg-cyber-dark/80 border border-neon-cyan/40 rounded-xl p-4 max-w-xs backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-neon-cyan animate-pulse" />
            <h4 className="text-neon-cyan text-sm font-bold tech-mono">{selectedSensor.name}</h4>
          </div>
          <p className="text-emerald-300/80 text-xs mb-1 font-sans">Type: {selectedSensor.type}</p>
          <p className="text-emerald-300 text-xs tech-mono font-bold">Latest Read: {selectedSensor.val}</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-neon-cyan h-full w-4/5 animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Visual Overlay: Drone Flight HUD Telemetry */}
      <div className="absolute top-4 right-4 z-10 bg-cyber-dark/80 border border-neon-purple/40 rounded-xl p-4 backdrop-blur-md tech-mono text-right">
        <div className="flex items-center gap-2 justify-end mb-1">
          <span className="text-neon-purple text-xs font-bold uppercase animate-pulse">Robotic Fleet Syncing</span>
          <Activity className="w-4 h-4 text-neon-purple" />
        </div>
        <p className="text-emerald-300/60 text-[10px]">Autopilot: Path Vector 49A</p>
        <p className="text-neon-purple text-xs font-bold mt-1">Drone battery: 88.2%</p>
      </div>

      {/* Interactive Glare Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

      {/* Solarpunk Bio-Shield Label */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-green-950/40 border border-neon-green/30 rounded-lg px-2.5 py-1 backdrop-blur-sm">
        <Shield className="w-3.5 h-3.5 text-neon-green" />
        <span className="text-[10px] text-neon-green font-bold tech-mono">BIO-SECURITY ACTIVE</span>
      </div>
    </div>
  )
}
