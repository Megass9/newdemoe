'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'card'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: user?.id || null, // Add userId if logged in
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotal(),
        shipping: 0, // Ücretsiz kargo
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
        const result = await response.json();
        alert(`Siparişiniz başarıyla oluşturuldu! Sipariş No: ${result.orderId}`);
        clearCart();
        router.push('/');
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

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Ad Soyad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Adres</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Ödeme Yöntemi</label>
              <select
                value={formData.payment}
                onChange={(e) => setFormData({...formData, payment: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="card">Kart</option>
                <option value="transfer">Havale</option>
                <option value="cod">Kapıda Ödeme</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
          </form>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x{item.quantity}</span>
                <span>{item.price * item.quantity} TL</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between font-semibold">
              <span>Toplam</span>
              <span>{getTotal()} TL</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}