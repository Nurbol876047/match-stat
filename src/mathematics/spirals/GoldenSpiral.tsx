import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GoldenSpiral = ({ ratio = 1.618 }) => {
  const group = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts = [];
    const a = 0.1;
    // Logarithmic spiral math connecting to ratio
    const b = Math.log(ratio) / (Math.PI / 2);
    
    for (let i = 0; i < 400; i++) {
      const theta = i * 0.05;
      const r = a * Math.exp(b * theta);
      pts.push(new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [ratio]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = -state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group} scale={0.2}>
      <line geometry={points}>
        <lineBasicMaterial color="#d4af37" linewidth={2} transparent opacity={0.6} />
      </line>
    </group>
  );
}
