// app/api/plisio/callback/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// This function will handle the incoming POST request from Plisio
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the incoming data for debugging purposes
    console.log("Plisio Callback Data:", data);

    // Plisio sends data with a signature to verify the request, we assume they send an 'invoice_id' and a 'status' field
    const { invoice_id, status, order_id, amount, currency, payment_id } = data;

    if (!invoice_id || !status || !order_id || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields in callback" },
        { status: 400 }
      );
    }

    // Return a success response to Plisio
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling Plisio callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
