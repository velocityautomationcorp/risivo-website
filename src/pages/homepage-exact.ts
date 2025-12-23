/**
 * EXACT DESIGN MATCH - Homepage
 * Based on required design screenshot
 * 100% Brand Guidelines Compliant
 */

import { globalStyles } from '../styles/global.css';
import { Navigation } from '../components/Navigation';
import { HeroWithDashboard } from '../components/HeroWithDashboard';
import { PartnerLogos } from '../components/PartnerLogos';
import { SimplifiedFeatures } from '../components/SimplifiedFeatures';
import { MarketingMadeSimple } from '../components/MarketingMadeSimple';
import { DarkCTASection } from '../components/DarkCTASection';
import { PricingCards } from '../components/PricingCards';
import { TestimonialsSection } from '../components/TestimonialsSection';
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

export const HomepageExact = () => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Powerful Marketing Meets Seamless Design | AI-Powered CRM</title>
      <meta name="description" content="Transform how you manage customer relationships with intelligent automation. Email marketing, smart workflows, and data-driven insights - all in one platform. Start your free trial today.">
      
      <!-- Open Graph / Social Media -->
      <meta property="og:title" content="Risivo - Powerful Marketing Meets Seamless Design">
      <meta property="og:description" content="Transform how you manage customer relationships with intelligent automation.">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://www.risivo.com">
      <meta property="og:image" content="https://www.risivo.com/og-image.png">
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Risivo - Powerful Marketing Meets Seamless Design">
      <meta name="twitter:description" content="Transform how you manage customer relationships with intelligent automation.">
      <meta name="twitter:image" content="https://www.risivo.com/og-image.png">
      
      <!-- Favicon - Official Risivo Icon -->
      <link rel="icon" type="image/png" href="/favicon.png">
      
      <!-- Fonts - JOST (Official Brand Font) -->
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

      <main>
        ${HeroWithDashboard()}
        
        ${PartnerLogos()}
        
        ${SimplifiedFeatures()}
        
        ${MarketingMadeSimple()}
        
        ${DarkCTASection({
          title: 'Data-Backed AI Insights',
          subtitle: 'Make Smarter Decisions with Real-Time Analytics',
          description: 'Get actionable insights from your campaigns with powerful analytics and AI-driven recommendations. Track performance, optimize conversions, and grow faster.',
          ctaText: 'View Analytics Demo',
          ctaHref: '#analytics',
          imagePosition: 'right',
          features: [
            'Real-time campaign performance tracking',
            'AI-powered optimization suggestions',
            'Custom dashboards and reports',
            'Predictive analytics for better planning'
          ]
        })}
        
        ${PricingCards()}
        
        ${TestimonialsSection()}
        
        ${DarkCTASection({
          title: 'Ready to Transform Your Marketing?',
          subtitle: 'Visual Marketing That Works For Your Apps',
          description: 'Join 50,000+ businesses using Risivo to automate their marketing, nurture leads, and close more deals. Start your free trial today - no credit card required.',
          ctaText: 'Start Free Trial',
          ctaHref: 'https://app.risivo.com/signup',
          secondaryCtaText: 'Schedule Demo',
          secondaryCtaHref: '#demo',
          imagePosition: 'left'
        })}
      </main>
      
      ${Footer(footerData)}
      
      <!-- Analytics and Animations -->
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
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href')
            if (href !== '#' && href !== '#demo' && href !== '#analytics') return
            
            e.preventDefault()
            const targetId = href.substring(1)
            const target = document.getElementById(targetId)
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' })
            }
          })
        })
      </script>
    </body>
    </html>
  `;
};
