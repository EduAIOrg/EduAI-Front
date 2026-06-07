'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useVoice, VoiceState } from '@/hooks/useVoice';
import { speechService } from '@/lib/speech';

/**
 * Assistant vocal avec cercle animé réactif et transcription en temps réel.
 * Utilise Web Speech API pour STT et TTS.
 */
const VoiceAssistant = () => {
  const {
    voiceState,
    transcript,
    aiResponse,
    isSupported,
    sessionHistory,
    toggleListening,
    stopSpeaking,
  } = useVoice();

  /** Couleurs et tailles selon l'état */
  const stateConfig: Record<VoiceState, { color: string; label: string; pulse: boolean }> = {
    idle: { color: '#6C63FF', label: 'Appuyez pour parler', pulse: false },
    listening: { color: '#00D4AA', label: 'Écoute en cours...', pulse: true },
    processing: { color: '#FFB547', label: 'Traitement...', pulse: true },
    speaking: { color: '#6C63FF', label: 'EduAI répond...', pulse: true },
  };

  const config = stateConfig[voiceState];

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MicOff className="mb-4 h-12 w-12 text-[#FF5470]" />
        <h3 className="text-lg font-semibold text-[#F0F0F8]">Non supporté</h3>
        <p className="mt-2 text-sm text-[#8888AA]">
          Votre navigateur ne supporte pas la reconnaissance vocale.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Cercle animé principal */}
      <div className="relative">
        {/* Ondes sonores */}
        {config.pulse && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: config.color }}
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{
                  scale: [1, 1.3 + ring * 0.15, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: ring * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}

        {/* Bouton micro central */}
        <motion.button
          onClick={toggleListening}
          className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full transition-all"
          style={{
            background: `radial-gradient(circle, ${config.color}20 0%, ${config.color}05 70%)`,
            border: `2px solid ${config.color}40`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
          transition={config.pulse ? { duration: 1, repeat: Infinity } : {}}
          aria-label={voiceState === 'listening' ? 'Arrêter' : 'Parler'}
        >
          {voiceState === 'speaking' ? (
            <Volume2 className="h-10 w-10" style={{ color: config.color }} />
          ) : (
            <Mic className="h-10 w-10" style={{ color: config.color }} />
          )}
        </motion.button>
      </div>

      {/* État label */}
      <motion.p
        className="text-sm font-medium"
        style={{ color: config.color }}
        key={voiceState}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {config.label}
      </motion.p>

      {/* Transcription en temps réel */}
      {transcript && (
        <motion.div
          className="w-full max-w-md rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-[#8888AA] mb-2">Votre question :</p>
          <p className="text-sm text-[#F0F0F8]">{transcript}</p>
        </motion.div>
      )}

      {/* Réponse IA */}
      {aiResponse && (
        <motion.div
          className="w-full max-w-md rounded-2xl border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-[#6C63FF]" />
            <span className="text-xs font-medium text-[#6C63FF]">EduAI</span>
            {voiceState === 'speaking' && (
              <motion.button
                onClick={stopSpeaking}
                className="ml-auto text-[#8888AA] hover:text-[#FF5470]"
                whileTap={{ scale: 0.9 }}
                aria-label="Arrêter la lecture"
              >
                <VolumeX className="h-4 w-4" />
              </motion.button>
            )}
          </div>
          <p className="text-sm text-[#F0F0F8]/90 mb-4">{aiResponse}</p>
          <div className="flex gap-2 justify-end">
            {voiceState !== 'speaking' ? (
              <button
                onClick={() => speechService.speak(aiResponse, "fr-FR")}
                className="flex items-center gap-1.5 rounded-lg bg-[#6C63FF]/20 px-3 py-1.5 text-xs font-medium text-[#6C63FF] hover:bg-[#6C63FF]/30 transition-colors"
              >
                🔊 Lire la réponse
              </button>
            ) : (
              <button
                onClick={() => speechService.stop()}
                className="flex items-center gap-1.5 rounded-lg bg-[#FF5470]/20 px-3 py-1.5 text-xs font-medium text-[#FF5470] hover:bg-[#FF5470]/30 transition-colors"
              >
                ⏹ Arrêter
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Historique de session */}
      {sessionHistory.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          <h3 className="text-xs font-medium text-[#8888AA]">Historique de la session</h3>
          <div className="max-h-48 space-y-2 overflow-y-auto custom-scrollbar">
            {sessionHistory.map((item, i) => (
              <motion.div
                key={i}
                className={`rounded-xl p-3 text-xs ${
                  item.role === 'user'
                    ? 'bg-[#13131A] text-[#F0F0F8]'
                    : 'border border-[#6C63FF]/20 bg-[#6C63FF]/5 text-[#F0F0F8]/90'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="font-medium text-[#8888AA]">
                  {item.role === 'user' ? 'Vous' : 'EduAI'} :{' '}
                </span>
                {item.content}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
