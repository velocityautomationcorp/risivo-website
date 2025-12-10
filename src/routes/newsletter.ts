// Newsletter Subscription API Route
import { Hono } from 'hono'
import { prisma } from '../lib/db'

const newsletterRoute = new Hono()

newsletterRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { email, source } = body

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email address is required' }, 400)
    }

    console.log('[NEWSLETTER] Subscribing email:', email)

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existing) {
      if (existing.isActive) {
        return c.json({
          success: true,
          message: "You're already subscribed to our newsletter!"
        })
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, subscribedAt: new Date() }
        })

        return c.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated."
        })
      }
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        source: source || 'website',
        isActive: true
      }
    })

    console.log('[NEWSLETTER] Subscriber created:', subscriber.id)

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
