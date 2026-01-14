import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { message: "Nieprawidłowe id kategorii" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { message: "Kategoria nie została znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Błąd podczas pobierania kategorii:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać kategorii" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 1️⃣ Pobranie ID z URL
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { message: "Nieprawidłowe id kategorii" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, categoryImage,categoryDescription, categoryCarouselImage,categoryInfo } = body;


    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(categoryImage && { categoryImage }),
        ...(categoryDescription && { categoryDescription }),
        ...(categoryCarouselImage && { categoryCarouselImage }),
        ...(categoryInfo && { categoryInfo }),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Błąd podczas aktualizacji kategorii:", error);
    return NextResponse.json(
      { message: "Nie udało się zaktualizować kalegorii" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { message: "Nieprawidłowe id kategorii" },
        { status: 400 }
      );
    }

    // Sprawdzamy, czy kategoria ma przypisane produkty
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!categoryWithProducts) {
      return NextResponse.json(
        { message: "Kategoria nie istnieje" },
        { status: 404 }
      );
    }

    if (categoryWithProducts.products.length > 0) {
      return NextResponse.json(
        { message: "Nie można usunąć kategorii, która ma przypisane produkty" },
        { status: 409 }
      );
    }

    // Usuwamy kategorię
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Kategoria została usunięta",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Błąd podczas usuwania kategorii:", error);
    return NextResponse.json(
      { message: "Nie udało się usunąć kategorii" },
      { status: 500 }
    );
  }
}
