/**
 * BASIC HOMEPAGE - Just Navigation and simple content
 * Testing which component is causing the error
 */

import { globalStyles } from '../styles/global.css.ts';
import { Navigation } from '../components/Navigation';
import { designSystem } from '../styles/design-system';

const { colors, spacing } = designSystem;

const navigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' }
];

export const HomepageBasic = () => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo</title>
      <link rel="icon" type="image/png" href="/favicon.png">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${globalStyles}</style>
    </head>
    <body>
      ${Navigation({
        logoSrc: '/images/risivo-logo.png',
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
          <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 20px; font-family: 'Jost', sans-serif;">
            Powerful Marketing Meets<br/>Seamless Design
          </h1>
          <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.9;">
            Transform how you manage customer relationships with intelligent automation
          </p>
          <a href="https://app.risivo.com/signup" style="
            background: white;
            color: #683FE9;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
          ">Start Free Trial</a>
        </section>

        <!-- Features -->
        <section style="padding: 80px 20px; background: white;">
          <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 60px; font-family: 'Jost', sans-serif;">
              Everything You Need to Grow
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
              <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">📊</div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #1f2937;">Email Marketing</h3>
                <p style="color: #6b7280; line-height: 1.6;">Create stunning campaigns with our intuitive editor</p>
              </div>
              <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🎯</div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #1f2937;">Smart Automation</h3>
                <p style="color: #6b7280; line-height: 1.6;">Intelligent workflows that save you hours every day</p>
              </div>
              <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">📈</div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #1f2937;">Data Insights</h3>
                <p style="color: #6b7280; line-height: 1.6;">Make better decisions with powerful analytics</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section style="
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 80px 20px;
          text-align: center;
          color: white;
        ">
          <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 20px; font-family: 'Jost', sans-serif;">
            Ready to Get Started?
          </h2>
          <p style="font-size: 1.125rem; margin-bottom: 40px; opacity: 0.9;">
            Join 50,000+ businesses using Risivo
          </p>
          <a href="https://app.risivo.com/signup" style="
            background: #683FE9;
            color: white;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
          ">Start Free Trial</a>
        </section>
      </main>
      
      <!-- Footer -->
      <footer style="background: #1f2937; color: white; padding: 60px 20px 30px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px;">
            <div>
              <h4 style="font-weight: 600; margin-bottom: 15px;">Risivo</h4>
              <p style="color: #9ca3af; font-size: 0.875rem;">Intelligent CRM that accelerates growth</p>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 15px;">Product</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><a href="/features" style="color: #9ca3af; text-decoration: none;">Features</a></li>
                <li style="margin-bottom: 10px;"><a href="/pricing" style="color: #9ca3af; text-decoration: none;">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 15px;">Company</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><a href="/about" style="color: #9ca3af; text-decoration: none;">About</a></li>
                <li style="margin-bottom: 10px;"><a href="/contact" style="color: #9ca3af; text-decoration: none;">Contact</a></li>
              </ul>
            </div>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 0.875rem;">© ${currentYear} Risivo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </body>
    </html>
  `;
};
