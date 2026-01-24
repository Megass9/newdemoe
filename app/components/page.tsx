'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
}

export default function Urunler() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filter && filter !== '') {
      filtered = filtered.filter(p => p.category.name === filter);
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [filter, sort, products]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Tüm Ürünler</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
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
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Tüm Ürünler</h1>
        <div className="flex gap-4 mb-8">
          <select onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
            <option value="">Tüm Kategoriler</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Giyim">Giyim</option>
            <option value="Ev & Yaşam">Ev & Yaşam</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)} className="p-2 border rounded">
            <option value="">Sırala</option>
            <option value="newest">En Yeni</option>
            <option value="price-asc">Fiyat Artan</option>
            <option value="price-desc">Fiyat Azalan</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {Array.isArray(filteredProducts) && filteredProducts.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Link href={`/urun/${product.id}`}>
                <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover cursor-pointer" />
              </Link>
              <div className="p-4">
                <Link href={`/urun/${product.id}`}>
                  <h3 className="text-lg font-semibold cursor-pointer hover:text-blue-600">{product.name}</h3>
                </Link>
                <p className="text-gray-600">{product.price} TL</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}