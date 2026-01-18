import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid user id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            address: true,
            items: { include: { product: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        cards: {
          include: {
            cardItems: { include: { product: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.cards.forEach((card) => {
      card.cardItems.sort((a, b) => b.id - a.id);
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users — REGISTER
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, country } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Brak wymaganych danych: name, email lub password" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Użytkownik o tym emailu już istnieje" },
        { status: 409 }
      );
    }

    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingUserByPhone) {
        return NextResponse.json(
          { message: "Użytkownik o tym numerze telefonu już istnieje" },
          { status: 409 }
        );
      }
    }

    // ✅ HASH HASŁA
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // 🔐 HASH
        phone,
        country,
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
      },
      include: {
        addresses: true,
        orders: {
          include: {
            items: { include: { product: true } },
            address: true,
          },
        },
        cards: {
          include: {
            cardItems: { include: { product: true } },
          },
        },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message },
      { status: 500 }
    );
  }
}
