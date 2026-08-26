import { useState, useMemo } from 'react';
import type { GestureState } from '../components/HandTracking/GestureMapper';
import { SimulatorScene } from '../scenes/SimulatorScene';
import { HelicopterRotorView } from '../components/HelicopterRotorView';
import { MusicalConstantView } from '../components/MusicalConstantView';

const Slider = ({ label, min, max, step, value, onChange, unit }: any) => {
  const percent = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="control-item">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ '--val': `${percent}%` } as React.CSSProperties}
      />
      <span>{value} {unit}</span>
    </div>
  );
};

const FORMULAS = [
  {
    id: 'golden',
    name: 'Алтын қима',
    equations: [
      'φ = 1 + 1/(1 + 1/(...))',
      'F(n) = (φⁿ - (1-φ)ⁿ) / √5',
      'lim (n→∞) F(n+1)/F(n) = φ',
      'f(x) = x · φ · k'
    ]
  },
  {
    id: 'fractal',
    name: 'Фрактал',
    equations: [
      'z_{n+1} = z_n² + C',
      'f(z) = z² + c₀ + c₁z⁻¹ + ...',
      'dim_H(F) = inf{d ≥ 0 : H^d(F) = 0}',
      'C = {c∈ℂ : lim sup|z_n| ≤ 2} · k'
    ]
  },
  {
    id: 'quantum',
    name: 'Квант',
    equations: [
      'iħ(∂/∂t)Ψ(r,t) = ĤΨ(r,t)',
      'P(x) = ∫|Ψ(x,t)|²dx = 1',
      'Δx·Δp ≥ ħ/2',
      'E_n = (n²π²ħ²)/(2mL²) · k'
    ]
  },
  {
    id: 'thermal',
    name: 'Спектр',
    equations: [
      'E = σ · T⁴',
      'λ_max = b / T',
      'S = -k_B ∑ P_i ln(P_i)',
      'Q = ε·σ·A(T_h⁴ - T_c⁴) · k'
    ]
  },
  {
    id: 'matrix',
    name: 'Матрица',
    equations: [
      'T(v) = A·x + b',
      'det(A - λI) = 0',
      'A = U·Σ·V^T',
      'v\' = ∇ × (A·k) + b'
    ]
  },
  {
    id: 'entropy',
    name: 'Энтропия',
    equations: [
      'dS = dQ_{rev} / T ≥ 0',
      'S = k_B ln(W)',
      'H(X) = -∑ P(x) log₂P(x)',
      'ΔS_{univ} = ΔS_{sys} + ΔS_{surr} > 0'
    ]
  },
  {
    id: 'tachyon',
    name: 'Тахион',
    equations: [
      'E = (m₀·c²) / √( (v/c)² - 1 )',
      'v > c, m² < 0',
      'ds² = -c²dt² + dx² + dy² + dz² < 0',
      'T_{μν} = (ρ + p/c²)U_μ U_ν + p g_{μν}'
    ]
  },
  {
    id: 'hologram',
    name: 'Голограмма',
    equations: [
      'I(x,y) = |A_R + A_O|²',
      'E(r,t) = ∫∫ U(ξ,η) [e^(ikr)/r] dξdη',
      'H_{tot} = H_{ref} ⊗ H_{obj}',
      'I_{rec} = I₀ · exp(-i φ(x,y)) · k'
    ]
  },
  {
    id: 'void',
    name: 'Қара құрдым',
    equations: [
      'ds² = -(1 - r_s/r)dt² + dr²/(1 - r_s/r)',
      'r_s = 2GM / c²',
      'T_H = ħc³ / (8πG M k_B)',
      'R_{μν} - ½R g_{μν} + Λ g_{μν} = 8πG/c⁴ T_{μν}'
    ]
  },
  {
    id: 'plasma',
    name: 'Плазма',
    equations: [
      '∇ · E = ρ / ε₀, ∇ · B = 0',
      '∇ × E = -∂B / ∂t',
      '∇ × B = μ₀J + μ₀ε₀(∂E / ∂t)',
      'f_p = √(n_e·e² / (m_e·ε₀)) · k'
    ]
  },
];


