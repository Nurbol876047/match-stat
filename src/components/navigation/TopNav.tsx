export const TopNav = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 pointer-events-auto transition-all duration-500 bg-[#040608]/40 backdrop-blur-md border-b border-white/5">
      <div 
        className="text-sm md:text-base font-semibold tracking-[0.15em] uppercase cursor-pointer text-white hover:text-white/80 transition-colors"
        onClick={() => scrollTo('scroll-container')}
      >
        Өмірдің жасырын коды
      </div>

      <div className="hidden md:flex items-center gap-10">
        <button onClick={() => scrollTo('section-nature')} className="transition-colors duration-500 uppercase text-xs font-medium tracking-[0.15em] text-white/50 hover:text-white">Табиғат</button>
        <button onClick={() => scrollTo('section-music')} className="transition-colors duration-500 uppercase text-xs font-medium tracking-[0.15em] text-white/50 hover:text-white">Музыка</button>
        <button onClick={() => scrollTo('section-architecture')} className="transition-colors duration-500 uppercase text-xs font-medium tracking-[0.15em] text-white/50 hover:text-white">Сәулет</button>
      </div>

      <button 
        className="hidden md:block px-6 py-2.5 border border-white/10 hover:border-[var(--color-accent-gold)] text-white hover:text-[var(--color-accent-gold)] text-xs font-medium uppercase tracking-[0.15em] transition-all duration-500 backdrop-blur-sm bg-white/5 ui-button"
        onClick={() => scrollTo('section-nature')}
      >
        Зерттеу
      </button>

      <button className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2">
        <div className="w-6 h-px bg-white/70"></div>
        <div className="w-6 h-px bg-white/70"></div>
      </button>
    </nav>
  );
};
