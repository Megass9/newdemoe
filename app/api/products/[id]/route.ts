import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    const { name, price, description, images, categoryId, stock } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = JSON.stringify(images);
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: updateData,
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
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}