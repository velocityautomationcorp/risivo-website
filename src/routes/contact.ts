// Contact Form API Route
import { Hono } from 'hono'
import { prisma } from '../lib/db'

const contactRoute = new Hono()

contactRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { firstName, lastName, email, phone, message, source } = body

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

    let defaultSubAccount = await prisma.subAccount.findFirst({
      where: { name: 'Website Leads' }
    })

    if (!defaultSubAccount) {
      defaultSubAccount = await prisma.subAccount.findFirst()
    }

    if (!defaultSubAccount) {
      console.error('[CONTACT] No sub-account found in database')
      return c.json(
        { error: 'System configuration error. Please contact support.' },
        500
      )
    }

    const contact = await prisma.contact.create({
      data: {
        subAccountId: defaultSubAccount.id,
        firstName,
        lastName,
        email,
        phone: phone || null,
        status: 'new',
        score: 0,
        tags: ['website', source || 'contact_form'],
        customFields: {
          message,
          source: source || 'contact_form',
          submittedAt: new Date().toISOString(),
          pageUrl: c.req.header('referer') || 'unknown',
          userAgent: c.req.header('user-agent') || 'unknown'
        }
      }
    })

    console.log('[CONTACT] Contact created:', contact.id)

    return c.json({
      success: true,
      contactId: contact.id,
      message: "Thank you! We'll be in touch soon."
    })

  } catch (error: any) {
    console.error('[CONTACT] Error:', error)

    if (error.code === 'P2002') {
      return c.json(
        { error: 'This email has already been submitted. We will contact you shortly.' },
        409
      )
    }

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
