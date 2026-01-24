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
  description: string;
}

export default function UrunDetay() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((p: Product) => p.id === Number(id));
          setProduct(found || null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">Ürün bulunamadı.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-bold mb-6">{product.price} TL</p>
            <p className="text-gray-600 mb-8">{product.description || 'Ürün açıklaması bulunmuyor.'}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
