import { Truck, RotateCcw, Lock, Star, MessageCircle, Trophy } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <Truck className="w-8 h-8 text-white" />,
      title: "Hızlı Kargo",
      description: "Ücretsiz ve hızlı teslimat",
      color: "from-blue-600 to-blue-400"
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-white" />,
      title: "Kolay İade",
      description: "30 gün içinde ücretsiz iade",
      color: "from-slate-500 to-gray-400"
    },
    {
      icon: <Lock className="w-8 h-8 text-white" />,
      title: "Güvenli Ödeme",
      description: "SSL korumalı güvenli alışveriş",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Star className="w-8 h-8 text-white" />,
      title: "Orijinal Ürün",
      description: "Garantili ve orijinal cihazlar",
      color: "from-gray-600 to-slate-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-white" />,
      title: "7/24 Destek",
      description: "Uzman müşteri hizmetleri",
      color: "from-indigo-600 to-blue-500"
    },
    {
      icon: <Trophy className="w-8 h-8 text-white" />,
      title: "Müşteri Memnuniyeti",
      description: "%98 olumlu müşteri yorumu",
      color: "from-sky-600 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Neden Bizi Tercih Ediyorsunuz?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Müşterilerimizin güvenini kazanmak için sunduğumuz avantajlar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-transparent animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {badge.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors duration-200">
                {badge.title}
              </h3>

              <p className="text-gray-600 text-center leading-relaxed">
                {badge.description}
              </p>

              {/* Decorative element */}
              <div className="mt-6 flex justify-center">
                <div className={`w-12 h-1 bg-gradient-to-r ${badge.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-800 via-blue-800 to-gray-800 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Mutlu Müşteri</div>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Satılan Ürün</div>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">Müşteri Puanı</div>
            </div>
            <div className="animate-fade-in-up animation-delay-1000">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Destek</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}