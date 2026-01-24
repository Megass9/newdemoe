'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, Phone, User, Menu, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function Header() {
  const { user, logout, isLoggedIn } = useUser();
  const { cart } = useCart();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          setCategories(await res.json());
        }
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
          setIsMenuOpen(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/urunler?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const totalItems = cart ? cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0;

  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <nav className={`bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Ne aramıştınız?"
            className="w-full bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full py-2.5 px-5 pl-11 outline-none transition-all duration-300 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute left-4 top-3 text-gray-400 hover:text-blue-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/profil" className="p-2 hover:bg-gray-100 rounded-full transition" title="Profil">
                <User className="w-6 h-6 text-gray-700" />
              </Link>
            ) : (
              <Link href="/giris" className="font-medium text-gray-600 hover:text-blue-600 transition">
                Giriş Yap
              </Link>
            )}
          </div>
          
          <Link href="/sepet" className={`relative p-2 hover:bg-gray-100 rounded-full transition ${isAnimating ? 'animate-bounce text-blue-600' : 'text-gray-700'}`}>
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2" aria-label="Mobil menüyü aç/kapat">
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
      </div>
      {/* Main Menu (Desktop and Mobile) */}
      {isMenuOpen && (
          <div className="bg-white border-t border-gray-100 py-4 px-4 space-y-2 absolute top-20 left-0 w-full shadow-lg z-40">
             <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">Ana Sayfa</Link>
             <Link href="/urunler" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">Tüm Ürünler</Link>
             {categories.map(category => (
                <Link 
                    key={category.id} 
                    href={`/urunler?category=${encodeURIComponent(category.name)}`} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                    {category.name}
                </Link>
             ))}

             <div className="border-t my-2"></div>

             {isLoggedIn ? (
                 <>
                    <Link href="/profil" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">Profil</Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-red-500 hover:bg-red-50 w-full text-left">Çıkış</button>
                 </>
             ) : (
                 <Link href="/giris" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">Giriş Yap</Link>
             )}
          </div>
      )}
    </nav>
  );
}