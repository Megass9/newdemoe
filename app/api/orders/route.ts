import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, userId, guestName, guestEmail, guestPhone, address, paymentMethod } = body;

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        guestName,
        guestEmail,
        guestPhone,
        address,
        paymentMethod,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // Stok güncelleme (Opsiyonel ama önerilir)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return NextResponse.json({ message: 'Sipariş oluşturuldu', orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 });
  }
}