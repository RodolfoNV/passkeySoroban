'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, User, Bike, ArrowLeft, QrCode, Smartphone, Laptop } from 'lucide-react';

interface AuthProps {
  onBack: () => void;
  onLogin: (userData: any) => void;
}

const PasskeyAuth: React.FC<AuthProps> = ({ onBack, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [showPasskeyOptions, setShowPasskeyOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setShowPasskeyOptions(true);
  };

  const handlePasskeyCreation = (method: 'device' | 'qr' | 'mobile') => {
    // Simular creación de passkey
    setTimeout(() => {
      const userData = {
        id: '1',
        name: username,
        username: username,
        role: 'borrower',
        creditScore: 750,
        vehicleType: vehicleType,
        walletAddress: 'G' + Array(56).fill(0).map(() => 
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join(''),
        balance: '1,250.50',
        currency: 'XLM'
      };
      onLogin(userData);
    }, 2000);
  };

  if (showPasskeyOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <Key className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Crear Passkey
            </h2>
            <p className="text-gray-400">
              Elige cómo quieres guardar tu passkey seguro
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handlePasskeyCreation('device')}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-white transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Laptop className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Guardar en este dispositivo</p>
                  <p className="text-sm text-gray-400">Usar Windows Hello, Face ID, o huella</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePasskeyCreation('qr')}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-white transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <QrCode className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Código QR para móvil</p>
                  <p className="text-sm text-gray-400">Escanear con tu teléfono</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePasskeyCreation('mobile')}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-white transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Usar dispositivo móvil</p>
                  <p className="text-sm text-gray-400">Continuar en tu teléfono</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowPasskeyOptions(false)}
            className="w-full text-gray-400 hover:text-white transition-colors mt-6"
          >
            ← Volver
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">RapidLoan</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <Key className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-gray-400">
            {isRegister ? 'Regístrate con passkey seguro' : 'Accede con tu passkey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Vehículo
              </label>
              <div className="relative">
                <Bike className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="motorcycle">Moto</option>
                  <option value="bicycle">Bicicleta</option>
                  <option value="electric_bike">Bicicleta Eléctrica</option>
                  <option value="car">Automóvil</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            {isRegister ? 'Crear Passkey' : 'Usar Passkey'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <p className="text-sm text-blue-300 text-center">
            🔒 <strong>Seguro:</strong> Tu passkey se guarda de forma encriptada en tu dispositivo
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasskeyAuth;