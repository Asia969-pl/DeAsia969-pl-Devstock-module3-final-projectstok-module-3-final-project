import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";
import bcrypt from "bcryptjs"; // ✅ ZMIANA

/* =========================
   POST — REGISTER USER
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, country } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // 🔍 sprawdzenie czy user już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // 🔐 HASH HASŁA
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // ✅ zapisujemy HASH
        phone,
        country,
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { message: "Failed to register user", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   GET — LIST USERS
========================= */

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        createdAt: true,
        addresses: true,
        orders: true,
        cards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
