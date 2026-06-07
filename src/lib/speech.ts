'use client';

type SpeechStateListener = (state: 'idle' | 'speaking') => void;

class SpeechService {
  private listeners = new Set<SpeechStateListener>();
  private currentState: 'idle' | 'speaking' = 'idle';

  subscribe(listener: SpeechStateListener) {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(state: 'idle' | 'speaking') {
    this.currentState = state;
    this.listeners.forEach((listener) => listener(state));
  }

  speak(text: string, lang: string = "fr-FR") {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.emit('speaking');
    };
    utterance.onend = () => {
      this.emit('idle');
    };
    utterance.onerror = () => {
      this.emit('idle');
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.emit('idle');
    }
  }
}

export const speechService = new SpeechService();
