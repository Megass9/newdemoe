const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCategories() {
  const categories = [
    { name: 'Elektronik', description: 'Elektronik ürünler' },
    { name: 'Giyim', description: 'Giyim ürünleri' },
    { name: 'Ev & Yaşam', description: 'Ev ve yaşam ürünleri' }
  ];

  for (const cat of categories) {
    try {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat
      });
      console.log(`${cat.name} kategorisi eklendi/güncellendi`);
    } catch (error) {
      console.error(`${cat.name} eklenirken hata:`, error.message);
    }
  }

  await prisma.$disconnect();
}

addCategories();