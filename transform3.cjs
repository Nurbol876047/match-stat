const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const newVideoExperimentItem = `type WaveType = 'sine' | 'fractal' | 'quantum' | 'chaos';

const renderWave = (type: WaveType) => {
  if (type === 'fractal') {
    return (
      <svg className="w-full h-full text-white/80 opacity-70" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 L10,2 L20,18 L30,5 L40,15 L50,8 L60,12 L70,3 L80,17 L90,6 L100,14 L110,4 L120,16 L130,7 L140,13 L150,2 L160,18 L170,5 L180,15 L190,8 L200,10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M0,10 L5,6 L10,14 L15,8 L20,12 L25,4 L30,16 L35,7 L40,13 L45,5 L50,15 L55,9 L60,11 L65,3 L70,17 L75,6 L80,14 L85,4 L90,16 L95,7 L100,13 L105,5 L110,15 L115,9 L120,11 L125,3 L130,17 L135,6 L140,14 L145,4 L150,16 L155,7 L160,13 L165,5 L170,15 L175,9 L180,11 L185,3 L190,17 L195,6 L200,10" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-40"/>
      </svg>
    );
  }
  if (type === 'quantum') {
    return (
      <svg className="w-full h-full text-white/80 opacity-70" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 C10,10 15,9 20,10 C25,11 35,8 40,10 C45,12 55,5 60,10 C65,15 75,2 80,10 C85,18 95,0 100,10 C105,20 115,2 120,10 C125,18 135,5 140,10 C145,15 155,8 160,10 C165,12 175,9 180,10 C185,11 195,10 200,10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M0,10 Q50,0 100,0 T200,10 M0,10 Q50,20 100,20 T200,10" fill="none" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.2" className="opacity-40"/>
      </svg>
    );
  }
  if (type === 'chaos') {
    return (
      <svg className="w-full h-full text-white/80 opacity-70" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 L5,15 L12,4 L18,18 L24,2 L35,19 L42,1 L50,15 L58,5 L65,16 L72,3 L80,19 L88,1 L95,17 L102,2 L110,18 L115,5 L125,16 L132,3 L140,19 L148,1 L155,14 L162,6 L170,18 L178,2 L185,15 L192,4 L200,10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M0,10 L8,2 L15,19 L22,4 L30,16 L38,3 L45,18 L52,5 L60,15 L68,2 L75,19 L82,4 L90,17 L98,3 L105,18 L112,5 L120,16 L128,2 L135,19 L142,4 L150,17 L158,3 L165,18 L172,5 L180,15 L188,2 L195,19 L200,10" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-40"/>
      </svg>
    );
  }
  return (
    <svg className="w-full h-full text-white/80 opacity-70" viewBox="0 0 200 20" preserveAspectRatio="none">
      <path d="M0,10 C5,0 15,20 20,10 C25,0 35,20 40,10 C45,0 55,20 60,10 C65,0 75,20 80,10 C85,0 95,20 100,10 C105,0 115,20 120,10 C125,0 135,20 140,10 C145,0 155,20 160,10 C165,0 175,20 180,10 C185,0 195,20 200,10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <path d="M0,10 C10,-5 10,25 20,10 C30,-5 30,25 40,10 C50,-5 50,25 60,10 C70,-5 70,25 80,10 C90,-5 90,25 100,10 C110,-5 110,25 120,10 C130,-5 130,25 140,10 C150,-5 150,25 160,10 C170,-5 170,25 180,10 C190,-5 190,25 200,10" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-40"/>
    </svg>
  );
};

const VideoExperimentItem = ({ src, title, formulaTop, formulaBottom, waveType = 'sine' }: { src: string, title: string, formulaTop: string, formulaBottom: string, waveType?: WaveType }) => {
  const [videoState, setVideoState] = useState({
    activeFormula: 'none',
    showGrid: false,
    recalcValue: 1.0
  });

  return (
    <div className="flex flex-col xl:flex-row gap-12 w-full max-w-7xl items-center xl:items-start mt-24 first:mt-0">
      <div className="flex flex-col w-full max-w-[380px] md:ml-12 xl:ml-20 shrink-0 gap-6">
        <div className={\`w-full relative rounded-[2rem] overflow-hidden border-8 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)] video-wrapper formula-\${videoState.activeFormula} \${videoState.showGrid ? 'show-grid' : ''}\`}>
          <video
            className="w-full h-full object-cover aspect-[4/5] object-[center_70%] scale-[1.15] bg-black/50"
            controls
            crossOrigin="anonymous"
            loop
            muted
            playsInline
          >
            <source src={src} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
          <div className="video-overlay absolute inset-0 pointer-events-none mix-blend-screen opacity-0 transition-opacity duration-500"></div>
        </div>

        <div className="w-full relative flex items-center justify-center h-16 bg-white/5 rounded-2xl border border-white/10 shadow-inner overflow-hidden">
          <div className="absolute top-1.5 left-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">{formulaTop}</div>
          <div className="absolute bottom-1.5 right-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">{formulaBottom}</div>
          
          <div className="absolute inset-0 flex items-center w-[200%] animate-wave-scroll">
            {renderWave(waveType)}
          </div>
        </div>
      </div>

      <div className="control-group w-full xl:flex-1 max-w-xl rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md h-fit video-controls-panel">
        <h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-white">{title}</h3>

        <div className="mb-6">
          <label className="text-xs mb-1 flex justify-between text-white/70">
            <span>Есептеу коэффициенті</span>
            <span aria-live="polite">{videoState.recalcValue.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={videoState.recalcValue}
            onChange={e => setVideoState(s => ({ ...s, recalcValue: Number(e.target.value) }))}
            className="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            style={{ '--val': \`\${((videoState.recalcValue - 0.5) / 2.5) * 100}%\` } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {FORMULAS.map(formula => (
            <button
              key={formula.id}
              onClick={() => setVideoState(s => ({ ...s, activeFormula: s.activeFormula === formula.id ? 'none' : formula.id }))}
              className={\`ui-button w-full py-2 rounded-lg border text-[10px] uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-white \${videoState.activeFormula === formula.id ? 'bg-white/20 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white'}\`}
            >
              {formula.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setVideoState(s => ({ ...s, showGrid: !s.showGrid }))}
          className={\`ui-button w-full py-3 mb-4 rounded-lg border text-xs uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-white \${videoState.showGrid ? 'bg-white/20 border-white text-white' : 'bg-white/5 border-white/20 hover:bg-white/10 text-white'}\`}
        >
          {videoState.showGrid ? 'Торды жасыру' : 'Математикалық торды көрсету'}
        </button>

        <button
          onClick={() => setVideoState(s => ({ ...s, recalcValue: 1.0, activeFormula: 'none', showGrid: false }))}
          className="ui-button w-full py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Қалпына келтіру
        </button>

        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[10px] text-white/60 mb-2 uppercase tracking-widest">Трансформация</p>
          <div className="text-white/90 font-mono text-[10px] sm:text-xs tracking-wider leading-relaxed space-y-1">
            <p className="text-white font-bold">k = {videoState.recalcValue.toFixed(2)}</p>
            {videoState.activeFormula === 'none'
              ? <p className="text-white/60">f(x) = x · k²</p>
              : FORMULAS.find(f => f.id === videoState.activeFormula)?.equations.map((eq, i) => (
                <p key={i} className="text-[var(--color-accent-gold)]/90 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">{eq}</p>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};`;

