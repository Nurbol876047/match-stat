import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { useRef, Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Helicopter } from '../../models/helicopter';
import { Forest } from '../../models/trees';
import { Village } from '../../models/village';
import { getHeightAt, fbm } from '../../utils/terrain';

const GlobalIndicators = ({ timeWarp, radius }: any) => {
  const timeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let animFrameId: number;

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      accumulatedTime += delta * timeWarp;
      
      if (timeRef.current) {
        timeRef.current.innerText = `${accumulatedTime.toFixed(1)} c`;
      }
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [timeWarp]);

  return (
    <>
      <div className="absolute top-4 left-4 hud-panel" style={{ padding: '8px 16px', minWidth: '150px' }}>
        <div className="flex justify-between items-center w-full">
          <span className="hud-label">Уақыт</span>
          <span className="hud-value" ref={timeRef}>0.0 c</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 hud-panel" style={{ padding: '8px 16px' }}>
        <div className="flex gap-4 items-center w-full">
          <span className="hud-label">Аймақ 1</span>
          <span className="hud-value" style={{ color: '#94a3b8', fontWeight: 'normal' }}>
            r={radius.toFixed(1)}, u=71.3, lane=-2
          </span>
        </div>
      </div>
    </>
  );
};

const MovingHelicopter = ({ 
  speed, altitude, timeWarp, 
  acceleration, rotorRPM, windSpeed, windDir, 
  radius, bankBias, oscAmp, oscFreq 
}: any) => {
  const ref = useRef<THREE.Group>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  // Refs for individual HUD values to animate them smoothly
  const rpmRef = useRef<HTMLSpanElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const flowRef = useRef<HTMLSpanElement>(null);
  const windRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  
  // Lerp targets
  const currentVals = useRef({ rpm: 0, speed: 0, alt: 0, flow: 0 });

  useFrame((_state, delta) => {
    if (!ref.current) return;
    
    // Lerp values for smooth numbers
    currentVals.current.rpm += (rotorRPM - currentVals.current.rpm) * 10 * delta;
    currentVals.current.speed += (speed - currentVals.current.speed) * 10 * delta;
    currentVals.current.alt += (altitude - currentVals.current.alt) * 10 * delta;
    
    const normalizedSpeed = (speed / 50) * acceleration * timeWarp; 
    time.current += delta * normalizedSpeed;

    const windRad = (windDir * Math.PI) / 180;
    const windOffsetX = Math.cos(windRad) * windSpeed * 0.1;
    const windOffsetZ = Math.sin(windRad) * windSpeed * 0.1;

    const hoverY = altitude + Math.sin(time.current * oscFreq) * oscAmp;

    const x = Math.sin(time.current) * radius + windOffsetX;
    const z = Math.cos(time.current) * radius + windOffsetZ;

    ref.current.position.set(x, hoverY, z);
    if (textGroupRef.current) {
      textGroupRef.current.position.set(x, hoverY + 15, z); 
    }
    
    const nextX = Math.sin(time.current + 0.1) * radius + windOffsetX;
    const nextZ = Math.cos(time.current + 0.1) * radius + windOffsetZ;
    ref.current.lookAt(nextX, hoverY, nextZ);

    ref.current.rotation.x = (speed / 200) * 0.5;
    ref.current.rotation.z = bankBias * (speed / 100);

    const targetFlow = Math.round((speed * hoverY) / 10) + windSpeed;
    currentVals.current.flow += (targetFlow - currentVals.current.flow) * 10 * delta;

    // Update individual HUD nodes directly
    if (rpmRef.current) rpmRef.current.innerText = `${Math.round(currentVals.current.rpm)}`;
    if (speedRef.current) speedRef.current.innerText = `${Math.round(currentVals.current.speed)}`;
    
    if (altRef.current) {
      const altStr = hoverY.toFixed(1);
      altRef.current.innerText = altStr;
      // Danger styling for low altitude
      if (hoverY < 5) {
        altRef.current.classList.add('critical');
      } else {
        altRef.current.classList.remove('critical');
      }
    }
    
    if (flowRef.current) flowRef.current.innerText = `${Math.round(currentVals.current.flow)}`;
    if (windRef.current) windRef.current.innerText = `${windOffsetX.toFixed(1)}, ${windOffsetZ.toFixed(1)}`;
    if (coordRef.current) coordRef.current.innerText = `${x.toFixed(0)} / ${z.toFixed(0)}`;
  });

  return (
    <>
      <group ref={ref}>
        <Helicopter isSimulator />
      </group>
      <group ref={textGroupRef}>
        <Html center zIndexRange={[100, 0]}>
          <div className="hud-panel" style={{ width: '190px', transform: 'translateY(-40px)' }}>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v7"/><path d="M12 15v7"/><path d="M22 12h-7"/><path d="M9 12H2"/></svg>
                RPM
              </span>
              <span className="hud-value" ref={rpmRef}>0</span>
            </div>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Жылдамдық
              </span>
              <span className="hud-value" ref={speedRef}>0</span>
            </div>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5l-5-3-5 3M17 19l-5 3-5-3"/></svg>
                Биіктік
              </span>
              <span className="hud-value" ref={altRef}>0</span>
            </div>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16A2 2 0 0 0 22 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M2 12h20"/></svg>
                Ағын (Flow)
              </span>
              <span className="hud-value" ref={flowRef}>0</span>
            </div>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4M18 12h4M12 2v4M12 18v4"/></svg>
                Жел әсері
              </span>
              <span className="hud-value" ref={windRef}>0, 0</span>
            </div>
            
            <div className="hud-row">
              <span className="hud-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                Коорд X/Z
              </span>
              <span className="hud-value" ref={coordRef}>0 / 0</span>
            </div>
            
          </div>
        </Html>
      </group>
    </>
  );
};

const Terrain = () => {
  const geometry = useMemo(() => {
    // 500x500 segments for infinite terrain look
    const geo = new THREE.PlaneGeometry(800, 800, 200, 200);
    const pos = geo.attributes.position;
    
    const colors = [];
    const colorObj = new THREE.Color();
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); 
      
      // IN THREE.JS: PlaneGeometry rotated by -PI/2 maps its +Y axis to the world's -Z axis!
      // We must calculate height using worldZ to match the trees/village physics.
      const worldZ = -y;
      
      const z = getHeightAt(x, worldZ);
      
      // Color variation based on height and moisture (noise)
      const noiseColor = fbm(x * 0.1, worldZ * 0.1, 2);
      
      // Organic, irregular shoreline
      const sandThreshold = (fbm(x * 0.05, worldZ * 0.05 + 50, 2) * 4) - 1.5;
      
      if (z < sandThreshold) {
        // Bright sand
        colorObj.set('#dcc296');
      } else if (z > 25) {
        // Dry alpine grass
        colorObj.set('#89997f');
      } else {
        // Deep rich forest grass
        colorObj.set('#22441f');
      }
      // Blend strong procedural noise texture into the grass
      colorObj.lerp(new THREE.Color('#4c6b39'), noiseColor * 0.75);
      
      colors.push(colorObj.r, colorObj.g, colorObj.b);
      
      pos.setZ(i, z);
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
      {/* Smooth shading for natural hills, no flatShading */}
      <meshStandardMaterial vertexColors={true} roughness={0.9} metalness={0.05} />
    </mesh>
  );
};

