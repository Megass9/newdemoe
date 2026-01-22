# E-Ticaret Demo

Bu Next.js tabanlı demo e-ticaret sitesi aşağıdaki özellikleri içerir:

## Özellikler

- **Ana Sayfa**: Banner, öne çıkan ürünler, kategori vitrinleri, güven veren alanlar (hızlı kargo, iade, güvenli ödeme)
- **Ürün & Kategori Yapısı**: Kategori sayfası (/kategoriler) ile filtreleme (kategori) ve sıralama (fiyat, en yeni), ürün detay sayfaları (/urun/[id]) çoklu görseller, açıklama, teknik özellikler, stok durumu
- **Sepet & Checkout**: Sepete ekleme/çıkarma, adet değiştirme, toplam tutar, kargo ücreti (basit), kupon alanı (placeholder), checkout formu ile misafir/kayıtlı kullanıcı ödemesi, adres, ödeme yöntemleri (kart/havale/kapıda)
- **Kullanıcı Sistemi**: Giriş/kayıt sayfası (/giris), profil sayfası (/profil) ile kişisel bilgiler, adres yönetimi, sipariş geçmişi
- **Sipariş Sistemi**: Checkout sonrası veritabanına kaydedilen siparişler, admin için API endpoint'leri

## Teknoloji Altyapısı

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı**: SQLite + Prisma ORM
- **State Management**: React Context (sepet için)

## Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Veritabanını hazırlayın:
```bash
# Veritabanı migration'ını çalıştırın
npx prisma migrate dev --name init

# Seed verilerini yükleyin
npm run db:seed
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Veritabanı Yapısı

- **User**: Kullanıcı bilgileri
- **Address**: Teslimat adresleri
- **Category**: Ürün kategorileri
- **Product**: Ürün bilgileri
- **Order**: Sipariş bilgileri
- **OrderItem**: Sipariş kalemleri

## API Endpoints

- `GET /api/products` - Ürünleri listele (filtreleme ve sıralama ile)
- `POST /api/orders` - Sipariş oluştur
- `GET /api/orders` - Siparişleri listele (admin için)

## Kullanım

- Ana sayfadan ürünleri inceleyin
- Kategoriler sayfasında filtreleyin ve sıralayın
- Ürün detaylarına tıklayın
- Sepete ürün ekleyin
- Checkout'ta siparişi tamamlayın
- Giriş yapın veya üye olun

## Geliştirme Notları

- Ürün görselleri placeholder, gerçek resimler ekleyebilirsiniz
- Ödeme entegrasyonu için Stripe/PayPal API'leri eklenebilir
- Email/SMS bildirimi için Nodemailer/Twilio eklenebilir
- Admin paneli için ayrı route'lar oluşturulabilir
- Giriş yapın veya üye olun

## Teknolojiler

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Context API (state management)
