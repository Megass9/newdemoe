import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ message: 'Ürün silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, price, description, images, categoryId, stock } = body;

    const updateData: any = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      stock: stock ? parseInt(stock) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    };

    if (images) {
      updateData.images = JSON.stringify(images);
    }

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: updateData
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}