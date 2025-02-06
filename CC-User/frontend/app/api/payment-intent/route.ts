import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount }: { amount: number } = await req.json();

    // Validate the request payload
    const MAX_AMOUNT = 1_000_000; // $10,000
    if (!amount || amount <= 0 || amount > MAX_AMOUNT) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { description: "Deposit funds" }, // Example metadata
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
}
