import { Hono } from 'hono'
import { HomepageStep6 } from './pages/homepage-step6'
import { ContactPageSimple } from './pages/contact-simple'
import { FeaturesPage } from './pages/features'
import { PricingPage } from './pages/pricing'
import contactRoute from './routes/contact'
import newsletterRoute from './routes/newsletter'
import registerRoute from './routes/register'

type Bindings = {
  WEBHOOK_URL?: string
  ENABLE_FULL_SITE?: string
  ENVIRONMENT?: string
  DATABASE_URL?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Mount API routes
app.route('/api/contact', contactRoute)
app.route('/api/newsletter', newsletterRoute)
app.route('/api/register', registerRoute)

// Debug endpoint to check configuration
app.get('/api/health', (c) => {
  const hasWebhook = !!c.env?.WEBHOOK_URL
  const isFullSite = c.env?.ENABLE_FULL_SITE === 'true'
  const environment = c.env?.ENVIRONMENT || 'production'
  
  return c.json({
    status: 'ok',
    environment,
    webhookConfigured: hasWebhook,
    fullSiteEnabled: isFullSite,
    timestamp: new Date().toISOString()
  })
})

// API endpoint for email subscriptions
app.post('/api/subscribe', async (c) => {
  try {
    const body = await c.req.json()
    const { email, timestamp, source } = body
    
    // Validate email first
    if (!email || !email.includes('@')) {
      console.error('Invalid email:', email)
      return c.json({ error: 'Invalid email address' }, 400)
    }
    
    // Get webhook URL from environment variable
    const webhookUrl = c.env?.WEBHOOK_URL || ''
    
    console.log('[SUBSCRIBE] Email:', email)
    console.log('[SUBSCRIBE] Webhook configured:', !!webhookUrl)
    
    if (!webhookUrl) {
      console.error('[SUBSCRIBE] WEBHOOK_URL not configured')
      return c.json({ 
        error: 'Service configuration incomplete. Please contact support.',
        code: 'WEBHOOK_NOT_CONFIGURED'
      }, 503)
    }
    
    // Send to Make.com webhook
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          timestamp,
          source,
          subscribed_at: new Date().toISOString(),
          page_url: c.req.url
        })
      })
      
      console.log('[SUBSCRIBE] Webhook response status:', webhookResponse.status)
      
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text()
        console.error('[SUBSCRIBE] Webhook error:', errorText)
        
        // Return success to user but log error
        return c.json({ 
          success: true, 
          message: 'Subscription received',
          warning: 'Processing error'
        })
      }
      
      return c.json({ success: true, message: 'Subscription successful' })
      
    } catch (fetchError) {
      console.error('[SUBSCRIBE] Fetch error:', fetchError)
      return c.json({ 
        success: true, 
        message: 'Subscription received',
        warning: 'Processing error'
      })
    }
    
  } catch (error) {
    console.error('[SUBSCRIBE] General error:', error)
    return c.json({ 
      error: 'Failed to process subscription', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Homepage - Full marketing website
app.get('/', (c) => {
  // Check if full site is enabled (for staging)
  const enableFullSite = c.env?.ENABLE_FULL_SITE === 'true'
  
  if (enableFullSite) {
    console.log('[ROUTING] Serving step 6 - Complete homepage with HeroWithDashboard')
    return c.html(HomepageStep6())
  }
  
  console.log('[ROUTING] Redirecting to coming soon')
  return c.redirect('/coming-soon')
})

// Coming Soon page route
app.get('/coming-soon', async (c) => {
  console.log('[ROUTING] Serving coming soon page')
  // For now, return a simple message
  // The full coming soon page will be loaded from the backup
  return c.html(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1>Coming Soon Page</h1>
        <p>This route will show the coming soon page.</p>
        <p>In staging, the homepage shows the full website.</p>
        <p><a href="/">Go to Homepage</a></p>
      </body>
    </html>
  `)
})

// Contact page
app.get('/contact', (c) => {
  return c.html(ContactPageSimple())
})

// Features page
app.get('/features', (c) => {
  return c.html(FeaturesPage())
})

// Pricing page
app.get('/pricing', (c) => {
  return c.html(PricingPage())
})

export default app
