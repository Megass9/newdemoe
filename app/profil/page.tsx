'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

export default function Profil() {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bilgiler');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/giris');
      return;
    }

    if (activeTab === 'siparisler') {
      fetchOrders();
    }
  }, [isLoggedIn, activeTab, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Filter orders for current user (mock - in real app, filter by userId)
        setOrders(data.slice(0, 3)); // Show last 3 orders
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Profilim</h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-8">
          <button
            onClick={() => setActiveTab('bilgiler')}
            className={`px-4 py-2 ${activeTab === 'bilgiler' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Bilgilerim
          </button>
          <button
            onClick={() => setActiveTab('adresler')}
            className={`px-4 py-2 ${activeTab === 'adresler' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Adreslerim
          </button>
          <button
            onClick={() => setActiveTab('siparisler')}
            className={`px-4 py-2 ${activeTab === 'siparisler' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Siparişlerim
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bilgiler' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <p className="mt-1 p-2 bg-gray-50 rounded">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 p-2 bg-gray-50 rounded">{user?.email}</p>
              </div>
            </div>
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Bilgileri Düzenle
            </button>
          </div>
        )}

        {activeTab === 'adresler' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Adreslerim</h2>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium">Ev Adresi</h3>
                <p className="text-gray-600 mt-1">
                  İstanbul, Kadıköy<br />
                  Bağdat Caddesi No: 123<br />
                  34700 Kadıköy/İstanbul
                </p>
                <div className="mt-2 space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">Düzenle</button>
                  <button className="text-red-600 hover:underline text-sm">Sil</button>
                </div>
              </div>
            </div>
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Yeni Adres Ekle
            </button>
          </div>
        )}

        {activeTab === 'siparisler' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sipariş Geçmişim</h2>
            {loading ? (
              <div className="text-center py-8">Yükleniyor...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz siparişiniz bulunmuyor.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Sipariş #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total} TL</p>
                        <span className={`text-sm px-2 py-1 rounded ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} ürün
                    </div>
                    <button className="mt-2 text-blue-600 hover:underline text-sm">
                      Detayları Görüntüle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}