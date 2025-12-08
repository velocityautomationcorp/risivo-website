/**
 * Base Layout
 * Main layout wrapper for all pages
 */

import { globalStyles } from '../styles/global.css'
import { Navigation, type NavigationProps } from '../components/Navigation'
import { Footer, type FooterProps } from '../components/Footer'

export interface BaseLayoutProps {
  title: string
  description?: string
  children: string
  navigation: NavigationProps
  footer: FooterProps
  customCSS?: string
  customJS?: string
}

export function BaseLayout({
  title,
  description = 'Risivo - Modern CRM software that helps businesses manage customer relationships, close deals, and grow revenue.',
  children,
  navigation,
  footer,
  customCSS = '',
  customJS = '',
}: BaseLayoutProps): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Risivo</title>
      <meta name="description" content="${description}">
      
      <!-- Open Graph / Social Media -->
      <meta property="og:title" content="${title} | Risivo">
      <meta property="og:description" content="${description}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://www.risivo.com">
      <meta property="og:image" content="https://www.risivo.com/og-image.png">
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title} | Risivo">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="https://www.risivo.com/og-image.png">
      
      <!-- Favicon - Official Risivo Icon -->
      <link rel="icon" type="image/png" href="/favicon.png">
      
      <!-- Fonts - JOST (Official Brand Font) -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <!-- Global Styles -->
      <style>
        ${globalStyles}
        ${customCSS}
      </style>
    </head>
    <body>
      <!-- Navigation -->
      ${Navigation(navigation)}
      
      <!-- Main Content -->
      <main>
        ${children}
      </main>
      
      <!-- Footer -->
      ${Footer(footer)}
      
      <!-- Custom JavaScript -->
      ${customJS ? `<script>${customJS}</script>` : ''}
      
      <!-- Analytics placeholder -->
      <script>
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('fade-in')
                observer.unobserve(entry.target)
              }
            })
          }, { threshold: 0.1 })
          
          // Observe all elements with .animate-on-scroll class
          document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el)
          })
        }
      </script>
    </body>
    </html>
  `
}