const oldItemStart = 'const VideoExperimentItem = ({ src, title, formulaTop, formulaBottom }';
const oldItemEnd = 'export const App = () => {';

const idxStart = content.indexOf(oldItemStart);
const idxEnd = content.indexOf(oldItemEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  content = content.substring(0, idxStart) + newVideoExperimentItem + '\n\n' + content.substring(idxEnd);
} else {
  console.log("Could not find VideoExperimentItem");
  process.exit(1);
}

const newMapping = `        <div className="flex flex-col gap-24 w-full items-center xl:items-start max-w-7xl">
          {[
            {
              src: '/video/demo.mp4',
              title: 'ФОРМУЛА ПАРАМЕТРЛЕРІ',
              formulaTop: 'y(t) = A·sin(ωt + φ)',
              formulaBottom: 'v = λ·f',
              waveType: 'sine' as WaveType
            },
            {
              src: '/video/AQNWsZ2J9LLwEtBqmfxPm2qqec4b_0ytC5QTomQkkzWVUeUCyIMZr4vD51mkO5S.mp4',
              title: 'ФРАКТАЛДЫҚ ҚҰРЫЛЫМДАР ПАРАМЕТРЛЕРІ',
              formulaTop: 'Z_{n+1} = Z_n² + C',
              formulaBottom: 'D = log(N)/log(S)',
              waveType: 'fractal' as WaveType
            },
            {
              src: '/video/AQMsXKUirsuMRgPOW1qabS74Oi2O1kcRnjx4MD8_Hn800kAba3Mul4dE7C8dIEp.mp4',
              title: 'КВАНТТЫҚ ТЕРБЕЛІСТЕР ПАРАМЕТРЛЕРІ',
              formulaTop: 'iℏ(∂Ψ/∂t) = ĤΨ',
              formulaBottom: 'Δx·Δp ≥ ℏ/2',
              waveType: 'quantum' as WaveType
            },
            {
              src: '/video/AQO6pXlDaFbUQ4NL4O3bqsj7dji_uHUH5CYZWHAmWMh6nI1RgEqgcK5QYVTodH4mGRcXbtAuHUh0e.mp4',
              title: 'ЭНТРОПИЯ ЖӘНЕ ХАОС ПАРАМЕТРЛЕРІ',
              formulaTop: 'dS/dt ≥ 0',
              formulaBottom: 'S = k_B ln(W)',
              waveType: 'chaos' as WaveType
            }
          ].map((item, idx) => (
            <VideoExperimentItem 
              key={idx} 
              src={item.src} 
              title={item.title} 
              formulaTop={item.formulaTop} 
              formulaBottom={item.formulaBottom} 
              waveType={item.waveType}
            />
          ))}
        </div>`;

const mappingStart = content.indexOf('<div className="flex flex-col gap-24 w-full items-center xl:items-start max-w-7xl">');
const mappingEnd = content.indexOf('{/* Isolated Styles for this specific block */}');

if (mappingStart !== -1 && mappingEnd !== -1) {
  content = content.substring(0, mappingStart) + newMapping + '\n\n        ' + content.substring(mappingEnd);
} else {
  console.log("Could not find mapping block");
  process.exit(1);
}

fs.writeFileSync('src/app/App.tsx', content, 'utf8');
console.log("Success");
