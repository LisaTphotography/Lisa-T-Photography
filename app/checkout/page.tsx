import type { Metadata } from "next"
import CheckoutClientPage from "./CheckoutClientPage"

export const metadata: Metadata = {
  title: "Checkout | Lisa JT Photography",
  description: "Complete your order securely",
}

export default function CheckoutPage() {
  return <CheckoutClientPage />
}
