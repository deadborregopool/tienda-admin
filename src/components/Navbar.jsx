import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md border-b border-[#dde9d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-[#1173b5] rounded-lg w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 hidden md:block">
                <span className="text-xl font-bold text-[#1173b5]">Compu</span>
                <span className="text-xl font-bold text-[#93c441]">Market</span>
                <span className="text-sm font-medium text-gray-500 ml-1">Admin</span>
              </div>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link 
                  to="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/' 
                      ? 'border-[#1173b5] text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/productos" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/productos') 
                      ? 'border-[#1173b5] text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Productos
                </Link>
              
              </div>
            )}
          </div>

          {/* Menú derecho */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative flex-shrink-0 flex items-center">
                  <div className="flex items-center text-sm rounded-full focus:outline-none">
                    <div className="bg-[#dde9d9] rounded-full p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1173b5]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{currentUser?.username}</span>
                  </div>
                </div>

                <div className="ml-3 relative">
                  <button
                    onClick={logout}
                    className="flex items-center bg-[#93c441] hover:bg-[#7eaa37] text-white text-sm font-medium rounded-md px-3 py-2 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Link 
                  to="/login" 
                  className="ml-4 bg-gradient-to-r from-[#1173b5] to-[#1a8cd2] hover:from-[#0d5a8f] hover:to-[#1173b5] text-white font-medium rounded-md px-4 py-2 text-sm shadow-sm transition-all"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-[#dde9d9]">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/' 
                  ? 'border-[#1173b5] bg-[#dde9d9] text-[#1173b5]' 
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/productos" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/productos') 
                  ? 'border-[#1173b5] bg-[#dde9d9] text-[#1173b5]' 
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Productos
            </Link>
            <Link 
              to="/categorias" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/categorias') 
                  ? 'border-[#1173b5] bg-[#dde9d9] text-[#1173b5]' 
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Categorías
            </Link>
            <Link 
              to="/pedidos" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/pedidos') 
                  ? 'border-[#1173b5] bg-[#dde9d9] text-[#1173b5]' 
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Pedidos
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;