import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { WaveVisualizer } from '../../mathematics/waves/WaveVisualizer';
import { globalOscillator } from '../../audio/oscillator';

export const MusicScene = () => {
  const [freq, setFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const [harmonics, setHarmonics] = useState<boolean[]>([true, false, false, false]);

  useEffect(() => {
    return () => globalOscillator.stop(); // cleanup on unmount
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      globalOscillator.stop();
      setIsPlaying(false);
    } else {
      globalOscillator.play(freq, harmonics);
      setIsPlaying(true);
    }
  };

  const setFrequency = (val: number) => {
    setFreq(val);
    if (isPlaying) {
      globalOscillator.setFrequency(val);
    }
  };

  const toggleHarmonic = (index: number) => {
    const newHarmonics = [...harmonics];
    newHarmonics[index] = !newHarmonics[index];
    setHarmonics(newHarmonics);
    if (isPlaying) {
      globalOscillator.setHarmonics(newHarmonics);
    }
  };

  return (
    <group>
      <Html fullscreen zIndexRange={[100, 0]}>
        <div className="w-full h-full pointer-events-none flex flex-col pt-24 px-6 md:px-12 overflow-y-auto pb-24 scrollbar-hide">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            02 <span className="text-blue-400">МУЗЫКА</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-md font-light">
            Дыбыс — бұл да математика.
          </p>

          <div className="flex flex-col md:flex-row flex-wrap gap-6 mt-12">
            {/* Frequency Controls */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-blue-400">Толқын ұзындығы</h3>
              
              <div className="mb-8">
                <label className="text-white/70 text-xs mb-2 flex justify-between tracking-wide">
                  <span>Жиілік</span> <span>{freq} Hz</span>
                </label>
                <input type="range" min="100" max="1000" value={freq} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-blue-400 cursor-pointer" />
              </div>

              <div className="flex gap-3 mb-8">
                {[220, 440, 880].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 text-xs border tracking-wider transition-colors ${
                      freq === f 
                        ? 'border-blue-400 text-blue-400 bg-blue-400/10' 
                        : 'border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {f} Hz
                  </button>
                ))}
              </div>

              <button 
                onClick={handlePlayToggle}
                className={`w-full py-3 text-xs uppercase tracking-[0.15em] transition-all font-medium border ${
                  isPlaying 
                    ? 'bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20' 
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/40 hover:bg-blue-500/20'
                }`}
              >
                {isPlaying ? 'Дыбысты тоқтату' : 'Дыбысты қосу'}
              </button>

              {freq === 880 && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10">
                  <p className="text-sm text-white/90 font-mono mb-2">440 Hz × 2 = 880 Hz</p>
                  <p className="text-xs text-blue-300 font-light leading-relaxed">
                    Октава = жиіліктің еселенуі. Волна становится в 2 раза плотнее!
                  </p>
                </div>
              )}
            </div>

            {/* Harmonics Controls */}
            <div className="pointer-events-auto bg-[#0a1217]/80 backdrop-blur-md p-6 border border-white/10 w-full md:w-80">
              <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-blue-400">Гармоника</h3>
              <div className="flex flex-col gap-3">
                {['Fundamental (1x)', '2nd Harmonic (2x)', '3rd Harmonic (3x)', '4th Harmonic (4x)'].map((label, i) => (
                   <button
                     key={i}
                     onClick={() => toggleHarmonic(i)}
                     className={`w-full py-2 px-4 text-xs tracking-wider transition-colors flex justify-between items-center border ${
                       harmonics[i]
                         ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                         : 'border-white/20 text-white/70 hover:bg-white/10'
                     }`}
                   >
                     <span>{label}</span>
                     <span>{harmonics[i] ? 'ON' : 'OFF'}</span>
                   </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-white/50 leading-relaxed font-light">
                Қарапайым синусоида гармоникалар қосылғанда күрделі толқынға айналады. Это математическое объяснение тембра звука.
              </p>
            </div>
          </div>
        </div>
      </Html>

      {/* 3D Wave Visualization */}
      <group position={[2, 0, 0]}>
        <WaveVisualizer frequency={freq} harmonics={harmonics} />
      </group>
    </group>
  );
};
