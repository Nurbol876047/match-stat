import React, { useState, useMemo } from 'react';
import { usePianoSound } from '../audio/usePianoSound';
import { Music, Piano } from 'lucide-react';

export const MusicalConstantView = () => {
  const [divisions, setDivisions] = useState(12);
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const { playNote, setVolume } = usePianoSound();
  const [volumeLevel, setVolumeLevel] = useState(0.5);

  // Сброс активных клавиш при изменении количества делений
  React.useEffect(() => {
    setHoveredKey(null);
    setActiveKey(null);
  }, [divisions]);

  const f0 = 261.63; // До первой октавы

  // Calculate the constant for current divisions
  const constant = Math.pow(2, 1 / divisions);

  // Generate keys data
  const keys = useMemo(() => {
    return Array.from({ length: divisions + 1 }, (_, k) => {
      const frequency = f0 * Math.pow(constant, k);
      return { k, frequency };
    });
  }, [divisions, constant]);

  // Generate chart data for N from 5 to 24
  const chartData = useMemo(() => {
    const data = [];
    let minError = Infinity;
    let minN = 5;

    for (let n = 5; n <= 24; n++) {
      // Find k closest to n * log2(1.5)
      const exactK = n * Math.log2(1.5);
      const k = Math.round(exactK);
      // error Δ = |2^(k/n) - 1.5|
      const error = Math.abs(Math.pow(2, k / n) - 1.5);
      data.push({ n, error });
      
      if (error < minError) {
        minError = error;
        minN = n;
      }
    }
    return { data, minError, minN };
  }, []);

  const getChartPath = () => {
    const { data } = chartData;
    const width = 300;
    const height = 80;
    const padding = 10;
    const minX = 5;
    const maxX = 24;
    const minY = 0;
    const maxY = Math.max(...data.map(d => d.error));

    return data.map((d, i) => {
      const x = padding + ((d.n - minX) / (maxX - minX)) * (width - padding * 2);
      const y = height - padding - ((d.error - minY) / (maxY - minY)) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full border-t border-white/10 flex flex-col md:flex-row relative bg-[#040608] shrink-0 z-20 shadow-2xl">
      {/* Visual / Chart Section */}
      <div className="w-full md:w-[60%] p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center items-center min-h-[350px]">
        
        <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-[10px] text-white/50 tracking-widest uppercase border border-white/10 pointer-events-none">
          МАТЕМАТИКАЛЫҚ КОНСТАНТА: ¹²√2
        </div>

        <div className="w-full max-w-lg mt-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-white/70 tracking-wider uppercase text-[10px] flex items-center gap-2">
              <Piano size={14} className="opacity-70" />
              Октава деңгейлері: {divisions}
            </span>
            <span className="text-xs text-blue-400 font-mono">f0 = {f0} Гц</span>
          </div>
          
          <input 
            type="range" 
            min="5" 
            max="24" 
            value={divisions} 
            onChange={(e) => setDivisions(Number(e.target.value))}
            className="w-full mb-10 accent-blue-500 cursor-pointer"
          />

          {/* Keyboard DOM */}
          <div className="relative w-full h-40 bg-white/5 rounded-t-sm rounded-b-md border-t border-l border-r border-white/10 shadow-inner flex select-none mb-2">
            {divisions === 12 ? (
              // 12-TET Standard Piano Layout
              <div className="relative w-full h-full flex">
                {(() => {
                  const whiteKeys = [0, 2, 4, 5, 7, 9, 11, 12];
                  const blackKeys = [1, 3, 6, 8, 10];
                  const noteNames = ['До', 'До#', 'Ре', 'Ре#', 'Ми', 'Фа', 'Фа#', 'Соль', 'Соль#', 'Ля', 'Ля#', 'Си', 'До'];
                  
                  return (
                    <>
                      {/* Render White Keys */}
                      {whiteKeys.map((k, index) => {
                        const isHovered = hoveredKey === k;
                        const isActive = activeKey === k;
                        return (
                          <div
                            key={k}
                            onMouseEnter={() => setHoveredKey(k)}
                            onMouseLeave={() => setHoveredKey(null)}
                            onPointerDown={() => {
                              setActiveKey(k);
                              playNote(keys[k].frequency);
                            }}
                            onPointerUp={() => setActiveKey(null)}
                            onPointerLeave={() => setActiveKey(null)}
                            className="flex-1 h-full border-r border-black/20 relative cursor-pointer transition-all duration-75"
                            style={{
                              backgroundColor: isHovered ? '#e5e5e5' : '#f5f5f5',
                              borderBottomLeftRadius: index === 0 ? '6px' : '0',
                              borderBottomRightRadius: index === whiteKeys.length - 1 ? '6px' : '0',
                              boxShadow: isActive ? 'inset 0 4px 8px rgba(0,0,0,0.4)' : 'inset 0 -4px 4px rgba(0,0,0,0.1)',
                              transform: isActive ? 'translateY(2px)' : 'none'
                            }}
                          >
                            <div className="absolute bottom-2 left-0 w-full text-center text-[10px] font-medium text-black/40 pointer-events-none">
                              {noteNames[k]}
                            </div>
                          </div>
                        );
                      })}
                      {/* Render Black Keys */}
                      {blackKeys.map((k) => {
                        const precedingWhiteIndex = whiteKeys.findIndex(wk => wk === k - 1);
                        const leftPercent = ((precedingWhiteIndex + 1) / whiteKeys.length) * 100;
                        const isHovered = hoveredKey === k;
                        const isActive = activeKey === k;
                        
                        return (
                          <div
                            key={k}
                            onMouseEnter={() => setHoveredKey(k)}
                            onMouseLeave={() => setHoveredKey(null)}
                            onPointerDown={() => {
                              setActiveKey(k);
                              playNote(keys[k].frequency);
                            }}
                            onPointerUp={() => setActiveKey(null)}
                            onPointerLeave={() => setActiveKey(null)}
                            className="absolute top-0 cursor-pointer transition-all duration-75 z-10"
                            style={{
                              left: `calc(${leftPercent}% - 3%)`,
                              width: '6%',
                              height: '60%',
                              backgroundColor: isHovered ? '#2a2a2a' : '#1a1a1a',
                              borderBottomLeftRadius: '3px',
                              borderBottomRightRadius: '3px',
                              boxShadow: isActive ? 'inset 0 4px 8px rgba(0,0,0,0.8)' : '2px 2px 5px rgba(0,0,0,0.3)',
                              transform: isActive ? 'translateY(2px)' : 'none'
                            }}
                          >
                            <div className="absolute bottom-2 left-0 w-full text-center text-[9px] font-medium text-white/50 pointer-events-none">
                              {noteNames[k]}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            ) : (
              // Equal Temperament non-12 Layout
              <div className="flex w-full h-full">
                {keys.map((keyData) => {
                  const isHovered = hoveredKey === keyData.k;
                  const isActive = activeKey === keyData.k;
                  return (
                    <div 
                      key={keyData.k}
                      onMouseEnter={() => setHoveredKey(keyData.k)}
                      onMouseLeave={() => setHoveredKey(null)}
                      onPointerDown={() => {
                        setActiveKey(keyData.k);
                        playNote(keyData.frequency);
                      }}
                      onPointerUp={() => setActiveKey(null)}
                      onPointerLeave={() => setActiveKey(null)}
                      className="flex-1 h-full border-r border-white/10 last:border-r-0 relative cursor-pointer transition-all duration-75"
                      style={{
                        backgroundColor: isHovered ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                        transform: isActive ? 'translateY(2px)' : 'none',
                        boxShadow: isActive ? 'inset 0 4px 8px rgba(0,0,0,0.4)' : 'none'
                      }}
                    >
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/40 pointer-events-none">
                        n={keyData.k}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center h-6">
             <span className="text-sm font-mono text-white/90">
               {(hoveredKey !== null || activeKey !== null) 
                 ? (
                    <span className={activeKey !== null ? 'text-blue-300 font-bold' : ''}>
                      f({activeKey ?? hoveredKey}) = {f0} × ({divisions}√2)^{activeKey ?? hoveredKey} = {keys[activeKey ?? hoveredKey ?? 0]?.frequency?.toFixed(2) ?? '0.00'} Гц
                    </span>
                 )
                 : 'Пернені басыңыз немесе меңзерді апарыңыз'}
             </span>
          </div>

        </div>
      </div>

      {/* UI Panel */}
      <div className="w-full md:w-[40%] p-4 md:p-6 overflow-y-auto text-white">
        <h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200 flex items-center gap-2">
          <Music size={16} className="text-blue-400" />
          Музыкалық математика
        </h3>
        
        <div className="space-y-4">
          <div className="control-group !mb-0 !p-4">
            <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest flex items-center gap-2">
              <span className="text-[14px]">♩</span> Негізгі формула
            </p>
            <p className="font-mono text-sm mt-1">f(n) = f0 · (ⁿ√2)<sup className="text-[10px]">k</sup></p>
          </div>

          <div className="control-group !mb-0 !p-4">
            <p className="text-[10px] text-white/50 mb-4 uppercase tracking-widest">Ағымдағы мәндер (n={divisions})</p>
            
            <div className="control-item !mb-2">
              <label>Қадам (ⁿ√2):</label>
              <span className="text-cyan-400">{constant.toFixed(5)}</span>
            </div>
            <div className="control-item !mb-0">
              <label>Таза квинта қателігі:</label>
              <span className="text-red-400">
                {chartData.data.find(d => d.n === divisions)?.error.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="control-group !mb-0 !p-4">
            <p className="text-[10px] text-white/50 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="text-[12px]">♪</span> Неге 12 нота? (Қателік графигі)
            </p>
            <div className="w-full h-24 mt-2 relative">
              <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="10" y1="70" x2="290" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="10" y1="10" x2="10" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* 12 line marker */}
                <line 
                  x1={10 + ((12 - 5) / (24 - 5)) * 280} 
                  y1="10" 
                  x2={10 + ((12 - 5) / (24 - 5)) * 280} 
                  y2="70" 
                  stroke="rgba(96, 165, 250, 0.3)" 
                  strokeDasharray="2 2"
                />
                
                {/* Data line */}
                <path 
                  d={getChartPath()} 
                  fill="none" 
                  stroke="#60a5fa" 
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                
                {/* Highlight N=12 point */}
                <circle 
                  cx={10 + ((12 - 5) / (24 - 5)) * 280} 
                  cy={80 - 10 - ((chartData.data.find(d=>d.n===12)?.error || 0) / Math.max(...chartData.data.map(d=>d.error))) * 60} 
                  r="3" 
                  fill="#60a5fa" 
                />
                
                {/* Axis labels */}
                <text x="10" y="80" fontSize="8" fill="rgba(255,255,255,0.5)">N=5</text>
                <text x={10 + ((12 - 5) / (24 - 5)) * 280} y="80" fontSize="8" fill="#60a5fa" textAnchor="middle">12</text>
                <text x="290" y="80" fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="end">N=24</text>
              </svg>
            </div>
            <p className="text-[9px] text-white/40 mt-2 leading-relaxed">
              Графикте N=12 нүктесіндегі таза квинтаға (3:2) ең жақын келетін минимум 
              (төменгі қателік) көрсетілген. Δ = |2^(k/n) - 1.5|
            </p>
          </div>

          <div className="control-group !mb-0 !p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Дыбыс</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volumeLevel}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolumeLevel(val);
                setVolume(val);
              }}
              className="w-24 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
