/**
 * Footer Component - NEW DESIGN v2.0 - December 10, 2025
 * New Design - Newsletter at top, Logo + 4 columns, Social icons at bottom
 * Per footer mockup requirements (Footer Requirements & Comments.docx)
 * DEPLOYMENT VERSION: 2025-12-10-v2.0
 */

import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

// Base64 encoded white Risivo logo (for embedding directly in component)
const WHITE_RISIVO_LOGO = "/White Favicon.png";

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
  copyrightText = `© ${new Date().getFullYear()} Velocity Automation Corp. All rights reserved.`,
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
        max-width: 600px;
        margin: 0 auto;
        align-items: stretch;
      }

      .newsletter-form input {
        flex: 1;
        padding: ${spacing.md} ${spacing.lg};
        border: none;
        border-radius: 8px;
        background: ${colors.white};
        font-size: 1rem;
      }

      .newsletter-language-select {
        padding: ${spacing.md};
        border: none;
        border-radius: 8px;
        background: ${colors.white};
        font-size: 1rem;
        cursor: pointer;
        min-width: 80px;
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
        font-size: 1.2rem;
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
          <h3 class="footer-newsletter-title">Stay Ahead of the Curve in: <span id="language-display">[EN ▼]</span> [ES] [FR] [DE]</h3>
          <h4 class="footer-newsletter-subtitle">Get exclusive CRM insights, AI tips, and product updates delivered to your inbox.</h4>
          <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              id="newsletter-email"
              aria-label="Email address"
            />
            <select 
              class="newsletter-language-select" 
              id="newsletter-language"
              aria-label="Select language"
            >
              ${newsletterLanguages
                .map(
                  (lang) => `
                <option value="${lang.code}">${lang.label}</option>
              `
                )
                .join("")}
            </select>
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

      // Update language display on selection
      document.addEventListener('DOMContentLoaded', function() {
        const languageSelect = document.getElementById('newsletter-language')
        const languageDisplay = document.getElementById('language-display')
        
        if (languageSelect && languageDisplay) {
          languageSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text
            languageDisplay.textContent = '[' + selectedOption + ']'
          })
        }
      })
    </script>
  `;
}
