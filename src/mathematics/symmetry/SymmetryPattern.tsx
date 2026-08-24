import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SymmetryPattern = ({ order = 6 }) => {
  const group = useRef<THREE.Group>(null);
  
  // A single stylized "petal" or "leaf" half-shape
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(1, 2, 0, 4);
    shape.quadraticCurveTo(-1, 2, 0, 0);
    
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group} scale={0.5}>
      {Array.from({ length: order }).map((_, i) => {
        const angle = (i / order) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            geometry={petalGeometry} 
            rotation={[0, 0, angle]}
          >
            <meshBasicMaterial color="#2e8b57" transparent opacity={0.7} wireframe />
          </mesh>
        );
      })}
    </group>
  );
}
