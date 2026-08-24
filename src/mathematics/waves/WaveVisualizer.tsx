import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaveVisualizerProps {
  frequency: number;
  harmonics?: boolean[]; // [Fundamental, 2nd, 3rd, 4th]
}

export const WaveVisualizer = ({ frequency, harmonics = [true, false, false, false] }: WaveVisualizerProps) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 400; i++) {
      pts.push(new THREE.Vector3((i / 400) * 14 - 7, 0, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position;
      const t = clock.elapsedTime;
      
      const freqFactor = frequency / 50; 
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        
        let y = 0;
        
        // Sum the active harmonics
        harmonics.forEach((isActive, index) => {
          if (isActive) {
            const n = index + 1; // 1, 2, 3, 4
            // Higher harmonics have lower amplitude (1/n)
            y += Math.sin(x * freqFactor * n - t * 8 * n) * (1.5 / n);
          }
        });
        
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" linewidth={3} transparent opacity={0.8} />
    </line>
  );
};
