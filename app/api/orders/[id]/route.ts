import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/orders/[id]'>
) {
  try {
    const { id } = await ctx.params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status gerekli' }, { status: 400 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Sipariş güncellenemedi' }, { status: 500 });
  }
}