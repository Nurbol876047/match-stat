import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Pavilion } from '../../models/architecture/Pavilion';

export const ArchitectureScene = () => {
  const [showGoldenRatio, setShowGoldenRatio] = useState(false);
  const [customRatio, setCustomRatio] = useState(1.0);

  // Math tolerance for golden ratio check
  const isGolden = Math.abs(customRatio - 1.618) < 0.005;

  return (
    <group>
      <Html fullscreen zIndexRange={[100, 0]}>
        <div className="w-full h-full pointer-events-none flex flex-col pt-24 px-6 md:px-12 overflow-y-auto pb-24 scrollbar-hide">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            03 <span className="text-[var(--color-accent-gold)]">СӘУЛЕТ</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">
            Ғимараттардың формасында да математикалық тәртіп бар.
          </p>

          <div className="flex flex-col md:flex-row flex-wrap gap-6 mt-12">
            {/* Interactive Rectangle Tool */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">Golden Ratio Rectangle</h3>
              
              <div className="mb-6">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Ratio</span> <span>{customRatio.toFixed(3)}</span>
                </label>
                <input 
                  type="range" 
                  min="1.0" 
                  max="2.0" 
                  step="0.001" 
                  value={customRatio} 
                  onChange={(e) => setCustomRatio(Number(e.target.value))} 
                  className="w-full accent-[var(--color-accent-gold)] cursor-pointer" 
                />
              </div>

              {/* Dynamic Feedback */}
              <div className={`p-4 border text-center transition-colors ${isGolden ? 'bg-[var(--color-accent-gold)]/20 border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                {isGolden ? (
                  <span className="font-bold uppercase tracking-widest text-sm drop-shadow-md">✓ GOLDEN RATIO</span>
                ) : (
                  <span className="font-mono text-xs tracking-wider">ratio ≠ φ</span>
                )}
              </div>
            </div>

            {/* Architecture Building Tool */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">Архитектурная гармония</h3>
              <p className="text-xs text-white/60 font-light mb-6 leading-relaxed">
                Стилизованный современный павильон спроектирован с учетом золотого сечения. Ширина здания соотносится с его высотой точно как 1.618.
              </p>
              <button 
                onClick={() => setShowGoldenRatio(!showGoldenRatio)}
                className="w-full py-3 bg-white/5 hover:bg-[var(--color-accent-gold)] hover:text-black text-white text-xs uppercase tracking-[0.15em] transition-colors border border-white/20 font-medium"
              >
                {showGoldenRatio ? 'Қиманы жасыру' : 'АЛТЫН ҚИМАНЫ КӨРСЕТУ'}
              </button>
            </div>
          </div>
        </div>
      </Html>

      {/* 2D interactive rectangle demonstration */}
      <group position={[-3, -1, 0]}>
         {/* Rectangle visually showing customRatio. Keep height constant (2), change width. */}
         <mesh>
           <planeGeometry args={[2 * customRatio, 2]} />
           <meshBasicMaterial color={isGolden ? "#d4af37" : "#3b82f6"} transparent opacity={0.3} wireframe={!isGolden} />
         </mesh>
         <mesh position={[0, 0, -0.01]}>
           <planeGeometry args={[2 * customRatio, 2]} />
           <meshBasicMaterial color={isGolden ? "#d4af37" : "#ffffff"} transparent opacity={0.05} />
         </mesh>
      </group>

      {/* 3D Architecture Model */}
      <group position={[2.5, -1, 0]}>
        <Pavilion showGoldenRatio={showGoldenRatio} />
      </group>
    </group>
  );
};
