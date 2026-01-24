'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GirisPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) router.push('/');
    } else {
      const ok = await register(name, email, password);
      if (ok) router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

          {/* MODE SWITCH */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`w-1/2 py-2 rounded-lg text-sm font-bold transition ${
                mode === 'login'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setMode('register')}
              className={`w-1/2 py-2 rounded-lg text-sm font-bold transition ${
                mode === 'register'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* FORM */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: mode === 'login' ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 40 : -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    required
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="E-posta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}
