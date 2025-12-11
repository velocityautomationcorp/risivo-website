// Supabase REST API client for Cloudflare Workers
// This replaces Prisma Client which doesn't work in Workers runtime
// Connects to shared Supabase PostgreSQL database with CRM

/**
 * Supabase REST API Client
 * Works in Cloudflare Workers (no Node.js APIs required)
 * Uses fetch API for database operations
 */

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export class SupabaseClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: SupabaseConfig) {
    this.baseUrl = `${config.url}/rest/v1`
    this.headers = {
      'apikey': config.anonKey,
      'Authorization': `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }

  /**
   * Insert a new contact into CRM
   */
  async createContact(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    subAccountId: string
  }) {
    const response = await fetch(`${this.baseUrl}/Contact`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        subAccountId: data.subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create contact: ${error}`)
    }

    return response.json()
  }

  /**
   * Create or update newsletter subscriber
   */
  async createSubscriber(data: {
    email: string
    name?: string
    status?: string
    tags?: string[]
  }) {
    // First check if subscriber exists
    const existingResponse = await fetch(
      `${this.baseUrl}/NewsletterSubscriber?email=eq.${encodeURIComponent(data.email)}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (existingResponse.ok) {
      const existing = await existingResponse.json()
      if (existing.length > 0) {
        // Subscriber exists, return it
        return existing[0]
      }
    }

    // Create new subscriber
    const response = await fetch(`${this.baseUrl}/NewsletterSubscriber`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        id: crypto.randomUUID(),
        email: data.email,
        name: data.name,
        status: data.status || 'active',
        tags: data.tags || [],
        subscribedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create subscriber: ${error}`)
    }

    return response.json()
  }

  /**
   * Register new user with agency and subaccount
   */
  async registerUser(data: {
    email: string
    name: string
    agencyName: string
    password: string // Will be hashed
  }) {
    // Create Agency
    const agencyId = crypto.randomUUID()
    const slug = data.agencyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const agencyResponse = await fetch(`${this.baseUrl}/Agency`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        id: agencyId,
        name: data.agencyName,
        slug: slug,
        email: data.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!agencyResponse.ok) {
      const error = await agencyResponse.text()
      throw new Error(`Failed to create agency: ${error}`)
    }

    const agency = await agencyResponse.json()

    // Create User
    const userId = crypto.randomUUID()
    const userResponse = await fetch(`${this.baseUrl}/User`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        id: userId,
        name: data.name,
        email: data.email,
        password: await this.hashPassword(data.password),
        role: 'AGENCY_OWNER',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!userResponse.ok) {
      const error = await userResponse.text()
      throw new Error(`Failed to create user: ${error}`)
    }

    const user = await userResponse.json()

    // Create default SubAccount
    const subAccountId = crypto.randomUUID()
    const subAccountResponse = await fetch(`${this.baseUrl}/SubAccount`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        id: subAccountId,
        name: `${data.agencyName} - Main`,
        email: data.email,
        agencyId: agencyId,
        industry: 'General',
        timezone: 'America/Los_Angeles',
        language: 'en',
        aiEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })

    if (!subAccountResponse.ok) {
      const error = await subAccountResponse.text()
      throw new Error(`Failed to create subaccount: ${error}`)
    }

    return {
      agency: agency[0],
      user: user[0],
      subAccount: (await subAccountResponse.json())[0]
    }
  }

  /**
   * Simple password hashing using Web Crypto API
   * Note: For production, consider using a proper password hashing library
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  /**
   * Get a SubAccount by ID
   */
  async getSubAccount(id: string) {
    const response = await fetch(
      `${this.baseUrl}/SubAccount?id=eq.${id}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get subaccount: ${error}`)
    }

    const results = await response.json()
    return results[0] || null
  }

  /**
   * Get first SubAccount for an Agency (for default operations)
   */
  async getFirstSubAccount(agencyId: string) {
    const response = await fetch(
      `${this.baseUrl}/SubAccount?agencyId=eq.${agencyId}&limit=1`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get subaccount: ${error}`)
    }

    const results = await response.json()
    return results[0] || null
  }
}

/**
 * Initialize Supabase client from environment variables
 */
export function createSupabaseClient(env: {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}): SupabaseClient {
  return new SupabaseClient({
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY
  })
}
