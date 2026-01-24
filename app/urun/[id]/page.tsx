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

export default function UrunDetayPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // API'niz destekliyorsa tek bir ürünü çekmek daha verimlidir.
    // Şimdilik tümünü çekip filtreleyeceğiz.
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('Veri yüklenirken hata oluştu');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const foundProduct = data.find((p: Product) => p.id === Number(id));
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Ürün bulunamadı.');
          }
        } else {
          setError('Ürünler yüklenemedi.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError('Bir hata oluştu.');
        setLoading(false);
      });
  }, [id]);

  if (loading || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="text-xl text-gray-500">{loading ? 'Yükleniyor...' : error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    // Bu durum yukarıdaki error state tarafından karşılanmalı, ama bir yedek olarak duruyor.
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
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