'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AdvancedPasskeyDemo from './AdvancedPasskeyDemo';

type AppView = 'landing' | 'auth' | 'dashboard';

interface PasskeyData {
  credentialId: string;
  publicKey: string;
  accountAddress?: string;
  deviceInfo?: string;
  username?: string;
}

const SorobanPasskeyApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [passkeyData, setPasskeyData] = useState<PasskeyData | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay datos guardados al cargar la aplicación
  useEffect(() => {
      // Rediseño Logitec: vista principal con azul eléctrico, sin emojis, layout moderno
      const checkExistingSession = () => {
      try {
        const savedData = localStorage.getItem('passkey-data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.credentialId && parsedData.publicKey) {
            setPasskeyData(parsedData);
            setCurrentView('dashboard');
          }
        }
      } catch (error) {
        console.warn('Error loading saved session:', error);
        localStorage.removeItem('passkey-data');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Manejar el éxito en la autenticación/registro
  const handleAuthSuccess = (data: PasskeyData) => {
    setPasskeyData(data);
    setCurrentView('dashboard');
    
    // Guardar en localStorage
    try {
      localStorage.setItem('passkey-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving session data:', error);
    }
  };

  // Manejar cerrar sesión
  const handleLogout = () => {
    setPasskeyData(null);
    setCurrentView('landing');
    
    // Limpiar localStorage
    try {
      localStorage.removeItem('passkey-data');
    } catch (error) {
      console.warn('Error clearing session data:', error);
    }
  };

  // Navegar a la vista de autenticación
  const handleStartSession = () => {
    setCurrentView('auth');
  };

  // Navegar de vuelta al landing
  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg" style={{ color: 'var(--muted-300)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderizar la vista correspondiente
  switch (currentView) {
    case 'landing':
      return <LandingPage onStartSession={handleStartSession} />;
    
    case 'auth':
      return (
        <AdvancedPasskeyDemo 
          onSuccess={handleAuthSuccess}
          onBack={handleBackToLanding}
        />
      );
    
    case 'dashboard':
      return passkeyData ? (
        <Dashboard 
          passkeyData={passkeyData}
          onLogout={handleLogout}
          onAuthenticate={() => {
            // Aquí podrías implementar una nueva autenticación
            console.log('Initiating new authentication...');
          }}
        />
      ) : null;
    
    default:
      return <LandingPage onStartSession={handleStartSession} />;
  }
};

export default SorobanPasskeyApp;