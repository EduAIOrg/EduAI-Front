'use client';

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { TranslateRequest, TranslateResponse, TranslationHistory } from '@/types/api';

/**
 * Hook pour le service de traduction FR/EN.
 * Inclut un debounce de 500ms et gère l'historique local.
 */
export const useTranslate = () => {
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Mutation de traduction */
  const translateMutation = useMutation({
    mutationFn: async (request: TranslateRequest): Promise<TranslateResponse> => {
      const { data } = await api.post('/api/translate', request);
      return data.data;
    },
    onSuccess: (result, variables) => {
      const entry: TranslationHistory = {
        id: crypto.randomUUID(),
        sourceText: variables.text,
        translatedText: result.translatedText,
        from: variables.from,
        to: variables.to,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    },
  });

  /** Traduit avec debounce de 500ms */
  const translateDebounced = useCallback(
    (request: TranslateRequest) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (request.text.trim().length > 0) {
          translateMutation.mutate(request);
        }
      }, 500);
    },
    [translateMutation]
  );

  /** Traduit immédiatement (sans debounce) */
  const translateImmediate = useCallback(
    (request: TranslateRequest) => {
      translateMutation.mutate(request);
    },
    [translateMutation]
  );

  return {
    translate: translateDebounced,
    translateImmediate,
    translatedText: translateMutation.data?.translatedText ?? '',
    isTranslating: translateMutation.isPending,
    history,
    clearHistory: () => setHistory([]),
  };
};
