/**
 * Absolute base for payment return URLs (success / failed).
 * Set VITE_PUBLIC_APP_URL in production (e.g. http://103.208.181.252:3000) when the app
 * is served behind a different host than where users open checkout.
 */
export function getPublicAppOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getPaymentSuccessPageUrl(): string {
  return `${getPublicAppOrigin()}/payment-success`;
}

export function getPaymentFailedPageUrl(): string {
  return `${getPublicAppOrigin()}/payment-failed`;
}

export const PAYMENT_RETURN_STORAGE_KEY = "fireguide_payment_return";

export type PaymentReturnContext = {
  amountPaid: number;
  totalAmount: number;
  paidIncentives: number;
  paidBalance: number;
  paidOnline: number;
  orderIds: string[];
  transactionId?: string;
};

export function readPaymentReturnContext(): PaymentReturnContext | null {
  try {
    const raw = sessionStorage.getItem(PAYMENT_RETURN_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<PaymentReturnContext>;
    if (typeof p.amountPaid !== "number") return null;
    return {
      amountPaid: p.amountPaid,
      totalAmount: typeof p.totalAmount === "number" ? p.totalAmount : p.amountPaid,
      paidIncentives: typeof p.paidIncentives === "number" ? p.paidIncentives : 0,
      paidBalance: typeof p.paidBalance === "number" ? p.paidBalance : 0,
      paidOnline: typeof p.paidOnline === "number" ? p.paidOnline : p.amountPaid,
      orderIds: Array.isArray(p.orderIds) ? p.orderIds : [],
      transactionId: typeof p.transactionId === "string" ? p.transactionId : undefined,
    };
  } catch {
    return null;
  }
}

export function clearPaymentReturnContext(): void {
  try {
    sessionStorage.removeItem(PAYMENT_RETURN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
