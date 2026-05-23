'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useChat } from './useChat';

/** États possibles du mode vocal */
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

/**
 * Hook pour le mode vocal.
 * Utilise Web Speech API pour la reconnaissance et la synthèse vocale.
 */
export const useVoice = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
  >([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { sendMessage, activeConversation } = useChat();

  /** Vérifie le support du navigateur */
  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  /** Démarre la reconnaissance vocale */
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'fr-FR';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setVoiceState('listening');
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      setTranscript(result[0].transcript);
    };
    recognition.onend = () => {
      setVoiceState('processing');
      if (transcript.trim()) {
        handleSendVoiceQuery(transcript);
      } else {
        setVoiceState('idle');
      }
    };
    recognition.onerror = () => setVoiceState('idle');

    recognitionRef.current = recognition;
    recognition.start();
  }, [transcript]);

  /** Arrête l'écoute */
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  /** Envoie la requête vocale au chat IA */
  const handleSendVoiceQuery = useCallback(
    (text: string) => {
      setSessionHistory((prev) => [
        ...prev,
        { role: 'user', content: text, timestamp: new Date().toISOString() },
      ]);

      sendMessage(text);

      // Simule une réponse IA pour la démo
      setTimeout(() => {
        const lastMessage = activeConversation?.messages?.slice(-1)[0];
        const responseText = lastMessage?.content || "Je traite votre demande...";
        setAiResponse(responseText);
        setSessionHistory((prev) => [
          ...prev,
          { role: 'assistant', content: responseText, timestamp: new Date().toISOString() },
        ]);
        speak(responseText);
      }, 1500);
    },
    [sendMessage, activeConversation]
  );

  /** Synthèse vocale de la réponse IA */
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.onstart = () => setVoiceState('speaking');
    utterance.onend = () => setVoiceState('idle');

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  /** Arrête la synthèse vocale */
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setVoiceState('idle');
  }, []);

  /** Toggle écoute */
  const toggleListening = useCallback(() => {
    if (voiceState === 'listening') {
      stopListening();
    } else if (voiceState === 'idle') {
      setTranscript('');
      startListening();
    }
  }, [voiceState, startListening, stopListening]);

  return {
    voiceState,
    transcript,
    aiResponse,
    isSupported,
    sessionHistory,
    startListening,
    stopListening,
    toggleListening,
    stopSpeaking,
    speak,
  };
};
