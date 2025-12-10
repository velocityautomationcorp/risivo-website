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
      
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: ${designSystem.colors.text.primary};
          background: #F9FAFB;
        }

        .contact-hero {
          background: linear-gradient(135deg, ${designSystem.colors.primary} 0%, #5a35c7 100%);
          color: white;
          padding: 6rem 2rem 4rem;
          text-align: center;
        }

        .contact-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .contact-hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-content {
          max-width: 1200px;
          margin: -2rem auto 4rem;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .contact-info {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .contact-info h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: ${designSystem.colors.text.primary};
        }

        .info-item {
          margin-bottom: 1.5rem;
        }

        .info-item h3 {
          font-size: 1rem;
          font-weight: 600;
          color: ${designSystem.colors.primary};
          margin-bottom: 0.5rem;
        }

        .info-item p {
          color: ${designSystem.colors.text.secondary};
          line-height: 1.6;
        }

        .info-item a {
          color: ${designSystem.colors.primary};
          text-decoration: none;
        }

        .info-item a:hover {
          text-decoration: underline;
        }

        .contact-form-wrapper {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 968px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-top: -1rem;
          }

          .contact-hero h1 {
            font-size: 2rem;
          }

          .contact-hero p {
            font-size: 1rem;
          }

          .contact-hero {
            padding: 5rem 1rem 3rem;
          }
        }
      </style>
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
