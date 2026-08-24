import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Helicopter } from '../../models/helicopter';
import { Mountains } from '../../models/mountains';
import { Forest } from '../../models/trees';
import { FractalTree } from '../../mathematics/fractals/FractalTree';
import { GoldenSpiral } from '../../mathematics/spirals/GoldenSpiral';
import { WaveVisualizer } from '../../mathematics/waves/WaveVisualizer';
import { Pavilion } from '../../models/architecture/Pavilion';
import { SymmetryPattern } from '../../mathematics/symmetry/SymmetryPattern';

gsap.registerPlugin(ScrollTrigger);

const PHI = (1 + Math.sqrt(5)) / 2; // Exact Mathematical accuracy

const CameraController = ({ isReducedMotion }: { isReducedMotion: boolean }) => {
  const { camera } = useThree();

  useEffect(() => {
    const ctx = gsap.context(() => {
      camera.position.set(0, 2, 10);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: isReducedMotion ? false : 1, // Remove smoothing scrub for reduced motion, or use simple snap
        }
      });

      if (isReducedMotion) {
        // Just fade between static positions instead of flying
        tl.to(camera.position, { z: -170, ease: "steps(4)" }, 0);
      } else {
        // Smooth cinematic fly-through
        tl.to(camera.position, {
          z: -170,
          y: -10,
          ease: "none"
        }, 0);
      }
    });
    
    return () => ctx.revert();
  }, [camera, isReducedMotion]);

  return null;
}

export const MasterScene = ({ states }: { states: any }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileQuery.matches);
    const mobileHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', mobileHandler);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      mobileQuery.removeEventListener('change', mobileHandler);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }} className="w-full h-full" gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={['#060a0f']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffd599" />
        <fog attach="fog" args={['#060a0f', 5, 50]} />

        <Suspense fallback={null}>
          <CameraController isReducedMotion={isReducedMotion} />

          {/* Intro / Mountains (Z: 0 to -30) */}
          <group position={[0, 0, 0]}>
            {!isReducedMotion && !isMobile && <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />}
            <Mountains />
            <Forest />
            {!isMobile && <Helicopter />} {/* Hide heavy procedural helicopter on mobile */}
          </group>

          {/* Nature Math (Z: -60) */}
          <group position={[0, -10, -60]}>
             <group position={[-5, 0, 0]}>
               <FractalTree 
                 iterations={states.fractal.iterations} 
                 angle={states.fractal.angle * Math.PI / 180} 
                 scaleFactor={states.fractal.scale} 
                 isMathMode={states.fractal.isMathMode} 
               />
             </group>
             <group position={[0, 0, 0]}>
               <GoldenSpiral ratio={states.fractal.spiralRatio} />
             </group>
             <group position={[5, 0, 0]}>
               <SymmetryPattern order={6} />
             </group>
          </group>

          {/* Music Math (Z: -100) */}
          <group position={[0, -10, -100]}>
             <WaveVisualizer frequency={states.music.freq} harmonics={states.music.harmonics} />
          </group>

          {/* Architecture (Z: -140) */}
          <group position={[0, -10, -140]}>
             <Pavilion showGoldenRatio={states.arch.showOverlay} />
             
             {/* 2D Ratio demo */}
             <group position={[-6, 0, 0]}>
               <mesh>
                 <planeGeometry args={[2 * states.arch.ratio, 2]} />
                 <meshBasicMaterial 
                   color={Math.abs(states.arch.ratio - PHI) < 0.005 ? "#d4af37" : "#3b82f6"} 
                   transparent 
                   opacity={0.3} 
                   wireframe={Math.abs(states.arch.ratio - PHI) > 0.005} 
                 />
               </mesh>
             </group>
          </group>
          
        </Suspense>
      </Canvas>
    </div>
  );
};
