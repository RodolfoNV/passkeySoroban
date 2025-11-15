'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, Clock, CheckCircle, Plus, LogOut, Bike, Wallet, Copy, ExternalLink } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onRequestLoan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onRequestLoan }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { icon: <DollarSign className="w-6 h-6" />, label: 'Préstamo Actual', value: '$5,000 MXN' },
    { icon: <Clock className="w-6 h-6" />, label: 'Próximo Pago', value: '15 Dic 2024' },
    { icon: <CheckCircle className="w-6 h-6" />, label: 'Score Crediticio', value: user.creditScore },
  ];

  const recentLoans = [
    { id: 1, amount: '$5,000', purpose: 'Moto de reparto', status: 'Activo', date: '01 Nov 2024' },
    { id: 2, amount: '$2,500', purpose: 'Smartphone', status: 'Pagado', date: '15 Sep 2024' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RapidLoan</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta, {user.name}! 🎉
          </h1>
          <p className="text-gray-400">Gestiona tus préstamos y tu wallet Stellar</p>
        </motion.div>

        {/* Wallet Stellar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/20 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <span>Wallet Stellar</span>
            </h3>
            <span className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
              Testnet
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Dirección de Wallet</p>
              <div className="flex items-center space-x-2">
                <code className="text-white bg-black/30 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                  {user.walletAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(user.walletAddress)}
                  className="text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                  title="Copiar dirección"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-sm mt-1"
                >
                  ¡Copiado al portapapeles!
                </motion.p>
              )}
            </div>
            
            <div>
              <p className="text-gray-400 text-sm mb-1">Balance</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">{user.balance}</span>
                <span className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded text-sm">
                  {user.currency}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">≈ ${(parseFloat(user.balance.replace(',', '')) * 0.12).toFixed(2)} USD</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="text-cyan-400">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Resto del dashboard se mantiene igual... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={onRequestLoan}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Solicitar Préstamo</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-white/10 flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Realizar Pago</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Loans */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Préstamos Recientes</h3>
              <div className="space-y-4">
                {recentLoans.map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <Bike className="w-8 h-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-semibold">{loan.purpose}</p>
                        <p className="text-gray-400 text-sm">{loan.amount} • {loan.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      loan.status === 'Activo' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Tu Perfil</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bike className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold capitalize">
                      {user.vehicleType?.replace('_', ' ') || 'Moto'}
                    </p>
                    <p className="text-gray-400 text-sm">Vehículo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">Score: {user.creditScore}</p>
                    <p className="text-gray-400 text-sm">Excelente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/20">
              <h4 className="text-lg font-bold text-white mb-3">💡 Consejos Rápidos</h4>
              <ul className="text-cyan-300 text-sm space-y-2">
                <li>• Realiza pagos a tiempo para mejorar tu score</li>
                <li>• Mantén tu información actualizada</li>
                <li>• Revisa las tasas antes de solicitar</li>
                <li>• Tu wallet Stellar está lista para usar</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;