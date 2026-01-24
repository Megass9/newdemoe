'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, Package, MapPin, LogOut, Plus, CheckCircle, Truck, Loader2, XCircle, Clock, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Profil() {
  const { user, logout, isLoggedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    country: 'Türkiye',
    city: '',
    district: '',
    content: '',
    postalCode: '',
    invoiceType: 'Bireysel'
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/giris');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (user?.uid && activeTab === 'orders') {
      setLoadingOrders(true);
      
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
          };
        });
        
        // Tarihe göre yeniden eskiye sıralama
        ordersData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(ordersData);
        setLoadingOrders(false);
      }, (error) => {
        console.error('Siparişler dinlenirken hata:', error);
        setLoadingOrders(false);
      });
    }

    if (user?.uid && activeTab === 'addresses') {
      setLoadingAddresses(true);
      const q = query(collection(db, 'addresses'), where('userId', '==', user.uid));
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const addressData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAddresses(addressData);
        setLoadingAddresses(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeTab, user]);

  if (!user) return null;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    try {
      await addDoc(collection(db, 'addresses'), {
        userId: user.uid,
        title: newAddress.title,
        fullName: newAddress.fullName,
        country: newAddress.country,
        city: newAddress.city,
        district: newAddress.district,
        content: newAddress.content,
        postalCode: newAddress.postalCode,
        invoiceType: newAddress.invoiceType,
        createdAt: new Date().toISOString()
      });
      setNewAddress({ title: '', fullName: '', country: 'Türkiye', city: '', district: '', content: '', postalCode: '', invoiceType: 'Bireysel' });
      setShowAddAddress(false);
      alert('Adres başarıyla eklendi.');
    } catch (error) {
      console.error('Adres eklenirken hata:', error);
      alert('Adres eklenemedi.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'addresses', id));
    } catch (error) {
      console.error('Adres silinirken hata:', error);
      alert('Adres silinemedi.');
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    defaultValue={user.displayName || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Bilgileri Güncelle
              </button>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sipariş Geçmişi</h2>
            {loadingOrders ? (
              <div className="text-center py-8 text-gray-500">Siparişler yükleniyor...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz bir siparişiniz bulunmuyor.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-50">
                    <div>
                      <span className="text-sm text-gray-500">Sipariş No</span>
                      <p className="font-bold text-gray-900">#{order.id.toString().padStart(6, '0')}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <span className="text-sm text-gray-500">Tarih</span>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">{order.items?.length || 0} Ürün</span>
                    </div>
                    <p className="font-bold text-blue-600 text-lg">{order.total.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kayıtlı Adresler</h2>
              <button 
                onClick={() => setShowAddAddress(true)}
                className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Yeni Adres
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Teslimat Adresi</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres Başlığı*</label>
                      <input
                        type="text"
                        required
                        placeholder="Ev, İş..."
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad*</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ülke Seçin*</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      >
                        <option value="Türkiye">Türkiye</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İl Seçiniz*</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İlçe Seçiniz*</label>
                      <input
                        type="text"
                        required
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres*</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Mahalle, sokak, cadde ve diğer bilgilerinizi girebilirsiniz"
                      value={newAddress.content}
                      onChange={(e) => setNewAddress({...newAddress, content: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fatura Tipi</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="invoiceType" 
                          value="Bireysel"
                          checked={newAddress.invoiceType === 'Bireysel'}
                          onChange={(e) => setNewAddress({...newAddress, invoiceType: e.target.value})}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Bireysel</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="invoiceType" 
                          value="Kurumsal"
                          checked={newAddress.invoiceType === 'Kurumsal'}
                          onChange={(e) => setNewAddress({...newAddress, invoiceType: e.target.value})}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Kurumsal</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Kaydet</button>
                    <button type="button" onClick={() => setShowAddAddress(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">İptal</button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-gray-200 p-4 rounded-xl relative group hover:border-blue-300 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {addr.title}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {addr.fullName && <span className="font-medium block">{addr.fullName}</span>}
                    {addr.content}<br/>
                    {addr.district && addr.city ? `${addr.district} / ${addr.city}` : ''}
                    {addr.country ? ` - ${addr.country}` : ''}
                  </p>
                </div>
              ))}
              {addresses.length === 0 && !showAddAddress && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Kayıtlı adres bulunamadı.
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.displayName || 'Kullanıcı'}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profil Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'orders' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Siparişlerim
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'addresses' 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  Adreslerim
                </button>
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}