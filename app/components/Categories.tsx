import { Smartphone, Shield, Zap, Headphones, Tablet, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Akıllı Telefonlar',
    image: '/placeholder.jpg',
    icon: <Smartphone className="w-6 h-6" strokeWidth={1.5} />,
    description: 'En yeni model cep telefonları',
    color: 'from-blue-600 to-blue-400'
  },
  {
    id: 2,
    name: 'Kılıf & Kapak',
    image: '/placeholder.jpg',
    icon: <Shield className="w-6 h-6" strokeWidth={1.5} />,
    description: 'Telefonunuz için şık koruma',
    color: 'from-slate-500 to-gray-400'
  },
  {
    id: 3,
    name: 'Şarj & Kablo',
    image: '/placeholder.jpg',
    icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
    description: 'Hızlı şarj aletleri ve kablolar',
    color: 'from-cyan-600 to-blue-500'
  },
  {
    id: 4,
    name: 'Kulaklık & Ses',
    image: '/placeholder.jpg',
    icon: <Headphones className="w-6 h-6" strokeWidth={1.5} />,
    description: 'Bluetooth kulaklık ve hoparlörler',
    color: 'from-indigo-600 to-blue-500'
  },
  {
    id: 5,
    name: 'Ekran Koruyucu',
    image: '/placeholder.jpg',
    icon: <Tablet className="w-6 h-6" strokeWidth={1.5} />,
    description: 'Kırılmaz cam ve filmler',
    color: 'from-sky-600 to-cyan-500'
  },
  {
    id: 6,
    name: 'Teknik Servis',
    image: '/placeholder.jpg',
    icon: <Wrench className="w-6 h-6" strokeWidth={1.5} />,
    description: 'Tamir ve bakım hizmetleri',
    color: 'from-gray-600 to-slate-500'
  }
];

export default function Categories() {
  return (
    <section className="py-20 bg-white">
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
            <Link
              href={`/urunler?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="group relative bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer block"
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
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
                  {category.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-200 flex items-center gap-1">
                    Keşfet <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Daha fazla kategori ve ürün için keşfetmeye devam edin
          </p>
          <Link href="/urunler" className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Tüm Kategorileri Gör
          </Link>
        </div>
      </div>
    </section>
  );
}