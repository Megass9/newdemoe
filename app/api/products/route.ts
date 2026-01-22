import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let where: any = {};
    if (category && category !== 'all') {
      where.category = {
        name: category
      };
    }

    let orderBy: any = {};
    if (sort === 'price-asc') {
      orderBy.price = 'asc';
    } else if (sort === 'price-desc') {
      orderBy.price = 'desc';
    } else if (sort === 'newest') {
      orderBy.id = 'desc';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true
      }
    });

    // Transform images and specs from JSON strings
    const transformedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images),
      specs: product.specs ? JSON.parse(product.specs) : null
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, images, categoryId, stock } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        images: JSON.stringify(images || ['/placeholder.jpg']),
        specs: JSON.stringify({}),
        categoryId: categoryId ? parseInt(categoryId) : null,
        stock: parseInt(stock) || 0,
      },
      include: {
        category: true
      }
    });

    const transformedProduct = {
      ...product,
      images: JSON.parse(product.images),
      specs: product.specs ? JSON.parse(product.specs) : null
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Ürün oluşturulamadı' }, { status: 500 });
  }
}