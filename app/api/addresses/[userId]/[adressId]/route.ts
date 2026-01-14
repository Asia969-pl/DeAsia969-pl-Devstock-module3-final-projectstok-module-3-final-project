import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

// Wyciąganie userId i addressId z URL
function getIdsFromRequest(req: NextRequest) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const userId = Number(parts[parts.length - 2]);      // userId przed addressId
  const addressId = Number(parts[parts.length - 1]);   // addressId to ostatni segment
  return {
    userId: isNaN(userId) ? null : userId,
    addressId: isNaN(addressId) ? null : addressId,
  };
}

// GET /api/addresses/[userId]/[addressId]
export async function GET(req: NextRequest) {
  try {
    const { userId, addressId } = getIdsFromRequest(req);
    if (!userId || !addressId) {
      return NextResponse.json({ message: "Invalid userId or addressId" }, { status: 400 });
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/addresses/[userId]/[addressId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// PATCH /api/addresses/[userId]/[addressId] – toggle isDefault
export async function PATCH(req: NextRequest) {
  try {
    const { userId, addressId } = getIdsFromRequest(req);
    if (!userId || !addressId) {
      return NextResponse.json({ message: "Invalid userId or addressId" }, { status: 400 });
    }

    // Pobranie obecnego stanu adresu
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    const newDefault = !address.isDefault;

    if (newDefault) {
      // jeśli ustawiamy nowy default, resetujemy wszystkie inne adresy
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: newDefault },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/addresses/[userId]/[addressId] error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
