/**
 * Footer Component - NEW DESIGN v2.0 - December 10, 2025
 * New Design - Newsletter at top, Logo + 4 columns, Social icons at bottom
 * Per footer mockup requirements (Footer Requirements & Comments.docx)
 * DEPLOYMENT VERSION: 2025-12-10-v2.0
 */

import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

// White Risivo logo path
const WHITE_RISIVO_LOGO =
  "data:image/png;base64,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";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  columns: FooterColumn[];
  socialLinks?: Array<{ platform: string; url: string; icon: string }>;
  copyrightText?: string;
  newsletterLanguages?: Array<{ code: string; label: string }>;
}

export function Footer({
  columns,
  socialLinks = [],
  copyrightText = `© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.`,
  newsletterLanguages = [
    { code: "en", label: "EN ▼" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
  ],
}: FooterProps): string {
  return `
    <style>
      .footer {
        background: #2b3544;
        color: ${colors.white};
        padding: 0;
        margin-top: 0;
        padding-top: 150px;
      }

      /* Newsletter Section - Top */
      .footer-newsletter-section {
        background: #3d4b5f;
        padding: ${spacing["2xl"]} 0;
        border-radius: 12px;
        margin: 0 auto;
        max-width: 1200px;
        width: 95%;
        transform: translateY(-50%);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }

      .footer-newsletter-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 ${spacing.lg};
        text-align: center;
      }

      .footer-newsletter-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: ${spacing.sm};
        color: ${colors.white};
      }

      .footer-newsletter-subtitle {
        font-size: 1rem;
        color: #cbd5e1;
        margin-bottom: ${spacing.xl};
      }

      .newsletter-form {
        display: flex;
        gap: ${spacing.md};
        max-width: 700px;
        margin: 0 auto;
        align-items: stretch;
      }

      .newsletter-language-select {
        padding: ${spacing.md} ${spacing.lg};
        border: none;
        border-radius: 8px;
        background: ${colors.white};
        font-size: 1rem;
        cursor: pointer;
        width: 90px;
        flex-shrink: 0;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 0.875rem;
        padding-right: 2rem;
      }

      .newsletter-form input {
        flex: 1;
        padding: ${spacing.md} ${spacing.lg};
        border: none;
        border-radius: 8px;
        background: ${colors.white};
        font-size: 1rem;
      }

      .newsletter-form button {
        padding: ${spacing.md} ${spacing["2xl"]};
        background: ${colors.primary};
        color: ${colors.white};
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .newsletter-form button:hover {
        background: ${colors.primaryDark};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
      }

      /* Main Footer Content */
      .footer-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: ${spacing["3xl"]} ${spacing.lg} ${spacing.xl} ${spacing.lg};
        padding-top: 0;
      }

      .footer-main {
        display: grid;
        grid-template-columns: 200px repeat(4, 1fr);
        gap: ${spacing["2xl"]};
        margin-bottom: ${spacing["3xl"]};
        align-items: start;
      }

      /* Logo Column */
      .footer-logo-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: ${spacing.md};
      }

      .footer-logo {
        width: 120px;
        height: auto;
        margin-bottom: ${spacing.md};
      }

      /* Menu Columns */
      .footer-column h4 {
        color: ${colors.white};
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: ${spacing.lg};
        text-align: left;
      }

      .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-links li {
        margin-bottom: ${spacing.sm};
        text-align: left;
      }

      .footer-links a {
        color: #cbd5e1;
        text-decoration: none;
        transition: color 0.2s;
        font-size: 0.95rem;
      }

      .footer-links a:hover {
        color: ${colors.white};
      }

      /* Bottom Section - Copyright & Social */
      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        padding-top: ${spacing.xl};
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: ${spacing.lg};
        text-align: center;
      }

      .footer-copyright {
        color: #cbd5e1;
        font-size: 0.9rem;
      }

      .footer-copyright-highlight {
        font-weight: 600;
        color: ${colors.white};
      }

      /* Social Icons */
      .footer-social {
        display: flex;
        gap: ${spacing.md};
        justify-content: center;
      }

      .social-link {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${colors.white};
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .social-link svg,
      .social-link img {
        width: 20px;
        height: 20px;
        filter: brightness(0) invert(1);
      }

      .social-link:hover {
        background: ${colors.primary};
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .footer-main {
          grid-template-columns: 150px repeat(2, 1fr);
          gap: ${spacing.xl};
        }

        .footer-logo-column {
          grid-column: 1;
          grid-row: 1 / 3;
        }
      }

      @media (max-width: 768px) {
        .footer-newsletter-section {
          transform: translateY(0);
          width: 100%;
          border-radius: 0;
          margin-bottom: ${spacing.xl};
        }

        .newsletter-form {
          flex-direction: column;
          gap: ${spacing.sm};
        }

        .newsletter-form input,
        .newsletter-language-select,
        .newsletter-form button {
          width: 100%;
        }

        .footer-main {
          grid-template-columns: 1fr;
          gap: ${spacing.xl};
          text-align: center;
        }

        .footer-logo-column {
          grid-column: 1;
          grid-row: auto;
          margin-bottom: ${spacing.lg};
        }

        .footer-column h4,
        .footer-links li {
          text-align: center;
        }

        .footer-bottom {
          flex-direction: column;
        }
      }
    </style>

    <footer class="footer">
      <!-- FOOTER VERSION: 2025-12-10-v2.0-NEW-DESIGN -->
      <!-- Newsletter Section at Top -->
      <div class="footer-newsletter-section">
        <div class="footer-newsletter-container">
          <h3 class="footer-newsletter-title">Stay Ahead of the Curve</h3>
          <h4 class="footer-newsletter-subtitle">Get exclusive CRM insights, AI tips, and product updates delivered to your inbox.</h4>
          <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
            <select 
              class="newsletter-language-select" 
              id="newsletter-language"
              aria-label="Select language"
            >
              ${newsletterLanguages
                .map(
                  (lang) => `
                <option value="${lang.code}">${lang.code.toUpperCase()}</option>
              `
                )
                .join("")}
            </select>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              id="newsletter-email"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <!-- Main Footer Content -->
      <div class="footer-container">
        <div class="footer-main">
          <!-- Logo Column -->
          <div class="footer-logo-column">
            <img src="${WHITE_RISIVO_LOGO}" alt="Risivo CRM Logo" class="footer-logo" />
          </div>

          <!-- Menu Columns -->
          ${columns
            .map(
              (column) => `
            <div class="footer-column">
              <h4>${column.title}</h4>
              <ul class="footer-links">
                ${column.links
                  .map(
                    (link) => `
                  <li><a href="${link.href}">${link.label}</a></li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Bottom Section -->
        <div class="footer-bottom">
          <div class="footer-copyright">
            ${copyrightText}<br>
            <span class="footer-copyright-highlight">Risivo™</span> is a trademark of Velocity Automation Corp.
          </div>
          
          ${
            socialLinks.length > 0
              ? `
            <div class="footer-social">
              ${socialLinks
                .map(
                  (social) => `
                <a href="${social.url}" class="social-link" aria-label="${social.platform}" target="_blank" rel="noopener noreferrer">
                  ${social.icon}
                </a>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </div>
    </footer>

    <script>
      async function subscribeNewsletter(e) {
        e.preventDefault()
        const email = document.getElementById('newsletter-email').value
        const language = document.getElementById('newsletter-language').value
        
        try {
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              language,
              timestamp: new Date().toISOString(),
              source: 'footer-newsletter'
            })
          })
          
          if (response.ok) {
            alert('Thank you for subscribing! You will receive exclusive CRM insights and updates.')
            document.getElementById('newsletter-email').value = ''
          } else {
            const data = await response.json()
            alert(data.error || 'Subscription failed. Please try again.')
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error)
          alert('An error occurred. Please try again.')
        }
      }
    </script>
  `;
}
