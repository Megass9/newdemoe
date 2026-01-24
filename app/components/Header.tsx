'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ShoppingCart, Search, Menu, Phone } from 'lucide-react';

export default function Header() {
  const { user, logout, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-blue-600 p-2.5 rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <Phone className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter leading-none text-gray-900">
              Vadeli<span className="text-blue-600">İletişim</span>
            </h1>
            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Teknoloji Store</span>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Ne aramıştınız?"
            className="w-full bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full py-2.5 px-5 pl-11 outline-none transition-all duration-300 text-gray-700"
          />
          <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/profil" className="font-medium text-gray-600 hover:text-blue-600 transition">
                {user?.displayName || user?.email}
              </Link>
              <button onClick={logout} className="text-gray-500 hover:text-blue-600 text-sm font-medium">Çıkış</button>
            </div>
          ) : (
            <Link href="/giris" className="hidden md:block font-medium text-gray-600 hover:text-blue-600 transition">
              Giriş Yap
            </Link>
          )}
          
          <Link href="/sepet" className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              2
            </span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
             <Link href="/" className="block text-gray-700 hover:text-blue-600">Ana Sayfa</Link>
             <Link href="/kategoriler" className="block text-gray-700 hover:text-blue-600">Kategoriler</Link>
             {isLoggedIn ? (
                 <>
                    <Link href="/profil" className="block text-gray-700 hover:text-blue-600">Profil</Link>
                    <button onClick={logout} className="block text-gray-500 hover:text-blue-600">Çıkış</button>
                 </>
             ) : (
                 <Link href="/giris" className="block text-gray-700 hover:text-blue-600">Giriş Yap</Link>
             )}
          </div>
      )}
    </nav>
  );
}