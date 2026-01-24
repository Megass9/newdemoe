import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Veritabanı temizleniyor...')
  // Önce ilişkili kayıtları sil (Foreign Key kısıtlamaları nedeniyle sıra önemli)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Örnek veriler ekleniyor...')

  // Kategoriler
  const phones = await prisma.category.create({
    data: {
      name: 'Akıllı Telefonlar',
      description: 'En yeni model cep telefonları',
    }
  })

  const cases = await prisma.category.create({
    data: {
      name: 'Kılıf & Kapak',
      description: 'Telefonunuz için şık koruma',
    }
  })

  const accessories = await prisma.category.create({
    data: {
      name: 'Aksesuarlar',
      description: 'Şarj aletleri, kablolar ve daha fazlası',
    }
  })

  // Ürünler
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      description: 'Titanyum tasarım, A17 Pro çip, 48MP Ana kamera.',
      price: 84999,
      stock: 20,
      categoryId: phones.id,
      images: JSON.stringify(['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692875663718']),
    }
  })

  await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Galaxy AI is here. Titanyum çerçeve.',
      price: 73999,
      stock: 15,
      categoryId: phones.id,
      images: JSON.stringify(['https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-s928-sm-s928bztqtur-539303553?$650_519_PNG$']),
    }
  })

  await prisma.product.create({
    data: {
      name: 'MagSafe Şeffaf Kılıf',
      description: 'iPhone 15 Pro Max için ince, hafif ve kolay tutuş sağlayan kılıf.',
      price: 1200,
      stock: 50,
      categoryId: cases.id,
      images: JSON.stringify(['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MAGSAFE_CASE_IPHONE_15_PRO_MAX_AV1?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1693248666571']),
    }
  })

  await prisma.product.create({
    data: {
      name: '20W USB-C Güç Adaptörü',
      description: 'Apple 20 W USB-C Güç Adaptörü, aygıtınızı evde, ofiste veya yolda hızlı ve verimli bir şekilde şarj etme imkanı sunar.',
      price: 700,
      stock: 100,
      categoryId: accessories.id,
      images: JSON.stringify(['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MHJE3?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1600726737000']),
    }
  })

  console.log('Seed işlemi tamamlandı!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })