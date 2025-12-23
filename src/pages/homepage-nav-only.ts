/**
 * NAVIGATION ONLY TEST
 * Testing if Navigation component causes the error
 */

import { globalStyles } from '../styles/global.css.ts';
import { Navigation } from '../components/Navigation';

const navigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' }
];

export const HomepageNavOnly = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Navigation Test</title>
      
      <!-- Fonts - JOST -->
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <!-- Global Styles -->
    </head>
    <body>
      ${Navigation({
        logoSrc: '/images/risivo-logo.png',
        items: navigationItems,
        ctaText: 'Start Free Trial',
        ctaHref: 'https://app.risivo.com/signup'
      })}

      <div style="padding: 100px 40px; text-align: center; font-family: 'Jost', sans-serif;">
        <h1 style="color: #683FE9; font-size: 3rem;">Navigation Component Test</h1>
        <p style="font-size: 1.25rem; color: #6b7280;">
          If you see the navigation bar above with the Risivo logo, Navigation works!
        </p>
        <p style="margin-top: 20px; color: #6b7280;">
          Next: Add Footer component
        </p>
      </div>
    </body>
    </html>
  `;
};
