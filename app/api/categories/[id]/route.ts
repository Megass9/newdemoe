import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    // Kategoriye bağlı ürün kontrolü
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("categoryId", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'Bu kategoriye bağlı ürünler var. Önce ürünleri silmelisiniz.' }, { status: 400 });
    }

    await deleteDoc(doc(db, "categories", id));
    return NextResponse.json({ message: 'Kategori silindi' });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, {
      name,
      description
    });

    const docSnap = await getDoc(docRef);
    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}
