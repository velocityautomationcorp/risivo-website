// User Registration API Route
import { Hono } from 'hono'
import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

const registerRoute = new Hono()

registerRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
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

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return c.json(
        { error: 'An account with this email already exists' },
        409
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const slug = (companyName || name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    let uniqueSlug = slug
    let slugCounter = 1
    while (await prisma.agency.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${slugCounter}`
      slugCounter++
    }

    const agency = await prisma.agency.create({
      data: {
        name: companyName || `${name}'s Agency`,
        slug: uniqueSlug,
        email: email,
        plan: plan || 'free',
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        aiEnabled: true,
        maxSubAccounts: 5
      }
    })

    console.log('[REGISTER] Agency created:', agency.id)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
        agencyId: agency.id
      }
    })

    console.log('[REGISTER] User created:', user.id)

    const subAccount = await prisma.subAccount.create({
      data: {
        name: 'Main Account',
        agencyId: agency.id,
        aiEnabled: true
      }
    })

    console.log('[REGISTER] Default sub-account created:', subAccount.id)

    return c.json({
      success: true,
      userId: user.id,
      agencyId: agency.id,
      redirectUrl: 'https://app.risivo.com/onboarding',
      message: 'Account created successfully! Redirecting to onboarding...'
    })

  } catch (error: any) {
    console.error('[REGISTER] Error:', error)

    if (error.code === 'P2002') {
      return c.json(
        { error: 'An account with this email already exists' },
        409
      )
    }

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
