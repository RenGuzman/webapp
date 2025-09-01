import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginAction = (mockUser, welcomeMessage, isNewUser = false) => {
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast({
      title: "¡Bienvenido!",
      description: welcomeMessage,
    });
    
    if (isNewUser) {
      localStorage.setItem('onboarding_completed', 'false');
      navigate('/welcome');
    } else {
      navigate('/');
    }
  }

  const login = async (email, password) => {
    try {
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };
      loginAction(mockUser, "Has iniciado sesión correctamente.");
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión. Intenta nuevamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const mockUser = {
        id: '1',
        email: 'usuario@gmail.com',
        name: 'Usuario Demo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      loginAction(mockUser, "Has iniciado sesión con Google correctamente.");
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión con Google. Intenta nuevamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const mockUser = {
        id: '1',
        email: email,
        name: name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };
      loginAction(mockUser, "Tu cuenta ha sido creada exitosamente.", true);
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('subscriptions');
    localStorage.removeItem('onboarding_completed');
    navigate('/login');
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};