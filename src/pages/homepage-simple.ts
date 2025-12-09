/**
 * SIMPLE HOMEPAGE - Step by step build
 * Adding components one at a time
 */

import { globalStyles } from '../styles/global.css.ts';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const navigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const footerData = {
  companyName: 'Risivo',
  tagline: 'Intelligent CRM that accelerates growth',
  sections: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Security', href: '/security' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Help Center', href: '/help' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' }
      ]
    }
  ],
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com/risivo' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/risivo' },
    { platform: 'facebook', url: 'https://facebook.com/risivo' }
  ]
};

export const HomepageSimple = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Powerful Marketing Meets Seamless Design</title>
      
      <!-- Favicon -->
      <link rel="icon" type="image/png" href="/favicon.png">
      
      <!-- Fonts - JOST (Official Brand Font) -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <!-- Global Styles -->
      <style>
        ${globalStyles}
      </style>
    </head>
    <body>
      ${Navigation({
        logoSrc: '/images/risivo-logo.png',
        items: navigationItems,
        ctaText: 'Start Free Trial',
        ctaHref: 'https://app.risivo.com/signup'
      })}

      <main>
        <section style="
          background: linear-gradient(135deg, #683FE9 0%, #7C3AED 100%);
          padding: 120px 20px;
          text-align: center;
          color: white;
        ">
          <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 20px;">
            Powerful Marketing Meets<br/>Seamless Design
          </h1>
          <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.9;">
            Transform how you manage customer relationships
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
          ">
            Start Free Trial
          </a>
        </section>

        <section style="padding: 80px 20px; text-align: center; background: white;">
          <h2 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 60px;">
            Everything You Need to Grow
          </h2>
          <p style="font-size: 1.125rem; color: #6b7280; max-width: 800px; margin: 0 auto;">
            More content coming soon as we add components one by one...
          </p>
        </section>
      </main>
      
      ${Footer(footerData)}
      
      <script>
        // Smooth scroll
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
