import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

// GET /api/users/[id]
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Nieprawidłowe id użytkownika" },
        { status: 400 }
      );
    }

    // Pobranie użytkownika z pełnymi relacjami
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            address: true,
            items: {
              include: { product: true },
            },
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
        { message: "Nie znaleziono użytkownika" },
        { status: 404 }
      );
    }

    // Sortowanie cardItems w każdej karcie (opcjonalne)
    user.cards.forEach((card) => {
      card.cardItems.sort((a, b) => b.id - a.id);
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać użytkownika", error: error.message },
      { status: 500 }
    );
  }
}

// POST: tworzenie nowego użytkownika
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

    // Sprawdzenie unikalności email i phone
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Użytkownik o tym emailu już istnieje" },
        { status: 409 }
      );
    }

    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingUserByPhone) {
        return NextResponse.json(
          { message: "Użytkownik o tym numerze telefonu już istnieje" },
          { status: 409 }
        );
      }
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        country,
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
      },
      include: {
        addresses: true,
        orders: { include: { items: { include: { product: true } }, address: true } },
        cards: { include: { cardItems: { include: { product: true } } } },
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
