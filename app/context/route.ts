import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Eksik bilgi', details: 'Email ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Giriş başarısız', details: 'Hatalı email veya şifre.' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sunucu hatası', details: String(error) },
      { status: 500 }
    );
  }
}