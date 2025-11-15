'use client';
import React, { useEffect, useState } from 'react';

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  creditScore: number;
  walletAddress: string;
  balance: string;
  currency: string;
};

const FEATURES: Feature[] = [
  {
    icon: '🏍️',
    title: 'Préstamos para Vehículos',
    description: 'Financia tu moto, bicicleta eléctrica o equipo de reparto'
  },
  {
    icon: '📱',
    title: 'Tecnología Móvil',
    description: 'Adquiere smartphones, power banks y accesorios esenciales'
  },
  {
    icon: '⚡',
    title: 'Aprobación Inmediata',
    description: 'Respuesta en minutos con tecnología blockchain Stellar'
  },
  {
    icon: '🛡️',
    title: 'Totalmente Seguro',
    description: 'Tus datos protegidos con passkeys y smart contracts'
  }
];

function randomStellarAddress(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // Generate a pseudo-random address starting with 'G' of length 56
  return 'G' + Array.from({ length: 55 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const RapidLoanLanding: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState<number>(0);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Hydration-safe localStorage read
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rapidloan_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved) as User);
        } catch {
          localStorage.removeItem('rapidloan_user');
        }
      }
    }

    const onScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 100);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentFeature((p) => (p + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rapidloan_user', JSON.stringify(userData));
    }
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rapidloan_user');
    }
  };

  // AUTH UI
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔑</div>
            <h2 className="text-3xl font-bold text-white mb-2">Acceder</h2>
            <p className="text-gray-400">Usa tu passkey seguro</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const demoUser: User = {
                id: '1',
                name: 'Usuario Demo',
                username: 'demo',
                creditScore: 750,
                walletAddress: randomStellarAddress(),
                balance: '1,250.50',
                currency: 'XLM'
              };
              handleLogin(demoUser);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Usar Passkey
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <p className="text-sm text-blue-300 text-center">
              💡 <strong>Demo:</strong> Cualquier usuario funciona
            </p>
          </div>

          <button onClick={() => setShowAuth(false)} className="w-full text-gray-400 hover:text-white transition-colors mt-4">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD WHEN LOGGED
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg" />
                <span className="text-xl font-bold text-white">RapidLoan</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-white">Hola, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido, {user.name}! 🎉</h1>
            <p className="text-gray-400">Tu wallet Stellar está lista</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">💰 Wallet Stellar</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Dirección:</p>
                <code className="text-white bg-black/30 px-3 py-2 rounded-lg text-sm font-mono">{user.walletAddress}</code>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Balance:</p>
                <p className="text-2xl font-bold text-white">
                  {user.balance} <span className="text-cyan-400">{user.currency}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Préstamo Actual', value: '$5,000 MXN' },
              { label: 'Próximo Pago', value: '15 Dic 2024' },
              { label: 'Score Crediticio', value: user.creditScore }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setShowAuth(false)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-2xl">
            Solicitar Préstamo
          </button>
        </div>
      </div>
    );
  }

  // PUBLIC LANDING
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-blue-500/20' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg" />
              <span className="text-xl font-bold text-white">RapidLoan</span>
            </div>

            <button onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold transition-all hover:scale-105">
              Acceder
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Préstamos</span>
                <br />
                <span className="text-white">para Delivery</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                Obtén el financiamiento que necesitas para tu equipo de trabajo. <strong className="text-cyan-400">Aprobación rápida, tasas justas.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-105 shadow-2xl"
                >
                  Comenzar Ahora →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12">
                {[
                  { number: '5min', label: 'Aprobación' },
                  { number: '2.5%', label: 'Tasa Mensual' },
                  { number: '24/7', label: 'Disponible' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-4">{FEATURES[currentFeature].icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{FEATURES[currentFeature].title}</h3>
                <p className="text-gray-300 text-lg">{FEATURES[currentFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RapidLoanLanding;
