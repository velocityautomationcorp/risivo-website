// User Registration API Route - Using Supabase REST API for Cloudflare Workers
import { Hono } from 'hono'
import type { Context } from 'hono'

const registerRoute = new Hono()

interface RegisterBody {
  email: string
  password: string
  name: string
  companyName?: string
  plan?: string
}

// Simple password hashing using Web Crypto API (Cloudflare Workers compatible)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Generate unique slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

registerRoute.post('/', async (c: Context) => {
  try {
    const body = await c.req.json() as RegisterBody
    const { email, password, name, companyName, plan } = body

    if (!email || !password || !name) {
      return c.json(
        { error: 'Missing required fields: email, password, name' },
        400
      )
    }

    if (!email.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400)
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400)
    }

    console.log('[REGISTER] Creating account for:', email)

    // Get Supabase credentials from environment
    const env = c.env as any
    const supabaseUrl = env.SUPABASE_URL
    const supabaseKey = env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[REGISTER] Missing Supabase credentials')
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

    // Check if user already exists
    const checkUserResponse = await fetch(
      `${baseUrl}/User?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers
      }
    )

    if (checkUserResponse.ok) {
      const existingUsers = await checkUserResponse.json()
      if (existingUsers.length > 0) {
        return c.json(
          { error: 'An account with this email already exists' },
          409
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate unique slug for agency
    const baseSlug = generateSlug(companyName || name)
    let uniqueSlug = baseSlug
    let slugCounter = 1

    // Check if slug exists and generate unique one
    while (true) {
      const checkSlugResponse = await fetch(
        `${baseUrl}/Agency?slug=eq.${uniqueSlug}`,
        {
          method: 'GET',
          headers
        }
      )

      if (checkSlugResponse.ok) {
        const existingAgencies = await checkSlugResponse.json()
        if (existingAgencies.length === 0) {
          break // Slug is unique
        }
        uniqueSlug = `${baseSlug}-${slugCounter}`
        slugCounter++
      } else {
        break
      }
    }

    // Create Agency
    const agencyId = crypto.randomUUID()
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial

    const agencyData = {
      id: agencyId,
      name: companyName || `${name}'s Agency`,
      companyEmail: email,
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      goal: 5000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createAgencyResponse = await fetch(`${baseUrl}/Agency`, {
      method: 'POST',
      headers,
      body: JSON.stringify(agencyData)
    })

    if (!createAgencyResponse.ok) {
      const error = await createAgencyResponse.text()
      console.error('[REGISTER] Failed to create agency:', error)
      return c.json(
        { 
          error: 'Failed to create account. Please try again.',
          details: error 
        },
        500
      )
    }

    const agency = await createAgencyResponse.json()
    console.log('[REGISTER] Agency created:', agencyId)

    // Create User
    const userId = crypto.randomUUID()
    const userData = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'AGENCY_OWNER',
      agencyId: agencyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createUserResponse = await fetch(`${baseUrl}/User`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    })

    if (!createUserResponse.ok) {
      const error = await createUserResponse.text()
      console.error('[REGISTER] Failed to create user:', error)
      
      // Rollback: Try to delete the agency (best effort)
      try {
        await fetch(`${baseUrl}/Agency?id=eq.${agencyId}`, {
          method: 'DELETE',
          headers
        })
      } catch (rollbackError) {
        console.error('[REGISTER] Rollback failed:', rollbackError)
      }

      return c.json(
        { 
          error: 'Failed to create account. Please try again.',
          details: error 
        },
        500
      )
    }

    const user = await createUserResponse.json()
    console.log('[REGISTER] User created:', userId)

    // Create default SubAccount
    const subAccountId = crypto.randomUUID()
    const subAccountData = {
      id: subAccountId,
      name: 'Main Account',
      companyEmail: email,
      agencyId: agencyId,
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      goal: 5000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createSubAccountResponse = await fetch(`${baseUrl}/SubAccount`, {
      method: 'POST',
      headers,
      body: JSON.stringify(subAccountData)
    })

    if (!createSubAccountResponse.ok) {
      const error = await createSubAccountResponse.text()
      console.error('[REGISTER] Failed to create subaccount:', error)
      // Continue even if subaccount creation fails - user can create it later
    } else {
      console.log('[REGISTER] Default sub-account created:', subAccountId)
    }

    // Send to webhook if configured
    const webhookUrl = env.WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user_registration',
            email,
            name,
            companyName: companyName || `${name}'s Agency`,
            plan: plan || 'free',
            userId,
            agencyId,
            registeredAt: new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.error('[REGISTER] Webhook failed:', webhookError)
        // Don't fail the request if webhook fails
      }
    }

    return c.json({
      success: true,
      userId,
      agencyId,
      redirectUrl: 'https://app.risivo.com/onboarding',
      message: 'Account created successfully! Redirecting to onboarding...'
    })

  } catch (error: any) {
    console.error('[REGISTER] Error:', error)

    return c.json(
      { 
        error: 'Failed to create account. Please try again.',
        details: error.message 
      },
      500
    )
  }
})

export default registerRoute
