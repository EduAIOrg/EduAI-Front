import type { Metadata } from 'next';
import { Languages } from 'lucide-react';
import TranslatePanel from '@/components/translate/TranslatePanel';
import PageHeader from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Traduction | EduAI Africa',
  description: 'Traduisez vos textes entre le français et l\'anglais avec contexte pédagogique.',
};

export default function TranslatePage() {
  return (
    <div>
      <PageHeader
        title="Traducteur"
        description="Traduisez vos textes FR ↔ EN avec contexte pédagogique"
        icon={<Languages className="h-6 w-6" />}
      />

      <TranslatePanel />
    </div>
  );
}