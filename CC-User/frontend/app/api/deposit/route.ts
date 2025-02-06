import { NextResponse } from 'next/server';
import axios from 'axios';

const PLISIO_API_URL = 'https://api.plisio.net/v1/';
const PLISIO_API_KEY = 'CzNr-B6xv2gBUzsI1bzBxdiTDzGiQyIcKcB3gA1eI25OsZIsTDh8Psrqp1X6ThEZ'; // Replace with your Plisio API Key

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderNumber } = body;

    const response = await axios.post(`${PLISIO_API_URL}invoices/create`, {
      api_key: PLISIO_API_KEY,
      amount,
      currency,
      order_number: orderNumber,
      description: `Deposit for Order #${orderNumber}`,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating Plisio deposit:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create deposit.' },
      { status: 500 }
    );
  }
}
