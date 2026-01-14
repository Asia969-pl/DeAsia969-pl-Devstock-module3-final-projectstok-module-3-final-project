import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/").pop());

    if (!id) {
      return NextResponse.json(
        { message: "Nieprawidłowe id pozycji zamówienia" },
        { status: 400 }
      );
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { message: "Pozycja zamówienia nie została znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(orderItem);
  } catch (error) {
    console.error("Błąd pobierania orderItem:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać pozycji zamówienia" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
    try {
      const url = new URL(request.url);
      const id = Number(url.pathname.split("/").pop());
  
      if (!id) {
        return NextResponse.json(
          { message: "Nieprawidłowe id pozycji zamówienia" },
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const { orderId, productId, quantity, price } = body;
  
      const updatedOrderItem = await prisma.orderItem.update({
        where: { id },
        data: {
          ...(orderId && { orderId: Number(orderId) }),
          ...(productId && { productId: Number(productId) }),
          ...(quantity && { quantity: Number(quantity) }),
          ...(price && { price: Number(price) }),
        },
      });
  
      return NextResponse.json(updatedOrderItem);
    } catch (error) {
      console.error("Błąd aktualizacji orderItem:", error);
      return NextResponse.json(
        { message: "Nie udało się zaktualizować pozycji zamówienia" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request) {
    try {
      const url = new URL(request.url);
      const id = Number(url.pathname.split("/").pop());
  
      if (!id) {
        return NextResponse.json(
          { message: "Nieprawidłowe id pozycji zamówienia" },
          { status: 400 }
        );
      }
  
      const deletedOrderItem = await prisma.orderItem.delete({
        where: { id },
      });
  
      return NextResponse.json({
        message: "Pozycja zamówienia została usunięta",
        orderItem: deletedOrderItem,
      });
    } catch (error) {
      console.error("Błąd usuwania orderItem:", error);
      return NextResponse.json(
        { message: "Nie udało się usunąć pozycji zamówienia" },
        { status: 500 }
      );
    }
  }
  