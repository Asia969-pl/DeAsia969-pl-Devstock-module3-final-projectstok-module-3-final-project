import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Błąd podczas pobierania marek:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać marek" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Pobranie danych z ciała żądania
    const body = await request.json();
    const { name, image } = body;

    // Walidacja podstawowa
    if (!name || !image) {
      return NextResponse.json(
        { message: "Brakuje wymaganych pól" },
        { status: 400 }
      );
    }

    const newBrand = await prisma.brand.create({
      data: {
        name,
        image,
      },
    });
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia marki:", error);
    return NextResponse.json(
      { message: "Nie udało się utworzyć marki" },
      { status: 500 }
    );
  }
}
