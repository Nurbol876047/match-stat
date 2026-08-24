import { Scroll, Sparkles, Cloud, Stars } from '@react-three/drei';
import { Helicopter } from '../../models/helicopter';
import { Mountains } from '../../models/mountains';
import { Forest } from '../../models/trees';

export const KatonKaragaiScene = () => {
  return (
    <group>
      {/* Atmosphere */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <group position={[0, -2, -20]}>
        <Cloud opacity={0.5} speed={0.4} width={50} depth={5} segments={20} color="#16302e" />
      </group>
      <group position={[0, 2, -10]}>
        <Cloud opacity={0.3} speed={0.2} width={30} depth={5} segments={10} color="#0a1217" />
      </group>
      
      <Sparkles count={800} scale={50} size={2} speed={0.4} opacity={0.3} color="#d4af37" />
      
      {/* Environment */}
      <Mountains />
      <Forest />
      
      {/* Moving Hero */}
      <Helicopter />

      {/* Scrollable HTML Overlay */}
      <Scroll html style={{ width: '100vw', height: '100vh' }}>
        {/* Page 1: Hero */}
        <div className="w-screen h-screen flex flex-col justify-center px-8 md:px-24 pointer-events-none">
          <div className="max-w-4xl pt-20">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-none">
              ӨМІРДІҢ <br />
              <span className="text-[var(--color-accent-gold)] font-light italic">ЖАСЫРЫН КОДЫ</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl tracking-wide leading-relaxed mb-10">
              Табиғаттағы, музыкадағы және сәулеттегі математикалық заңдылықтарды зерттеу
            </p>
            <button className="pointer-events-auto px-8 py-3 bg-white/5 border border-white/20 hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] text-white text-sm font-medium uppercase tracking-[0.2em] transition-all duration-500 backdrop-blur-md">
              Зерттеу
            </button>
          </div>
          
          <div className="absolute bottom-12 left-8 md:left-24 animate-bounce text-white/50 text-xs tracking-[0.2em] uppercase flex flex-col items-center gap-2">
            <span>Scroll to explore</span>
            <span>↓</span>
          </div>
        </div>

        {/* Page 2: Katon Karagai Intro */}
        <div className="w-screen h-screen flex flex-col justify-center items-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-2xl text-right pt-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
              КАТОНҚАРАҒАЙ
            </h2>
            <p className="text-2xl md:text-3xl text-[var(--color-accent-gold)] italic font-light">
              Табиғаттың өзінде математика бар.
            </p>
          </div>
        </div>
      </Scroll>
    </group>
  );
};
