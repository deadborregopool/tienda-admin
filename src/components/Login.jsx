import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dde9d9] to-[#e9f2e9] p-4">
      {/* Pantalla de carga completa durante autenticación */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-12 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-[#1173b5] mb-2">Verificando credenciales</h2>
          <p className="text-gray-600 max-w-md mx-auto text-center">
            Estamos buscando tu usuario en nuestra base de datos. Esto puede tomar unos segundos.
          </p>
        </div>
      )}
      
      <div className="w-full max-w-md">
        {/* Logo Compumarket */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-14 h-14 bg-[#1173b5] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold ml-3 text-[#1173b5]">Compu<span className="text-[#93c441]">Market</span></h1>
          </div>
        </div>
        
        {/* Panel de login */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#dde9d9] relative">
          <div className="bg-gradient-to-r from-[#1173b5] to-[#1a8cd2] p-6">
            <h2 className="text-2xl font-bold text-white text-center">Panel de Administración</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent transition"
                    placeholder="Ingresa tu usuario"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent transition"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg text-white font-bold flex items-center justify-center transition-all ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#1173b5] to-[#1a8cd2] hover:from-[#0d5a8f] hover:to-[#1173b5] focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:ring-offset-2 shadow-md'
                  }`}
                  disabled={loading}
                >
                  <span className="flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Ingresar al panel
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-[#f8fbf8] p-4 border-t border-[#dde9d9] text-center text-sm text-gray-600">
            © 2023 Compumarket - Todos los derechos reservados
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>¿Necesitas ayuda? <a href="#" className="font-medium text-[#1173b5] hover:text-[#0d5a8f]">Contacta al soporte</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;