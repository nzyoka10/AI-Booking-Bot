import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: string;
}

interface WebhookPayload {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
        statuses?: any[];
      };
    }>;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'GET') {
      // WhatsApp webhook verification
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === 'your_verify_token') {
        return new Response(challenge, { headers: corsHeaders })
      }

      return new Response('Forbidden', { status: 403, headers: corsHeaders })
    }

    if (req.method === 'POST') {
      const payload: WebhookPayload = await req.json()
      
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              await processWhatsAppMessage(message, supabase)
            }
          }
        }
      }

      return new Response('OK', { headers: corsHeaders })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})

async function processWhatsAppMessage(message: WhatsAppMessage, supabase: any) {
  console.log('Processing message:', message)

  // Store incoming message
  await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: message.from,
      message_type: 'incoming',
      message_content: message.text.body,
      session_id: message.id
    })

  // Process message with AI
  const aiResponse = await generateAIResponse(message.text.body, message.from, supabase)
  
  // Send response back to WhatsApp
  await sendWhatsAppMessage(message.from, aiResponse)
  
  // Store outgoing message
  await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: message.from,
      message_type: 'outgoing',
      message_content: aiResponse,
      session_id: message.id
    })
}

async function generateAIResponse(messageText: string, phoneNumber: string, supabase: any): Promise<string> {
  const lowerMessage = messageText.toLowerCase()
  
  // Simple intent detection
  if (lowerMessage.includes('plumb') || lowerMessage.includes('water') || lowerMessage.includes('pipe')) {
    // Find available plumbers
    const { data: fundis } = await supabase
      .from('fundis')
      .select(`
        *,
        profiles!inner(full_name, phone, location)
      `)
      .contains('service_ids', ['plumbing'])
      .eq('availability', 'available')
      .eq('verification_status', true)
      .limit(3)

    if (fundis && fundis.length > 0) {
      let response = "🔧 I found these verified plumbers near you:\n\n"
      fundis.forEach((fundi, index) => {
        response += `${index + 1}. *${fundi.profiles.full_name}*\n`
        response += `   ⭐ ${fundi.rating}/5 rating\n`
        response += `   📍 ${fundi.location}\n`
        response += `   💰 KSh ${fundi.hourly_rate}/hour\n`
        response += `   📱 ${fundi.profiles.phone}\n\n`
      })
      response += "Reply with the number to book, or type 'more info' for details."
      return response
    }
  }
  
  if (lowerMessage.includes('electric') || lowerMessage.includes('power') || lowerMessage.includes('wiring')) {
    return "⚡ I can help you find qualified electricians! Can you tell me more about your electrical issue? Is it an emergency or planned work?"
  }
  
  if (lowerMessage.includes('mechanic') || lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
    return "🚗 I can connect you with trusted mechanics! What type of vehicle issue are you experiencing? Please share your location too."
  }
  
  if (lowerMessage.includes('book') && /\d+/.test(lowerMessage)) {
    // Handle booking selection
    return "✅ Great choice! I'm processing your booking. Please confirm:\n\n📅 When do you need the service?\n📍 What's your exact location?\n📝 Any specific details about the job?"
  }
  
  // Default response
  return `Hello! 👋 Welcome to MtaaniFix!\n\nI can help you find:\n🔧 Plumbers\n⚡ Electricians  \n🚗 Mechanics\n💻 ICT Support\n\nWhat service do you need today?`
}

async function sendWhatsAppMessage(to: string, message: string) {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  
  if (!accessToken || !phoneNumberId) {
    console.error('WhatsApp credentials not configured')
    return
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    if (!response.ok) {
      console.error('Failed to send WhatsApp message:', await response.text())
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
  }
}