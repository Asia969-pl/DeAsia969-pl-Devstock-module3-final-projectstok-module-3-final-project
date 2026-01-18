import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";
//categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error while loading category:", error);
    return NextResponse.json(
      { message: "Failed to load category" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      categoryImage,
      categoryDescription,
      categoryCarouselImage,
      categoryInfo,
    } = body;

    if (
      !name ||
      !categoryImage ||
      !categoryDescription ||
      !categoryCarouselImage ||
      !categoryInfo
    ) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        categoryImage,
        categoryDescription,
        categoryCarouselImage,
        categoryInfo,
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}
