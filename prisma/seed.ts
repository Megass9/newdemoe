import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const elektronik = await prisma.category.upsert({
    where: { name: 'Elektronik' },
    update: {},
    create: {
      name: 'Elektronik',
      description: 'Elektronik ürünler'
    }
  });

  const giyim = await prisma.category.upsert({
    where: { name: 'Giyim' },
    update: {},
    create: {
      name: 'Giyim',
      description: 'Giyim ürünleri'
    }
  });

  const ev = await prisma.category.upsert({
    where: { name: 'Ev & Yaşam' },
    update: {},
    create: {
      name: 'Ev & Yaşam',
      description: 'Ev ve yaşam ürünleri'
    }
  });

  // Create products
  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Akıllı Telefon',
      description: 'Son model akıllı telefon',
      price: 5000,
      stock: 10,
      categoryId: elektronik.id,
      images: JSON.stringify(['/placeholder.jpg']),
      specs: JSON.stringify({ 'Ekran': '6.5 inç', 'RAM': '8GB', 'Depolama': '128GB' })
    }
  });

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Laptop',
      description: 'Güçlü performanslı laptop',
      price: 12000,
      stock: 5,
      categoryId: elektronik.id,
      images: JSON.stringify(['/placeholder.jpg']),
      specs: JSON.stringify({ 'İşlemci': 'Intel i7', 'RAM': '16GB', 'SSD': '512GB' })
    }
  });

  await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Kot Pantolon',
      description: 'Rahat kot pantolon',
      price: 200,
      stock: 20,
      categoryId: giyim.id,
      images: JSON.stringify(['/placeholder.jpg']),
      specs: JSON.stringify({ 'Beden': 'M', 'Renk': 'Mavi', 'Materyal': 'Pamuk' })
    }
  });

  await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Çamaşır Makinesi',
      description: 'Enerji tasarruflu çamaşır makinesi',
      price: 8000,
      stock: 3,
      categoryId: ev.id,
      images: JSON.stringify(['/placeholder.jpg']),
      specs: JSON.stringify({ 'Kapasite': '8kg', 'Enerji Sınıfı': 'A++', 'Program': '15' })
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });