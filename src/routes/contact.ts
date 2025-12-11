// Contact Form API Route - Using Supabase REST API for Cloudflare Workers
import { Hono } from 'hono'
import type { Context } from 'hono'

const contactRoute = new Hono()

interface ContactBody {
  firstName: string
  lastName: string
  email: string
  department?: string
  phone?: string
  message: string
  source?: string
}

contactRoute.post('/', async (c: Context) => {
  try {
    const body = await c.req.json() as ContactBody
    const { firstName, lastName, email, department, phone, message, source } = body

    if (!firstName || !lastName || !email || !message) {
      return c.json(
        { error: 'Missing required fields: firstName, lastName, email, message' },
        400
      )
    }

    if (!email.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400)
    }

    console.log('[CONTACT] Creating contact:', { firstName, lastName, email })

    // Get Supabase credentials from environment
    const env = c.env as any
    const supabaseUrl = env.SUPABASE_URL
    // Use service role key for server-side operations (bypasses RLS)
    const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[CONTACT] Missing Supabase credentials')
      return c.json(
        { error: 'Service configuration error. Please contact support.' },
        500
      )
    }

    const baseUrl = `${supabaseUrl}/rest/v1`
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }

    // Find default SubAccount (Website Leads or first available)
    let defaultSubAccountId: string | null = null
    
    try {
      const subAccountResponse = await fetch(
        `${baseUrl}/SubAccount?name=eq.Website%20Leads&limit=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (subAccountResponse.ok) {
        const subAccounts = await subAccountResponse.json()
        if (subAccounts.length > 0) {
          defaultSubAccountId = subAccounts[0].id
        }
      }
    } catch (err) {
      console.error('[CONTACT] Error finding SubAccount:', err)
    }

    // If no "Website Leads" subaccount, get the first one
    if (!defaultSubAccountId) {
      try {
        const firstSubAccountResponse = await fetch(
          `${baseUrl}/SubAccount?limit=1`,
          {
            method: 'GET',
            headers
          }
        )

        if (firstSubAccountResponse.ok) {
          const subAccounts = await firstSubAccountResponse.json()
          if (subAccounts.length > 0) {
            defaultSubAccountId = subAccounts[0].id
          }
        }
      } catch (err) {
        console.error('[CONTACT] Error finding first SubAccount:', err)
      }
    }

    if (!defaultSubAccountId) {
      console.error('[CONTACT] No sub-account found in database')
      return c.json(
        { error: 'System configuration error. Please contact support.' },
        500
      )
    }

    // Create contact in CRM
    const contactId = crypto.randomUUID()
    const contactData = {
      id: contactId,
      subAccountId: defaultSubAccountId,
      firstName,
      lastName,
      email,
      phone: phone || null,
      customFields: {
        department: department || null,
        message: message || null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createContactResponse = await fetch(`${baseUrl}/Contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactData)
    })

    if (!createContactResponse.ok) {
      const error = await createContactResponse.text()
      console.error('[CONTACT] Failed to create contact:', error)
      
      // Check if it's a duplicate email error
      if (error.includes('duplicate') || error.includes('unique')) {
        return c.json(
          { error: 'This email has already been submitted. We will contact you shortly.' },
          409
        )
      }

      return c.json(
        { 
          error: 'Failed to submit contact form. Please try again.',
          details: error 
        },
        500
      )
    }

    const contact = await createContactResponse.json()
    console.log('[CONTACT] Contact created:', contactId)

    // Also save to webhook if configured (for Make.com or other automation)
    const webhookUrl = env.WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact_form',
            firstName,
            lastName,
            email,
            department: department || null,
            phone: phone || null,
            message,
            source: source || 'contact_form',
            submittedAt: new Date().toISOString(),
            pageUrl: c.req.header('referer') || 'unknown',
            userAgent: c.req.header('user-agent') || 'unknown',
            contactId
          })
        })
      } catch (webhookError) {
        console.error('[CONTACT] Webhook failed:', webhookError)
        // Don't fail the request if webhook fails
      }
    }

    return c.json({
      success: true,
      contactId,
      message: "Thank you! We'll be in touch soon."
    })

  } catch (error: any) {
    console.error('[CONTACT] Error:', error)

    return c.json(
      { 
        error: 'Failed to submit contact form. Please try again.',
        details: error.message 
      },
      500
    )
  }
})

export default contactRoute
