import { useEffect, useState } from 'react';
import { globalOscillator } from '../../audio/oscillator';



export const MasterUI = ({ states, setStates }: any) => {
  const [videoState, setVideoState] = useState({
    isFormulaApplied: false,
    showGrid: false,
    recalcValue: 1.0
  });

  useEffect(() => {
    if (states.music.isPlaying) {
      globalOscillator.play(states.music.freq, states.music.harmonics);
    } else {
      globalOscillator.stop();
    }
  }, [states.music.isPlaying, states.music.freq, states.music.harmonics]);

  return (
    <main id="scroll-container" className="relative w-full text-white pointer-events-none z-10" aria-label="Интерактивті математикалық зерттеу">
      
      {/* 1. Hero */}
      <section className="h-[100vh] w-full flex flex-col justify-center px-8 md:px-24 pt-20">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 leading-none pointer-events-auto">
          ӨМІРДІҢ <br />
          <span className="text-[var(--color-accent-gold)] font-light italic">ЖАСЫРЫН КОДЫ</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10 pointer-events-auto">
          Табиғаттағы, музыкадағы және сәулеттегі математикалық заңдылықтарды зерттеу
        </p>
        <div className="absolute bottom-12 left-8 md:left-24 animate-bounce text-white/50 text-xs tracking-[0.2em] uppercase pointer-events-auto" aria-hidden="true">
          SCROLL TO EXPLORE ↓
        </div>
      </section>

      {/* 2. Katon Karagai */}
      <section className="h-[100vh] w-full flex flex-col justify-center items-end px-8 md:px-24">
        <div className="max-w-2xl text-right pointer-events-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-4">КАТОНҚАРАҒАЙ</h2>
          <p className="text-2xl md:text-3xl text-[var(--color-accent-gold)] italic font-light">Табиғаттың өзінде математика бар.</p>
        </div>
      </section>

      {/* 3. Nature */}
      <section id="section-nature" className="h-[150vh] w-full flex flex-col pt-32 px-8 md:px-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-2 pointer-events-auto">01 <span className="text-[var(--color-accent-gold)]">ТАБИҒАТ</span></h2>
        <p className="text-white/60 text-lg md:text-xl max-w-md mb-12 pointer-events-auto">Қарапайым ережелерден күрделі құрылымдар пайда болады.</p>
        
        {/* Contextual UI Panel - Mobile Bottom Sheet style via media queries */}
        <div className="md:ml-auto pointer-events-auto ui-panel p-6 w-full md:w-80 sticky top-32 rounded-t-3xl md:rounded-2xl mt-auto md:mt-0">
          <h3 className="mb-4 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">ФРАКТАЛ</h3>
          
          <div className="mb-4">
             <label htmlFor="fractal-iter" className="text-xs mb-1 flex justify-between text-white/70"><span>Итерация</span><span aria-live="polite">{states.fractal.iterations}</span></label>
             <input id="fractal-iter" aria-label="Фрактал итерациясы" type="range" min="1" max="8" value={states.fractal.iterations} onChange={e => setStates('fractal', 'iterations', Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]" />
          </div>
          
          <div className="mb-6">
             <label htmlFor="fractal-angle" className="text-xs mb-1 flex justify-between text-white/70"><span>Бұрыш</span><span aria-live="polite">{states.fractal.angle}°</span></label>
             <input id="fractal-angle" aria-label="Бұтақ бұрышы" type="range" min="10" max="60" value={states.fractal.angle} onChange={e => setStates('fractal', 'angle', Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]" />
          </div>
          
          <button 
            aria-pressed={states.fractal.isMathMode}
            onClick={() => setStates('fractal', 'isMathMode', !states.fractal.isMathMode)} 
            className="ui-button w-full py-3 bg-white/5 border border-white/20 text-xs uppercase tracking-widest hover:bg-[var(--color-accent-gold)] hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
          >
            {states.fractal.isMathMode ? 'Ағашты қайтару' : 'МАТЕМАТИКАЛЫҚ ҚҰРЫЛЫМ'}
          </button>

          <div className="mt-6 pt-5 border-t border-white/10" aria-hidden="true">
            <p className="text-[10px] text-[var(--color-accent-gold)]/60 mb-2 uppercase tracking-widest">Логарифмдік спираль</p>
            <p className="text-white/90 font-mono text-sm tracking-wider">r = a·e<sup className="text-[10px]">bθ</sup></p>
          </div>
        </div>
      </section>

      {/* 4. Music */}
      <section id="section-music" className="h-[150vh] w-full flex flex-col pt-32 px-8 md:px-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-2 pointer-events-auto">02 <span className="text-blue-400">МУЗЫКА</span></h2>
        <p className="text-white/60 text-lg md:text-xl max-w-md mb-12 pointer-events-auto">Дыбыс — бұл да математика.</p>
        
        <div className="md:ml-auto pointer-events-auto ui-panel p-6 w-full md:w-80 sticky top-32 rounded-t-3xl md:rounded-2xl mt-auto md:mt-0">
          <h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-blue-400">Толқын ұзындығы (Waveform)</h3>
          
          <div className="mb-6">
             <label htmlFor="music-freq" className="text-xs mb-1 flex justify-between text-white/70"><span>Жиілік (Frequency)</span><span aria-live="polite">{states.music.freq} Hz</span></label>
             <input id="music-freq" aria-label="Дыбыс жиілігі" type="range" min="100" max="1000" value={states.music.freq} onChange={e => setStates('music', 'freq', Number(e.target.value))} className="w-full accent-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="mb-6">
            <p className="text-xs mb-2 flex justify-between text-white/70">Гармоникалар (Harmonics)</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((h, i) => (
                <button 
                  key={h}
                  onClick={() => {
                    const newHarmonics = [...states.music.harmonics];
                    newHarmonics[i] = !newHarmonics[i];
                    setStates('music', 'harmonics', newHarmonics);
                  }}
                  className={`flex-1 py-2 text-[10px] font-mono border transition-colors focus:outline-none focus:ring-1 focus:ring-white ${states.music.harmonics[i] ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                  aria-label={`${h} гармоника`}
                  aria-pressed={states.music.harmonics[i]}
                >
                  {h}f
                </button>
              ))}
            </div>
          </div>
          
          <button 
            aria-pressed={states.music.isPlaying}
            onClick={() => setStates('music', 'isPlaying', !states.music.isPlaying)} 
            className={`ui-button w-full py-3 text-xs uppercase tracking-widest border font-medium focus:outline-none focus:ring-2 focus:ring-white ${states.music.isPlaying ? 'bg-red-500/10 text-red-400 border-red-500/40' : 'bg-blue-500/10 text-blue-400 border-blue-500/40'}`}
          >
            {states.music.isPlaying ? 'Дыбысты тоқтату' : 'Дыбысты қосу'}
          </button>

          <div className="mt-6 pt-5 border-t border-white/10" aria-hidden="true">
            <p className="text-[10px] text-blue-400/60 mb-2 uppercase tracking-widest">Синусоида формуласы</p>
            <p className="text-white/90 font-mono text-sm tracking-wider">y(t) = A·sin(2πft)</p>
          </div>
        </div>
      </section>

      {/* 5. Architecture */}
      <section id="section-architecture" className="h-[150vh] w-full flex flex-col pt-32 px-8 md:px-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-2 pointer-events-auto">03 <span className="text-[var(--color-accent-gold)]">СӘУЛЕТ</span></h2>
        <p className="text-white/60 text-lg md:text-xl max-w-md mb-12 pointer-events-auto">Ғимараттардың формасында да математикалық тәртіп бар.</p>
        
        <div className="md:ml-auto pointer-events-auto ui-panel p-6 w-full md:w-80 sticky top-32 rounded-t-3xl md:rounded-2xl mt-auto md:mt-0">
          <h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-[var(--color-accent-gold)]">GOLDEN RATIO</h3>
          
          <div className="mb-6">
             <label htmlFor="arch-ratio" className="text-xs mb-1 flex justify-between text-white/70"><span>Қатынас (Ratio)</span><span aria-live="polite">{states.arch.ratio.toFixed(3)}</span></label>
             <input id="arch-ratio" aria-label="Алтын қима қатынасы" type="range" min="1.0" max="2.0" step="0.001" value={states.arch.ratio} onChange={e => setStates('arch', 'ratio', Number(e.target.value))} className="w-full accent-[var(--color-accent-gold)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]" />
          </div>
          
          <button 
            aria-pressed={states.arch.showOverlay}
            onClick={() => setStates('arch', 'showOverlay', !states.arch.showOverlay)} 
            className="ui-button w-full py-3 bg-white/5 border border-white/20 text-xs uppercase tracking-widest hover:bg-[var(--color-accent-gold)] hover:text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
          >
            {states.arch.showOverlay ? 'Қиманы жасыру' : 'АЛТЫН ҚИМАНЫ КӨРСЕТУ'}
          </button>

          <div className="mt-6 pt-5 border-t border-white/10" aria-hidden="true">
            <p className="text-[10px] text-[var(--color-accent-gold)]/60 mb-2 uppercase tracking-widest">Фибоначчи / Алтын қима</p>
            <p className="text-white/90 font-mono text-sm tracking-wider">φ = (1 + √5) / 2</p>
          </div>
        </div>
      </section>

      {/* 6. Final */}
      <section className="h-[100vh] w-full flex flex-col items-center justify-center text-center px-8 md:px-12 bg-gradient-to-t from-[#040608] to-transparent">
        <div className="flex gap-8 md:gap-12 text-5xl md:text-6xl mb-12 pointer-events-auto opacity-80" aria-hidden="true">
          <span>🌲</span><span>🌀</span><span>〰</span><span>🏛️</span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl pointer-events-auto text-white" tabIndex={0}>
          Математика — табиғаттың, <br />
          дыбыстың және адам жасаған <br />
          формалардың ортақ тілі.
        </h2>
      </section>



      {/* Footer */}
      <footer className="w-full py-12 flex flex-col items-center justify-center text-center border-t border-white/5 bg-[#040608] pointer-events-auto mt-20">
        <h4 className="text-white/80 font-bold tracking-[0.2em] mb-4 text-sm">ӨМІРДІҢ ЖАСЫРЫН КОДЫ</h4>
        <p className="text-[var(--color-accent-gold)]/70 text-xs tracking-[0.1em] mb-4 uppercase">Табиғат × Музыка × Сәулет × Математика</p>
        <p className="text-white/30 text-[10px]">© 2026</p>
      </footer>
      
    </main>
  );
};
