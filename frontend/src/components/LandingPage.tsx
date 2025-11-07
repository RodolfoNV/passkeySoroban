'use client';

import React from 'react';

interface LandingPageProps {
  onStartSession: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSession }) => {
  const [logueado, setLogueado] = React.useState(() => {
    // Persistencia de sesión
    return !!localStorage.getItem('usuario');
  });
  const [usuario, setUsuario] = React.useState(() => localStorage.getItem('usuario') || "");
  const [wallet, setWallet] = React.useState("");
  const [showWelcome, setShowWelcome] = React.useState(false);

  // Simulación: al loguear, se recibe el usuario y wallet
  const handleLogin = (user: string) => {
    setUsuario(user);
    setWallet("GABCD1234WALLETEXAMPLE"); // Aquí iría la lógica real para obtener la wallet
    setLogueado(true);
    localStorage.setItem('usuario', user);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2500);
  };

  const handleLogout = () => {
    setLogueado(false);
    setUsuario("");
    setWallet("");
    localStorage.removeItem('usuario');
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300">
      <section className="w-full h-full flex flex-col items-center justify-center p-0 m-0">
        <h1 className="text-6xl font-extrabold text-center mb-6 text-blue-100 tracking-tight drop-shadow-lg">Logitec Passkey</h1>
        <p className="text-xl text-center mb-8 text-blue-200 font-medium">Autenticación avanzada con passkeys y Soroban.<br/>Seguridad y simplicidad para tu acceso digital.</p>
        {/* PasskeyAuth: Registro/Login o Interfaz de Dashboard+Préstamos */}
        <div className="mb-12 flex justify-center w-full">
          {!logueado ? (
            <PasskeyAuth onLogin={handleLogin} />
          ) : (
            <div className="w-full flex flex-col gap-8">
              {showWelcome && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
                  ¡Bienvenido, {usuario}!
                </div>
              )}
              <div className="mb-8">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-500/80 hover:bg-blue-700 text-white rounded-lg shadow transition-all"
                  >
                    Cerrar sesión
                  </button>
                </div>
                {/* Dashboard de usuario autenticado */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-blue-900 mb-2">Panel General</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                      <div className="text-lg font-semibold text-blue-800 mb-2">Usuario</div>
                      <div className="text-blue-600 font-mono mb-2">{usuario}</div>
                      <div className="text-xs text-gray-500">Wallet:</div>
                      <div className="text-purple-700 font-mono break-all">{wallet}</div>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                      <div className="text-lg font-semibold text-blue-800 mb-2">Estado</div>
                      <div className="text-green-600 font-bold">Autenticado</div>
                      <div className="text-xs text-gray-500 mt-2">Biométrico / Passkey</div>
                    </div>
                  </div>
                </div>
                {/* Panel de préstamos y recibos */}
                <div className="mt-8">
                  <Prestamo usuario={usuario} wallet={wallet} />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Technology Section */}
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Powered by <span className="text-purple-400">Cutting-Edge Technology</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl text-white">WebAuthn</span>
              </div>
              <span className="text-gray-300 font-medium">WebAuthn</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl text-white">Stellar</span>
              </div>
              <span className="text-gray-300 font-medium">Stellar</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl text-white">Soroban</span>
              </div>
              <span className="text-gray-300 font-medium">Soroban</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl text-white">Biometric</span>
              </div>
              <span className="text-gray-300 font-medium">Biometric</span>
            </div>
          </div>
        </div>
      </section>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
    </main>
  );
}
import { PasskeyAuth } from "./PasskeyAuth";
import Prestamo from "./Prestamo";
export default LandingPage;