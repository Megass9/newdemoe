'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ShoppingCart, ArrowLeft, PackageX, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category?: { name: string };
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [addedProducts, setAddedProducts] = useState<string[]>([]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  useEffect(() => {
    params.then(p => setCategoryName(decodeURIComponent(p.slug)));
  }, [params]);

  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter((p: Product) => 
            p.category?.name?.toLowerCase() === categoryName.toLowerCase()
          );
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
                <p className="text-gray-500 mt-1">{products.length} ürün listeleniyor</p>
            </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
                <PackageX className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Bu kategoride henüz ürün bulunmuyor. Diğer kategorilerimize göz atabilirsiniz.
            </p>
            <Link href="/urunler" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Tüm Ürünleri Gör
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
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
      </main>
      
      <Footer />
    </div>
  );
}