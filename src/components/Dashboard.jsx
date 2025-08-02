import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simular tiempo de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-8 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-[#1173b5] mb-2">Cargando Panel de Control</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Preparando todas las herramientas y estadísticas para la gestión de tu tienda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1173b5]">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los aspectos de tu tienda</p>
        </div>
        
      </div>

      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-[#1173b5] to-[#0e5a8f] rounded-xl p-6 mb-8 text-white shadow-lg transition-all duration-500 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {currentUser?.username}!</h2>
            <p className="max-w-2xl opacity-90">
              Desde este panel podrás gestionar todos los productos de tu tienda. 
              Explora las opciones a continuación para comenzar.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Último acceso: Hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <DashboardCard 
          title="Ver Productos"
          description="Explora todos los productos disponibles"
          link="/productos"
          linkText="Ver Productos"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          bgColor="bg-[#1173b5]"
          delay="0"
        />
        
        <DashboardCard 
          title="Agregar Producto"
          description="Crea un nuevo producto para tu tienda"
          link="/productos/nuevo"
          linkText="Crear Producto"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          bgColor="bg-[#93c441]"
          delay="200"
        />
        
        <DashboardCard 
          title="Gestión Avanzada"
          description="Accede a reportes y estadísticas"
          link="#"
          linkText="Próximamente"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          bgColor="bg-[#0e5a8f]"
          delay="400"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl shadow-md border border-[#dde9d9] p-6 transition-all duration-500 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-[#1173b5]">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/productos"
            className="bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-5 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Gestionar Productos
          </Link>
          <button
            onClick={logout}
            className="bg-[#dde9d9] hover:bg-[#c7d4c0] text-gray-700 px-5 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link, linkText, icon, bgColor, delay }) => (
  <div 
    className="bg-white rounded-xl shadow-md overflow-hidden border border-[#dde9d9] transition-all duration-500 hover:translate-y-[-5px] animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`${bgColor} p-5 text-white`}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <p className="mt-2 opacity-90">{description}</p>
    </div>
    <div className="p-5">
      <Link 
        to={link} 
        className="inline-block w-full bg-[#dde9d9] hover:bg-[#c7d4c0] text-gray-800 px-4 py-3 rounded-lg text-center font-medium transition-colors"
      >
        {linkText}
      </Link>
    </div>
  </div>
);

export default Dashboard;