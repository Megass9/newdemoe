'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { CreditCard, MapPin, CheckCircle, ShieldCheck, ArrowLeft, User, Mail, Phone } from 'lucide-react';

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const total = getTotal();
    const shippingCost = total > 150 ? 0 : 29.90;
    const finalTotal = total + shippingCost;

    try {
      const orderData = {
        userId: user?.id || null,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: finalTotal,
        shipping: shippingCost,
        address: formData.address,
        paymentMethod: formData.payment,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setIsSuccess(true);
        clearCart();
      } else {
        alert('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Siparişiniz Alındı!</h2>
            <p className="text-gray-600 mb-8">
              Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: <span className="font-bold text-gray-900">#TR-{Math.floor(Math.random() * 100000)}</span>
            </p>
            <Link 
              href="/" 
              className="inline-block w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = getTotal();
  const shippingCost = total > 150 ? 0 : 29.90;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/sepet" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Sepete Dön
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          Güvenli Ödeme
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Info */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Teslimat Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        placeholder="Adınız Soyadınız"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required 
                        type="email" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required 
                        type="tel" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        placeholder="05XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Adres</label>
                    <textarea 
                      required 
                      rows={3} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                      placeholder="Mahalle, Sokak, No, Daire, İlçe/İl"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Ödeme Bilgileri
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment: 'card'})}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${formData.payment === 'card' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      Kredi Kartı
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment: 'transfer'})}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${formData.payment === 'transfer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      Havale/EFT
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, payment: 'cod'})}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${formData.payment === 'cod' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      Kapıda Ödeme
                    </button>
                  </div>
                </div>

                {formData.payment === 'card' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Ad Soyad" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Kart Numarası</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input type="text" maxLength={19} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="0000 0000 0000 0000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Son Kullanma Tarihi</label>
                        <input type="text" maxLength={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="AA/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CVV</label>
                        <input type="text" maxLength={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
                {formData.payment === 'transfer' && (
                  <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                    Siparişiniz alındıktan sonra IBAN bilgileri gösterilecektir.
                  </div>
                )}
                {formData.payment === 'cod' && (
                  <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                    Kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz.
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity} adet</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
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
                <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-blue-600">{finalTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? (
                  'İşleniyor...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Siparişi Tamamla
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit SSL ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}