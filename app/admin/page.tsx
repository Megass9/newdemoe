'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  userId: number | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  images: string[];
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  stock?: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
      fetchProducts();
      fetchCategories();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminLoggedIn', 'true');
      fetchOrders();
      fetchProducts();
      fetchCategories();
    } else {
      alert('Yanlış şifre!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Sipariş durumu güncellendi!');
      } else {
        alert('Hata oluştu!');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Hata oluştu!');
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
        alert('Ürün başarıyla silindi!');
      } else {
        alert('Ürün silinirken hata oluştu!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Hata oluştu!');
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setShowAddProduct(false);
        alert('Ürün başarıyla eklendi!');
      } else {
        alert('Ürün eklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Hata oluştu!');
    }
  };

  const updateProduct = async (productId: number, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(product =>
          product.id === productId ? updatedProduct : product
        ));
        setEditingProduct(null);
        alert('Ürün başarıyla güncellendi!');
      } else {
        alert('Ürün güncellenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Hata oluştu!');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Bekliyor',
      PROCESSING: 'Hazırlanıyor',
      SHIPPED: 'Kargoda',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Girişi</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Giriş Yap
              </button>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Demo şifre: admin123
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-8 bg-white rounded-t-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-4 font-medium transition-colors duration-200 border-b-2 ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            📦 Siparişler ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-4 font-medium transition-colors duration-200 border-b-2 ${
              activeTab === 'products'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            🛍️ Ürünler ({products.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-b-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Siparişler</h2>

            {loading ? (
              <div className="text-center py-8">Yükleniyor...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz sipariş yok.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">Sipariş #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')} {new Date(order.createdAt).toLocaleTimeString('tr-TR')}
                        </p>
                        {order.userId ? (
                          <p className="text-sm text-gray-600">Kullanıcı ID: {order.userId}</p>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <p>Misafir: {order.guestName}</p>
                            <p>Email: {order.guestEmail}</p>
                            <p>Telefon: {order.guestPhone}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{order.total} TL</p>
                        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Ürünler:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.product.name} x{item.quantity}</span>
                            <span>{item.price * item.quantity} TL</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="PENDING">Bekliyor</option>
                        <option value="PROCESSING">Hazırlanıyor</option>
                        <option value="SHIPPED">Kargoda</option>
                        <option value="DELIVERED">Teslim Edildi</option>
                        <option value="CANCELLED">İptal Edildi</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-b-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Ürünler</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                ➕ Ürün Ekle
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz ürün yok.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-indigo-600 font-bold text-xl mb-2">{product.price} TL</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'Açıklama yok'}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                      >
                        ✏️ Düzenle
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <ProductForm
            onSubmit={addProduct}
            onCancel={() => setShowAddProduct(false)}
            title="Yeni Ürün Ekle"
            categories={categories}
          />
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={(data) => updateProduct(editingProduct.id, data)}
            onCancel={() => setEditingProduct(null)}
            title="Ürün Düzenle"
            categories={categories}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

// Product Form Component
interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  title: string;
  categories: Category[];
}

function ProductForm({ product, onSubmit, onCancel, title, categories }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    images: product?.images || ['/placeholder.jpg'],
    categoryId: product?.categoryId || '',
    stock: product?.stock || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}