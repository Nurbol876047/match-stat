import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { HandTracking } from './HandTracking';

interface Props {
  rotorRPM: number;
  bankBias?: number;
}

const OrbitingFormulas = ({ rotorRPM }: Props) => {
  const ringsRef = useRef<(THREE.Group | null)[]>([]);
  
  useFrame((state, delta) => {
    const baseSpeed = 0.3 + (rotorRPM / 1500); 
    
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      // Alternate direction and slightly different speeds per ring
      const speed = baseSpeed * (1 + index * 0.25) * (index % 2 === 0 ? 1 : -1);
      ring.rotation.y += speed * delta;
      
      // Wobble effect
      ring.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.15;
      ring.rotation.z = Math.cos(state.clock.elapsedTime * 0.3 - index) * 0.15;
    });
  });

  const allFormulas = [
    // Ring 0 (Kinematics)
    ["ω = 2π·N / 60", "θ(t) = θ_0 + ω·t", "v = ω·r", "a_c = ω²·r", "T = 2π/ω"],
    // Ring 1 (Dynamics & Energy)
    ["F = m·ω²·r", "L = I·ω", "E = ½Iω²", "τ = I·α", "P = τ·ω"],
    // Ring 2 (Aerodynamics Lift/Drag)
    ["L = ½ρv²A·Cl", "D = ½ρv²A·Cd", "Re = ρvL/μ", "M = v/a", "a = √(γRT)"],
    // Ring 3 (Advanced Fluid Dynamics)
    ["p + ½ρv² = const", "∇ × v = ζ", "Γ = ∮ v·dl", "L = ρvΓ", "F_t = T - W"]
  ];
  
  const colors = ["#b45309", "#1d4ed8", "#047857", "#6d28d9"]; // gold, blue, emerald, purple
  const radii = [3.2, 4.0, 4.8, 5.6];
  const heights = [0.3, -0.3, 0.7, -0.7];
  const tilts = [0, 0.2, -0.15, 0.3];

  return (
    <>
      {allFormulas.map((formulas, ringIndex) => (
        <group 
          key={`ringGroup-${ringIndex}`}
          ref={el => { ringsRef.current[ringIndex] = el; }} 
          position={[0, heights[ringIndex], 0]} 
          rotation={[tilts[ringIndex], 0, -tilts[ringIndex]]}
        >
          {formulas.map((formula, i) => {
            const angle = (i / formulas.length) * Math.PI * 2;
            const radius = radii[ringIndex];
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <Text
                key={`f-${ringIndex}-${i}`}
                position={[x, 0, z]}
                rotation={[0, -angle - Math.PI / 2, 0]}
                fontSize={0.24}
                color={colors[ringIndex]}
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.8}
              >
                {formula}
              </Text>
            );
          })}
        </group>
      ))}
    </>
  );
};

interface HelicopterProps {
  rotorRPM: number;
  bankBias?: number; // legacy, can ignore
  pitchBias?: number; // up/down
  yawBias?: number; // left/right
  altitudeOffset?: number;
  sideOffset?: number;
}

