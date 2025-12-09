/**
 * EXACT DESIGN MATCH - Homepage
 * Based on required design screenshot
 * 100% Brand Guidelines Compliant
 */

import { BaseLayout } from '../layouts/BaseLayout';
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

export const HomepageExact = () => {
  const content = `
    ${Navigation({
      logoSrc: '/images/risivo-logo.png',
      items: navigationItems,
      ctaText: 'Start Free Trial',
      ctaHref: 'https://app.risivo.com/signup'
    })}

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
    
    ${Footer()}
  `;

  return BaseLayout({
    title: 'Risivo - Powerful Marketing Meets Seamless Design | AI-Powered CRM',
    description: 'Transform how you manage customer relationships with intelligent automation. Email marketing, smart workflows, and data-driven insights - all in one platform. Start your free trial today.',
    children: content
  });
};
