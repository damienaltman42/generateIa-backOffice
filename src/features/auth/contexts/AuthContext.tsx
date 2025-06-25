import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from './authContextTypes';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}; 