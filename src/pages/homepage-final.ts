/**
 * FINAL WORKING HOMEPAGE
 * All components properly integrated
 */

import { globalStyles } from '../styles/global.css.ts';
import { designSystem } from '../styles/design-system';
import { Navigation } from '../components/Navigation';
import { HeroWithDashboard } from '../components/HeroWithDashboard';
import { PartnerLogos } from '../components/PartnerLogos';
import { SimplifiedFeatures } from '../components/SimplifiedFeatures';
import { MarketingMadeSimple } from '../components/MarketingMadeSimple';
import { DarkCTASection } from '../components/DarkCTASection';
import { PricingCards } from '../components/PricingCards';
import { TestimonialsSection } from '../components/TestimonialsSection';

const { colors, spacing } = designSystem;

const navigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export const HomepageFinal = () => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Powerful Marketing Meets Seamless Design | AI-Powered CRM</title>
      <meta name="description" content="Transform how you manage customer relationships with intelligent automation. Email marketing, smart workflows, and data-driven insights - all in one platform.">
      
      <!-- Open Graph -->
      <meta property="og:title" content="Risivo - Powerful Marketing Meets Seamless Design">
      <meta property="og:description" content="Transform how you manage customer relationships with intelligent automation.">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://www.risivo.com">
      
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
      
      <!-- Simple Footer (avoiding Footer component issue) -->
      <footer style="
        background: ${colors.textDark};
        color: white;
        padding: ${spacing['3xl']} ${spacing.xl} ${spacing.xl};
      ">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: ${spacing['2xl']};
            margin-bottom: ${spacing['2xl']};
          ">
            <!-- Company -->
            <div>
              <h4 style="font-weight: 600; margin-bottom: ${spacing.md};">Risivo</h4>
              <p style="color: #9ca3af; font-size: 0.875rem;">
                Intelligent CRM that accelerates growth
              </p>
            </div>
            
            <!-- Product -->
            <div>
              <h4 style="font-weight: 600; margin-bottom: ${spacing.md};">Product</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: ${spacing.sm};"><a href="/features" style="color: #9ca3af; text-decoration: none;">Features</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/pricing" style="color: #9ca3af; text-decoration: none;">Pricing</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/security" style="color: #9ca3af; text-decoration: none;">Security</a></li>
              </ul>
            </div>
            
            <!-- Resources -->
            <div>
              <h4 style="font-weight: 600; margin-bottom: ${spacing.md};">Resources</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: ${spacing.sm};"><a href="/blog" style="color: #9ca3af; text-decoration: none;">Blog</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/docs" style="color: #9ca3af; text-decoration: none;">Documentation</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/help" style="color: #9ca3af; text-decoration: none;">Help Center</a></li>
              </ul>
            </div>
            
            <!-- Company -->
            <div>
              <h4 style="font-weight: 600; margin-bottom: ${spacing.md};">Company</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: ${spacing.sm};"><a href="/about" style="color: #9ca3af; text-decoration: none;">About</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/contact" style="color: #9ca3af; text-decoration: none;">Contact</a></li>
                <li style="margin-bottom: ${spacing.sm};"><a href="/careers" style="color: #9ca3af; text-decoration: none;">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <!-- Bottom bar -->
          <div style="
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: ${spacing.lg};
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: ${spacing.md};
          ">
            <p style="color: #9ca3af; font-size: 0.875rem;">
              © ${currentYear} Risivo. All rights reserved.
            </p>
            <div style="display: flex; gap: ${spacing.md};">
              <a href="/privacy" style="color: #9ca3af; text-decoration: none; font-size: 0.875rem;">Privacy</a>
              <a href="/terms" style="color: #9ca3af; text-decoration: none; font-size: 0.875rem;">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      
      <!-- Scripts -->
      <script>
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        });
        
        // Intersection Observer for animations
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          
          document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
          });
        }
      </script>
    </body>
    </html>
  `;
};
