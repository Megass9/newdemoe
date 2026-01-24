import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { status } = body;

    const orderRef = doc(db, 'orders', params.id);
    await updateDoc(orderRef, { status });

    return NextResponse.json({ message: 'Sipariş durumu güncellendi', id: params.id, status });
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    return NextResponse.json({ error: 'Sipariş güncellenemedi' }, { status: 500 });
  }
}