const RealisticMountains = () => {
  // Generate highly detailed procedural mountains on ONE side
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(180, 500, 256, 64);
    const pos = geo.attributes.position;
    const count = pos.count;
    
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const dist = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Normalized distance (0 at inner edge, 1 at outer edge)
      const nd = (dist - 180) / 320;
      
      let normalizedAngle = angle;
      if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
      
      // Center the mountains at PI/2 (which becomes negative Z in 3D space, i.e. background)
      let angleDist = Math.abs(normalizedAngle - Math.PI / 2);
      if (angleDist > Math.PI) angleDist = Math.PI * 2 - angleDist;
      
      // Fade out mountains smoothly on the sides (span about 120 degrees total)
      let angleMask = 1.0 - (angleDist / (Math.PI * 0.35));
      if (angleMask < 0) angleMask = 0;
      // Smooth the edges of the mask
      angleMask = angleMask * angleMask * (3 - 2 * angleMask);
      
      // Base mountain profile
      const profile = Math.sin(nd * Math.PI) * 1.5 * angleMask; 
      
      // Fractal noise for jagged, realistic rocky peaks
      let n = Math.sin(angle * 12 + dist * 0.05) * 1.0;
      n += Math.sin(angle * 32 - dist * 0.1) * 0.5;
      n += Math.sin(angle * 64 + dist * 0.2) * 0.25;
      n += Math.sin(angle * 128 - dist * 0.4) * 0.125;
      n += Math.sin(angle * 256 + dist * 0.8) * 0.06;
      
      // Apply noise
      let z = (profile * 60) + (n * profile * 45);
      
      // Keep it flat underwater
      if (z < -1) z = -1;
      
      // Add a slight tilt to make mountains lean away from center
      z += nd * 20 * angleMask;

      pos.setZ(i, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#3a4f40" 
        roughness={0.8} 
        metalness={0.1}
      />
    </mesh>
  );
};

export const SimulatorScene = ({ 
  speed, altitude, timeWarp, 
  acceleration, rotorRPM, windSpeed, windDir, 
  radius, bankBias, oscAmp, oscFreq 
}: any) => {
  return (
    <div className="relative w-full h-full border-r-2 border-gray-300 bg-[#f2d5a3]">
      <Canvas 
        camera={{ position: [130, 90, 150], fov: 50 }} 
        shadows="soft"
        dpr={[1, 2]} 
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#f2d5a3']} />
          {/* Pushed fog far back so scene is clear, but horizon blends */}
          <fog attach="fog" args={['#f2d5a3', 150, 750]} />
          
          <Environment preset="sunset" />
          {/* Darker ambient for richer contrast */}
          <ambientLight intensity={0.25} color="#8aa2c1" />
          {/* Brighter direct sun for intense golden hour and long shadows */}
          <directionalLight 
            position={[100, 30, -100]} 
            intensity={4} 
            color="#ffc896"
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-camera-left={-150} 
            shadow-camera-right={150} 
            shadow-camera-top={150} 
            shadow-camera-bottom={-150} 
            shadow-bias={-0.0001}
          />
          
          <OrbitControls 
            makeDefault 
            target={[0, 0, 0]} 
            minAzimuthAngle={0}             // Разрешаем смотреть с правого угла
            maxAzimuthAngle={Math.PI / 2}   // до центра
            minPolarAngle={Math.PI / 6}    
            maxPolarAngle={Math.PI / 2 - 0.1} 
            minDistance={80}               
            maxDistance={250}              
            enablePan={false}              
          />

          <MovingHelicopter 
            speed={speed} altitude={altitude} timeWarp={timeWarp}
            acceleration={acceleration} rotorRPM={rotorRPM} windSpeed={windSpeed} windDir={windDir}
            radius={radius} bankBias={bankBias} oscAmp={oscAmp} oscFreq={oscFreq}
          />

          <group position={[0, 0, 0]}>
            <Terrain />
            <Forest />
            <Village />
          </group>

          {/* Задний фон: Круговое Озеро */}
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial 
              color="#2a6f7c" 
              roughness={0.1} 
              metalness={0.8} 
              envMapIntensity={2} 
            />
          </mesh>

          {/* Кольцо Гор по краям */}
          <RealisticMountains />
        </Suspense>
      </Canvas>
      
      <GlobalIndicators timeWarp={timeWarp} radius={radius} />
    </div>
  );
};
