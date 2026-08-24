import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const Pavilion = ({ showGoldenRatio }: { showGoldenRatio: boolean }) => {
  const group = useRef<THREE.Group>(null);
  
  // Clean minimalist modern building with golden ratio proportions.
  // Base width = 4, Height = 4 / 1.618 = 2.47
  
  const w = 4;
  const h = w / 1.618; // 2.47
  const d = 2;

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Base / Floor */}
      <mesh position={[0, -h/2 - 0.1, 0]}>
        <boxGeometry args={[w + 1, 0.2, d + 1]} />
        <meshStandardMaterial color="#0a1217" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, h/2 + 0.1, 0]}>
        <boxGeometry args={[w + 0.5, 0.2, d + 0.5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>

      {/* Columns (Left, Right, Back, Front) */}
      <mesh position={[-w/2 + 0.1, 0, d/2 - 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, h]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[w/2 - 0.1, 0, d/2 - 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, h]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[-w/2 + 0.1, 0, -d/2 + 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, h]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[w/2 - 0.1, 0, -d/2 + 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, h]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>

      {/* Glass Core inside */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w * 0.7, h, d * 0.7]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.1} metalness={0.9} roughness={0} />
      </mesh>

      {/* Golden Ratio Overlay */}
      {showGoldenRatio && (
        <group position={[0, 0, d/2 + 0.1]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
            <lineBasicMaterial color="#d4af37" linewidth={2} />
          </lineSegments>
          {/* Inner Golden rectangle division */}
          <lineSegments position={[-w/2 + h/2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(h, h)]} />
            <lineBasicMaterial color="#d4af37" linewidth={1} transparent opacity={0.5} />
          </lineSegments>
          {/* HTML label */}
          <Html position={[w/2 + 0.2, h/2, 0]} className="pointer-events-none">
            <div className="text-[var(--color-accent-gold)] text-xs font-mono whitespace-nowrap bg-black/80 px-2 py-1 border border-[var(--color-accent-gold)]/50 backdrop-blur-md">
              Ratio 1 : 1.618
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
