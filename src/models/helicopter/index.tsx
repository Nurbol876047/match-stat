import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Helicopter = ({ isSimulator = false }: { isSimulator?: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Mesh>(null);
  const tailRotor = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (rotor.current) rotor.current.rotation.y += 0.4;
    if (tailRotor.current) tailRotor.current.rotation.x += 0.5;
  });

  return (
    <group ref={group} scale={isSimulator ? 0.8 : 0.15}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 2, 8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Cockpit Window */}
      <mesh position={[0, 0.2, 1]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.48, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={1} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, 0, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.3, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Main Rotor */}
      <group position={[0, 0.8, 0]}>
        <mesh position={[0, -0.2, 0]}>
           <cylinderGeometry args={[0.05, 0.05, 0.4]} />
           <meshStandardMaterial color="#333" />
        </mesh>
        <mesh ref={rotor}>
          <boxGeometry args={[6, 0.02, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Tail Rotor */}
      <group position={[0.2, 0.2, -2.5]}>
        <mesh ref={tailRotor} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.5, 0.02, 0.1]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
      
      {/* Skids */}
      <group position={[0, -0.6, 0]}>
        <mesh position={[-0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.5]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.5]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        {/* Struts */}
        <mesh position={[-0.4, 0.3, 0.5]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0.4, 0.3, 0.5]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[-0.4, 0.3, -0.5]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0.4, 0.3, -0.5]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </group>
    </group>
  );
};
