'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, Package, MapPin, LogOut, Plus, CheckCircle } from 'lucide-react';

export default function Profil() {
  const { user, logout, isLoggedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/giris');
    }
  }, [isLoggedIn, router]);

  if (!user) return null;

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
            {/* Mock Orders - Gerçek veriler API'den çekilmeli */}
            {[1, 2].map((order) => (
              <div key={order} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-50">
                  <div>
                    <span className="text-sm text-gray-500">Sipariş No</span>
                    <p className="font-bold text-gray-900">#202400{order}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <span className="text-sm text-gray-500">Tarih</span>
                    <p className="font-medium text-gray-900">12 Ocak 2024</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Teslim Edildi
                    </span>
                  </div>
                  <p className="font-bold text-blue-600 text-lg">1.250,00 ₺</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'addresses':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kayıtlı Adresler</h2>
              <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Yeni Adres
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl relative">
                <div className="absolute top-4 right-4 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Ev Adresim</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Atatürk Mah. Cumhuriyet Cad. No:123 D:4<br />
                  Kadıköy / İstanbul
                </p>
              </div>
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