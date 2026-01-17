import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categories = searchParams.getAll("category");
    const brands = searchParams.getAll("brand"); // 👈
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const sortParam = searchParams.get("sort") || "newest";

    if (!categories.length) {
      return NextResponse.json(
        { message: "Parametr 'category' jest wymagany" },
        { status: 400 }
      );
    }

    // --- WHERE FILTER ---
    const where: any = {
      category: {
        name: {
          in: categories,
          mode: "insensitive",
        },
      },
    };

    if (brands.length) {
      where.brand = {
        name: {
          in: brands,
          mode: "insensitive",
        },
      };
    }



    if (min || max) {
      where.price = {};
      if (min) where.price.gte = Number(min);
      if (max) where.price.lte = Number(max);
    }

    // --- SORT ---
    let orderBy: any = { id: "desc" }; // default newest
    if (sortParam === "oldest") orderBy = { id: "asc" };
    if (sortParam === "priceAsc") orderBy = { price: "asc" };
    if (sortParam === "priceDesc") orderBy = { price: "desc" };

    // --- PAGINATION ---
    if (!limitParam) {
      const products = await prisma.product.findMany({
        where,
        include: { category: true, brand: true },
        orderBy,
      });
      return NextResponse.json({
        data: products,
        meta: { totalItems: products.length, paginated: false },
      });
    }

    const limit = Math.max(Number(limitParam), 1);
    const page = Math.max(Number(pageParam) || 1, 1);
    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, brand: true },
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: products,
      meta: { page, limit, totalItems, totalPages, paginated: true },
    });
  } catch (error) {
    console.error("Błąd wyszukiwania produktów:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać produktów" },
      { status: 500 }
    );
  }
}
