import { useState } from 'react';
import { SimulatorScene } from '../scenes/SimulatorScene';

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

export const App = () => {
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
    <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden">
      {/* Simulation Viewport (Top on mobile, Left on desktop) */}
      <div className="w-full h-[55vh] md:h-full md:flex-1 relative">
        <SimulatorScene 
          speed={speed} altitude={altitude} timeWarp={timeWarp}
          acceleration={acceleration} rotorRPM={rotorRPM} windSpeed={windSpeed} windDir={windDir}
          radius={radius} bankBias={bankBias} oscAmp={oscAmp} oscFreq={oscFreq}
        />
      </div>

      {/* Control Panel (Bottom on mobile, Right on desktop) */}
      <div className="w-full h-[45vh] md:w-[450px] md:h-full control-panel flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6">
          
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xs md:text-sm font-bold text-white tracking-[0.15em] uppercase">Қазақстан, Катонқарағай</h2>
              <p className="text-[10px] text-white/50 tracking-widest uppercase mt-1">Оқу симуляторы • 3D Локация</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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
              <li>Use the sliders to modify live mathematical dynamics in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
