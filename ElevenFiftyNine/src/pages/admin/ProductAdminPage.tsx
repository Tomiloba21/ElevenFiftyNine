import { useState, useEffect, useRef } from 'react';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Save, 
  Tag,
  Upload
} from 'lucide-react';
import type { Product } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { ProductApi } from '../../context/ProductApi';
  
export default function ProductAdminPage() {
  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = 'http://localhost:8080/api/v1/product';

  // Initial empty product template
  const emptyProduct: Product = {
    id: '',
    name: '',
    brand: '',
    description: '',
    price: 0,
    discountPrice: null,
    stockQuantity: 0,
    colors: [],
    sizes: [],
    category: '',
    tags: [],
    imageUrl: '',
    featured: false,
    reviewCount: 0,
    averageRating: 0
  };

  const navigate = useNavigate();
  
  // Check authentication on component mount
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      navigate('/auth');
      return;
    }
    
    loadProducts();
  }, [navigate]);

  // Load products using ProductApi
  const loadProducts = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const data = await ProductApi.fetchProducts(currentPage);
      setProducts(data.content);
      setTotalPages(data.page.totalPages);
    } catch (error) {
      console.error('Failed to load products:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        setAuthError('Authentication failed. Please log in again.');
        localStorage.removeItem('userToken');
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to reload products when page changes
  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      loadProducts();
    }
  }, [currentPage]);

  // Handle search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await ProductApi.fetchProducts(0);
      setProducts(data.content.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      ));
      setCurrentPage(0);
    } catch (error) {
      console.error('Search failed:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('userToken');
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete using ProductApi
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Optimistically update UI
      const originalProducts = [...products];
      setProducts(products.filter(p => p.id !== id));
      
      try {
        await ProductApi.deleteProduct(id);
        // Refresh from server to confirm
        await loadProducts();
      } catch (error) {
        // Revert on error
        setProducts(originalProducts);
        console.error('Delete failed:', error);
        alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Reset image selection
  const resetImageSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const getAuthHeaders = () => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('401: Unauthorized - No token found');
    }
    return {
      'Authorization': `Bearer ${userToken}`,
    };
  };

  // Handle save for both create and update
  const handleSave = async () => {
    if (!editingProduct) return;
    
    if (!validateForm(editingProduct)) {
      return;
    }

    setLoading(true);
    try {
      const isNewProduct = editingProduct.id.startsWith('temp-');
      let savedProduct: Product;
      
      if (selectedImage) {
        if (isNewProduct) {
          // First create product without image
          const productWithoutImage = { ...editingProduct };
          delete productWithoutImage.imageUrl; // Remove any placeholder
          
          // Create the product first
          savedProduct = await ProductApi.saveProduct(productWithoutImage);
          
          // Then upload the image separately
          savedProduct = await ProductApi.uploadProductImage(savedProduct.id, selectedImage);
        } else {
          // For existing product with new image
          // Create a FormData object
          const formData = new FormData();
          
          // Add product data as JSON
          const productBlob = new Blob([JSON.stringify(editingProduct)], {
            type: 'application/json'
          });
          formData.append('product', productBlob);
          
          // Add image
          formData.append('image', selectedImage);
          
          // Send the request
          const response = await fetch(`${API_BASE_URL}/${editingProduct.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Failed to update product: ${response.statusText}`);
          }
          
          savedProduct = await response.json();
        }
      } else {
        // No image to upload, just save the product data
        savedProduct = await ProductApi.saveProduct(editingProduct);
      }

      // Update UI
      if (isNewProduct) {
        setProducts([...products, savedProduct]);
      } else {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      }

      resetImageSelection();
      setIsModalOpen(false);
      
      // Reload products to ensure UI is in sync with backend
      await loadProducts();
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (product: Product): boolean => {
    const errors: Record<string, string> = {};
    
    if (!product.name.trim()) errors.name = 'Name is required';
    if (!product.brand.trim()) errors.brand = 'Brand is required';
    if (!product.description.trim()) errors.description = 'Description is required';
    if (product.price <= 0) errors.price = 'Price must be greater than 0';
    if (product.stockQuantity < 0) errors.stockQuantity = 'Stock cannot be negative';
    if (product.colors.length === 0) errors.colors = 'At least one color is required';
    if (product.sizes.length === 0) errors.sizes = 'At least one size is required';
    if (!product.category.trim()) errors.category = 'Category is required';
    if (product.tags.length === 0) errors.tags = 'At least one tag is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle field changes
  const handleFieldChange = (field: keyof Product, value: any) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ''
      });
    }
  };

  // Handle array field changes (colors, sizes, tags)
  const handleArrayFieldChange = (field: 'colors' | 'sizes' | 'tags', action: 'add' | 'remove', value?: string) => {
    if (!editingProduct) return;

    let newArray = [...editingProduct[field]];
    
    if (action === 'add' && value) {
      newArray.push(value);
    } else if (action === 'remove' && value) {
      newArray = newArray.filter(item => item !== value);
    }
    
    handleFieldChange(field, newArray);
  };

  // Open modal for creating/editing
  const openModal = (product: Product | null = null) => {
    resetImageSelection();
    setEditingProduct(product || {...emptyProduct, id: `temp-${Date.now()}`});
    
    // If editing an existing product with an imageUrl, set it as the preview
    if (product && product.imageUrl) {
      setImagePreview(product.imageUrl);
    }
    
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Show auth error if present
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-6">{authError}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">ElevenFiftyNine Admin</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
          >
            <Plus size={18} className="mr-1" /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or brand..."
                className="w-full px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-700">No products found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded object-cover" 
                            src={product.imageUrl || '/api/placeholder/300/300'} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      {product.discountPrice && (
                        <div className="text-sm text-gray-500 line-through">${product.discountPrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stockQuantity > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stockQuantity > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.featured ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages - 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 0 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i;
                      } else if (currentPage <= 2) {
                        pageNumber = i;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 5 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages - 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct.id.startsWith('temp-') ? 'Create Product' : 'Edit Product'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {/* Basic Info */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={editingProduct.brand}
                      onChange={(e) => handleFieldChange('brand', e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.brand ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.brand && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Price ($)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.discountPrice || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseFloat(e.target.value);
                          handleFieldChange('discountPrice', value);
                        }}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editingProduct.stockQuantity}
                      onChange={(e) => handleFieldChange('stockQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.stockQuantity && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.stockQuantity}</p>
                    )}
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image
                    </label>
                    
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="mb-4 relative">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-48 object-contain border rounded bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            resetImageSelection();
                            // Only clear the imageUrl if it's a new product or if a file was selected
                            if (editingProduct.id.startsWith('temp-') || selectedImage) {
                              handleFieldChange('imageUrl', '');
                            }
                          }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      
                      {/* File input */}
                      <div className="flex items-center">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-l flex items-center"
                        >
                          <Upload size={16} className="mr-1" /> Choose File
                        </button>
                        <div className="px-4 py-2 bg-gray-50 border-t border-b border-r border-gray-300 text-sm text-gray-500 flex-grow truncate">
                          {selectedImage ? selectedImage.name : "No file selected"}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div>
                    {/* Colors */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Colors
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingProduct.colors.map((color) => (
                          <span 
                            key={color} 
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => handleArrayFieldChange('colors', 'remove', color)}
                              className="ml-1 text-blue-600 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          id="newColor"
                          placeholder="Add color"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              handleArrayFieldChange('colors', 'add', e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('newColor') as HTMLInputElement;
                            if (input.value.trim()) {
                              handleArrayFieldChange('colors', 'add', input.value.trim());
                              input.value = '';
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {formErrors.colors && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.colors}</p>
                      )}
                    </div>
                    
                    {/* Sizes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sizes
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingProduct.sizes.map((size) => (
                          <span 
                            key={size} 
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => handleArrayFieldChange('sizes', 'remove', size)}
                              className="ml-1 text-green-600 hover:text-green-900"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          id="newSize"
                          placeholder="Add size"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              handleArrayFieldChange('sizes', 'add', e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('newSize') as HTMLInputElement;
                            if (input.value.trim()) {
                              handleArrayFieldChange('sizes', 'add', input.value.trim());
                              input.value = '';
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {formErrors.sizes && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.sizes}</p>
                      )}
                    </div>
                    
                    {/* Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingProduct.category}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingProduct.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            <Tag size={12} className="mr-1" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleArrayFieldChange('tags', 'remove', tag)}
                              className="ml-1 text-purple-600 hover:text-purple-900"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          id="newTag"
                          placeholder="Add tag"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              handleArrayFieldChange('tags', 'add', e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('newTag') as HTMLInputElement;
                            if (input.value.trim()) {
                              handleArrayFieldChange('tags', 'add', input.value.trim());
                              input.value = '';
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {formErrors.tags && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.tags}</p>
                      )}
                    </div>
                    
                    {/* Featured */}
                    <div className="mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingProduct.featured}
                          onChange={(e) => handleFieldChange('featured', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Featured Product
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save size={16} className="mr-1" /> Save
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }