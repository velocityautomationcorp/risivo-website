// Newsletter Subscription API Route - Using Supabase REST API for Cloudflare Workers
import { Hono } from 'hono'
import type { Context } from 'hono'

const newsletterRoute = new Hono()

interface NewsletterBody {
  email: string
  source?: string
  name?: string
}

newsletterRoute.post('/', async (c: Context) => {
  try {
    const body = await c.req.json() as NewsletterBody
    const { email, source, name } = body

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email address is required' }, 400)
    }

    console.log('[NEWSLETTER] Subscribing email:', email)

    // Get Supabase credentials from environment
    const env = c.env as any
    const supabaseUrl = env.SUPABASE_URL
    const supabaseKey = env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[NEWSLETTER] Missing Supabase credentials')
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

    // Check if subscriber already exists
    const checkResponse = await fetch(
      `${baseUrl}/NewsletterSubscriber?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers
      }
    )

    if (checkResponse.ok) {
      const existing = await checkResponse.json()
      if (existing.length > 0) {
        const subscriber = existing[0]
        
        if (subscriber.status === 'active') {
          return c.json({
            success: true,
            message: "You're already subscribed to our newsletter!"
          })
        } else {
          // Reactivate subscription
          const updateResponse = await fetch(
            `${baseUrl}/NewsletterSubscriber?id=eq.${subscriber.id}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                status: 'active',
                subscribedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
            }
          )

          if (updateResponse.ok) {
            return c.json({
              success: true,
              message: "Welcome back! Your subscription has been reactivated."
            })
          }
        }
      }
    }

    // Create new subscriber
    const subscriberId = crypto.randomUUID()
    const subscriberData = {
      id: subscriberId,
      email,
      name: name || null,
      status: 'active',
      tags: [source || 'website'],
      subscribedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createResponse = await fetch(`${baseUrl}/NewsletterSubscriber`, {
      method: 'POST',
      headers,
      body: JSON.stringify(subscriberData)
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.error('[NEWSLETTER] Failed to create subscriber:', error)
      
      return c.json(
        { 
          error: 'Failed to subscribe to newsletter. Please try again.',
          details: error 
        },
        500
      )
    }

    const subscriber = await createResponse.json()
    console.log('[NEWSLETTER] Subscriber created:', subscriberId)

    // Also create a Contact record in CRM for newsletter subscribers
    try {
      // Get default SubAccount
      const subAccountResponse = await fetch(
        `${baseUrl}/SubAccount?limit=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (subAccountResponse.ok) {
        const subAccounts = await subAccountResponse.json()
        if (subAccounts.length > 0) {
          const defaultSubAccountId = subAccounts[0].id

          // Create contact
          const contactId = crypto.randomUUID()
          await fetch(`${baseUrl}/Contact`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              id: contactId,
              subAccountId: defaultSubAccountId,
              name: name || email.split('@')[0],
              email,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          })
        }
      }
    } catch (contactError) {
      console.error('[NEWSLETTER] Failed to create contact:', contactError)
      // Don't fail the request if contact creation fails
    }

    // Send to webhook if configured
    const webhookUrl = env.WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'newsletter_subscription',
            email,
            name: name || null,
            source: source || 'website',
            subscribedAt: new Date().toISOString(),
            subscriberId
          })
        })
      } catch (webhookError) {
        console.error('[NEWSLETTER] Webhook failed:', webhookError)
        // Don't fail the request if webhook fails
      }
    }

    return c.json({
      success: true,
      message: "You're subscribed! Check your email for confirmation."
    })

  } catch (error: any) {
    console.error('[NEWSLETTER] Error:', error)

    return c.json(
      { 
        error: 'Failed to subscribe to newsletter. Please try again.',
        details: error.message 
      },
      500
    )
  }
})

export default newsletterRoute
