'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function SepetPage() {
  // CartContext'ten sepet verilerini ve fonksiyonlarını alıyoruz
  // Not: Eğer context dosyanızda bu fonksiyonlar farklı isimlendirilmişse (örn: items yerine cart) burayı düzenlemeniz gerekebilir.
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Toplam tutarı sepet verilerinden hesapla
  const total = cart?.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0) || 0;

  // Sepet boş ise gösterilecek ekran
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 mb-8">Henüz sepetinize ürün eklemediniz.</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Alışverişe Başla
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepetim ({cart.length} Ürün)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ürün Listesi */}
          <div className="flex-grow space-y-4">
            {cart.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 md:gap-6">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <img 
                    src={item.images?.[0] || '/placeholder.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.category?.name}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Sepetten Çıkar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-blue-600 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">
                        {(item.price * (item.quantity || 1)).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{total?.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Bedava</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Toplam</span>
                  <span className="font-bold text-2xl text-blue-600">{total?.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Sepeti Onayla
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Güvenli Ödeme
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}