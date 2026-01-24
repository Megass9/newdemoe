'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Filter, SlidersHorizontal, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category?: { name: string };
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

function UrunlerContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(categoryParam || '');
  const [sort, setSort] = useState('');
  const [addedProducts, setAddedProducts] = useState<string[]>([]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (filter && filter !== '') {
      const selectedCategory = categories.find(c => c.name === filter);
      filtered = filtered.filter(p => 
        p.category?.name === filter || 
        (selectedCategory && String(p.categoryId) === String(selectedCategory.id))
      );
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    setFilteredProducts(filtered);
  }, [filter, sort, products, search, categoryParam, categories]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-16">
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tüm Ürünler</h1>
            <p className="text-gray-500 mt-2">
              {search ? `"${search}" için arama sonuçları` : 'En yeni teknoloji ürünlerini keşfedin'}
            </p>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            {filteredProducts.length} ürün listeleniyor
          </span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                <Filter className="w-5 h-5" />
                Filtreler
              </div>
              
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Kategoriler</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setFilter('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filter === '' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Tüm Kategoriler
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => setFilter(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filter === category.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Sort Bar */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-500 pl-2 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Sıralama:
                </span>
                <select 
                  onChange={(e) => setSort(e.target.value)} 
                  value={sort}
                  className="p-2 pr-8 border-none bg-transparent text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
                >
                  <option value="">Varsayılan</option>
                  <option value="newest">En Yeni</option>
                  <option value="price-asc">Fiyat Artan</option>
                  <option value="price-desc">Fiyat Azalan</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                Aradığınız kriterlere uygun ürün bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                    <Link href={`/urun/${product.id}`}>
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img 
                          src={product.images[0] || '/placeholder.jpg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/urun/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-blue-600">{product.price.toLocaleString('tr-TR')} TL</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`p-2.5 rounded-full transition-all shadow-lg ${addedProducts.includes(product.id) ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-900/20'}`}
                          title="Sepete Ekle"
                        >
                          {addedProducts.includes(product.id) ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <ShoppingCart className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Urunler() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <UrunlerContent />
    </Suspense>
  );
}
