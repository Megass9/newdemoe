import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, images } = body;

    const newProduct = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: String(categoryId),
      images: images || [],
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);
    return NextResponse.json({ id: docRef.id, ...newProduct }, { status: 201 });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}