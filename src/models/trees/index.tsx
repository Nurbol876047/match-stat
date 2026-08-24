import React, { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { getHeightAt, isValidSpawnPoint } from '../../utils/terrain';

export const Forest = ({ isSimulator = true }: { isSimulator?: boolean }) => {
  const trees = useMemo(() => {
    return Array.from({ length: 12000 }).map(() => {
      // Spawn trees over the entire map area (800x800)
      const x = (Math.random() - 0.5) * 800;
      const z = (Math.random() - 0.5) * 800;
      
      const dist = Math.sqrt(x * x + z * z);
      
      // Clear out the center for the expanded village entirely
      if (dist < 55) return null;
      
      // Use centralized physics check for shoreline, height, and density
      if (!isValidSpawnPoint(x, z, 'tree')) return null;
      
      let y = getHeightAt(x, z);

      const scale = 0.5 + Math.random() * 0.9;
      
      // Random species: 0=Pine, 1=Spruce, 2=Larch
      const type = Math.floor(Math.random() * 3);
      
      return { x, y, z, scale, type };
    }).filter(t => t !== null);
  }, []);

  return (
    <group>
      {/* Pine (Tall, pointed) */}
      <Instances limit={12000} castShadow receiveShadow>
        <coneGeometry args={[1, 6, 8]} />
        <meshStandardMaterial color="#1a331a" roughness={0.7} metalness={0.05} />
        {trees.filter(t => (t as any).type === 0).map((t: any, i) => (
          <Instance key={`pine-${i}`} position={[t.x, t.y + 3 * t.scale, t.z]} scale={[t.scale, t.scale, t.scale]} />
        ))}
      </Instances>
      
      {/* Spruce (Wide, layered look) */}
      <Instances limit={12000} castShadow receiveShadow>
        <coneGeometry args={[1.5, 4, 8]} />
        <meshStandardMaterial color="#234526" roughness={0.7} metalness={0.05} />
        {trees.filter(t => (t as any).type === 1).map((t: any, i) => (
          <Instance key={`spruce-${i}`} position={[t.x, t.y + 2 * t.scale, t.z]} scale={[t.scale, t.scale, t.scale]} />
        ))}
      </Instances>

      {/* Larch (Medium, yellowish green) */}
      <Instances limit={12000} castShadow receiveShadow>
        <coneGeometry args={[1.2, 4.5, 8]} />
        <meshStandardMaterial color="#496639" roughness={0.7} metalness={0.05} />
        {trees.filter(t => (t as any).type === 2).map((t: any, i) => (
          <Instance key={`larch-${i}`} position={[t.x, t.y + 2.25 * t.scale, t.z]} scale={[t.scale, t.scale, t.scale]} />
        ))}
      </Instances>

      {/* Trunks for all trees */}
      <Instances limit={12000} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5, 6]} />
        <meshStandardMaterial color="#362215" roughness={0.9} />
        {trees.map((t: any, i) => (
          <Instance key={`trunk-${i}`} position={[t.x, t.y + 0.75 * t.scale, t.z]} scale={[t.scale, t.scale, t.scale]} />
        ))}
      </Instances>
    </group>
  );
};
