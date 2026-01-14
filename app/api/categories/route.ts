import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";
//categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Błąd podczas pobierania kategorii:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać kategorii" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Pobranie danych z ciała żądania
    const body = await request.json();
    const { name, categoryImage, categoryDescription,  categoryCarouselImage, categoryInfo} = body;

    // Walidacja podstawowa
    if (!name || !categoryImage || !categoryDescription ||!categoryCarouselImage ||!categoryInfo  ) {
      return NextResponse.json(
        { message: "Brakuje wymaganych pól" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        categoryImage,
        categoryDescription,
        categoryCarouselImage,
        categoryInfo
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia kategorii:", error);
    return NextResponse.json(
      { message: "Nie udało się utworzyć kategorii" },
      { status: 500 }
    );
  }
}
