'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, FileText, Settings2 } from 'lucide-react';
import { QuizCreateRequest, QuizDifficulty, QuizType } from '@/types/quiz';
import { Document } from '@/types/document';

interface QuizGeneratorProps {
  documents: Document[];
  onGenerate: (options: QuizCreateRequest) => void;
  isGenerating: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de génération de quiz avec sélection du document, type, difficulté et nombre de questions.
 */
const QuizGenerator = ({ documents, onGenerate, isGenerating, isOpen, onClose }: QuizGeneratorProps) => {
  const [documentId, setDocumentId] = useState('');
  const [type, setType] = useState<QuizType>('mcq');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);

  const handleGenerate = () => {
    if (!documentId) return;
    onGenerate({ document_id: documentId, quiz_type: type, difficulty, num_questions: questionCount });
  };

  const difficultyOptions = [
    { value: 'easy' as const, label: 'Facile', color: 'text-[#00D4AA] border-[#00D4AA]' },
    { value: 'medium' as const, label: 'Moyen', color: 'text-[#FFB547] border-[#FFB547]' },
    { value: 'hard' as const, label: 'Difficile', color: 'text-[#FF5470] border-[#FF5470]' },
  ];

  const typeOptions = [
    { value: 'mcq' as const, label: 'QCM' },
    { value: 'open' as const, label: 'Questions ouvertes' },
    { value: 'mixed' as const, label: 'Mixte' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C63FF]/10">
                  <Sparkles className="h-5 w-5 text-[#6C63FF]" />
                </div>
                <h2 className="text-lg font-bold text-[#F0F0F8]">Générer un Quiz</h2>
              </div>
              <motion.button
                onClick={onClose}
                className="rounded-lg p-2 text-[#8888AA] hover:bg-[#1E1E2E]"
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="space-y-5">
              {/* Document source */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8888AA]">
                  <FileText className="h-3.5 w-3.5" />
                  Document source
                </label>
                <select
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  className="w-full rounded-xl border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F0F0F8] outline-none focus:border-[#6C63FF]"
                >
                  <option value="">Sélectionner un document</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8888AA]">
                  <Settings2 className="h-3.5 w-3.5" />
                  Type de questions
                </label>
                <div className="flex gap-2">
                  {typeOptions.map((opt) => (
                    <motion.button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                        type === opt.value
                          ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                          : 'border-[#1E1E2E] text-[#8888AA] hover:border-[#6C63FF]/30'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulté */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#8888AA]">
                  Difficulté
                </label>
                <div className="flex gap-2">
                  {difficultyOptions.map((opt) => (
                    <motion.button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                        difficulty === opt.value
                          ? `${opt.color} bg-opacity-10`
                          : 'border-[#1E1E2E] text-[#8888AA] hover:border-[#6C63FF]/30'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Nombre de questions */}
              <div>
                <label className="mb-2 flex justify-between text-xs font-medium text-[#8888AA]">
                  <span>Nombre de questions</span>
                  <span className="text-[#6C63FF]">{questionCount}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-[#6C63FF]"
                />
                <div className="flex justify-between text-[10px] text-[#8888AA]">
                  <span>5</span>
                  <span>20</span>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleGenerate}
                disabled={!documentId || isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Génération en cours...' : 'Générer le quiz'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuizGenerator;
