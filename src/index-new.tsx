import { Hono } from 'hono'
import { Homepage } from './pages/homepage'

type Bindings = {
  WEBHOOK_URL?: string
  ENABLE_FULL_SITE?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// API endpoint for email subscriptions
app.post('/api/subscribe', async (c) => {
  try {
    const body = await c.req.json()
    const { email, timestamp, source } = body
    
    // Get webhook URL from environment variable
    const webhookUrl = c.env?.WEBHOOK_URL || ''
    
    if (!webhookUrl) {
      console.error('WEBHOOK_URL not configured')
      return c.json({ error: 'Webhook not configured' }, 500)
    }
    
    // Validate email
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400)
    }
    
    // Send to Make.com webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp,
        source,
        subscribed_at: new Date().toISOString(),
        page_url: c.req.url
      })
    })
    
    if (!webhookResponse.ok) {
      throw new Error('Webhook request failed')
    }
    
    return c.json({ success: true, message: 'Subscription successful' })
  } catch (error) {
    console.error('Subscription error:', error)
    return c.json({ error: 'Failed to process subscription' }, 500)
  }
})

// Homepage route - New full marketing website
app.get('/', (c) => {
  // Check if full site is enabled (can be controlled by environment variable)
  const enableFullSite = c.env?.ENABLE_FULL_SITE === 'true'
  
  if (enableFullSite) {
    return c.html(Homepage())
  }
  
  // Default: redirect to coming soon page
  return c.redirect('/coming-soon')
})

// Coming Soon page (moved to separate route)
app.get('/coming-soon', async (c) => {
  // Import the old coming soon page
  const { ComingSoonPage } = await import('./pages/coming-soon')
  return c.html(ComingSoonPage())
})

// Export the app
export default app
