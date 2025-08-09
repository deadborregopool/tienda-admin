import axios from 'axios';

const API_URL = 'https://tienda-kxep.onrender.com/api';
const ADMIN_API_URL = 'https://tienda-kxep.onrender.com/api/admin';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
export const getProductsBySubcategory = async (subcategoryId) => {
  try {
    const response = await axios.get(`${API_URL}/subcategorias/${subcategoryId}/solo-productos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/categorias/${categoryId}/productos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Categorías y Subcategorías
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Productos Públicos
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/productos/buscar`, {
      params: { term: query } // Cambiado de 'q' a 'term'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const filterByPrice = async (min, max) => {
  try {
    const response = await axios.get(`${API_URL}/productos/filtrar/precio`, {
      params: { min, max } // Mantenemos min y max
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const filterByStock = async (minStock) => {
  try {
    const response = await axios.get(`${API_URL}/productos/filtrar/stock`, {
      params: { stock: minStock } // Corregido a 'stock'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Ofertas
export const getOfertas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ofertas`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Operaciones Protegidas (Admin)
export const createProduct = async (productData, imageFiles) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // 1. Agregar campos del producto
    for (const key in productData) {
      formData.append(key, productData[key]);
    }
    
    // 2. Agregar nuevas imágenes
    imageFiles.forEach(file => {
      formData.append('imagenes', file);
    });
    
    const response = await axios.post(
      `${ADMIN_API_URL}/productos/con-imagenes`, 
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateProduct = async (id, productData, imageFiles) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // 1. Agregar campos del producto como strings
    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', String(productData.precio));
    formData.append('stock', String(productData.stock));
    formData.append('estado', productData.estado);
    formData.append('orientado_a', productData.orientado_a);
    formData.append('subcategoria_id', String(productData.subcategoria_id));
    
    if (productData.en_oferta) {
      formData.append('en_oferta', 'true');
      formData.append('porcentaje_descuento', String(productData.porcentaje_descuento));
    }
    
    // 2. Agregar nuevas imágenes
    imageFiles.forEach(file => {
      formData.append('imagenes', file);
    });
    
    const response = await axios.put(
      `${ADMIN_API_URL}/productos/${id}`, 
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/productos/${id}`, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// ... otros imports ...

export const createProductWithImages = async (productData, files) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Agregar campos del producto
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Agregar archivos de imágenes
    files.forEach(file => {
      formData.append('imagenes', file);
    });
    
    const response = await axios.post(
      `${ADMIN_API_URL}/productos/con-imagenes`, 
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProductWithImages = async (id, productData, imagenes) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Campos del producto
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Agregar todas las imágenes como archivos
    imagenes.forEach(file => {
      formData.append('imagenes', file);
    });
    
    const response = await axios.put(
      `https://tienda-kxep.onrender.com/api/productos/${id}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};