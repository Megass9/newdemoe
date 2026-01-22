export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Ticaret
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Modern alışveriş deneyimi için tasarlanmış, güvenilir ve kullanıcı dostu e-ticaret platformu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-200">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <span className="text-lg">📺</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🏠</span> Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/kategoriler" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">📂</span> Kategoriler
                </a>
              </li>
              <li>
                <a href="/sepet" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🛒</span> Sepet
                </a>
              </li>
              <li>
                <a href="/profil" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">👤</span> Profil
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Müşteri Hizmetleri</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">❓</span> Sık Sorulan Sorular
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🚚</span> Kargo Takibi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">↩️</span> İade Koşulları
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">📞</span> İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">İletişim</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-indigo-400 mt-1">📧</span>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">info@eticaret.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-indigo-400 mt-1">📱</span>
                <div>
                  <p className="text-gray-400">Telefon</p>
                  <p className="text-white">0123 456 7890</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-indigo-400 mt-1">📍</span>
                <div>
                  <p className="text-gray-400">Adres</p>
                  <p className="text-white">İstanbul, Türkiye</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 E-Ticaret. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Kullanım Koşulları
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Çerez Politikası
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}