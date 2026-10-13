import { useEffect, useState } from 'react';

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Prefers an Egyptian Arabic voice, then any Arabic voice. */
export function arabicVoice(): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null;
  const voices = window.speechSynthesis.getVoices();
  const lang = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-');
  return (
    voices.find((v) => lang(v).startsWith('ar-eg')) ??
    voices.find((v) => lang(v).startsWith('ar')) ??
    null
  );
}

/** Reads the lines one after another. Returns false when the browser has no speech support. */
export function speakArabic(lines: string[], hooks: { onStart?: () => void; onEnd?: () => void } = {}): boolean {
  if (!canSpeak() || !lines.length) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = arabicVoice();
  lines.forEach((line, i) => {
    const u = new SpeechSynthesisUtterance(line.replace(/…/g, '، '));
    u.lang = voice?.lang ?? 'ar-EG';
    if (voice) u.voice = voice;
    u.rate = 0.95;
    if (i === 0 && hooks.onStart) u.onstart = hooks.onStart;
    if (i === lines.length - 1 && hooks.onEnd) {
      u.onend = hooks.onEnd;
      u.onerror = hooks.onEnd;
    }
    synth.speak(u);
  });
  return true;
}

export const stopSpeaking = () => {
  if (canSpeak()) window.speechSynthesis.cancel();
};

/** Voices load asynchronously in most browsers; this re-checks when they arrive. */
export function useArabicVoice() {
  const [state, setState] = useState(() => ({ voice: arabicVoice(), loaded: canSpeak() && window.speechSynthesis.getVoices().length > 0 }));
  useEffect(() => {
    if (!canSpeak()) return;
    const update = () => setState({ voice: arabicVoice(), loaded: window.speechSynthesis.getVoices().length > 0 });
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, []);
  return { supported: canSpeak(), ...state };
}
