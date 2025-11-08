"use server"

import { Resend } from "resend"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  // Validate form data
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    throw new Error("All fields are required")
  }

  if (!isValidEmail(formData.email)) {
    throw new Error("Please enter a valid email address")
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email service not configured")
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email using Resend
    const result = await resend.emails.send({
      from: "contact@lisajtphotography.com",
      to: ["LisaJTPhotography@gmail.com"],
      replyTo: formData.email,
      subject: `Contact Form: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <h3>Message:</h3>
        <p>${formData.message.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p><em>Reply directly to this email to respond to ${formData.name}</em></p>
      `,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error(`Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
