'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Plus, Truck, Landmark } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressTitle: '',
    country: 'Türkiye',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    invoiceType: 'Bireysel',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');

  useEffect(() => {
    if (user) {
      // Kullanıcı bilgilerini önceden doldur
      setFormData(prev => ({
        ...prev,
        email: prev.email || user.email || '',
        fullName: prev.fullName || user.displayName || ''
      }));

      // Kayıtlı adresleri getir
      const fetchAddresses = async () => {
        try {
          if (user.uid) {
            const q = query(collection(db, 'addresses'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const addresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedAddresses(addresses);
          }
        } catch (error) {
          console.error("Adresler yüklenirken hata:", error);
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    if (id === 'new') {
      setFormData(prev => ({
        ...prev,
        addressTitle: '',
        country: 'Türkiye',
        city: '',
        district: '',
        postalCode: '',
        address: '',
        invoiceType: 'Bireysel'
      }));
    } else {
      const addr = savedAddresses.find(a => a.id === id);
      if (addr) {
        setFormData(prev => ({
          ...prev,
          addressTitle: addr.title || '',
          fullName: addr.fullName || prev.fullName,
          phone: addr.phone || prev.phone,
          country: addr.country || 'Türkiye',
          city: addr.city || '',
          district: addr.district || '',
          postalCode: addr.postalCode || '',
          address: addr.content || '',
          invoiceType: addr.invoiceType || 'Bireysel'
        }));
      }
    }
  };

  // Toplam tutarı sepet verilerinden hesapla
  const total = cart?.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0) || 0;

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
          <Link href="/" className="text-blue-600 hover:underline">Alışverişe Dön</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: total,
          guestName: formData.fullName || "",
          guestEmail: formData.email || "",
          guestPhone: formData.phone || "",
          userId: user?.uid || null,
          paymentMethod: paymentMethod,
          // Backend şemasında paymentMethod alanı olmayabileceği için bu bilgiyi adres alanına ekliyoruz
          address: `[${formData.addressTitle}] ${formData.address}, ${formData.district}/${formData.city}, ${formData.country} ${formData.postalCode} - ${formData.invoiceType} - Ödeme: ${paymentMethod === 'cod' ? 'Kapıda Ödeme' : paymentMethod === 'bank_transfer' ? 'Havale/EFT' : 'Kredi Kartı'}`,
          status: 'PENDING'
        })
      });

      if (response.ok) {
        clearCart();
        alert('Siparişiniz başarıyla alındı!');
        router.push('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Sipariş oluşturulurken bir hata oluştu${errorData.error || errorData.message ? ': ' + (errorData.error || errorData.message) : '.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <Link href="/sepet" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Sepete Dön
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-grow">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Teslimat Adresi</h2>
              
              {/* Kayıtlı Adresler Seçimi */}
              {user && savedAddresses.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Kayıtlı Adreslerim</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr.id)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-blue-300 ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? 'border-blue-600' : 'border-gray-300'}`}>
                            {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              {addr.title}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {addr.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {addr.district} / {addr.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div 
                      onClick={() => handleAddressSelect('new')}
                      className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 ${selectedAddressId === 'new' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-gray-200'}`}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="font-medium text-sm">Yeni Adres Gir</span>
                    </div>
                  </div>
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                {/* E-posta alanı sipariş takibi için gereklidir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input 
                      required
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres Başlığı*</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ev, İş..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.addressTitle}
                      onChange={e => setFormData({...formData, addressTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad*</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ülke Seçin*</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                    >
                      <option value="Türkiye">Türkiye</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İl Seçiniz*</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İlçe Seçiniz*</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.district}
                      onChange={e => setFormData({...formData, district: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.postalCode}
                      onChange={e => setFormData({...formData, postalCode: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres*</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Mahalle, sokak, cadde ve diğer bilgilerinizi girebilirsiniz"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
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
                        checked={formData.invoiceType === 'Bireysel'}
                        onChange={(e) => setFormData({...formData, invoiceType: e.target.value})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Bireysel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="invoiceType" 
                        value="Kurumsal"
                        checked={formData.invoiceType === 'Kurumsal'}
                        onChange={(e) => setFormData({...formData, invoiceType: e.target.value})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Kurumsal</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Ödeme Yöntemi
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium text-sm">Kredi Kartı</span>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="font-medium text-sm">Kapıda Ödeme</span>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <Landmark className="w-6 h-6" />
                      <span className="font-medium text-sm">EFT / Havale</span>
                    </div>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                        <input 
                          required
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          value={formData.cardNumber}
                          onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma (AA/YY)</label>
                          <input 
                            required
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            value={formData.expiry}
                            onChange={e => setFormData({...formData, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                          <input 
                            required
                            type="text" 
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            value={formData.cvc}
                            onChange={e => setFormData({...formData, cvc: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                      <p>Kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz.</p>
                      <p className="mt-2 text-xs opacity-80">* Kapıda ödeme hizmet bedeli kargo firması tarafından tahsil edilebilir.</p>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-medium text-gray-900 mb-2">Banka Hesap Bilgileri:</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Banka: <strong>Ziraat Bankası</strong></p>
                        <p>Alıcı: <strong>Vadeli İletişim Ltd. Şti.</strong></p>
                        <p>IBAN: <strong>TR00 0000 0000 0000 0000 0000 00</strong></p>
                        <p className="mt-3 text-xs text-gray-500">Sipariş numaranızı açıklama kısmına yazmayı unutmayınız.</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h3>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-gray-500">{item.quantity || 1} x {item.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{total?.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Bedava</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                  <span>Toplam</span>
                  <span className="text-blue-600">{total?.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}