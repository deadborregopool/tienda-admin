import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getProductById, 
  getCategories,
  createProduct,
  updateProduct,
  updateProductWithImages
} from '../services/productService';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [imagenesPreviews, setImagenesPreviews] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    estado: 'Nuevo',
    orientado_a: 'Adultos',
    categoria_id: '',
    subcategoria_id: '',
    en_oferta: false,
    porcentaje_descuento: 0
  });
  const urlToFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error al convertir URL a File:', error);
    return null;
  }
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cats = await getCategories();
        setCategorias(cats);
        
        if (id) {
          const productoExistente = await getProductById(id);
          
          setProducto({
            nombre: productoExistente.nombre,
            descripcion: productoExistente.descripcion,
            precio: productoExistente.precio,
            stock: productoExistente.stock,
            estado: productoExistente.estado,
            orientado_a: productoExistente.orientado_a,
            categoria_id: productoExistente.categoria_id,
            subcategoria_id: productoExistente.subcategoria_id,
            en_oferta: productoExistente.en_oferta,
            porcentaje_descuento: productoExistente.porcentaje_descuento
          });
          if (productoExistente.imagenes && productoExistente.imagenes.length > 0) {
          const imagenesFilesPromises = productoExistente.imagenes.map(async (imgUrl) => {
            const filename = imgUrl.split('/').pop();
            return urlToFile(imgUrl, filename);
          });
          
          const imagenesFiles = (await Promise.all(imagenesFilesPromises)).filter(Boolean);
          
          setImagenesFiles(imagenesFiles);
          
          setImagenesPreviews(imagenesFiles.map(file => ({
            url: URL.createObjectURL(file),
            isExisting: true,
            file
          })));
        }
          // Cargar previsualizaciones de imágenes existentes
          if (productoExistente.imagenes && productoExistente.imagenes.length > 0) {
            setImagenesPreviews(productoExistente.imagenes.map(img => ({
              url: img,
              isExisting: true,
              id: img
            })));
          }
            // Guardar imágenes existentes por separado
        if (productoExistente.imagenes && productoExistente.imagenes.length > 0) {
          const imagenesExistentes = productoExistente.imagenes.map(img => ({
            url: img,
            nombre: img.split('/').pop() // Guardar solo el nombre del archivo
          }));
          
          setImagenesExistentes(imagenesExistentes);
          
          // Previsualizaciones incluyen las existentes
          setImagenesPreviews(imagenesExistentes.map(img => ({
            url: img.url,
            isExisting: true,
            nombre: img.nombre
          })));
        } 
          // Cargar subcategorías
          if (productoExistente.categoria_id) {
            const cat = cats.find(c => c.id === parseInt(productoExistente.categoria_id));
            if (cat) {
              setSubcategorias(cat.subcategorias);
            }
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar datos del producto');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    const categoria = categorias.find(c => c.id == categoriaId);
    
    setSubcategorias(categoria ? categoria.subcategorias : []);
    
    setProducto({
      ...producto,
      categoria_id: categoriaId,
      subcategoria_id: ''
    });
  };
  
 const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Previsualización de nuevas imágenes
  const newPreviews = files.map(file => ({
    url: URL.createObjectURL(file),
    isExisting: false,
    file
  }));
  
  setImagenesPreviews([...imagenesPreviews, ...newPreviews]);
  setImagenesFiles([...imagenesFiles, ...files]);
};

