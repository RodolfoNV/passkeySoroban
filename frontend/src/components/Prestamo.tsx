import React from "react";

interface PrestamoProps {
  usuario: string;
  wallet: string;
}

const Prestamo: React.FC<PrestamoProps> = ({ usuario, wallet }) => {
  const [monto, setMonto] = React.useState(0);
  const [status, setStatus] = React.useState("");

  const solicitarPrestamo = () => {
    if (monto <= 0) {
      setStatus("Ingresa un monto válido");
      return;
    }
    // Aquí iría la lógica real de integración con Soroban/contract
    setStatus(`Solicitud enviada: ${monto} XLM para ${usuario}`);
  };

  // Estado para navegación
  const [vista, setVista] = React.useState('Inicio');

  // Colores mejorados
  const sidebarColor = 'bg-[#233A7B]';
  const activeColor = 'bg-[#1A2B5A]';
  const buttonColor = 'bg-[#2563eb]';

  // Contenido por vista
  const renderVista = () => {
    switch (vista) {
      case 'Inicio':
        return (
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Panel de Préstamos</h1>
            <div className="text-sm text-gray-500 mb-6">Bienvenido, <span className="font-bold text-blue-700">{usuario}</span></div>
            <div className="flex gap-4 mb-8">
              <span className="text-xs text-gray-400">Wallet:</span>
              <span className="font-mono text-purple-700">{wallet}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">322</div>
                <div className="text-xs text-gray-600">Clientes</div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">64</div>
                <div className="text-xs text-gray-600">Préstamos Activos</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">211</div>
                <div className="text-xs text-gray-600">Pagos Pendientes</div>
              </div>
              <div className="bg-pink-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-700">45913</div>
                <div className="text-xs text-gray-600">Monto por Cobrar</div>
              </div>
            </div>
          </div>
        );
      case 'Clientes':
        return <div className="text-xl font-bold text-blue-900">Gestión de Clientes (próximamente)</div>;
      case 'Préstamos':
        return (
          <div className="bg-blue-50 rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Solicitar Préstamo</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Monto (XLM)</label>
              <input
                type="number"
                min={1}
                value={monto}
                onChange={e => setMonto(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={solicitarPrestamo}
              className={`px-6 py-4 ${buttonColor} text-white font-semibold rounded-lg shadow-lg transition-all duration-200 w-full`}
            >
              Solicitar Préstamo
            </button>
            {status && (
              <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">{status}</div>
            )}
          </div>
        );
      case 'Cobros':
        return <div className="text-xl font-bold text-blue-900">Cobros (próximamente)</div>;
      case 'Reportes':
        return <div className="text-xl font-bold text-blue-900">Reportes (próximamente)</div>;
      case 'Usuarios':
        return <div className="text-xl font-bold text-blue-900">Usuarios (próximamente)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[600px] w-full bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Sidebar mejorada */}
      <aside className={`${sidebarColor} text-white w-64 flex flex-col py-8 px-6 space-y-6`}>
        <div className="text-2xl font-bold mb-8 text-center">El Prestamista</div>
        <nav className="flex-1 space-y-4">
          {['Inicio','Clientes','Préstamos','Cobros','Reportes','Usuarios','Salir'].map((item) => (
            <button
              key={item}
              onClick={() => item === 'Salir' ? window.location.reload() : setVista(item)}
              className={`w-full text-left px-4 py-2 rounded transition font-semibold text-lg ${vista===item ? activeColor : ''} hover:bg-[#1A2B5A]`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto text-xs text-center opacity-70">v1.0 - Logitec</div>
      </aside>
      {/* Main Dashboard dinámico */}
      <main className="flex-1 p-10 bg-white flex flex-col gap-8">
        {renderVista()}
      </main>
    </div>
  );
};

export default Prestamo;
