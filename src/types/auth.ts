/** Représente un utilisateur authentifié */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

/** Données du formulaire de connexion */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Données du formulaire d'inscription */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Réponse d'authentification du serveur */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

/** État du store d'authentification */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}