const removeImage = (index) => {
  const imageToRemove = imagenesPreviews[index];
  
  if (imageToRemove.isExisting) {
    // Agregar a imágenes a eliminar
    setImagenesAEliminar([...imagenesAEliminar, imageToRemove.nombre]);
  }
  
  // Eliminar de las previsualizaciones
  const newPreviews = [...imagenesPreviews];
  newPreviews.splice(index, 1);
  setImagenesPreviews(newPreviews);
  
  // Si es una nueva imagen, eliminar del array de archivos
  if (!imageToRemove.isExisting) {
    setImagenesFiles(imagenesFiles.filter(
      file => file.name !== imageToRemove.file.name
    ));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validación
  if (!producto.nombre.trim()) {
    setError('El nombre del producto es obligatorio');
    return;
  }
  
  setError('');
  setLoading(true);
  
  try {
    const productData = { 
      ...producto,
      categoria_id: Number(producto.categoria_id),
      subcategoria_id: Number(producto.subcategoria_id),
    };
    
    if (id) {
      // Filtrar imágenes no eliminadas
      const imagenesAEnviar = imagenesFiles.filter((_, index) => {
        return !imagenesAEliminar.includes(index);
      });
      
      await updateProductWithImages(
        id, 
        productData, 
        imagenesAEnviar
      );
    } else {
      await createProduct(productData, imagenesFiles);
    }
    
    navigate('/productos');
  } catch (err) {
    setError('Error al guardar: ' + (err.message || JSON.stringify(err)));
    console.error("Error detallado:", err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-12 border-4 border-t-[#1173b5] border-r-[#93c441] border-b-[#0e5a8f] border-l-[#dde9d9] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-[#1173b5] mb-2">Cargando producto</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {id ? 'Obteniendo detalles del producto...' : 'Preparando el formulario para nuevo producto...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1173b5]">
            {id ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Actualiza los detalles de tu producto existente' : 'Completa todos los campos para agregar un nuevo producto'}
          </p>
        </div>
        <button
          onClick={() => navigate('/productos')}
          className="bg-[#dde9d9] hover:bg-[#c7d4c0] text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a productos
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span><strong>Error:</strong> {error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-[#dde9d9] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Columna izquierda - Información básica */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1173b5] mb-4 pb-2 border-b border-[#dde9d9]">
                Información Básica
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="text-red-500">*</span> Nombre del producto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={producto.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    placeholder="Ej: Laptop HP Pavilion 15"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="text-red-500">*</span> Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={producto.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    rows="4"
                    placeholder="Describe el producto con detalle..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <span className="text-red-500">*</span> Precio (S/.)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">S/.</span>
                      <input
                        type="number"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        className="w-full pl-8 pr-3 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <span className="text-red-500">*</span> Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={producto.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1173b5] mb-4 pb-2 border-b border-[#dde9d9]">
                Categorización
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <span className="text-red-500">*</span> Estado
                    </label>
                    <select
                      name="estado"
                      value={producto.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Usado">Usado</option>
                      <option value="Reacondicionado">Reacondicionado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <span className="text-red-500">*</span> Orientado a
                    </label>
                    <select
                      name="orientado_a"
                      value={producto.orientado_a}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    >
                      <option value="Adultos">Adultos</option>
                      <option value="Niños">Niños</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="text-red-500">*</span> Categoría
                  </label>
                  <select
                    name="categoria_id"
                    value={producto.categoria_id}
                    onChange={handleCategoriaChange}
                    className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="text-red-500">*</span> Subcategoría
                  </label>
                  <select
                    name="subcategoria_id"
                    value={producto.subcategoria_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                    required
                    disabled={!producto.categoria_id}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {subcategorias.map(subcategoria => (
                      <option key={subcategoria.id} value={subcategoria.id}>
                        {subcategoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Ofertas e Imágenes */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1173b5] mb-4 pb-2 border-b border-[#dde9d9]">
                Ofertas y Descuentos
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="en_oferta"
                        checked={producto.en_oferta}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${
                        producto.en_oferta ? 'bg-[#93c441]' : 'bg-gray-300'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                        producto.en_oferta ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">Este producto está en oferta</div>
                  </label>
                </div>
                
                {producto.en_oferta && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Porcentaje de descuento</label>
                    <div className="relative">
                      <span className="absolute right-3 top-3 text-gray-500">%</span>
                      <input
                        type="number"
                        name="porcentaje_descuento"
                        value={producto.porcentaje_descuento}
                        onChange={handleChange}
                        className="w-full pr-10 py-3 border border-[#dde9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93c441] focus:border-transparent"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="0-100%"
                      />
                    </div>
                    <div className="mt-2 bg-[#dde9d9] p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Precio final: <span className="font-bold">S/.{(producto.precio * (1 - producto.porcentaje_descuento/100)).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-[#1173b5] mb-4 pb-2 border-b border-[#dde9d9]">
                Imágenes del Producto
              </h2>
              
              <div className="mb-4">
                <div 
                  className="border-2 border-dashed border-[#dde9d9] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#93c441] transition-colors p-8 text-center"
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#93c441]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium text-[#1173b5] mt-3">Agregar imágenes</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Arrastra y suelta imágenes aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formatos soportados: JPG, PNG, WEBP. Máx. 5MB por imagen
                  </p>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {imagenesPreviews.map((preview, index) => (
  <div key={index} className={`relative group rounded-xl overflow-hidden border-2 h-40 ${
    preview.markedForDelete ? 'border-red-500 opacity-60' : 'border-[#dde9d9]'
  }`}>
    <img 
      src={preview.url} 
      alt={`Preview ${index}`} 
      className="w-full h-full object-cover"
    />
    <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    {preview.isExisting && !preview.markedForDelete && (
      <span className="absolute bottom-2 left-2 bg-[#1173b5] text-white text-xs px-2 py-1 rounded">
        Existente
      </span>
    )}
    
    {preview.markedForDelete && (
      <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        Eliminar
      </span>
    )}
  </div>
))}
              </div>
              
              {imagenesPreviews.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">No hay imágenes seleccionadas</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Acciones del formulario */}
        <div className="bg-[#f8fbf8] p-6 border-t border-[#dde9d9] flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/productos')}
            className="bg-[#dde9d9] hover:bg-[#c7d4c0] text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#1173b5] hover:bg-[#0e5a8f] text-white shadow-md'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {id ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {id ? 'Actualizar Producto' : 'Crear Producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;