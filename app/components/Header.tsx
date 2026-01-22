'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { user, logout, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ticaret
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group">
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/kategoriler" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group">
              Kategoriler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/sepet" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group flex items-center">
              <span className="mr-1">🛒</span> Sepet
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group">
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profil" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Ana Sayfa
              </Link>
              <Link href="/kategoriler" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Kategoriler
              </Link>
              <Link href="/sepet" className="text-gray-700 hover:text-indigo-600 font-medium py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span className="mr-2">🛒</span> Sepet
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>

              {isLoggedIn ? (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                  <Link href="/profil" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    href="/giris"
                    className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}