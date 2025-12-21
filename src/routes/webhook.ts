import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  MAKE_WAITLIST_WEBHOOK_URL?: string
  MAKE_INVESTOR_WEBHOOK_URL?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Waitlist webhook endpoint
app.post('/waitlist', async (c) => {
  try {
    const webhookUrl = c.env?.MAKE_WAITLIST_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('[WEBHOOK] MAKE_WAITLIST_WEBHOOK_URL not configured')
      return c.json({ 
        error: 'Webhook not configured',
        details: 'MAKE_WAITLIST_WEBHOOK_URL environment variable is not set'
      }, 500)
    }

    const body = await c.req.json()
    console.log('[WEBHOOK] Waitlist data received:', body)

    // Forward to Make.com
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      console.error('[WEBHOOK] Make.com returned error:', response.status)
      return c.json({ 
        error: 'Webhook submission failed',
        details: `Make.com returned status ${response.status}`
      }, 500)
    }

    console.log('[WEBHOOK] Successfully forwarded to Make.com')
    return c.json({ 
      success: true,
      message: 'Data sent to Make.com successfully'
    })

  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error)
    return c.json({ 
      error: 'Internal server error',
      details: error.message 
    }, 500)
  }
})

// Investor webhook endpoint
app.post('/investor', async (c) => {
  try {
    const webhookUrl = c.env?.MAKE_INVESTOR_WEBHOOK_URL
    const supabaseUrl = c.env?.SUPABASE_URL
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY

    const body = await c.req.json()
    console.log('[WEBHOOK] Investor data received:', body)

    // Count existing investors to determine position
    let investorNumber = 1 // Default
    
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // Count all investors in the database
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'investor')
        
        if (!error && count !== null) {
          investorNumber = count + 1 // Current investor's position
          console.log('[WEBHOOK] Investor count:', count, 'New investor number:', investorNumber)
        }
      } catch (dbError) {
        console.error('[WEBHOOK] Database count error (non-critical):', dbError)
        // Continue with default number if database fails
      }
    }

    // Forward to Make.com with investor number
    if (webhookUrl) {
      const webhookData = {
        ...body,
        investor_number: investorNumber
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      if (!response.ok) {
        console.error('[WEBHOOK] Make.com returned error:', response.status)
        // Don't fail - still return success with investor number
      } else {
        console.log('[WEBHOOK] Successfully forwarded to Make.com')
      }
    } else {
      console.warn('[WEBHOOK] MAKE_INVESTOR_WEBHOOK_URL not configured - skipping webhook')
    }

    // Return success with investor number
    return c.json({ 
      success: true,
      message: 'Investor registration received',
      investor_number: investorNumber
    })

  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error)
    return c.json({ 
      error: 'Internal server error',
      details: error.message 
    }, 500)
  }
})

export default app
