import { useRef, useCallback, useEffect } from 'react';

export const usePianoSound = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0.5; // Default volume
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (masterGainRef.current && ctxRef.current) {
      // Smoothly change volume
      masterGainRef.current.gain.setTargetAtTime(volume, ctxRef.current.currentTime, 0.05);
    }
  }, []);

  const playNote = useCallback((frequency: number) => {
    initAudio();
    if (!ctxRef.current || !masterGainRef.current) return;

    const osc = ctxRef.current.createOscillator();
    const gain = ctxRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    // Envelope
    const now = ctxRef.current.currentTime;
    const attack = 0.01;
    const decay = 0.5;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + attack + decay + 0.1);
  }, [initAudio]);

  return { playNote, setVolume };
};
