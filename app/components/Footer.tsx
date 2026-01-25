'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Lock, Loader2, Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <h5 className="text-2xl font-bold text-white tracking-tight">
                Vadeli<span className="text-blue-500">İletişim</span>
              </h5>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Teknoloji Store</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              En yeni teknoloji ürünleri, güvenilir alışveriş ve müşteri memnuniyeti odaklı hizmet anlayışımızla yanınızdayız.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="group-hover:text-white transition-colors">0850 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="group-hover:text-white transition-colors">info@vadeliiletisim.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="group-hover:text-white transition-colors">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-white font-bold text-lg mb-6 relative inline-block">
              Hızlı Linkler
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h6>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/sepet" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Sepetim
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h6 className="text-white font-bold text-lg mb-6 relative inline-block">
              Kategoriler
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h6>
            <ul className="space-y-3">
              <li>
                <Link href="/urunler?category=Akıllı Telefonlar" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Akıllı Telefonlar
                </Link>
              </li>
              <li>
                <Link href="/urunler?category=Aksesuarlar" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Aksesuarlar
                </Link>
              </li>
              <li>
                <Link href="/urunler?category=Bilgisayarlar" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Bilgisayarlar
                </Link>
              </li>
              <li>
                <Link href="/urunler?category=Teknik Servis" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Teknik Servis
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h6 className="text-white font-bold text-lg mb-6 relative inline-block">
              Bülten
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h6>
            <p className="text-sm mb-4 text-gray-400">
              En yeni ürünler ve indirimlerden haberdar olmak için bültenimize abone olun.
            </p>
            <form className="flex flex-col gap-3 mb-6" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz" 
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" 
              />
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`px-4 py-3 rounded-lg transition-all font-medium text-sm shadow-lg flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'}`}
              >
                {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'success' && <Check className="w-4 h-4" />}
                {status === 'idle' && 'Abone Ol'}
                {status === 'success' && 'Abone Olundu!'}
                {status === 'error' && 'Hata Oluştu'}
              </button>
            </form>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Vadeli İletişim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik" className="text-xs text-gray-500 hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="text-xs text-gray-500 hover:text-white transition-colors">Kullanım Koşulları</Link>
            <Link href="/admin" className="bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-xs transition-all font-medium flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Yönetici Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}