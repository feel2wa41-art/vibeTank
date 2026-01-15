import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated Tank Model (simplified geometric)
function Tank({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const turretRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Tank bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    if (turretRef.current) {
      // Turret rotation
      turretRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Tank Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 1.2]} />
        <meshStandardMaterial color="#4a5d23" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Tank Tracks */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.4]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.4]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Turret */}
      <group ref={turretRef} position={[0, 0.7, 0]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
          <meshStandardMaterial color="#3d4d1f" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Barrel */}
        <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// Explosion Particles
function Explosions() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  // Use useMemo to initialize particle data once
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Orange/red colors
      col[i * 3] = 0.8 + Math.random() * 0.2;
      col[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      col[i * 3 + 2] = 0;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += 0.02;
        if (posArray[i * 3 + 1] > 5) {
          posArray[i * 3 + 1] = 0;
          posArray[i * 3] = (Math.random() - 0.5) * 20;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Smoke particles
function Smoke() {
  const smokeRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  // Use useMemo to initialize particle positions once
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (smokeRef.current) {
      const posArray = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += 0.01;
        posArray[i * 3] += (Math.random() - 0.5) * 0.02;
        if (posArray[i * 3 + 1] > 4) {
          posArray[i * 3 + 1] = 0;
        }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={smokeRef} geometry={geometry}>
      <pointsMaterial
        size={0.4}
        color="#555555"
        transparent
        opacity={0.3}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

// Moving camera
function CameraAnimation() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useFrame((state) => {
    const cam = cameraRef.current;
    cam.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 3;
    cam.position.z = 8 + Math.cos(state.clock.elapsedTime * 0.15) * 2;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

// Ground with grid
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#1a2810"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Muzzle flash effect
function MuzzleFlash() {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(Math.random() > 0.7 ? 50 : 0);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <pointLight
      position={[0, 1, 2]}
      color="#ff6600"
      intensity={intensity}
      distance={10}
    />
  );
}

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullText = 'MISSION BRIEFING INITIALIZED...';

  // Handle Enter Mission button click - play video
  const handleEnterClick = () => {
    setShowVideo(true);
    // Small delay to ensure video element is mounted
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 100);
  };

  // Handle video end - proceed to main content
  const handleVideoEnd = () => {
    onEnter();
  };

  // Handle skip video
  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onEnter();
  };

  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Trigger typing when load progress reaches 50%
  useEffect(() => {
    if (loadProgress >= 50 && !startTyping) {
      setStartTyping(true);
    }
  }, [loadProgress, startTyping]);

  // Typing effect
  useEffect(() => {
    if (!startTyping) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [startTyping, fullText]);

  // Video intro screen
  if (showVideo) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onEnded={handleVideoEnd}
          playsInline
        >
          <source src="/intro/introtank.mp4" type="video/mp4" />
        </video>

        {/* Skip button */}
        <button
          onClick={handleSkipVideo}
          className="absolute bottom-8 right-8 px-6 py-2 bg-military-900/80 border border-military-500/50 text-military-400 hover:text-military-300 hover:bg-military-800/80 transition-all duration-300 mono-font text-sm tracking-wider"
        >
          SKIP →
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-military-950">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0f05', 5, 30]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 10, 5]} intensity={1} color="#8bc34a" />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff4400" />

          <CameraAnimation />
          <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />

          <Tank position={[0, 0, 0]} />
          <Tank position={[-4, 0, -3]} />
          <Tank position={[4, 0, -2]} />

          <Explosions />
          <Smoke />
          <MuzzleFlash />
          <Ground />
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] opacity-50" />

        {/* Top HUD */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <div className="mono-font text-military-500 text-xs">
            <div>SYS.STATUS: ONLINE</div>
            <div>LAT: 37.5665° N</div>
            <div>LON: 126.9780° E</div>
          </div>
          <div className="mono-font text-military-500 text-xs text-right">
            <div>{new Date().toLocaleDateString()}</div>
            <div className="text-military-400">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="military-font text-6xl md:text-8xl text-military-500 mb-4 tracking-wider animate-pulse">
            TANK
          </h1>
          <p className="mono-font text-military-300 text-lg mb-8">
            PROJECT MANAGER PORTFOLIO 2025
          </p>

          {/* Typing text */}
          <div className="h-8 mb-8">
            <p className="mono-font text-military-400 text-sm">
              {typedText}
              <span className="animate-pulse">_</span>
            </p>
          </div>

          {/* Loading bar */}
          {!isLoaded && (
            <div className="w-64 md:w-96 mb-8">
              <div className="flex justify-between mb-2">
                <span className="mono-font text-xs text-military-500">LOADING ASSETS</span>
                <span className="mono-font text-xs text-military-500">{Math.min(100, Math.floor(loadProgress))}%</span>
              </div>
              <div className="h-2 bg-military-900 border border-military-700 overflow-hidden">
                <div
                  className="h-full bg-military-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, loadProgress)}%` }}
                />
              </div>
            </div>
          )}

          {/* Enter button */}
          {showButton && (
            <button
              onClick={handleEnterClick}
              className="pointer-events-auto group relative px-12 py-4 border-2 border-military-500 bg-military-950/80 hover:bg-military-500 transition-all duration-300"
            >
              <span className="military-font text-2xl text-military-500 group-hover:text-military-950 tracking-widest">
                ENTER MISSION
              </span>
              <div className="absolute -inset-1 border border-military-500/50 pointer-events-none" />
              <div className="absolute -inset-2 border border-military-500/25 pointer-events-none" />
            </button>
          )}
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex justify-center gap-8">
            {['SYSTEMS', 'WEAPONS', 'COMMS', 'NAV'].map((item, i) => (
              <div key={item} className="text-center">
                <div className={`w-3 h-3 mx-auto mb-1 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-military-500'} animate-pulse`} />
                <span className="mono-font text-xs text-military-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-military-500" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-military-500" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-military-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-military-500" />
      </div>
    </div>
  );
}