const HelicopterModel = ({ rotorRPM, bankBias = 0, pitchBias = 0, yawBias = 0, altitudeOffset = 0, sideOffset = 0 }: HelicopterProps) => {
  const mainRotorRef = useRef<THREE.Group>(null);
  const tailRotorRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // 1. Rotor spinning
    const omega = (2 * Math.PI * rotorRPM) / 60;
    if (mainRotorRef.current) mainRotorRef.current.rotation.y -= omega * delta;
    if (tailRotorRef.current) tailRotorRef.current.rotation.x -= omega * delta;

    // 2. Smooth Interpolation (Lerp) for position and rotation
    if (bodyRef.current) {
      const lerpSpeed = 15.0; // Быстрый и четкий отклик
      
      // Position
      bodyRef.current.position.x += (sideOffset - bodyRef.current.position.x) * lerpSpeed * delta;
      bodyRef.current.position.y += (altitudeOffset - bodyRef.current.position.y) * lerpSpeed * delta;
      
      // Shortest path Angular Lerp to avoid 180-degree jumps
      const lerpAngle = (current: number, target: number, speed: number, dt: number) => {
        let deltaAngle = target - current;
        // Normalize delta to [-PI, PI]
        deltaAngle = ((deltaAngle + Math.PI) % (Math.PI * 2)) - Math.PI;
        // In JS, modulo of negative number is negative, so we need extra step if we want strict positive modulo,
        // but `(a % b + b) % b` is the safe way:
        deltaAngle = ((deltaAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        
        return current + deltaAngle * speed * dt;
      };

      bodyRef.current.rotation.x = lerpAngle(bodyRef.current.rotation.x, pitchBias, lerpSpeed, delta);
      bodyRef.current.rotation.y = lerpAngle(bodyRef.current.rotation.y, -yawBias, lerpSpeed, delta);
      
      // Optional: slight roll based on yaw to make the turn look natural
      const targetBank = yawBias * 0.3 + bankBias;
      bodyRef.current.rotation.z = lerpAngle(bodyRef.current.rotation.z, -targetBank, lerpSpeed, delta);
    }
  });

  return (
    <group scale={0.8} ref={bodyRef}>
      {/* Фюзеляж (Fuselage) */}
      <mesh position={[0, 0, 0]} scale={[0.8, 1, 2.5]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Стекло кабины (Glass Cockpit) */}
      <mesh position={[0, 0.2, 1.2]} scale={[0.65, 0.7, 1.1]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.9} envMapIntensity={2} />
      </mesh>

      {/* Хвостовая балка (Tail boom) */}
      <mesh position={[0, 0.2, -3]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.35, 3.5, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Вертикальный киль (Vertical Stabilizer) */}
      <mesh position={[0, 0.6, -4.5]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 1.2, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Горизонтальный стабилизатор (Horizontal Stabilizer) */}
      <mesh position={[0, 0.3, -4.2]} castShadow>
        <boxGeometry args={[1.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Шасси / Лыжи (Skids) */}
      <group position={[0, -1.1, 0.5]}>
        {/* Left Skid */}
        <mesh position={[-0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Skid */}
        <mesh position={[0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Struts */}
        <mesh position={[-0.5, 0.55, 1]} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.5, 0.55, 1]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.5, 0.55, -1]} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.5, 0.55, -1]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Мачта несущего винта (Main Rotor Mast) */}
      <mesh position={[0, 1.1, 0.2]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      
      {/* Втулка несущего винта (Main Rotor Hub) */}
      <mesh position={[0, 1.35, 0.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Несущий винт (Main Rotor Blades) */}
      <group position={[0, 1.35, 0.2]} ref={mainRotorRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 9]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 9]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Втулка хвостового винта (Tail Rotor Hub) */}
      <mesh position={[0.1, 0.8, -4.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Хвостовой винт (Tail Rotor Blades) */}
      <group position={[0.15, 0.8, -4.6]} ref={tailRotorRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 1.4, 0.15]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 1.4, 0.15]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export const HelicopterRotorView = ({ rotorRPM: propRotorRPM, bankBias: propBankBias = 0 }: Props) => {
  const [gesture, setGesture] = useState<any>(null);

  const isTracking = gesture && gesture.wingAmplitude > 0;
  
  const currentRotorRPM = isTracking ? 100 + gesture.wingAmplitude * 700 : propRotorRPM;
  const currentYawBias = isTracking ? gesture.yaw : 0; // Left/Right steer
  const currentPitchBias = isTracking ? gesture.pitch : 0; // Forward/Back tilt
  const currentAltOffset = isTracking ? (0.5 - gesture.position.y) * 4 : 0; // Up/Down movement
  const currentSideOffset = isTracking ? (gesture.position.x - 0.5) * 4 : 0; // Left/Right movement

  const omegaRad = (2 * Math.PI * currentRotorRPM) / 60;
  const omegaRev = currentRotorRPM / 60;

  return (
    <div className="h-[350px] md:h-[450px] w-full border-t border-white/10 flex flex-col md:flex-row relative bg-[#040608] shrink-0 z-20 shadow-2xl">
      {/* 3D Scene */}
      <div className="w-full md:w-[60%] h-[150px] md:h-full relative border-b md:border-b-0 md:border-r border-white/10">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5, 2.5, 6]} />
          <OrbitControls enablePan={false} enableZoom={true} target={[0, 0, 0]} maxPolarAngle={Math.PI / 2 + 0.1} />
          
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow shadow-bias={-0.0001} />
          
          {/* Среда для красивых отражений металла и стекла */}
          <Environment preset="city" />
          
          {/* Контактные тени на земле для реализма */}
          <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={15} blur={1.5} far={4} />

          <group rotation={[0, -Math.PI / 6, 0]}>
            <HelicopterModel 
              rotorRPM={currentRotorRPM} 
              bankBias={propBankBias} 
              pitchBias={currentPitchBias}
              yawBias={currentYawBias}
              altitudeOffset={currentAltOffset}
              sideOffset={currentSideOffset}
            />
            <OrbitingFormulas rotorRPM={currentRotorRPM} />
          </group>
        </Canvas>
        

      </div>

      {/* UI Panel */}
      <div className="w-full md:w-[40%] h-full p-4 md:p-6 overflow-y-auto text-white">
        <h3 className="mb-4 uppercase tracking-[0.15em] text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Физика айналуы (Вращение)
        </h3>
        
        <HandTracking onGestureUpdate={setGesture} className="mb-6" />
        
        <div className="space-y-4">
          <div className="bg-white/5 p-3 rounded border border-white/10">
            <p className="text-[10px] text-white/50 mb-1 uppercase tracking-widest">Формула (Угловая скорость)</p>
            <p className="font-mono text-sm">ω = 2π·N / 60</p>
          </div>

          <div className="bg-white/5 p-3 rounded border border-white/10">
            <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">Ағымдағы мәндер</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-xs text-white/70">N (RPM):</span>
                <span className="font-mono text-sm text-[var(--color-accent-gold, #fbbf24)]">{Math.round(currentRotorRPM)} айн/м</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-xs text-white/70">ω (Угловая скорость):</span>
                <span className="font-mono text-sm text-blue-400">{omegaRad.toFixed(2)} рад/с</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/70">Жиілік (Обороты):</span>
                <span className="font-mono text-sm text-green-400">{omegaRev.toFixed(2)} об/с</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
