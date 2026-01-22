'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

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
    <div>
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isLogin ? 'Giriş Yap' : 'Üye Ol'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-2">Ad Soyad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Şifre</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Üye Ol')}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Hesabın yok mu? Üye ol' : 'Zaten üye misin? Giriş yap'}
          </button>
        </div>
        {isLogin && (
          <div className="text-center mt-4">
            <Link href="/sifremi-unuttum" className="text-blue-600 hover:underline">
              Şifremi unuttum
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}