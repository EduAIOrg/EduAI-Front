declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;

    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;

    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
  }

  var SpeechRecognition: SpeechRecognitionStatic;

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

export {};