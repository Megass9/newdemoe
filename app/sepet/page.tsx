'use client';

import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Sepet() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const total = getTotal();
  const shippingCost = total > 150 ? 0 : 29.90;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          Alışveriş Sepetim
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sepetiniz Henüz Boş</h2>
            <p className="text-gray-500 mb-8 text-lg">
              Henüz sepetinize ürün eklemediniz. En yeni teknolojileri keşfetmeye ne dersiniz?
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20"
            >
              <ArrowLeft className="w-5 h-5" /> Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md">
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-blue-600 font-bold text-xl">{item.price.toLocaleString('tr-TR')} ₺</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-blue-600 transition disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-blue-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Sepetten Kaldır"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-medium">{total.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">Ücretsiz</span>
                    ) : (
                      <span className="font-medium">{shippingCost.toLocaleString('tr-TR')} ₺</span>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">Toplam</span>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-blue-600">{finalTotal.toLocaleString('tr-TR')} ₺</span>
                      <span className="text-xs text-gray-500">KDV Dahil</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Ödemeye Geç <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Güvenli Ödeme</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> 3D Secure</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}