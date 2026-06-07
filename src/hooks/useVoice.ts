'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useChat } from './useChat';
import api from '@/lib/api';
import { speechService } from '@/lib/speech';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

/**
 * Hook pour le mode vocal.
 * Utilise le backend pour transcription (Whisper) et synthèse (TTS).
 * Fallback sur Web Speech API si le backend n'est pas disponible.
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { sendMessage, activeConversation } = useChat();

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      !!(navigator.mediaDevices?.getUserMedia);
    Promise.resolve().then(() => {
      setIsSupported(supported);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setVoiceState((prev) => {
        if (state === 'speaking') {
          return 'speaking';
        }
        if (state === 'idle' && prev === 'speaking') {
          return 'idle';
        }
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  /** Synthèse vocale via la Web Speech API du navigateur */
  const speak = useCallback((text: string) => {
    speechService.speak(text, 'fr-FR');
  }, []);

  /** Envoie la requête vocale au chat IA */
  const handleSendVoiceQuery = useCallback(
    async (text: string) => {
      setSessionHistory((prev) => [
        ...prev,
        { role: 'user', content: text, timestamp: new Date().toISOString() },
      ]);
      sendMessage(text);

      // Attend la réponse
      setTimeout(async () => {
        const lastMessage = activeConversation?.messages?.slice(-1)[0];
        const responseText = lastMessage?.content || "Je traite votre demande...";
        setAiResponse(responseText);
        setSessionHistory((prev) => [
          ...prev,
          { role: 'assistant', content: responseText, timestamp: new Date().toISOString() },
        ]);
        await speak(responseText);
      }, 2000);
    },
    [sendMessage, activeConversation, speak]
  );

  /** Transcrit l'audio via le backend */
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setVoiceState('processing');
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      const { data } = await api.post('/api/voice/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const text = data.transcript;
      setTranscript(text);
      if (text.trim()) {
        handleSendVoiceQuery(text);
      } else {
        setVoiceState('idle');
      }
    } catch {
      setVoiceState('idle');
    }
  }, [handleSendVoiceQuery]);

  /** Fallback: Web Speech API */
  const startWebSpeechListening = useCallback(() => {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
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
      const currentTranscript = transcript;
      if (currentTranscript.trim()) {
        handleSendVoiceQuery(currentTranscript);
      } else {
        setVoiceState('idle');
      }
    };
    recognition.onerror = () => setVoiceState('idle');

    recognitionRef.current = recognition;
    recognition.start();
  }, [transcript, handleSendVoiceQuery]);

  /** Démarre l'enregistrement audio pour transcription backend */
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setVoiceState('listening');
    } catch {
      // Fallback: Web Speech API
      startWebSpeechListening();
    }
  }, [transcribeAudio, startWebSpeechListening]);

  /** Arrête l'écoute */
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    recognitionRef.current?.stop();
  }, []);

  const stopSpeaking = useCallback(() => {
    speechService.stop();
  }, []);

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
