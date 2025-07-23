import type { Metadata } from "next"
import CartClientPage from "./CartClientPage"

export const metadata: Metadata = {
  title: "Shopping Cart | PhotoVision",
  description: "View and manage your shopping cart",
}

export default function CartPage() {
  return <CartClientPage />
}
