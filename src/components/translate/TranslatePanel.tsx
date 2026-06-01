'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Check, Clock, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatRelativeDate } from '@/lib/utils';

/**
 * Panel de traduction FR/EN bidirectionnel.
 * Inclut le swap de langues, historique et option de contexte pédagogique.
 */
const TranslatePanel = () => {
  const [sourceText, setSourceText] = useState('');
  const [fromLang, setFromLang] = useState<'fr' | 'en'>('fr');
  const [toLang, setToLang] = useState<'fr' | 'en'>('en');
  const [keepContext, setKeepContext] = useState(true);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);

  const { translate, translatedText, isTranslating, history, clearHistory } = useTranslate();

  const handleSwapLangs = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceText(translatedText);
  };

  const handleSourceChange = (text: string) => {
    setSourceText(text);
    if (text.trim()) {
      translate({ text, source_lang: fromLang, target_lang: toLang, preserve_pedagogical_context: keepContext });
    }
  };

  const handleCopy = async (text: string, type: 'source' | 'target') => {
    await navigator.clipboard.writeText(text);
    if (type === 'source') {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } else {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
  };

  const langLabels = { fr: '🇫🇷 Français', en: '🇬🇧 Anglais' };

  return (
    <div className="space-y-6">
      {/* Main translation area */}
      <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr]">
        {/* Source */}
        <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A]">
          <div className="flex items-center justify-between border-b border-[#1E1E2E] px-4 py-3">
            <span className="text-sm font-medium text-[#F0F0F8]">{langLabels[fromLang]}</span>
            <motion.button
              onClick={() => handleCopy(sourceText, 'source')}
              className="text-[#8888AA] hover:text-[#F0F0F8]"
              whileTap={{ scale: 0.9 }}
              aria-label="Copier le texte source"
            >
              {copiedSource ? (
                <Check className="h-4 w-4 text-[#00D4AA]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.button>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => handleSourceChange(e.target.value)}
            placeholder="Entrez votre texte ici..."
            className="h-48 w-full resize-none bg-transparent p-4 text-sm text-[#F0F0F8] placeholder-[#8888AA] outline-none"
            maxLength={2000}
          />
          <div className="border-t border-[#1E1E2E] px-4 py-2 text-right text-[10px] text-[#8888AA]">
            {sourceText.length} / 2000
          </div>
        </div>

        {/* Swap button */}
        <div className="flex items-center justify-center">
          <motion.button
            onClick={handleSwapLangs}
            className="rounded-xl border border-[#1E1E2E] bg-[#13131A] p-3 text-[#8888AA] hover:border-[#6C63FF] hover:text-[#6C63FF]"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            aria-label="Inverser les langues"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Target */}
        <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A]">
          <div className="flex items-center justify-between border-b border-[#1E1E2E] px-4 py-3">
            <span className="text-sm font-medium text-[#F0F0F8]">{langLabels[toLang]}</span>
            <motion.button
              onClick={() => handleCopy(translatedText, 'target')}
              className="text-[#8888AA] hover:text-[#F0F0F8]"
              whileTap={{ scale: 0.9 }}
              aria-label="Copier la traduction"
            >
              {copiedTarget ? (
                <Check className="h-4 w-4 text-[#00D4AA]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.button>
          </div>
          <div className="relative h-48 overflow-y-auto p-4">
            {isTranslating ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner size="sm" text="Traduction..." />
              </div>
            ) : (
              <p className="text-sm text-[#F0F0F8]/90 whitespace-pre-wrap">
                {translatedText || (
                  <span className="text-[#8888AA]">La traduction apparaîtra ici...</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center justify-between rounded-xl border border-[#1E1E2E] bg-[#13131A] px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setKeepContext(!keepContext)}
            className="text-[#6C63FF]"
            whileTap={{ scale: 0.9 }}
          >
            {keepContext ? (
              <ToggleRight className="h-6 w-6" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-[#8888AA]" />
            )}
          </motion.button>
          <span className="text-xs text-[#8888AA]">Conserver le contexte pédagogique</span>
        </div>
      </div>

      {/* Historique */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F0F0F8]">
              <Clock className="h-4 w-4 text-[#8888AA]" />
              Historique récent
            </h3>
            <motion.button
              onClick={clearHistory}
              className="text-xs text-[#8888AA] hover:text-[#FF5470]"
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {history.map((item) => (
              <motion.div
                key={item.id}
                className="rounded-xl bg-[#0A0A0F] p-3 cursor-pointer hover:bg-[#0A0A0F]/80"
                onClick={() => {
                  setSourceText(item.sourceText);
                  setFromLang(item.from as 'fr' | 'en');
                  setToLang(item.to as 'fr' | 'en');
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 text-[10px] text-[#8888AA] mb-1">
                  <span>{langLabels[item.from as 'fr' | 'en']}</span>
                  <ArrowLeftRight className="h-3 w-3" />
                  <span>{langLabels[item.to as 'fr' | 'en']}</span>
                  <span className="ml-auto">{formatRelativeDate(item.createdAt)}</span>
                </div>
                <p className="text-xs text-[#F0F0F8] line-clamp-1">{item.sourceText}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatePanel;
