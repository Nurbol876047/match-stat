import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Simple pseudo-random noise for terrain displacement
const noise = (x: number, z: number) => {
  return (Math.sin(x * 0.3) + Math.sin(z * 0.3)) * 2.0 + 
         (Math.sin(x * 1.5) + Math.sin(z * 1.5)) * 0.5;
};

const MountainLayer = ({ position, color, scale, resolution = 64, wireframe = false }: any) => {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(80, 80, resolution, resolution);
    geometry.rotateX(-Math.PI / 2);
    
    const posAttribute = geometry.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const z = posAttribute.getZ(i);
      
      // Distance from center for valley effect
      const dist = Math.abs(x) * 0.1;
      
      let y = noise(x * scale, z * scale) * 2;
      y += dist * 3; // raise edges to form a valley
      
      posAttribute.setY(i, y);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [scale, resolution]);

  return (
    <mesh position={position} geometry={geom} receiveShadow>
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
        metalness={0.3} 
        flatShading 
        wireframe={wireframe}
      />
    </mesh>
  );
};

export const Mountains = () => {
  const group = useRef<THREE.Group>(null);

  // useScroll removed as we are in simulator mode

  return (
    <group ref={group}>
      {/* Deep Background */}
      <MountainLayer position={[0, -5, -45]} color="#0a1217" scale={0.05} />
      {/* Mid Mountains */}
      <MountainLayer position={[0, -8, -25]} color="#102026" scale={0.1} />
      {/* Foreground / Forest Level */}
      <MountainLayer position={[0, -12, -5]} color="#16302e" scale={0.15} />
      {/* Math Wireframe Layer to hint at math underneath */}
      <MountainLayer position={[0, -11.9, -5]} color="#2e8b57" scale={0.15} wireframe={true} />
    </group>
  );
};
