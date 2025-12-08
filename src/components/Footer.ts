/**
 * Footer Component
 * Multi-column footer with newsletter signup
 */

import { designSystem } from '../styles/design-system'

const { colors, spacing } = designSystem

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterProps {
  columns: FooterColumn[]
  socialLinks?: Array<{ platform: string; url: string; icon: string }>
  copyrightText?: string
}

export function Footer({
  columns,
  socialLinks = [],
  copyrightText = `© ${new Date().getFullYear()} Risivo. All rights reserved.`,
}: FooterProps): string {
  return `
    <style>
      .footer {
        background: ${colors.darkGray};
        color: ${colors.white};
        padding: ${spacing['3xl']} 0 ${spacing.xl} 0;
        margin-top: ${spacing['4xl']};
      }

      .footer-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 ${spacing.lg};
      }

      .footer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: ${spacing['2xl']};
        margin-bottom: ${spacing['2xl']};
      }

      .footer-column h4 {
        color: ${colors.white};
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: ${spacing.lg};
      }

      .footer-links {
        list-style: none;
        padding: 0;
      }

      .footer-links li {
        margin-bottom: ${spacing.sm};
      }

      .footer-links a {
        color: ${colors.lightGray};
        text-decoration: none;
        transition: color 0.2s;
      }

      .footer-links a:hover {
        color: ${colors.white};
      }

      .footer-newsletter {
        background: rgba(255, 255, 255, 0.1);
        padding: ${spacing.xl};
        border-radius: 8px;
      }

      .footer-newsletter h4 {
        margin-bottom: ${spacing.md};
      }

      .footer-newsletter p {
        margin-bottom: ${spacing.lg};
        color: ${colors.lightGray};
      }

      .newsletter-form {
        display: flex;
        gap: ${spacing.sm};
      }

      .newsletter-form input {
        flex: 1;
        padding: ${spacing.md};
        border: none;
        border-radius: 4px;
        background: ${colors.white};
      }

      .newsletter-form button {
        padding: ${spacing.md} ${spacing.xl};
        background: ${colors.primary};
        color: ${colors.white};
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }

      .newsletter-form button:hover {
        background: ${colors.primaryDark};
      }

      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: ${spacing.xl};
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: ${spacing.lg};
      }

      .footer-social {
        display: flex;
        gap: ${spacing.md};
      }

      .social-link {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${colors.white};
        text-decoration: none;
        transition: all 0.2s;
      }

      .social-link:hover {
        background: ${colors.primary};
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .footer-grid {
          grid-template-columns: 1fr;
          gap: ${spacing.xl};
        }

        .newsletter-form {
          flex-direction: column;
        }

        .footer-bottom {
          flex-direction: column;
          text-align: center;
        }
      }
    </style>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          ${columns.map(column => `
            <div class="footer-column">
              <h4>${column.title}</h4>
              <ul class="footer-links">
                ${column.links.map(link => `
                  <li><a href="${link.href}">${link.label}</a></li>
                `).join('')}
              </ul>
            </div>
          `).join('')}

          <div class="footer-column">
            <div class="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Get the latest CRM insights and product updates.</p>
              <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  required 
                  id="newsletter-email"
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>${copyrightText}</div>
          
          ${socialLinks.length > 0 ? `
            <div class="footer-social">
              ${socialLinks.map(social => `
                <a href="${social.url}" class="social-link" aria-label="${social.platform}" target="_blank" rel="noopener">
                  ${social.icon}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </footer>

    <script>
      async function subscribeNewsletter(e) {
        e.preventDefault()
        const email = document.getElementById('newsletter-email').value
        
        try {
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              timestamp: new Date().toISOString(),
              source: 'footer-newsletter'
            })
          })
          
          if (response.ok) {
            alert('Thank you for subscribing!')
            document.getElementById('newsletter-email').value = ''
          } else {
            alert('Subscription failed. Please try again.')
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error)
          alert('An error occurred. Please try again.')
        }
      }
    </script>
  `
}
