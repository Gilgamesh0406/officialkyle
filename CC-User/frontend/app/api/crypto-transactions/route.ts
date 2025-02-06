import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET all transactions
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userid = searchParams.get("userid") || "";
  const currency = searchParams.get("currency") || "";
  try {
    const transactions = await prisma.cryptoListing.findMany({
      select: {
        id: false,
        canceled: true,
        confirmed: true,
        type: true,
        userid: true,
        address: true,
        currency: true,
        amount: true,
        time: false,
      },
      where: {
        userid: userid,
        currency: currency,
        canceled: false,
        confirmed: false
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
