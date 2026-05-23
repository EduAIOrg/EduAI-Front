import type { Metadata } from 'next';
import { Mic } from 'lucide-react';
import VoiceAssistant from '@/components/voice/VoiceAssistant';
import PageHeader from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Mode Vocal | EduAI Africa',
  description: 'Interagissez avec l\'IA par la voix pour une expérience d\'apprentissage immersive.',
};

export default function VoicePage() {
  return (
    <div>
      <PageHeader
        title="Mode Vocal"
        description="Parlez avec l'IA pour apprendre de manière interactive"
        icon={<Mic className='h-5 w-5'/>}
      />
      <VoiceAssistant />
    </div>
  );
}
