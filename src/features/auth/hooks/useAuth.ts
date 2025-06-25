import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          if (user && user.isAdmin) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Si pas admin, déconnecter
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          // Token invalide
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await authService.login(email, password);
      
      if (response.user.isAdmin) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'NOT_ADMIN' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      logout();
      return false;
    }

    try {
      const response = await authService.refreshToken(refresh_token);
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
  };
}; 