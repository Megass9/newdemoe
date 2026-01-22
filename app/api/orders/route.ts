import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, total, shipping, address, paymentMethod, guestName, guestEmail, guestPhone } = body;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        total,
        shipping: shipping || 0,
        address,
        paymentMethod,
        guestName,
        guestEmail,
        guestPhone,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Here you would send email/SMS notification to seller
    console.log('New order created:', order.id);

    return NextResponse.json({ orderId: order.id, message: 'Sipariş başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 });
  }
}

export async function GET() {
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
    return NextResponse.json({ error: 'Siparişler alınamadı' }, { status: 500 });
  }
}