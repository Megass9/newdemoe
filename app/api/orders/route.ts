import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('🔍 API GET /orders - İstek yapan UserID:', userId);

    const ordersRef = collection(db, 'orders');
    let q;

    if (userId) {
      q = query(ordersRef, where('userId', '==', userId));
    } else {
      q = query(ordersRef);
    }
    
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Firestore Timestamp'i okunabilir tarihe çeviriyoruz
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    // Tarihe göre yeniden eskiye sıralama (Client-side sorting)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`✅ API GET /orders - Bulunan sipariş sayısı: ${orders.length}`);
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

    console.log('📝 API POST /orders - Gelen Sipariş Verisi:', { userId, total, itemsCount: items?.length });

    const orderData = {
      userId: userId ? String(userId) : null, // ID'yi string olarak saklamak daha güvenlidir
      guestName,
      guestEmail,
      guestPhone,
      address,
      paymentMethod,
      total,
      status: 'PENDING',
      items, // Ürünleri direkt array olarak saklıyoruz
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);

    console.log('🎉 API POST /orders - Sipariş başarıyla oluşturuldu. ID:', docRef.id);
    return NextResponse.json({ message: 'Sipariş oluşturuldu', orderId: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 });
  }
}