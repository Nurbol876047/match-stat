export class AudioOscillator {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private masterGain: GainNode | null = null;
  
  private baseFreq: number = 440;
  private harmonics: boolean[] = [true, false, false, false]; 
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  play(frequency: number = 440, activeHarmonics: boolean[] = [true, false, false, false]) {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.stop(); 
    this.baseFreq = frequency;
    this.harmonics = activeHarmonics;
    
    this.masterGain = this.ctx!.createGain();
    this.masterGain.connect(this.ctx!.destination);
    
    this.masterGain.gain.setValueAtTime(0, this.ctx!.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + 0.1);
    
    this.harmonics.forEach((isActive, index) => {
      if (isActive) {
        this.addOscillator(index + 1);
      }
    });
  }

  private addOscillator(multiplier: number) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = this.baseFreq * multiplier;
    
    // Higher harmonics have lower volume (1/n ratio)
    gain.gain.value = 1 / multiplier; 
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    this.oscillators.push(osc);
    this.gains.push(gain);
  }

  setFrequency(freq: number) {
    this.baseFreq = freq;
    if (this.ctx && this.oscillators.length > 0) {
      let activeIndex = 0;
      this.harmonics.forEach((isActive, index) => {
        if (isActive) {
          const osc = this.oscillators[activeIndex];
          if (osc) {
             if (this.ctx) {
        osc.frequency.setTargetAtTime(freq * (index + 1), this.ctx.currentTime, 0.05);
      }
          }
          activeIndex++;
        }
      });
    }
  }

  setHarmonics(activeHarmonics: boolean[]) {
     this.harmonics = activeHarmonics;
     if (this.oscillators.length > 0) {
        this.play(this.baseFreq, this.harmonics);
     }
  }

  stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
      
      this.oscillators.forEach(osc => osc.stop(this.ctx!.currentTime + 0.1));
      
      this.oscillators = [];
      this.gains = [];
    }
  }
}

export const globalOscillator = new AudioOscillator();
