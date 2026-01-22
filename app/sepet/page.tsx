'use client';

import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Sepet() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
        {cart.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {cart.map(item => (
                <div key={item.id} className="flex items-center border-b py-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>{item.price} TL</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
              <p className="mb-4">Toplam: {getTotal()} TL</p>
              <Link href="/checkout" className="bg-blue-600 text-white px-6 py-3 rounded-lg block text-center">
                Ödeme Yap
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}