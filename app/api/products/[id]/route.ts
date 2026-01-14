import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

/* =========================
   GET – pobierz produkt + kategoria + marka
========================= */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Nieprawidłowe id produktu" },
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
        { message: "Produkt nie został znaleziony" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Błąd podczas pobierania produktu:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać produktu" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT – aktualizacja produktu
========================= */
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Nieprawidłowe id produktu" },
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
    console.error("Błąd podczas aktualizacji produktu:", error);
    return NextResponse.json(
      { message: "Nie udało się zaktualizować produktu" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – usuń produkt
========================= */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Nieprawidłowe id produktu" },
        { status: 400 }
      );
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Produkt został usunięty",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Błąd podczas usuwania produktu:", error);
    return NextResponse.json(
      { message: "Nie udało się usunąć produktu" },
      { status: 500 }
    );
  }
}
