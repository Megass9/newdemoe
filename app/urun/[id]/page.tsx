'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ShoppingCart, Star, Heart, Share2, Truck, RotateCcw, Settings, Check, X, Search, ChevronRight, Minus, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
}

export default function UrunDetay() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const foundProduct = data.find((p: Product) => p.id === parseInt(id as string));
        setProduct(foundProduct || null);
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
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-pulse"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
              </div>

              <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <Search className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h1>
            <p className="text-gray-600 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                Ana Sayfa
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <img
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {/* Stock Badge */}
              {product.stock > 0 ? (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Stokta Var</span>
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <span className="flex items-center gap-1"><X className="w-3 h-3" /> Stokta Yok</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-indigo-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-indigo-600">
                  {product.price} TL
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {(product.price * 1.2).toFixed(0)} TL
                </span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  17% İndirim
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(4.8/5 - 127 değerlendirme)</span>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Bu yüksek kaliteli ürün, günlük kullanımınız için tasarlanmıştır. Dayanıklı malzemeler ve özenli işçilik ile üretilmiştir.'}
              </p>
            </div>

            {/* Stock Info */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-gray-700 font-medium">Stok Durumu:</span>
              <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'Çok Stok' : product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Adet:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[50px]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => addToCart({ ...product, quantity })}
                disabled={product.stock === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                  product.stock > 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? <span className="flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Sepete Ekle</span> : 'Stokta Yok'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorilere Ekle
                </button>
                <button className="flex items-center justify-center py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  <Share2 className="w-5 h-5 mr-2" />
                  Paylaş
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ücretsiz Kargo</p>
                  <p className="text-sm text-gray-600">150 TL üzeri</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kolay İade</p>
                  <p className="text-sm text-gray-600">30 gün içinde</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-gray-400" />
              Teknik Özellikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
                <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}