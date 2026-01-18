import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET() {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });

    return NextResponse.json(orderItems);
  } catch (error) {
    console.error("Error getting orderItems:", error);
    return NextResponse.json(
      { message: "Failed to download order items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity, price } = body;

    // 🔍 Walidacja
    if (!orderId || !productId || !quantity || !price) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newOrderItem = await prisma.orderItem.create({
      data: {
        orderId: Number(orderId),
        productId: Number(productId),
        quantity: Number(quantity),
        price: Number(price),
      },
    });

    return NextResponse.json(newOrderItem, { status: 201 });
  } catch (error) {
    console.error("Error creating orderItem:", error);
    return NextResponse.json(
      { message: "Failed to create order item" },
      { status: 500 }
    );
  }
}
