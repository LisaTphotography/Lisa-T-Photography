"use server"

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingMethod: "pickup" | "delivery"
  shippingAddress?: {
    address: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  items: Array<{
    title: string
    size: string
    frame: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingZone?: any
}

export async function sendOrderEmails(orderData: OrderEmailData) {
  try {
    // Format order items for email
    const itemsList = orderData.items
      .map(
        (item) =>
          `- ${item.title} (${item.size}, ${item.frame}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n")

    // Email to business owner (Lisa)
    const businessEmailBody = `
NEW ORDER RECEIVED - ${orderData.orderNumber}

CUSTOMER INFORMATION:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone}

${
  orderData.shippingMethod === "pickup"
    ? `
PICKUP INFORMATION:
Customer will pick up order in Strathmore, AB
Contact customer at: ${orderData.customerEmail} or ${orderData.customerPhone}
`
    : `
DELIVERY ADDRESS:
${orderData.shippingAddress?.address}
${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.province} ${orderData.shippingAddress?.postalCode}
${orderData.shippingAddress?.country}

SHIPPING ZONE: ${orderData.shippingZone?.name || "Standard"} (${orderData.shippingZone?.description || "Standard shipping"})
ESTIMATED DELIVERY: ${orderData.shippingZone?.deliveryDays || "5-10 days"}
`
}

ORDER ITEMS:
${itemsList}

ORDER SUMMARY:
Subtotal: $${orderData.subtotal.toFixed(2)}
${orderData.shippingMethod === "pickup" ? "Pickup: FREE" : `Delivery: ${orderData.shipping === 0 ? "FREE" : `$${orderData.shipping.toFixed(2)}`}`}
GST (5%): $${orderData.tax.toFixed(2)}
TOTAL: $${orderData.total.toFixed(2)}

PAYMENT INSTRUCTIONS:
Customer should send e-transfer for $${orderData.total.toFixed(2)} to: dat210@telus.net

Security Question: What is my business name?
Answer: Lisa T Photography

Process order once payment is received.
    `.trim()

    // Email to customer
    const customerEmailBody = `
Thank you for your order!

ORDER CONFIRMATION - ${orderData.orderNumber}

Hi ${orderData.customerName},

Thank you for your order from Lisa T Photography! We've received your order and are excited to get it ready for you.

YOUR ORDER:
${itemsList}

ORDER SUMMARY:
Subtotal: $${orderData.subtotal.toFixed(2)}
${orderData.shippingMethod === "pickup" ? "Pickup: FREE" : `Delivery: ${orderData.shipping === 0 ? "FREE" : `$${orderData.shipping.toFixed(2)}`}`}
GST (5%): $${orderData.tax.toFixed(2)}
TOTAL: $${orderData.total.toFixed(2)}

PAYMENT INSTRUCTIONS:
Please send an Interac e-transfer for $${orderData.total.toFixed(2)} to:
📧 dat210@telus.net

Security Question: What is my business name?
Answer: Lisa T Photography

${
  orderData.shippingMethod === "pickup"
    ? `
PICKUP DETAILS:
Once we receive your payment, we'll contact you to arrange pickup in Strathmore, AB.
`
    : `
DELIVERY DETAILS:
Your order will be shipped to:
${orderData.shippingAddress?.address}
${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.province} ${orderData.shippingAddress?.postalCode}

Estimated delivery: ${orderData.shippingZone?.deliveryDays || "5-10 days"}
`
}

WHAT'S NEXT?
1. Send the e-transfer payment to dat210@telus.net
2. We'll confirm receipt of payment within 24 hours
3. Your order will be processed and ${orderData.shippingMethod === "pickup" ? "ready for pickup" : "shipped"} within 3-5 business days
4. You'll receive ${orderData.shippingMethod === "pickup" ? "pickup" : "tracking"} information once your order ${orderData.shippingMethod === "pickup" ? "is ready" : "ships"}

Questions? Feel free to reach out:
📧 Email: dat210@telus.net
📞 Phone: (403) 934-7262

Thank you for supporting Lisa T Photography!

Best regards,
Lisa T Photography
Strathmore, Alberta
    `.trim()

    // Send email to business owner
    const businessEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Lisa T Photography <orders@lisatphotography.com>", // You'll need to verify this domain with Resend
        to: ["dat210@telus.net"],
        subject: `New Order - ${orderData.orderNumber}`,
        text: businessEmailBody,
      }),
    })

    // Send email to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Lisa T Photography <orders@lisatphotography.com>", // You'll need to verify this domain with Resend
        to: [orderData.customerEmail],
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        text: customerEmailBody,
      }),
    })

    if (!businessEmailResponse.ok || !customerEmailResponse.ok) {
      console.error("Email sending failed")
      return { success: false, error: "Failed to send confirmation emails" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending emails:", error)
    return { success: false, error: "Failed to send emails" }
  }
}
