// Contact Page
// Full contact page with form and company info
import { Navigation } from '../components/Navigation'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { designSystem } from '../styles/design-system'

export const ContactPage = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Us - Risivo | Get in Touch</title>
      <meta name="description" content="Contact Risivo for questions, support, or to schedule a demo. We're here to help you succeed with AI-powered CRM.">
      <link rel="icon" type="image/png" href="/favicon.png">
      
    </head>
    <body>
      ${Navigation({
        logoSrc: '/risivo-logo.png',
        navItems: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact', active: true }
        ]
      })}

      <div class="contact-hero">
        <h1>Get in Touch</h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <h2>Contact Information</h2>

          <div class="info-item">
            <h3>📧 Email</h3>
            <p><a href="mailto:hello@risivo.com">hello@risivo.com</a></p>
          </div>

          <div class="info-item">
            <h3>💬 Support</h3>
            <p>For technical support or account issues:<br/>
            <a href="mailto:support@risivo.com">support@risivo.com</a></p>
          </div>

          <div class="info-item">
            <h3>📞 Phone</h3>
            <p>+1 (555) 123-4567<br/>
            Mon-Fri, 9am-6pm EST</p>
          </div>

          <div class="info-item">
            <h3>🏢 Office</h3>
            <p>123 Business Street<br/>
            Suite 456<br/>
            San Francisco, CA 94102</p>
          </div>

          <div class="info-item">
            <h3>⏱️ Response Time</h3>
            <p>We typically respond within 24 hours during business days.</p>
          </div>
        </div>

        <div class="contact-form-wrapper">
          ${ContactForm()}
        </div>
      </div>

      ${Footer()}
    </body>
    </html>
  `
}
