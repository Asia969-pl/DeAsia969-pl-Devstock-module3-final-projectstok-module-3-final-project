import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid category id" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error while loading category:", error);
    return NextResponse.json(
      { message: "Failed to load category" },
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
        { message: "Invalid category id" },
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
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Could not update the category" },
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
        { message: "Invalid category id" },
        { status: 400 }
      );
    }

    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!categoryWithProducts) {
      return NextResponse.json(
        { message: "The category does not exist" },
        { status: 404 }
      );
    }

    if (categoryWithProducts.products.length > 0) {
      return NextResponse.json(
        { message: "You cannot delete a category that has products assigned to it." },
        { status: 409 }
      );
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "The category has been deleted",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
