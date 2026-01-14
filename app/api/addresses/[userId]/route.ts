import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

function getUserIdFromUrl(req: NextRequest): number | null {
  const url = new URL(req.url);
  const idParam = url.pathname.split("/").pop();
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/* =========================
   GET /api/addresses/[userId]
========================= */
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const url = new URL(req.url);
    const defaultOnly = url.searchParams.get("default") === "true";

    const where = defaultOnly
      ? { userId, isDefault: true }
      : { userId };

    const addresses = await prisma.address.findMany({
      where,
      orderBy: { id: "desc" }, // najnowsze na górze
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/addresses error:", err);
    return NextResponse.json(
      { message: "Failed to fetch addresses", error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST /api/addresses/[userId]
========================= */
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const body = await req.json();
    const {
      country,
      completeAdress,
      isDefault = false,
      province,
      city,
      postalCode,
    } = body;

    if (!country || !completeAdress) {
      return NextResponse.json(
        { message: "country and completeAdress are required" },
        { status: 400 }
      );
    }

    // 🟢 jeśli nowy adres ma być główny — zdejmujemy flagę z poprzednich
    if (isDefault === true) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        country: String(country),
        completeAdress: String(completeAdress),
        isDefault: Boolean(isDefault),
        province: province ? String(province) : null,
        city: city ? String(city) : null,
        postalCode: postalCode ? String(postalCode) : null,
        userId,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/addresses error:", err);
    return NextResponse.json(
      { message: "Failed to create address", error: err.message },
      { status: 500 }
    );
  }
}
