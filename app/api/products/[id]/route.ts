import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error while downloading product:", error);
    return NextResponse.json(
      { message: "Failed to download product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      imageUrlFirst,
      imageUrlSecond,
      categoryId,
      brandId,
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(imageUrlFirst !== undefined && { imageUrlFirst }),
        ...(imageUrlSecond !== undefined && { imageUrlSecond }),
        ...(categoryId !== undefined && { categoryId }),
        ...(brandId !== undefined && { brandId }),
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error while updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 }
      );
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "The product has been removed",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error removing product:", error);
    return NextResponse.json(
      { message: "Failed to remove product" },
      { status: 500 }
    );
  }
}
