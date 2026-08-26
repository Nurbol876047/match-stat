const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

content = content.replace(
  'const VideoExperimentItem = ({ src }: { src: string }) => {',
  'const VideoExperimentItem = ({ src, title, formulaTop, formulaBottom }: { src: string, title: string, formulaTop: string, formulaBottom: string }) => {'
);

content = content.replace(
  '<div className="absolute top-1.5 left-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">y(t) = A·sin(ωt + φ)</div>',
  '<div className="absolute top-1.5 left-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">{formulaTop}</div>'
);

content = content.replace(
  '<div className="absolute bottom-1.5 right-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">v = λ·f</div>',
  '<div className="absolute bottom-1.5 right-4 text-[9px] text-white/50 font-mono z-10 hidden sm:block">{formulaBottom}</div>'
);

content = content.replace(
  '<h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-white">Формула параметрлері</h3>',
  '<h3 className="mb-6 uppercase tracking-[0.15em] text-xs font-semibold text-white">{title}</h3>'
);

const newMapping = `          {[
            {
              src: '/video/demo.mp4',
              title: 'ФОРМУЛА ПАРАМЕТРЛЕРІ',
              formulaTop: 'y(t) = A·sin(ωt + φ)',
              formulaBottom: 'v = λ·f'
            },
            {
              src: '/video/AQNWsZ2J9LLwEtBqmfxPm2qqec4b_0ytC5QTomQkkzWVUeUCyIMZr4vD51mkO5S.mp4',
              title: 'ФРАКТАЛДЫҚ ҚҰРЫЛЫМДАР ПАРАМЕТРЛЕРІ',
              formulaTop: 'Z_{n+1} = Z_n² + C',
              formulaBottom: 'D = log(N)/log(S)'
            },
            {
              src: '/video/AQMsXKUirsuMRgPOW1qabS74Oi2O1kcRnjx4MD8_Hn800kAba3Mul4dE7C8dIEp.mp4',
              title: 'КВАНТТЫҚ ТЕРБЕЛІСТЕР ПАРАМЕТРЛЕРІ',
              formulaTop: 'iℏ(∂Ψ/∂t) = ĤΨ',
              formulaBottom: 'Δx·Δp ≥ ℏ/2'
            },
            {
              src: '/video/AQO6pXlDaFbUQ4NL4O3bqsj7dji_uHUH5CYZWHAmWMh6nI1RgEqgcK5QYVTodH4mGRcXbtAuHUh0e.mp4',
              title: 'ЭНТРОПИЯ ЖӘНЕ ХАОС ПАРАМЕТРЛЕРІ',
              formulaTop: 'dS/dt ≥ 0',
              formulaBottom: 'S = k_B ln(W)'
            }
          ].map((item, idx) => (
            <VideoExperimentItem 
              key={idx} 
              src={item.src} 
              title={item.title} 
              formulaTop={item.formulaTop} 
              formulaBottom={item.formulaBottom} 
            />
          ))}`;

// Need to match exactly what is there
const oldMappingStart = `          {[`;
const oldMappingEnd = `          ))}
        </div>`;

const startIndex = content.indexOf(oldMappingStart);
const endIndex = content.indexOf(oldMappingEnd) + `          ))}`.length;

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newMapping + content.substring(endIndex);
    fs.writeFileSync('src/app/App.tsx', content, 'utf8');
    console.log("Success");
} else {
    console.log("Failed to find mapping");
}
