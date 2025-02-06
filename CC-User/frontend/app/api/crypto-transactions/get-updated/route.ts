import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET all transactions
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PLISIO_API_BASE_URL}/operations/${id}?api_key=${process.env.PLISIO_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: Date.now() % 2 === 0 ? "0" : "1",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const cryptoListingData = await prisma.cryptoListing.findFirst({
      where: { address: id },
    });

    const amount = parseFloat(
      cryptoListingData ? cryptoListingData.amount.toString() : "0"
    );

    const data = await response.json();
    if (data.data.status === "completed") {
      const cryptoConfirmation = await prisma.cryptoConfirmation.findFirst({
        where: { listingid: cryptoListingData?.id },
      });
      if (!cryptoConfirmation) {
        await prisma.cryptoConfirmation.create({
          data: {
            userid: cryptoListingData?.userid,
            listingid: cryptoListingData?.id || -1,
            transactionid: -1,
            time: Date.now(),
          },
        });
        const user = await prisma.user.findFirst({
          where: { userid: cryptoListingData?.userid },
        });
        if (user) {
          await prisma.userTransaction.create({
            data: {
              userid: user.userid,
              service: "crypto_deposit",
              amount: amount * 1.2,
              time: Date.now(),
            },
          });

          await prisma.user.updateMany({
            where: {
              userid: user?.userid,
            },
            data: {
              balance:
                parseFloat(user ? user.balance.toString() : "0") + amount * 1.2,
            },
          });
        }
      }
    }
    await prisma.cryptoListing.updateMany({
      where: {
        address: id,
      },
      data: {
        type: data.data.status,
        canceled:
          data.data.status !== "new" &&
          data.data.status !== "completed" &&
          data.data.status !== "pending",
        confirmed: data.data.status === "completed",
      },
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store", // Prevent caching
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
