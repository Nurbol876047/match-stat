import React, { useMemo } from 'react';
import { isValidSpawnPoint, getHeightAt } from '../../utils/terrain';

export const Village = () => {
  const houses = useMemo(() => {
      const list = [];
      
      // Main street (20 houses)
      for (let i = 0; i < 20; i++) {
        const z = -35 + i * 4 + (Math.random() * 2);
        const side = i % 2 === 0 ? 1 : -1;
        const x = (4 + Math.random() * 2) * side;
        if (!isValidSpawnPoint(x, z, 'building')) continue;
        list.push({
          x, y: 2, z,
          scale: 0.7 + Math.random() * 0.6,
          rotY: (side > 0 ? -Math.PI / 2 : Math.PI / 2) + (Math.random() - 0.5) * 0.2,
          wallColor: ['#f4e4d4', '#e8d5c4', '#d4c4b4'][Math.floor(Math.random() * 3)],
          roofColor: ['#8b4513', '#a0522d', '#723a0f'][Math.floor(Math.random() * 3)]
        });
      }
  
      // Side streets (12 houses)
      for (let i = 0; i < 12; i++) {
        const z = -15 + Math.floor(i / 6) * 15 + (Math.random() * 2); 
        const side = i % 2 === 0 ? 1 : -1;
        const x = (10 + (i % 3) * 6 + Math.random() * 2) * side; 
        if (!isValidSpawnPoint(x, z, 'building')) continue;
        list.push({
          x, y: 2, z,
          scale: 0.6 + Math.random() * 0.5,
          rotY: (side > 0 ? Math.PI : 0) + (Math.random() - 0.5) * 0.3,
          wallColor: ['#f4e4d4', '#e8d5c4', '#d4c4b4'][Math.floor(Math.random() * 3)],
          roofColor: ['#8b4513', '#a0522d', '#723a0f'][Math.floor(Math.random() * 3)]
        });
      }

      // Scattered rural houses in the valley (15 houses)
      let attempts = 0;
      let scattered = 0;
      while (scattered < 15 && attempts < 150) {
        attempts++;
        // Valley is typically -X and slightly -Z. Let's scatter them randomly in a wider radius.
        const angle = Math.random() * Math.PI * 2;
        const radius = 60 + Math.random() * 100;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        if (!isValidSpawnPoint(x, z, 'building')) continue;
        
        const y = getHeightAt(x, z);
        // Avoid spawning on steep hills
        if (y > 15) continue;

        list.push({
          x, y, z,
          scale: 0.6 + Math.random() * 0.4,
          rotY: Math.random() * Math.PI, 
          wallColor: ['#e5d0b3', '#c2b59b', '#b0a38b'][Math.floor(Math.random() * 3)], 
          roofColor: ['#612b18', '#4a2511', '#54301f'][Math.floor(Math.random() * 3)]
        });
        scattered++;
      }
      
      return list;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Central Village & Scattered Houses */}
      {houses.map((h, i) => (
        <group key={i} position={[h.x, h.y, h.z]} rotation={[0, h.rotY, 0]} scale={h.scale}>
          {/* House body */}
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 2, 3]} />
            <meshStandardMaterial color={h.wallColor} roughness={0.9} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            <coneGeometry args={[2.5, 1.5, 4]} />
            <meshStandardMaterial color={h.roofColor} roughness={0.8} />
          </mesh>
          {/* Door */}
          <mesh position={[0, 0.75, 1.51]}>
            <boxGeometry args={[0.6, 1.5, 0.05]} />
            <meshStandardMaterial color="#4a3018" />
          </mesh>
          {/* Window */}
          <mesh position={[0.7, 1.2, 1.51]}>
            <boxGeometry args={[0.6, 0.6, 0.05]} />
            <meshStandardMaterial color="#87CEEB" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[-0.7, 1.2, 1.51]}>
            <boxGeometry args={[0.6, 0.6, 0.05]} />
            <meshStandardMaterial color="#87CEEB" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Chimney */}
          <mesh position={[0.8, 3, 0]} castShadow>
            <boxGeometry args={[0.4, 1.5, 0.4]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
        </group>
      ))}
      
      {/* Roads remain at flat village height (Y=2.0) */}
      <mesh position={[0, 2.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 90]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.2, 90]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 2.015, -15]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[5, 60]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 2.015, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[5, 60]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
    </group>
  );
};
