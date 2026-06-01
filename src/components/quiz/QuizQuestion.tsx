'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  isSubmitting?: boolean;
  feedback?: { isCorrect: boolean; explanation: string } | null;
}

/**
 * Composant de question de quiz (QCM ou question ouverte).
 * Affiche un feedback immédiat après la réponse.
 */
const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isSubmitting,
  feedback,
}: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');

  const handleSubmitMCQ = (optionId: string) => {
    if (feedback || isSubmitting) return;
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  const handleSubmitOpen = () => {
    if (!openAnswer.trim() || isSubmitting) return;
    onAnswer(openAnswer.trim());
  };

  return (
    <motion.div
      className="mx-auto max-w-2xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-[#8888AA]">
          <span>Question {questionNumber} / {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6">
        <h2 className="text-lg font-semibold text-[#F0F0F8]">{question.content}</h2>
      </div>

      {/* Options QCM */}
      {question.question_type === 'mcq' && question.options && (
        <div className="space-y-3">
          {question.options.map((optionText, idx) => {
            const optionId = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === optionId;
            const showResult = feedback !== null && feedback !== undefined;
            let optionStyle = 'border-[#1E1E2E] bg-[#13131A] hover:border-[#6C63FF]/30';

            if (showResult && isSelected) {
              optionStyle = feedback.isCorrect
                ? 'border-[#00D4AA] bg-[#00D4AA]/10'
                : 'border-[#FF5470] bg-[#FF5470]/10';
            }

            return (
              <motion.button
                key={optionId}
                onClick={() => handleSubmitMCQ(optionId)}
                disabled={!!feedback || isSubmitting}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${optionStyle} disabled:cursor-default`}
                whileHover={!feedback ? { scale: 1.01 } : {}}
                whileTap={!feedback ? { scale: 0.99 } : {}}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isSelected && showResult
                      ? feedback.isCorrect
                        ? 'bg-[#00D4AA] text-white'
                        : 'bg-[#FF5470] text-white'
                      : 'bg-[#1E1E2E] text-[#8888AA]'
                  }`}
                >
                  {showResult && isSelected ? (
                    feedback.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />
                  ) : (
                    optionId
                  )}
                </div>
                <span className="text-[#F0F0F8]">{optionText}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Question ouverte */}
      {question.question_type === 'open' && (
        <div className="space-y-3">
          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Écrivez votre réponse..."
            className="min-h-[120px] w-full resize-none rounded-xl border border-[#1E1E2E] bg-[#13131A] p-4 text-sm text-[#F0F0F8] placeholder-[#8888AA] outline-none focus:border-[#6C63FF]"
            disabled={!!feedback || isSubmitting}
          />
          {!feedback && (
            <motion.button
              onClick={handleSubmitOpen}
              disabled={!openAnswer.trim() || isSubmitting}
              className="rounded-xl bg-[#6C63FF] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A52E0] disabled:opacity-40"
              whileTap={{ scale: 0.95 }}
            >
              Valider
            </motion.button>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <motion.div
          className={`mt-4 rounded-xl border p-4 ${
            feedback.isCorrect
              ? 'border-[#00D4AA]/30 bg-[#00D4AA]/5'
              : 'border-[#FF5470]/30 bg-[#FF5470]/5'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {feedback.isCorrect ? (
              <Check className="h-4 w-4 text-[#00D4AA]" />
            ) : (
              <X className="h-4 w-4 text-[#FF5470]" />
            )}
            <span className={`text-sm font-semibold ${feedback.isCorrect ? 'text-[#00D4AA]' : 'text-[#FF5470]'}`}>
              {feedback.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
            </span>
          </div>
          <p className="text-xs text-[#8888AA]">{feedback.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizQuestion;
