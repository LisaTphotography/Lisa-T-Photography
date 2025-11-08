"use server"

import { Resend } from "resend"

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
  console.log("🚀 Server action called - sendOrderEmails")
  console.log("📧 Customer email:", orderData.customerEmail)
  console.log("🔑 API Key exists:", !!process.env.RESEND_API_KEY)

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Format order items for email
    const itemsList = orderData.items
      .map(
        (item) =>
          `- ${item.title} (${item.size}, ${item.frame}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n")

    // Email to business owner (Lisa) - HTML version
    const businessEmailHtml = `
      <h2>NEW ORDER RECEIVED - ${orderData.orderNumber}</h2>
      
      <h3>CUSTOMER INFORMATION:</h3>
      <ul>
        <li><strong>Name:</strong> ${orderData.customerName}</li>
        <li><strong>Email:</strong> ${orderData.customerEmail}</li>
        <li><strong>Phone:</strong> ${orderData.customerPhone}</li>
      </ul>
      
      ${
        orderData.shippingMethod === "pickup"
          ? `
        <h3>PICKUP INFORMATION:</h3>
        <p>Customer will pick up order in Strathmore, AB</p>
        <p>Contact customer at: ${orderData.customerEmail} or ${orderData.customerPhone}</p>
      `
          : `
        <h3>DELIVERY ADDRESS:</h3>
        <p>
          ${orderData.shippingAddress?.address}<br/>
          ${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.province} ${orderData.shippingAddress?.postalCode}<br/>
          ${orderData.shippingAddress?.country}
        </p>
        <p><strong>Shipping Zone:</strong> ${orderData.shippingZone?.name || "Standard"} (${orderData.shippingZone?.description || "Standard shipping"})</p>
        <p><strong>Estimated Delivery:</strong> ${orderData.shippingZone?.deliveryDays || "5-10 days"}</p>
      `
      }
      
      <h3>ORDER ITEMS:</h3>
      <pre>${itemsList}</pre>
      
      <h3>ORDER SUMMARY:</h3>
      <ul>
        <li>Subtotal: $${orderData.subtotal.toFixed(2)}</li>
        <li>${orderData.shippingMethod === "pickup" ? "Pickup: FREE" : `Delivery: ${orderData.shipping === 0 ? "FREE" : `$${orderData.shipping.toFixed(2)}`}`}</li>
        <li>GST (5%): $${orderData.tax.toFixed(2)}</li>
        <li><strong>TOTAL: $${orderData.total.toFixed(2)}</strong></li>
      </ul>
      
      <h3>PAYMENT INSTRUCTIONS:</h3>
      <p>Customer should send e-transfer for <strong>$${orderData.total.toFixed(2)}</strong> to: <strong>LisaJTPhotography@gmail.com</strong></p>
      <p>Security Question: What is my business name?<br/>Answer: Lisa JT Photography</p>
      <p>⚠️ Process order once payment is received.</p>
    `

    // Email to customer - HTML version
    const customerEmailHtml = `
      <h1>Thank you for your order!</h1>
      <h2>ORDER CONFIRMATION - ${orderData.orderNumber}</h2>
      
      <p>Hi ${orderData.customerName},</p>
      <p>Thank you for your order from Lisa JT Photography! We've received your order and are excited to get it ready for you.</p>
      
      <h3>YOUR ORDER:</h3>
      <pre>${itemsList}</pre>
      
      <h3>ORDER SUMMARY:</h3>
      <ul>
        <li>Subtotal: $${orderData.subtotal.toFixed(2)}</li>
        <li>${orderData.shippingMethod === "pickup" ? "Pickup: FREE" : `Delivery: ${orderData.shipping === 0 ? "FREE" : `$${orderData.shipping.toFixed(2)}`}`}</li>
        <li>GST (5%): $${orderData.tax.toFixed(2)}</li>
        <li><strong>TOTAL: $${orderData.total.toFixed(2)}</strong></li>
      </ul>
      
      <h3>PAYMENT INSTRUCTIONS:</h3>
      <p>Please send an Interac e-transfer for <strong>$${orderData.total.toFixed(2)}</strong> to:</p>
      <p>📧 <strong>LisaJTPhotography@gmail.com</strong></p>
      <p>Security Question: What is my business name?<br/>Answer: Lisa JT Photography</p>
      
      ${
        orderData.shippingMethod === "pickup"
          ? `
        <h3>PICKUP DETAILS:</h3>
        <p>Once we receive your payment, we'll contact you to arrange pickup in Strathmore, AB.</p>
      `
          : `
        <h3>DELIVERY DETAILS:</h3>
        <p>Your order will be shipped to:</p>
        <p>
          ${orderData.shippingAddress?.address}<br/>
          ${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.province} ${orderData.shippingAddress?.postalCode}
        </p>
        <p>Estimated delivery: ${orderData.shippingZone?.deliveryDays || "5-10 days"}</p>
      `
      }
      
      <h3>WHAT'S NEXT?</h3>
      <ol>
        <li>Send the e-transfer payment to LisaJTPhotography@gmail.com</li>
        <li>We'll confirm receipt of payment within 24 hours</li>
        <li>Your order will be processed and ${orderData.shippingMethod === "pickup" ? "ready for pickup" : "shipped"} within 3-5 business days</li>
        <li>You'll receive ${orderData.shippingMethod === "pickup" ? "pickup" : "tracking"} information once your order ${orderData.shippingMethod === "pickup" ? "is ready" : "ships"}</li>
      </ol>
      
      <p>Questions? Feel free to reach out:</p>
      <ul>
        <li>📧 Email: LisaJTPhotography@gmail.com</li>
        <li>📞 Phone: (403) 934-7262</li>
      </ul>
      
      <p>Thank you for supporting Lisa JT Photography!</p>
      <p>Best regards,<br/>Lisa JT Photography<br/>Strathmore, Alberta</p>
    `

    console.log("📤 Sending business email to LisaJTPhotography@gmail.com...")

    const businessEmail = await resend.emails.send({
      from: "orders@lisajtphotography.com",
      to: ["LisaJTPhotography@gmail.com"],
      subject: `New Order - ${orderData.orderNumber}`,
      html: businessEmailHtml,
    })

    console.log("✅ Business email result:", businessEmail)

    if (businessEmail.error) {
      console.error("❌ Business email failed:", businessEmail.error)
      throw new Error(`Business email failed: ${businessEmail.error.message}`)
    }

    console.log("📤 Sending customer email to", orderData.customerEmail)

    const customerEmail = await resend.emails.send({
      from: "orders@lisajtphotography.com",
      to: [orderData.customerEmail],
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: customerEmailHtml,
    })

    console.log("✅ Customer email result:", customerEmail)

    if (customerEmail.error) {
      console.error("❌ Customer email failed:", customerEmail.error)
      throw new Error(`Customer email failed: ${customerEmail.error.message}`)
    }

    console.log("🎉 Both emails sent successfully!")
    return { success: true }
  } catch (error) {
    console.error("💥 Error sending emails:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send emails",
    }
  }
}
