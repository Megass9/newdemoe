import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Banner() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <div className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-semibold mb-2">
              🚀 Yeni Sezon Ürünleri Stokta
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Geleceğin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Teknolojisi
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
              En yeni akıllı cihazlar, orijinal aksesuarlar ve Vadeli İletişim güvencesiyle tanışın. Hızlı kargo ve güvenli ödeme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href="/urunler" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                Alışverişe Başla <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/urunler" className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/10 transition backdrop-blur-sm flex items-center justify-center">
                Kategorileri Keşfet
              </Link>
            </div>
          </div>
          
          {/* Hero Image / Visual */}
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
            <div className="w-72 h-96 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[3rem] rotate-6 blur-2xl absolute opacity-40 animate-pulse"></div>
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl transform hover:-translate-y-2 transition duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop" 
                 alt="Hero Product" 
                 className="rounded-2xl w-64 h-80 object-cover shadow-lg"
               />
               <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-500">Sadece</span>
                  <span className="text-xl font-bold text-blue-600">₺84.999</span>
               </div>
            </div>
          </div>
        </div>
    </section>
  );
}