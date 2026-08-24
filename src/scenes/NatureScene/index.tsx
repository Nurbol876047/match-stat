import { useState } from 'react';
import { Html } from '@react-three/drei';
import { FractalTree } from '../../mathematics/fractals/FractalTree';
import { GoldenSpiral } from '../../mathematics/spirals/GoldenSpiral';
import { SymmetryPattern } from '../../mathematics/symmetry/SymmetryPattern';

export const NatureScene = () => {
  const [iterations, setIterations] = useState(5);
  const [angle, setAngle] = useState(35);
  const [scale, setScale] = useState(0.7);
  const [isMathMode, setIsMathMode] = useState(false);
  const [spiralRatio, setSpiralRatio] = useState(1.618);
  const [symmetryOrder, setSymmetryOrder] = useState(6);

  return (
    <group>
      <Html fullscreen zIndexRange={[100, 0]}>
        <div className="w-full h-full pointer-events-none flex flex-col pt-24 px-6 md:px-12 overflow-y-auto pb-24 scrollbar-hide">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            01 <span className="text-[var(--color-accent-gold)]">ТАБИҒАТ</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-md font-light">
            Қарапайым ережелерден күрделі құрылымдар пайда болады.
          </p>
          
          <div className="flex flex-col md:flex-row flex-wrap gap-6 mt-12">
            {/* Fractal Controls */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">Фрактальное дерево</h3>
              
              <div className="mb-5">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Фрактал деңгейі</span> <span>{iterations}</span>
                </label>
                <input type="range" min="1" max="8" value={iterations} onChange={(e) => setIterations(Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer" />
              </div>

              <div className="mb-5">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Бұтақ бұрышы</span> <span>{angle}°</span>
                </label>
                <input type="range" min="10" max="60" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer" />
              </div>

              <div className="mb-8">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Өсу коэффициенті</span> <span>{scale}</span>
                </label>
                <input type="range" min="0.5" max="0.9" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer" />
              </div>

              <button 
                onClick={() => setIsMathMode(!isMathMode)}
                className="w-full py-3 bg-white/5 hover:bg-[var(--color-accent-gold)] hover:text-black text-white text-xs uppercase tracking-[0.15em] transition-colors border border-white/20 font-medium"
              >
                {isMathMode ? 'Ағашты қайтару' : 'МАТЕМАТИКАЛЫҚ ҚҰРЫЛЫМДЫ КӨРСЕТУ'}
              </button>
            </div>

            {/* Spiral Controls */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">Алтын қима спиралі</h3>
              <div className="mb-6">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Ratio (φ)</span> <span>{spiralRatio.toFixed(3)}</span>
                </label>
                <input type="range" min="1.1" max="2.0" step="0.001" value={spiralRatio} onChange={(e) => setSpiralRatio(Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer" />
                <p className="mt-4 text-[10px] text-white/40 uppercase tracking-widest">φ = 1.618033988...</p>
              </div>
            </div>

            {/* Symmetry Controls */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">Симметрия</h3>
              <div className="mb-2">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Symmetry Order</span> <span>{symmetryOrder}</span>
                </label>
                <input type="range" min="1" max="12" step="1" value={symmetryOrder} onChange={(e) => setSymmetryOrder(Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </Html>

      {/* 3D Elements */}
      <group position={[-4, 0, 0]}>
        <FractalTree iterations={iterations} angle={(angle * Math.PI) / 180} scaleFactor={scale} isMathMode={isMathMode} />
      </group>
      
      <group position={[1, 0, 0]}>
        <GoldenSpiral ratio={spiralRatio} />
      </group>

      <group position={[6, 0, 0]}>
        <SymmetryPattern order={symmetryOrder} />
      </group>
    </group>
  );
};
