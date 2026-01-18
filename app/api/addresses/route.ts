import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";


export async function GET(req: NextRequest) {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: { id: "desc" }, 
    });
    return NextResponse.json(addresses, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/addresses error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isDefault, country, province, city, postalCode, completeAdress } = body;

    if (!userId || !country || !city || !completeAdress) {
      return NextResponse.json({ message: "No required data" }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: Number(userId) },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: Number(userId),
        country,
        province,
        city,
        postalCode,
        completeAdress,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/addresses error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