type WaveType = 'sine' | 'fractal' | 'quantum' | 'chaos';

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
        <div className={`w-full relative rounded-[2rem] overflow-hidden border-8 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)] video-wrapper formula-${videoState.activeFormula} ${videoState.showGrid ? 'show-grid' : ''}`}>
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
            style={{ '--val': `${((videoState.recalcValue - 0.5) / 2.5) * 100}%` } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {FORMULAS.map(formula => (
            <button
              key={formula.id}
              onClick={() => setVideoState(s => ({ ...s, activeFormula: s.activeFormula === formula.id ? 'none' : formula.id }))}
              className={`ui-button w-full py-2 rounded-lg border text-[10px] uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-white ${videoState.activeFormula === formula.id ? 'bg-white/20 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white'}`}
            >
              {formula.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setVideoState(s => ({ ...s, showGrid: !s.showGrid }))}
          className={`ui-button w-full py-3 mb-4 rounded-lg border text-xs uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-white ${videoState.showGrid ? 'bg-white/20 border-white text-white' : 'bg-white/5 border-white/20 hover:bg-white/10 text-white'}`}
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
};

export const App = () => {
  

  const waveBars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const baseHeight = Math.sin((i / 39) * Math.PI) * 100;
      return {
        height: Math.max(15, baseHeight * 0.8 + Math.random() * 20),
        duration: 0.3 + Math.random() * 0.4,
        delay: Math.random()
      };
    });
  }, []);

  const [speed, setSpeed] = useState(50);
  const [altitude, setAltitude] = useState(20);
  const [timeWarp, setTimeWarp] = useState(1);

  const [acceleration, setAcceleration] = useState(2.0);
  const [rotorRPM, setRotorRPM] = useState(400);
  const [windSpeed, setWindSpeed] = useState(5);
  const [windDir, setWindDir] = useState(45);

  const [radius, setRadius] = useState(30);
  const [bankBias, setBankBias] = useState(0.1);
  const [oscAmp, setOscAmp] = useState(1.0);
  const [oscFreq, setOscFreq] = useState(2.0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#040608] overflow-x-hidden">
      <div className="flex flex-col md:flex-row w-full relative">
        {/* Simulation Viewport (Top on mobile, Left on desktop) */}
        <div className="w-full md:flex-1 relative flex flex-col">
          {/* Main 3D Scene */}
          <div className="w-full h-[60vh] md:h-[75vh] shrink-0 relative">
            <SimulatorScene
              speed={speed} altitude={altitude} timeWarp={timeWarp}
              acceleration={acceleration} rotorRPM={rotorRPM} windSpeed={windSpeed} windDir={windDir}
              radius={radius} bankBias={bankBias} oscAmp={oscAmp} oscFreq={oscFreq}
            />
          </div>

          {/* Helicopter Details Section */}
          <div className="w-full shrink-0">
            <HelicopterRotorView rotorRPM={rotorRPM} bankBias={bankBias} />
            <MusicalConstantView />
          </div>
        </div>

        {/* Control Panel (Bottom on mobile, Right on desktop) */}
        <div className="w-full h-[45vh] md:w-[450px] md:h-screen md:sticky md:top-0 control-panel flex flex-col overflow-y-auto border-l border-white/5 z-30">
          <div className="p-4 md:p-6">

            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
              <h2 className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-[0.2em] uppercase">
                Қазақстан, Катонқарағай
              </h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#pin-grad)" strokeWidth="1.5" className="text-white/40 flex-shrink-0 ml-4">
                <defs>
                  <linearGradient id="pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

                        <div className="control-group">
              <Slider label="Тікұшақ жылдамдығы" min={0} max={200} step={1} value={speed} onChange={setSpeed} unit="км/сағ" />
              <Slider label="Ұшу биіктігі" min={2} max={100} step={1} value={altitude} onChange={setAltitude} unit="м" />
              <Slider label="Уақытты жеделдету" min={0.1} max={5} step={0.1} value={timeWarp} onChange={setTimeWarp} unit="есе" />
            </div>

            <div className="control-group">
              <Slider label="Үдеу коэффициенті a" min={0.1} max={5} step={0.1} value={acceleration} onChange={setAcceleration} unit="м/с²" />
              <Slider label="Ротор жиілігі RPM" min={0} max={800} step={10} value={rotorRPM} onChange={setRotorRPM} unit="айн/м" />
              <Slider label="Желдің жылдамдығы Vw" min={0} max={50} step={1} value={windSpeed} onChange={setWindSpeed} unit="м/с" />
              <Slider label="Желдің бағыты Ө" min={0} max={360} step={1} value={windDir} onChange={setWindDir} unit="°" />
            </div>

            <div className="control-group">
              <Slider label="Айналу радиусы R" min={5} max={100} step={1} value={radius} onChange={setRadius} unit="м" />
              <Slider label="Көлбеу бұрышы" min={-1} max={1} step={0.1} value={bankBias} onChange={setBankBias} unit="рад" />
              <Slider label="Тербеліс амплитудасы" min={0} max={5} step={0.1} value={oscAmp} onChange={setOscAmp} unit="м" />
              <Slider label="Тербеліс жиілігі f" min={0} max={10} step={0.1} value={oscFreq} onChange={setOscFreq} unit="Гц" />
            </div>

            <div className="mt-4 md:mt-8 text-[10px] md:text-xs text-[#f1f5f9] leading-relaxed border-t border-[#334155] pt-4">
              <ul className="list-disc pl-4 space-y-2">
                <li>Кез-келген параметрді өзгертіп симуляцияны бақылаңыз</li>
                <li>Картаны айналдыру үшін тышқанның сол жақ батырмасын басып тұрып жылжытыңыз</li>
                <li>Жақындату үшін дөңгелекті бұраңыз</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Video Experiment Section */}
      <section id="section-video" className="h-auto min-h-[100vh] w-full flex flex-col justify-center py-32 px-8 md:px-12 pointer-events-auto bg-[#040608] relative video-experimental-block">
        <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">04 <span className="text-white">ВИДЕО-АНАЛИЗ</span></h2>
        <p className="text-white/60 text-lg md:text-xl max-w-md mb-12">Қозғалыстың математикалық моделі.</p>

                                <div className="flex flex-col gap-24 w-full items-center xl:items-start max-w-7xl">
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
        </div>

        {/* Isolated Styles for this specific block */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .video-experimental-block {
            border-top: 1px solid rgba(255,255,255,0.05);
          }
          .video-wrapper.formula-golden video {
            filter: sepia(80%) saturate(150%) hue-rotate(-30deg) contrast(110%);
          }
          .video-wrapper.formula-fractal video {
            filter: contrast(200%) saturate(200%) hue-rotate(90deg) brightness(0.8);
          }
          .video-wrapper.formula-quantum video {
            filter: invert(100%) hue-rotate(180deg) saturate(50%);
          }
          .video-wrapper.formula-thermal video {
            filter: grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(400%) contrast(150%);
          }
          .video-wrapper.formula-matrix video {
            filter: hue-rotate(100deg) saturate(250%) brightness(1.2) contrast(150%);
          }
          .video-wrapper.formula-entropy video {
            filter: contrast(300%) grayscale(50%) blur(2px) invert(10%);
          }
          .video-wrapper.formula-tachyon video {
            filter: hue-rotate(240deg) saturate(300%) blur(1px) brightness(1.5);
          }
          .video-wrapper.formula-hologram video {
            filter: brightness(1.5) contrast(80%) sepia(50%) hue-rotate(180deg) opacity(80%);
          }
          .video-wrapper.formula-void video {
            filter: brightness(0.3) contrast(200%) grayscale(100%);
          }
          .video-wrapper.formula-plasma video {
            filter: saturate(400%) hue-rotate(300deg) contrast(150%) brightness(1.2);
          }
          .video-wrapper video {
            transition: filter 0.5s ease;
          }
          .video-wrapper.show-grid .video-overlay {
            opacity: 1;
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
            background-size: 50px 50px;
            background-position: center center;
          }
          @keyframes wave-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-wave-scroll {
            animation: wave-scroll 4s ease-in-out infinite alternate;
          }
        `}} />
      </section>
    </div>
  );
};
