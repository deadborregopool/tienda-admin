import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate('/productos');
    } catch (err) {
      setError('Error al eliminar el producto');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#1173b5] font-medium text-lg animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-[#1173b5] border-solid rounded-full animate-spin mb-4"></div>
          Cargando detalles del producto...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
        <div className="mt-6">
          <Link 
            to="/productos" 
            className="inline-flex items-center text-[#1173b5] hover:text-[#0e5a8f] font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a la lista de productos
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-[#dde9d9] rounded-full p-4 inline-block mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#1173b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            El producto que estás buscando no existe o ha sido eliminado
          </p>
          <Link 
            to="/productos" 
            className="inline-flex items-center bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">¿Eliminar producto?</h3>
              <div className="mt-2">
                <p className="text-gray-500">
                  ¿Estás seguro de que deseas eliminar permanentemente este producto? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                onClick={handleDelete}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <Link 
          to="/productos" 
          className="inline-flex items-center text-[#1173b5] hover:text-[#0e5a8f] font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a la lista de productos
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#dde9d9]">
        {/* Encabezado con nombre y categoría */}
        <div className="bg-[#1173b5] p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{product.nombre}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm">
                  {product.categoria}
                </span>
                <span className="text-white opacity-80">•</span>
                <span className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm">
                  {product.subcategoria}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/productos/editar/${product.id}`}
                className="bg-[#93c441] hover:bg-[#7daa3a] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {product.imagenes && product.imagenes.length > 0 ? (
              <>
                <div className="bg-gray-100 rounded-xl overflow-hidden border-2 border-[#dde9d9] h-96 flex items-center justify-center">
                  <img 
                    src={product.imagenes[currentImage]} 
                    alt={`${product.nombre} ${currentImage + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {product.imagenes.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`rounded-lg overflow-hidden border-2 h-24 transition-all ${
                        index === currentImage 
                          ? 'border-[#93c441] scale-105' 
                          : 'border-transparent hover:border-[#1173b5]'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Vista previa ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 w-full h-96 flex flex-col items-center justify-center p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Sin imágenes disponibles</h3>
                <p className="text-gray-500">Este producto no tiene imágenes asociadas</p>
              </div>
            )}
          </div>
          
          {/* Detalles del producto */}
          <div>
            <div className="bg-[#dde9d9] bg-opacity-50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-bold text-[#1173b5] mb-3">Descripción</h2>
              <p className="text-gray-700">{product.descripcion || 'No hay descripción disponible'}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="bg-white border border-[#dde9d9] rounded-xl p-4">
                <h3 className="font-medium text-gray-500 mb-1">Precio base</h3>
                <p className="text-2xl font-bold text-gray-800">S/.{product.precio}</p>
              </div>
              
              <div className="bg-white border border-[#dde9d9] rounded-xl p-4">
                <h3 className="font-medium text-gray-500 mb-1">Stock disponible</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">{product.stock}</span>
                  <span className="text-gray-600">unidades</span>
                </div>
              </div>
              
              <div className="bg-white border border-[#dde9d9] rounded-xl p-4">
                <h3 className="font-medium text-gray-500 mb-1">Estado</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    product.estado === 'disponible' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="font-medium capitalize">{product.estado}</span>
                </div>
              </div>
              
              <div className="bg-white border border-[#dde9d9] rounded-xl p-4">
                <h3 className="font-medium text-gray-500 mb-1">Orientado a</h3>
                <p className="font-medium">{product.orientado_a || 'Todos los públicos'}</p>
              </div>
            </div>
            
            {product.en_oferta && (
              <div className="bg-gradient-to-r from-[#93c441] to-[#7daa3a] p-5 rounded-xl mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white text-[#93c441] px-3 py-1 rounded-full font-bold text-sm">
                        OFERTA ESPECIAL
                      </span>
                      <span className="text-white font-bold text-sm">
                        {product.porcentaje_descuento}% DE DESCUENTO
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-white text-xl line-through opacity-80">
                        S/.{product.precio}
                      </span>
                      <span className="text-white text-3xl font-bold">
                        S/.{product.precio_final}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                    <div className="text-white font-medium text-sm">
                      Ahorras: S/.{(product.precio - product.precio_final).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/productos/editar/${product.id}`}
                className="flex-1 min-w-[200px] bg-[#1173b5] hover:bg-[#0e5a8f] text-white px-5 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar Producto
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 min-w-[200px] bg-red-100 hover:bg-red-200 text-red-700 px-5 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar Producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;