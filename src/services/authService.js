import axios from 'axios';

// Usando tu endpoint real
const API_URL = 'https://tienda-kxep.onrender.com/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    
    // Asegurándonos de obtener el token de la respuesta
    return response.data.token || response.data.access_token;
  } catch (error) {
    // Mejor manejo de errores
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        throw new Error(data.error || 'Credenciales inválidas');
      } else {
        throw new Error(data.error || `Error en el servidor (${status})`);
      }
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
};