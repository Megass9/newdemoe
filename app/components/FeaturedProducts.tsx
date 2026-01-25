'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, ArrowRight, Check, Loader2, ShoppingBag , Heart } from 'lucide-react';

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
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(item => item !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4)); // Show 4 products to match grid
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

if (loading) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
      
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
          <ShoppingBag className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Vadeli<span className="text-blue-600">İletişim</span>
          </h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            Teknoloji Store
          </p>
        </div>
      </div>

      {/* Spinner + Text */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-lg font-medium text-gray-700">
          Ürünler hazırlanıyor
        </p>
        <p className="text-sm text-gray-500">
          Senin için en iyilerini yüklüyoruz 🚀
        </p>
      </div>

      {/* Skeleton Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-300 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Öne Çıkanlar</h3>
            <p className="text-gray-500 mt-2">Bu hafta en çok satan ürünlerimiz.</p>
          </div>
          <Link href="/urunler" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src={product.images[0] || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                  Teknoloji
                </div>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm z-10"
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current text-red-500' : ''}`} />
                </button>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full text-sm font-medium shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 w-10/12 flex items-center justify-center gap-2 ${addedProducts.includes(product.id) ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}
                >
                  {addedProducts.includes(product.id) ? (
                    <><Check className="w-4 h-4" /> Eklendi</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Sepete Ekle</>
                  )}
                </button>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-gray-300" />
                  <span className="text-xs text-gray-400 ml-1">(4.2)</span>
                </div>
                <Link href={`/urun/${product.id}`}>
                    <h4 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition">{product.name}</h4>
                </Link>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                  <span className="text-xl font-bold text-gray-900">₺{product.price}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">Ücretsiz Kargo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}