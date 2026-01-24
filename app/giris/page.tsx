'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function Giris() {
  const { login, register } = useUser();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }

      if (success) {
        router.push('/');
      } else {
        alert(isLogin ? 'Giriş başarısız!' : 'Kayıt başarısız!');
      }
    } catch (error) {
      alert('Bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? 'Tekrar Hoşgeldiniz' : 'Aramıza Katılın'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ad Soyad"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="E-posta adresi"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-600/30"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Hesabın yok mu? Hemen üye ol' : 'Zaten üye misin? Giriş yap'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}