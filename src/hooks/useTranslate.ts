'use client';

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { TranslateRequest, TranslateResponse, TranslationHistory } from '@/types/api';

/**
 * Hook pour le service de traduction FR/EN.
 * Endpoint: POST /api/translate/
 */
export const useTranslate = () => {
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateMutation = useMutation({
    mutationFn: async (request: TranslateRequest): Promise<TranslateResponse> => {
      const { data } = await api.post('/api/translate/', {
        text: request.text,
        source_lang: request.source_lang,
        target_lang: request.target_lang,
        preserve_pedagogical_context: request.preserve_pedagogical_context ?? true,
      });
      return data;
    },
    onSuccess: (result, variables) => {
      const entry: TranslationHistory = {
        id: crypto.randomUUID(),
        sourceText: variables.text,
        translatedText: result.translated_text,
        from: variables.source_lang,
        to: variables.target_lang,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    },
  });

  const translateDebounced = useCallback(
    (request: TranslateRequest) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        if (request.text.trim().length > 0) translateMutation.mutate(request);
      }, 500);
    },
    [translateMutation]
  );

  const translateImmediate = useCallback(
    (request: TranslateRequest) => { translateMutation.mutate(request); },
    [translateMutation]
  );

  return {
    translate: translateDebounced,
    translateImmediate,
    translatedText: translateMutation.data?.translated_text ?? '',
    isTranslating: translateMutation.isPending,
    history,
    clearHistory: () => setHistory([]),
  };
};
