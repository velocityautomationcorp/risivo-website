/**
 * STEP 4: Step3 + PricingCards
 */

import { globalStyles } from '../styles/global.css.ts';
import { Navigation } from '../components/Navigation';
import { PartnerLogos } from '../components/PartnerLogos';
import { SimplifiedFeatures } from '../components/SimplifiedFeatures';
import { MarketingMadeSimple } from '../components/MarketingMadeSimple';
import { PricingCards } from '../components/PricingCards';
import { designSystem } from '../styles/design-system';

const { colors, spacing } = designSystem;

const navigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' }
];

export const HomepageStep4 = () => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Step 4 Test</title>
      <link rel="icon" type="image/png" href="/favicon.png">
      <link rel="shortcut icon" type="image/png" href="/favicon.png">
      <link rel="apple-touch-icon" href="/favicon.png">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${globalStyles}</style>
    </head>
    <body>
      ${Navigation({
        logoSrc: '/risivo-logo.png',
        items: navigationItems,
        ctaText: 'Start Free Trial',
        ctaHref: 'https://app.risivo.com/signup'
      })}

      <main style="padding-top: 100px;">
        <!-- Hero -->
        <section style="
          background: linear-gradient(135deg, #683FE9 0%, #7C3AED 100%);
          padding: 120px 20px;
          text-align: center;
          color: white;
        ">
          <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="
              font-size: 3.5rem;
              font-weight: 700;
              margin-bottom: 24px;
              line-height: 1.2;
              color: white;
            ">
              Powerful Marketing Meets Seamless Design
            </h1>
            <p style="
              font-size: 1.25rem;
              margin-bottom: 40px;
              opacity: 0.95;
              line-height: 1.6;
              color: white;
            ">
              Create stunning campaigns, automate workflows, and grow your business with AI-powered insights.
            </p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
              <a href="https://app.risivo.com/signup" style="
                background: white;
                color: ${colors.primary};
                padding: 16px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1rem;
                transition: transform 0.2s;
                display: inline-block;
              ">
                Start Free Trial
              </a>
              <a href="#features" style="
                background: rgba(255, 255, 255, 0.15);
                color: white;
                padding: 16px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1rem;
                border: 2px solid white;
                transition: transform 0.2s;
                display: inline-block;
              ">
                Learn More
              </a>
            </div>
          </div>
        </section>

        <!-- Partner Logos -->
        ${PartnerLogos()}

        <!-- Simplified Features -->
        ${SimplifiedFeatures({
          title: 'Smart Marketing Tools',
          subtitle: '$250/yr For Everyone',
          features: [
            {
              icon: '📧',
              title: 'Email Marketing',
              description: 'Create beautiful campaigns with our drag-and-drop editor'
            },
            {
              icon: '🤖',
              title: 'Smart Automation',
              description: 'Set up workflows that run on autopilot'
            },
            {
              icon: '📊',
              title: 'Data Insights',
              description: 'Get actionable insights powered by AI'
            }
          ]
        })}

        <!-- Marketing Made Simple -->
        ${MarketingMadeSimple()}

        <!-- Pricing Cards - NEW COMPONENT -->
        ${PricingCards({
          title: 'Simple, Transparent Pricing',
          description: 'Choose the plan that fits your business needs',
          plans: [
            {
              name: 'Starter',
              price: '$0',
              period: 'forever',
              description: 'Perfect for trying out Risivo',
              features: [
                { text: 'Up to 1,000 contacts', included: true },
                { text: 'Email campaigns', included: true },
                { text: 'Basic automation', included: true },
                { text: 'Email support', included: true },
                { text: 'Custom domains', included: false },
                { text: 'Advanced analytics', included: false }
              ],
              ctaText: 'Get Started Free',
              ctaHref: 'https://app.risivo.com/signup'
            },
            {
              name: 'Professional',
              price: '$29',
              period: '/month',
              description: 'For growing businesses',
              features: [
                { text: 'Up to 10,000 contacts', included: true },
                { text: 'Unlimited email campaigns', included: true },
                { text: 'Advanced automation', included: true },
                { text: 'Priority support', included: true },
                { text: 'Custom domains', included: true },
                { text: 'Advanced analytics', included: true }
              ],
              ctaText: 'Start Free Trial',
              ctaHref: 'https://app.risivo.com/signup',
              highlighted: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: 'pricing',
              description: 'For large organizations',
              features: [
                { text: 'Unlimited contacts', included: true },
                { text: 'Everything in Professional', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: '24/7 phone support', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'SLA guarantee', included: true }
              ],
              ctaText: 'Contact Sales',
              ctaHref: '/contact'
            }
          ]
        })}

        <!-- Dark CTA Section -->
        <section style="
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 80px 20px;
          text-align: center;
          color: white;
        ">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 20px; color: white;">
              Ready to Transform Your Marketing?
            </h2>
            <p style="font-size: 1.1rem; margin-bottom: 40px; opacity: 0.9; color: white;">
              Join thousands of businesses already using Risivo
            </p>
            <a href="https://app.risivo.com/signup" style="
              background: ${colors.primary};
              color: white;
              padding: 18px 40px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 1.1rem;
              display: inline-block;
              transition: transform 0.2s;
            ">
              Get Started Free
            </a>
          </div>
        </section>

        <!-- Simple Footer -->
        <footer style="
          background: #0a0a0f;
          color: white;
          padding: 60px 20px 30px;
        ">
          <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px;">
              <!-- Company -->
              <div>
                <img src="/images/risivo-logo-white.png" alt="Risivo" style="height: 32px; margin-bottom: 16px;" onerror="this.src='/risivo-logo-white.png'">
                <p style="opacity: 0.7; line-height: 1.6;">
                  Powerful marketing automation made simple for everyone.
                </p>
              </div>
              
              <!-- Product -->
              <div>
                <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; opacity: 0.6;">Product</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 8px;"><a href="/features" style="color: white; opacity: 0.8; text-decoration: none;">Features</a></li>
                  <li style="margin-bottom: 8px;"><a href="/pricing" style="color: white; opacity: 0.8; text-decoration: none;">Pricing</a></li>
                </ul>
              </div>
              
              <!-- Resources -->
              <div>
                <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; opacity: 0.6;">Resources</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 8px;"><a href="/blog" style="color: white; opacity: 0.8; text-decoration: none;">Blog</a></li>
                  <li style="margin-bottom: 8px;"><a href="/docs" style="color: white; opacity: 0.8; text-decoration: none;">Documentation</a></li>
                </ul>
              </div>
              
              <!-- Company -->
              <div>
                <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; opacity: 0.6;">Company</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 8px;"><a href="/about" style="color: white; opacity: 0.8; text-decoration: none;">About</a></li>
                  <li style="margin-bottom: 8px;"><a href="/contact" style="color: white; opacity: 0.8; text-decoration: none;">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div style="
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 30px;
              text-align: center;
              opacity: 0.6;
              font-size: 0.9rem;
            ">
              © ${currentYear} Risivo. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      <!-- Smooth scroll -->
      <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      </script>
    </body>
    </html>
  `;
};
