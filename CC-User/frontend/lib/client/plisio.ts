import axios, { AxiosError } from "axios";

const PLISIO_API_KEY = process.env.PLISIO_API_KEY;

const plisioClient = axios.create({
  baseURL: "https://plisio.net/api/v1",
  headers: {
    Authorization: `Bearer ${PLISIO_API_KEY}`,
  },
});

export async function createPlisioInvoice(
  amount: number,
  currency: string,
  description: string
) {
  try {
    const response = await plisioClient.post("/invoices/new", {
      amount,
      currency,
      description,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error(
        "Error creating invoice:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create invoice."
      );
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
}
