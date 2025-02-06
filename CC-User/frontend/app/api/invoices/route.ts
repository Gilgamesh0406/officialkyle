import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const sourceCurrency = searchParams.get("source_currency") || "USD";
  const sourceAmount = searchParams.get("source_amount") || "9";
  const orderNumber = searchParams.get("order_number") || "1";
  const orderName = searchParams.get("order_name") || "btc1";
  const allowed_psys_cids = searchParams.get("allowed_psys_cids") || "BTC";

  const apiKey = process.env.PLISIO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Plisio API key not configured" },
      { status: 500 }
    );
  }

  const queryParams = new URLSearchParams({
    source_currency: sourceCurrency,
    source_amount: sourceAmount,
    order_number: orderNumber,
    order_name: orderName,
    allowed_psys_cids: allowed_psys_cids,
    api_key: apiKey,
    callback_url: process.env.NEXT_PUBLIC_WEB_URL + '/api/plisio/callback'

  });

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_PLISIO_API_BASE_URL
      }/invoices/new?${queryParams.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    // await prisma.cryptoAddress.create({
    //   data: {
    //     removed: false,
    //     userid: orderName,
    //     address: data.data.invoice_url,
    //     currency: allowed_psys_cids,
    //     time: parseInt(orderNumber)
    //   },
    // });

    await prisma.cryptoListing.create({
      data: {
        canceled: false,
        confirmed: false,
        type: "New",
        userid: orderName,
        address: data.data.txn_id,
        currency: allowed_psys_cids,
        amount: sourceAmount,
        time: parseInt(orderNumber)
      }
    })

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
