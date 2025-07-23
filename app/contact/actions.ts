"use server"

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

  try {
    console.log("Attempting to send email with data:", formData)

    // Send email using EmailJS
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "YOUR_ACTUAL_SERVICE_ID", // Replace with your real service ID
        template_id: "YOUR_ACTUAL_TEMPLATE_ID", // Replace with your real template ID
        user_id: "YOUR_ACTUAL_PUBLIC_KEY", // Replace with your real public key
        template_params: {
          to_name: "Lisa T Photography",
          to_email: "dat210@telus.net",
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
        },
      }),
    })

    console.log("EmailJS response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("EmailJS error response:", errorText)
      throw new Error(`Failed to send email: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("EmailJS success:", result)

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
