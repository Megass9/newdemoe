import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Kategoriler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;
    
    const docRef = await addDoc(collection(db, "categories"), { name, description });
    return NextResponse.json({ id: docRef.id, name, description }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Kategori oluşturulamadı' }, { status: 500 });
  }
}