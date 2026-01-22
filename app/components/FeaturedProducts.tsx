'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 3)); // İlk 3 ürünü göster
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Müşterilerimizin en çok tercih ettiği premium ürünleri keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <Link href={`/urun/${product.id}`}>
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                </Link>
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Popüler
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">⭐</span>
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                    4.8
                  </span>
                </div>
              </div>

              <div className="p-6">
                <Link href={`/urun/${product.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-indigo-600">{product.price} TL</span>
                    <span className="text-sm text-gray-500 line-through">1.299 TL</span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-semibold text-sm">17% İndirim</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🛒 Sepete Ekle
                  </button>
                  <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
                    <span className="text-gray-400 group-hover:text-indigo-600">❤️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/kategoriler"
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Tüm Ürünleri Gör
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}