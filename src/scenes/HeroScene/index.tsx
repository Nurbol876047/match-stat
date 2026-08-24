import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { KatonKaragaiScene } from '../KatonKaragaiScene';
import { NatureScene } from '../NatureScene';
import { MusicScene } from '../MusicScene';
import { ArchitectureScene } from '../ArchitectureScene';

interface HeroSceneProps {
  currentScene: string;
}

export const HeroScene = ({ currentScene }: HeroSceneProps) => {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 45 }} className="w-full h-full" gl={{ antialias: true }}>
      <color attach="background" args={['#040608']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffd599" />
      <fog attach="fog" args={['#040608', 10, 40]} />

      <Suspense fallback={null}>
        {currentScene === 'katon' && (
          <ScrollControls pages={3} damping={0.2} distance={1.2}>
            <KatonKaragaiScene />
          </ScrollControls>
        )}
        {currentScene === 'nature' && <NatureScene />}
        {currentScene === 'music' && <MusicScene />}
        {currentScene === 'architecture' && <ArchitectureScene />}
      </Suspense>
    </Canvas>
  );
};
