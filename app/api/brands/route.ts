import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error while downloading brands:", error);
    return NextResponse.json(
      { message: "Unable to download brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image } = body;

    if (!name || !image) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newBrand = await prisma.brand.create({
      data: {
        name,
        image,
      },
    });
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Error while creating brand:", error);
    return NextResponse.json(
      { message: "Failed to create brand" },
      { status: 500 }
    );
  }
}
