import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getProducts, 
  deleteProduct, 
  searchProducts,
  filterByPrice,
  filterByStock
} from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minStock: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar productos');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchProducts(searchQuery);
      setProducts(results);
      setLoading(false);
    } catch (err) {
      setError('Error al buscar productos: ' + err.message);
      setLoading(false);
    }
  };

  const handleFilter = async (filterType) => {
    try {
      setLoading(true);
      let filteredProducts = [];
      
      switch (filterType) {
        case 'price':
          if (filters.minPrice || filters.maxPrice) {
            filteredProducts = await filterByPrice(
              filters.minPrice || 0,
              filters.maxPrice || 1000000
            );
          }
          break;
          
        case 'stock':
          if (filters.minStock) {
            filteredProducts = await filterByStock(filters.minStock);
          }
          break;
          
        default:
          filteredProducts = await getProducts();
      }
      
      if (filteredProducts.length > 0) {
        setProducts(filteredProducts);
      } else {
        setError('No se encontraron productos con esos filtros');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error al aplicar filtros: ' + err.message);
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', minStock: '' });
    loadProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#1173b5] font-medium text-lg animate-pulse">
          Cargando productos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 max-w-2xl mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1173b5]">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">Administra tu catálogo de productos</p>
        </div>
        <Link 
          to="/productos/nuevo"
          className="bg-[#93c441] hover:bg-[#7daa3a] text-white px-5 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Nuevo Producto
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-lg mb-8 border border-[#dde9d9] overflow-hidden">
        <div className="bg-[#1173b5] p-4">
          <h2 className="text-xl font-semibold text-white">Filtros y Búsqueda</h2>
        </div>
        
        <div className="p-5">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos por nombre, descripción o categoría..."
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-6 py-3 rounded-r-lg transition-colors duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Buscar
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Precio mínimo</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">S/.</span>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Precio máximo</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">S/.</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                  placeholder="1000.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Stock mínimo</label>
              <input
                type="number"
                value={filters.minStock}
                onChange={(e) => setFilters({...filters, minStock: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilter('price')}
              className="bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-5 py-2.5 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              Filtrar por Precio
            </button>
            <button
              onClick={() => handleFilter('stock')}
              className="bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-5 py-2.5 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Filtrar por Stock
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-[#dde9d9] hover:bg-[#c7d4c0] text-gray-700 px-5 py-2.5 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#dde9d9]">
        <div className="bg-[#1173b5] p-4">
          <h2 className="text-xl font-semibold text-white">Lista de Productos</h2>
          <p className="text-[#c2e0ff] text-sm mt-1">
            {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#dde9d9]">
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Imagen</th>
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Producto</th>
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Precio</th>
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Stock</th>
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Categoría</th>
                <th className="py-4 px-5 text-left text-gray-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde9d9]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#f8faf7] transition-colors">
                  <td className="py-4 px-5">
                    {product.imagenes && product.imagenes.length > 0 ? (
                      <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 overflow-hidden flex items-center justify-center">
                        <img 
                          src={product.imagenes[0]} 
                          alt={product.nombre} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl w-16 h-16 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-medium text-gray-900">{product.nombre}</div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-md">{product.descripcion}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-medium">S/.{product.precio}</div>
                    {product.en_oferta && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#93c441] text-white text-xs px-2 py-1 rounded-full">OFERTA</span>
                        <div className="text-sm">
                          <span className="font-medium">S/.{product.precio_final}</span>
                          <span className="text-gray-500 ml-1">({product.porcentaje_descuento}% dto)</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 20 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 5 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}  unidades
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-medium">{product.subcategoria}</div>
                    <div className="text-sm text-gray-600">{product.categoria}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col space-y-2 min-w-[120px]">
                      <Link
                        to={`/productos/${product.id}`}
                        className="text-[#1173b5] hover:text-[#0e5a8f] transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Ver Detalle
                      </Link>
                      <Link
                        to={`/productos/editar/${product.id}`}
                        className="text-[#93c441] hover:text-[#7daa3a] transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Modificar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-2 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-[#dde9d9] rounded-full p-4 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#1173b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Intenta ajustar tus filtros de búsqueda o crear un nuevo producto
              </p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 text-[#1173b5] hover:text-[#0e5a8f] font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;