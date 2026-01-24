'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ShoppingCart, ArrowLeft, Check, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  category?: { name: string };
  categoryId?: string;
  stock?: number;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);

          // Benzer ürünleri getir
          if (data.categoryId) {
            try {
              const productsRes = await fetch('/api/products');
              if (productsRes.ok) {
                const allProducts = await productsRes.json();
                const similar = allProducts
                  .filter((p: Product) => p.categoryId === data.categoryId && p.id !== data.id)
                  .slice(0, 4);
                setSimilarProducts(similar);
              }
            } catch (err) {
              console.error('Benzer ürünler yüklenirken hata:', err);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      // @ts-ignore
      addToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h2>
          <Link href="/urunler" className="text-blue-600 hover:underline">
            Tüm Ürünlere Dön
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/urunler" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Ürünlere Dön
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                <img 
                  src={product.images?.[selectedImage] || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category?.name || 'Genel'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current text-gray-300" />
                    <span className="ml-1 text-gray-600">(4.2)</span>
                  </div>
                  <span>•</span>
                  <span className={product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock && product.stock > 0 ? 'Stokta Var' : 'Stokta Yok'}
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-8">
                {product.price.toLocaleString('tr-TR')} TL
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description || 'Bu ürün için açıklama bulunmamaktadır.'}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Ücretsiz Kargo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>2 Yıl Garanti</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <span>30 Gün İade Hakkı</span>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock <= 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdded 
                      ? 'bg-green-600 text-white shadow-green-600/20' 
                      : (!product.stock || product.stock <= 0)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-6 h-6" />
                      Sepete Eklendi
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      {(!product.stock || product.stock <= 0) ? 'Stokta Yok' : 'Sepete Ekle'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link href={`/urun/${item.id}`} key={item.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={item.images?.[0] || '/placeholder.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="font-bold text-blue-600">
                      {item.price.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
