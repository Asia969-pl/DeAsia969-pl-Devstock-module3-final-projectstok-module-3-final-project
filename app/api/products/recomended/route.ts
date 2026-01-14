// app/api/products/recommended/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET() {
  try {
    // Pobieramy wszystkie kategorie z produktami
    const categories = await prisma.category.findMany({
      include: {
        products: {
          orderBy: { id: "asc" }, // lub losowo, np. przez shuffle później
        },
      },
    });

    // Losujemy kategorie
    const shuffledCategories = categories.sort(() => 0.5 - Math.random());

    // Bierzemy po jednym produkcie z każdej kategorii
    const selectedProducts = shuffledCategories
      .map((c) => c.products[0])
      .filter(Boolean);

    // Pobieramy kompletne dane dla tych produktów
    const productIds = selectedProducts.map((p) => p.id);

    const completeProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(completeProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Nie udało się pobrać rekomendacji" },
      { status: 500 }
    );
  }
}
