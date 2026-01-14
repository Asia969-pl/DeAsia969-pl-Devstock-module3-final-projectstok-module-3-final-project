import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    // 🔹 JEŚLI NIE MA LIMITU → ZWRÓĆ WSZYSTKO
    if (!limitParam) {
      const products = await prisma.product.findMany({
        orderBy: { id: "asc" },
        include: {
          category: true, // dołączamy kategorię
          brand: true,    // dołączamy markę
        },
      });

      return NextResponse.json({
        data: products,
        meta: {
          totalItems: products.length,
          paginated: false,
        },
      });
    }

    // 🔹 JEŚLI JEST LIMIT → PAGINACJA
    const limit = Math.max(Number(limitParam), 1);
    const page = Math.max(Number(pageParam) || 1, 1);
    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: {
          category: true, // dołączamy kategorię
          brand: true,    // dołączamy markę
        },
      }),
      prisma.product.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: products,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        paginated: true,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania produktów:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać produktów" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId, brandId } = body;

    if (!name || !description || !price || !stock || !imageUrl || !categoryId || !brandId) {
      return NextResponse.json({ message: "Brakuje wymaganych pól" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        brandId,
      },
      include: {
        category: true, // od razu zwracamy też kategorię
        brand: true,    // i markę
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia produktu:", error);
    return NextResponse.json({ message: "Nie udało się utworzyć produktu" }, { status: 500 });
  }
}
