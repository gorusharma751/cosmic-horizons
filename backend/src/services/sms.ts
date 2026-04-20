// sms.ts - SMS service
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendSMS(phone: string, message: string): Promise<void> {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    })
    console.log(`SMS sent to ${phone}`)
  } catch (error) {
    console.error('SMS send failed:', error)
    throw error
  }
}

export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${phone}`
    })
  } catch (error) {
    console.error('WhatsApp send failed:', error)
  }
}
