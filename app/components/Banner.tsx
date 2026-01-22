export default function Banner() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Modern Alışveriş
            <span className="block text-yellow-300">Deneyimi</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100 animate-fade-in-up animation-delay-200">
            Premium ürünleri, şık tasarımları ve mükemmel fiyatları keşfedin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              🛍️ Alışverişe Başla
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300">
              📦 Ürünleri Keşfet
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 animate-bounce">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce animation-delay-1000">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">💎</span>
          </div>
        </div>
      </div>
    </section>
  );
}