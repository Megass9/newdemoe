import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    // Resimleri JSON string'den array'e çevir
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        images: JSON.stringify(images || []), // Array'i string olarak sakla
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}