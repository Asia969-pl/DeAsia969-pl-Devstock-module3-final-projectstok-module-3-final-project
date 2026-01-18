import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

function parseIdsFromUrl(req: NextRequest): { userId: number | null; orderId: number | null } {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean); 
    const orderIdStr = segments.pop(); 
    const userIdStr = segments.pop(); 
    const userId = Number(userIdStr);
    const orderId = Number(orderIdStr);
    return {
      userId: Number.isNaN(userId) ? null : userId,
      orderId: Number.isNaN(orderId) ? null : orderId,
    };
  } catch {
    return { userId: null, orderId: null };
  }
}


export async function GET(req: NextRequest) {
  try {
    const { userId, orderId } = parseIdsFromUrl(req);

    if (userId === null || orderId === null) {
      return NextResponse.json({ message: "Invalid userId or orderId" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true, 
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const orderWithCategory = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          categoryName: item.product.category?.name || null,
        },
      })),
    };

    return NextResponse.json(orderWithCategory, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/orders/[userId]/[orderId] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
