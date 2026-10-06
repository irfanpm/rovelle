"use server";
// Online payments remain closed until provider order creation, capture verification,
// webhook reconciliation and live merchant credentials are configured together.
export async function verifyPayment(_payload: unknown) { return { success: false, error: "Online payments are not currently available." }; }

