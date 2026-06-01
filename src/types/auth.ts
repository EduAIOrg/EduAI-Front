/** Représente un utilisateur authentifié */
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Données du formulaire de connexion */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Données du formulaire d'inscription */
export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Réponse token du backend (login / register) */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
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
