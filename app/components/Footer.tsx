import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h5 className="text-white text-xl font-bold">Vadeli İletişim</h5>
            <p className="text-sm leading-relaxed">
              Teknolojiyi güvenle buluşturan adres. Müşteri memnuniyeti odaklı hizmet anlayışımızla yanınızdayız.
            </p>
          </div>
          <div>
            <h6 className="text-white font-bold mb-4">Hızlı Linkler</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition">İletişim</a></li>
              <li><a href="#" className="hover:text-white transition">Kargo Takip</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-bold mb-4">Kategoriler</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Telefonlar</a></li>
              <li><a href="#" className="hover:text-white transition">Bilgisayarlar</a></li>
              <li><a href="#" className="hover:text-white transition">Aksesuarlar</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-bold mb-4">Bülten</h6>
            <p className="text-sm mb-4">İndirimlerden haberdar olun.</p>
            <div className="flex">
              <input type="email" placeholder="E-posta adresi" className="bg-gray-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-blue-500 outline-none" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">Kayıt</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 Vadeli İletişim. Tüm hakları saklıdır.</p>
          <Link href="/admin" className="mt-4 md:mt-0 bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-xs transition-colors">
            Admin Paneli
          </Link>
        </div>
      </footer>
  );
}