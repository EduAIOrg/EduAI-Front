/** Routes de l'application */
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/dashboard/documents',
  DOCUMENT_VIEW: (id: string) => `/dashboard/documents/${id}`,
  CHAT: '/dashboard/chat',
  QUIZ: '/dashboard/quiz',
  QUIZ_VIEW: (id: string) => `/dashboard/quiz/${id}`,
  TRANSLATE: '/dashboard/translate',
  VOICE: '/dashboard/voice',
  PROGRESS: '/dashboard/progress',
  PRICING: '/pricing',
  BILLING: '/dashboard/billing',
} as const;

/** Éléments de la navigation sidebar */
export const NAV_ITEMS = [
  { label: 'Accueil', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Documents', href: ROUTES.DOCUMENTS, icon: 'FileText' },
  { label: 'Chat IA', href: ROUTES.CHAT, icon: 'MessageSquare' },
  { label: 'Quiz', href: ROUTES.QUIZ, icon: 'Brain' },
  { label: 'Traduction', href: ROUTES.TRANSLATE, icon: 'Languages', badge: 'Pro' },
  { label: 'Mode Vocal', href: ROUTES.VOICE, icon: 'Mic', badge: 'Pro' },
  { label: 'Mes Progrès', href: ROUTES.PROGRESS, icon: 'TrendingUp' },
] as const;
