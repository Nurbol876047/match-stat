import { useMemo } from 'react';
import * as THREE from 'three';

interface FractalTreeProps {
  iterations: number;
  angle: number;
  scaleFactor: number;
  isMathMode: boolean;
}

export const FractalTree = ({ iterations, angle, scaleFactor, isMathMode }: FractalTreeProps) => {
  const { lines, meshes } = useMemo(() => {
    const linesArr: THREE.Vector3[] = [];
    const meshesArr: any[] = [];
    
    // Recursive branching algorithm
    const buildTree = (
      startPoint: THREE.Vector3,
      dir: THREE.Vector3,
      length: number,
      depth: number
    ) => {
      if (depth === 0) return;

      const endPoint = startPoint.clone().add(dir.clone().multiplyScalar(length));
      linesArr.push(startPoint, endPoint);
      
      meshesArr.push({
        position: startPoint.clone().lerp(endPoint, 0.5),
        quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
        length,
        radius: 0.15 * Math.pow(scaleFactor, iterations - depth)
      });

      const nextLength = length * scaleFactor;
      
      // Branch 1 (Right)
      const dir1 = dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
      dir1.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * 0.5); 
      buildTree(endPoint, dir1, nextLength, depth - 1);
      
      // Branch 2 (Left)
      const dir2 = dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -angle);
      dir2.applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle * 0.5);
      buildTree(endPoint, dir2, nextLength, depth - 1);
    };

    buildTree(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 2, iterations);

    const geometry = new THREE.BufferGeometry().setFromPoints(linesArr);
    return { lines: geometry, meshes: meshesArr };
  }, [iterations, angle, scaleFactor]);
  
  return (
    <group position={[0, -3, 0]}>
      {isMathMode ? (
        <lineSegments geometry={lines}>
          <lineBasicMaterial color="#d4af37" transparent opacity={0.8} />
        </lineSegments>
      ) : (
        meshes.map((m, i) => (
          <mesh key={i} position={m.position} quaternion={m.quaternion}>
            <cylinderGeometry args={[m.radius * 0.7, m.radius, m.length, 6]} />
            <meshStandardMaterial color="#2e8b57" roughness={0.9} metalness={0.1} />
          </mesh>
        ))
      )}
    </group>
  );
};
