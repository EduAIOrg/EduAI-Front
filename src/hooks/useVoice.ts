'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useChat } from './useChat';
import api from '@/lib/api';

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
    setIsSupported(
      typeof window !== 'undefined' &&
      !!(navigator.mediaDevices?.getUserMedia)
    );
  }, []);

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
  }, []);

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
  }, [transcript]);

  /** Arrête l'écoute */
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    recognitionRef.current?.stop();
  }, []);

  /** Transcrit l'audio via le backend */
  const transcribeAudio = async (audioBlob: Blob) => {
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
  };

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
    [sendMessage, activeConversation]
  );

  /** Synthèse vocale via le backend, fallback sur Web Speech API */
  const speak = useCallback(async (text: string) => {
    setVoiceState('speaking');
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://eduai-back.onrender.com';
      const token = localStorage.getItem('eduai_token');
      const response = await fetch(`${baseURL}/api/voice/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text, lang: 'fr' }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(audioUrl);
        };
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    // Fallback: Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1;
      utterance.onstart = () => setVoiceState('speaking');
      utterance.onend = () => setVoiceState('idle');
      window.speechSynthesis.speak(utterance);
    } else {
      setVoiceState('idle');
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setVoiceState('idle');
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
