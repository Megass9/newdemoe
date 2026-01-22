const categories = [
  {
    id: 1,
    name: 'Elektronik',
    image: '/placeholder.jpg',
    icon: '💻',
    description: 'En yeni teknoloji ürünleri',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Giyim',
    image: '/placeholder.jpg',
    icon: '👕',
    description: 'Moda ve stil ürünleri',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 3,
    name: 'Ev & Yaşam',
    image: '/placeholder.jpg',
    icon: '🏠',
    description: 'Ev dekorasyonu ürünleri',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    name: 'Spor & Outdoor',
    image: '/placeholder.jpg',
    icon: '⚽',
    description: 'Spor malzemeleri',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    name: 'Kitap & Eğitim',
    image: '/placeholder.jpg',
    icon: '📚',
    description: 'Kitaplar ve eğitim materyalleri',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 6,
    name: 'Kozmetik',
    image: '/placeholder.jpg',
    icon: '💄',
    description: 'Güzellik ve bakım ürünleri',
    color: 'from-yellow-500 to-pink-500'
  }
];

export default function Categories() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İhtiyacınız olan her şeyi kategorilerimizde keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{category.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                    Keşfet →
                  </span>
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Daha fazla kategori ve ürün için keşfetmeye devam edin
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Tüm Kategorileri Gör
          </button>
        </div>
      </div>
    </section>
  );
}