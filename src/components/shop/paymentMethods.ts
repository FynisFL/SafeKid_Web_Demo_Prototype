import { CreditCard, QrCode } from "lucide-react";

export const paymentMethods = [
  { id: "qr", label: "Bank QR", detail: "VNPAY-QR", icon: QrCode },
  { id: "card", label: "Debit or credit card", detail: "Domestic or international card", icon: CreditCard },
  { id: "wallet", label: "MoMo", detail: "E-wallet", icon: null },
] as const;

export type PaymentMethod = typeof paymentMethods[number];
