import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gereklidir.' }, { status: 400 });
    }

    const newCategory = {
      name,
      description,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "categories"), newCategory);
    return NextResponse.json({ id: docRef.id, ...newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}