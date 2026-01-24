'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'PROCESSING': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    (order.guestName && order.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.guestEmail && order.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Yönetim</span>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Genel Bakış
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'orders' 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Siparişler
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                      {orders.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'products' 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    Ürünler
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                      {products.length}
                    </span>
                  </button>
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Genel Bakış</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Toplam Gelir</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {orders.reduce((acc, order) => acc + order.total, 0).toLocaleString('tr-TR')} TL
                      </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Toplam Sipariş</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <Package className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Aktif Ürünler</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{products.length}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Bekleyen Siparişler</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {orders.filter(o => o.status === 'PENDING').length}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Siparişler</h2>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Sipariş ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Sipariş bulunamadı.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                          <tr>
                            <th className="px-6 py-4">Sipariş No</th>
                            <th className="px-6 py-4">Müşteri</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">
                                    {order.guestName || `Kullanıcı ${order.userId}`}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {order.guestEmail}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {order.total.toLocaleString('tr-TR')} TL
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  {getStatusText(order.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                >
                                  <option value="PENDING">Bekliyor</option>
                                  <option value="PROCESSING">Hazırlanıyor</option>
                                  <option value="SHIPPED">Kargoda</option>
                                  <option value="DELIVERED">Teslim Edildi</option>
                                  <option value="CANCELLED">İptal Edildi</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative w-full sm:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Ürün ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Plus className="w-5 h-5" />
                      Yeni Ürün
                    </button>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                      Ürün bulunamadı.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="bg-white text-gray-900 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h3>
                              <span className="font-bold text-blue-600">{product.price} ₺</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
                              {product.description || 'Açıklama yok'}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                              <span>Stok: {product.stock || 0}</span>
                              <span>{product.category?.name || 'Kategorisiz'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>

          {/* Modals */}
          {showAddProduct && (
            <ProductForm
              onSubmit={addProduct}
              onCancel={() => setShowAddProduct(false)}
              title="Yeni Ürün Ekle"
              categories={categories}
              onCategoryAdd={fetchCategories}
            />
          )}

          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={(data) => updateProduct(editingProduct.id, data)}
              onCancel={() => setEditingProduct(null)}
              title="Ürün Düzenle"
              categories={categories}
              onCategoryAdd={fetchCategories}
            />
          )}
        </div>
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
  onCategoryAdd?: () => void;
}

function ProductForm({ product, onSubmit, onCancel, title, categories, onCategoryAdd }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    images: product?.images || ['/placeholder.jpg'],
    categoryId: product?.categoryId || '',
    stock: product?.stock || 0,
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setNewCategoryName('');
        setIsAddingCategory(false);
        if (onCategoryAdd) onCategoryAdd();
        if (newCategory && newCategory.id) {
          setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
        }
        alert('Kategori eklendi!');
      } else {
        alert('Kategori eklenirken hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Görseller (URL veya Dosya)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  URL Ekle
                </button>
              </div>
              <div className="mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-xl overflow-hidden h-24 bg-gray-50">
                    <img src={img} alt={`Görsel ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <div className="flex gap-2">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  {isAddingCategory ? 'İptal' : '+'}
                </button>
              </div>
              {isAddingCategory && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Yeni Kategori Adı"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    Ekle
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}