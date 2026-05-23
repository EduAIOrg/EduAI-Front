import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'EduAI Africa — Assistant IA Pédagogique',
    template: '%s | EduAI Africa',
  },
  description:
    'EduAI Africa est un assistant IA pédagogique conçu pour les étudiants africains. Analysez vos documents, passez des quiz, traduisez et apprenez avec l\'IA.',
  keywords: ['IA', 'pédagogie', 'Afrique', 'quiz', 'traduction', 'documents', 'apprentissage'],
  authors: [{ name: 'EduAI Africa' }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'EduAI Africa',
    description: 'Assistant IA pédagogique pour étudiants africains',
    type: 'website',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#13131A',
                border: '1px solid #1E1E2E',
                color: '#F0F0F8',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
