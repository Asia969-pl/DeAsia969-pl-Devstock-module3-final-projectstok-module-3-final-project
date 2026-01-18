import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    if (!limitParam) {
      const products = await prisma.product.findMany({
        orderBy: { id: "asc" },
        include: {
          category: true, 
          brand: true,    
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

  
    const limit = Math.max(Number(limitParam), 1);
    const page = Math.max(Number(pageParam) || 1, 1);
    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: {
          category: true, 
          brand: true,    
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
    console.error("Error while downloading products:", error);
    return NextResponse.json(
      { message: "Failed to download products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId, brandId } = body;

    if (!name || !description || !price || !stock || !imageUrl || !categoryId || !brandId) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
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
        category: true, 
        brand: true,    
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
