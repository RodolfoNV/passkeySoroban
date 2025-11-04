'use client';

import React from 'react';

interface LandingPageProps {
  onStartSession: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSession }) => {
  const [logueado, setLogueado] = React.useState(false);
  const [usuario, setUsuario] = React.useState("");
  const [wallet, setWallet] = React.useState("");

  // Simulación: al loguear, se recibe el usuario y wallet
  const handleLogin = (user: string) => {
    setUsuario(user);
    setWallet("GABCD1234WALLETEXAMPLE"); // Aquí iría la lógica real para obtener la wallet
    setLogueado(true);
  };
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300">
      <section className="w-full h-full flex flex-col items-center justify-center p-0 m-0">
        <h1 className="text-6xl font-extrabold text-center mb-6 text-blue-100 tracking-tight drop-shadow-lg">Logitec Passkey</h1>
        <p className="text-xl text-center mb-8 text-blue-200 font-medium">Autenticación avanzada con passkeys y Soroban.<br/>Seguridad y simplicidad para tu acceso digital.</p>
        {/* PasskeyAuth: Registro/Login o Interfaz de Préstamos */}
        <div className="mb-12 flex justify-center">
          {!logueado ? (
            <PasskeyAuth onLogin={handleLogin} />
          ) : (
            <Prestamo usuario={usuario} wallet={wallet} />
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