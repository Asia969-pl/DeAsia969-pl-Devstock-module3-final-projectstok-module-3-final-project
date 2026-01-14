import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { message: "Nieprawidłowe id adresu" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!brand) {
      return NextResponse.json(
        { message: "Marka nie została znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Błąd podczas pobierania marki:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać marki" },
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
        { message: "Nieprawidłowe id adresu" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, image } = body;


    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image && { image })
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error("Błąd podczas aktualizacji marki:", error);
    return NextResponse.json(
      { message: "Nie udało się zaktualizować marki" },
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
          { message: "Nieprawidłowe id marki" },
          { status: 400 }
        );
      }
  
      const productsCount = await prisma.product.count({
        where: { brandId: id },
      });
  
      if (productsCount > 0) {
        return NextResponse.json(
          {
            message: "Nie można usunąć marki, która ma przypisane produkty",
          },
          { status: 409 }
        );
      }
  
      const deletedBrand = await prisma.brand.delete({
        where: { id },
      });
  
      return NextResponse.json(deletedBrand);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Błąd usuwania marki" },
        { status: 500 }
      );
    }
  }
  