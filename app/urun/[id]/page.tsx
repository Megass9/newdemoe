'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
}

export default function KategoriPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const slug = params?.slug;
  const categoryName = typeof slug === 'string' ? decodeURIComponent(slug) : '';

  useEffect(() => {
    if (!categoryName) return;

    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter((p: Product) => p.category?.name === categoryName);
          setProducts(filtered);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="text-xl text-gray-500">Yükleniyor...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">{categoryName}</h1>
        
        {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">Bu kategoride henüz ürün bulunmamaktadır.</p>
                <Link href="/urunler" className="text-blue-600 hover:text-blue-800 font-medium">
                    Tüm ürünlere göz at
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <Link href={`/urun/${product.id}`} className="relative h-48 bg-gray-100 block">
                    <img 
                        src={product.images[0] || '/placeholder.jpg'} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                    />
                </Link>
                <div className="p-4 flex-grow flex flex-col">
                    <Link href={`/urun/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2 line-clamp-2">{product.name}</h3>
                    </Link>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">{product.price} TL</span>
                    </div>
                    <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                    Sepete Ekle
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
}