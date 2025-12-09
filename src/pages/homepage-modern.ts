/**
 * Modern Homepage - Based on template design with official brand colors
 */

import { BaseLayout } from '../layouts/BaseLayout'
import { ModernHero } from '../components/ModernHero'
import { StatsSection } from '../components/StatsSection'
import { FeaturesGrid } from '../components/FeaturesGrid'
import { DarkCTASection } from '../components/DarkCTASection'
import { PricingCards } from '../components/PricingCards'
import { navigationItems, footerColumns, socialLinks } from '../data/navigation'

export function HomepageModern(): string {
  
  // Modern Hero Section
  const heroSection = ModernHero({
    subheadline: '🚀 All-in-One CRM Platform',
    headline: 'Powerful Marketing Meets Seamless Design',
    description: 'Risivo empowers agencies and businesses to rise above the competition through intelligent automation and seamless customer relationship management.',
    primaryCTA: {
      text: 'Get Started',
      href: 'https://app.risivo.com/signup'
    },
    secondaryCTA: {
      text: 'Watch Demo',
      href: '#demo'
    },
    dashboardImage: '/images/dashboard-preview.png',
    trustedByLogos: [
      '/images/logos/google.svg',
      '/images/logos/microsoft.svg',
      '/images/logos/slack.svg',
      '/images/logos/hubspot.svg',
      '/images/logos/salesforce.svg'
    ]
  })
  
  // Statistics Section
  const statsSection = StatsSection({
    title: 'Smart Marketing Data, $3507 for Everyone',
    description: 'Transform your business with data-driven insights and automation',
    stats: [
      { number: '200', suffix: '%', label: 'Increase in ROI' },
      { number: '50', suffix: 'K+', label: 'Active Users' },
      { number: '99', suffix: '%', label: 'Customer Satisfaction' }
    ],
    ctaText: 'Explore Features',
    ctaHref: '/features'
  })
  
  // Features Grid Section
  const featuresSection = FeaturesGrid({
    sectionSubtitle: 'What We Offer',
    sectionTitle: 'Our Marketing Solutions',
    features: [
      {
        icon: '📊',
        title: 'Smart Pipeline Management',
        description: 'Visualize your sales pipeline and track deals from first contact to close with intelligent automation.'
      },
      {
        icon: '✉️',
        title: 'Email Marketing Automation',
        description: 'Create, schedule, and track email campaigns with ease. Personalize at scale with smart segmentation.'
      },
      {
        icon: '📈',
        title: 'Advanced Analytics',
        description: 'Get deep insights into your sales performance with real-time dashboards and custom reports.'
      },
      {
        icon: '🤝',
        title: 'Team Collaboration',
        description: 'Work together seamlessly with shared contacts, tasks, and real-time updates for your entire team.'
      },
      {
        icon: '🔗',
        title: 'Seamless Integrations',
        description: 'Connect with your favorite tools and apps. Sync data automatically across your entire stack.'
      },
      {
        icon: '🎯',
        title: 'Lead Scoring',
        description: 'Prioritize your best opportunities with AI-powered lead scoring and intelligent recommendations.'
      }
    ]
  })
  
  // Dark CTA Section 1
  const campaignEditorSection = DarkCTASection({
    title: 'Intuitive Campaign Editor',
    description: 'Create stunning marketing campaigns with our drag-and-drop editor. No design or coding skills required.',
    primaryCTA: {
      text: 'Try Campaign Editor',
      href: '/features/campaigns'
    },
    secondaryCTA: {
      text: 'View Examples',
      href: '/examples'
    },
    image: '/images/campaign-editor.png',
    imagePosition: 'right'
  })
  
  // Dark CTA Section 2
  const analyticsSection = DarkCTASection({
    title: 'Data-Backed AI Insights',
    description: 'Make smarter decisions with real-time analytics and AI-powered recommendations that help you grow faster.',
    primaryCTA: {
      text: 'Explore Analytics',
      href: '/features/analytics'
    },
    image: '/images/analytics-dashboard.png',
    imagePosition: 'left'
  })
  
  // Pricing Section
  const pricingSection = PricingCards({
    title: 'Pricing That Fits Your Needs',
    description: 'Choose the perfect plan for your business. All plans include 14-day free trial.',
    showAnnualToggle: true,
    plans: [
      {
        name: 'Starter',
        price: '$14.9',
        period: '/month',
        description: 'Perfect for small teams getting started',
        features: [
          { text: 'Up to 500 contacts', included: true },
          { text: 'Basic campaign builder', included: true },
          { text: '1 user account', included: true },
          { text: 'Email support', included: true },
          { text: 'Advanced analytics', included: false },
          { text: 'Custom integrations', included: false }
        ],
        ctaText: 'Start Free Trial',
        ctaHref: 'https://app.risivo.com/signup?plan=starter'
      },
      {
        name: 'Professional',
        price: '$29',
        period: '/month',
        description: 'For growing businesses that need more power',
        features: [
          { text: 'Unlimited contacts', included: true },
          { text: 'Advanced campaign builder', included: true },
          { text: 'Up to 5 users', included: true },
          { text: 'Priority support', included: true },
          { text: 'Advanced analytics', included: true },
          { text: 'API access', included: true }
        ],
        ctaText: 'Start Free Trial',
        ctaHref: 'https://app.risivo.com/signup?plan=professional',
        highlighted: true
      },
      {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        description: 'For large organizations with custom needs',
        features: [
          { text: 'Unlimited everything', included: true },
          { text: 'White-label options', included: true },
          { text: 'Unlimited users', included: true },
          { text: 'Dedicated support', included: true },
          { text: 'Custom integrations', included: true },
          { text: 'SLA guarantees', included: true }
        ],
        ctaText: 'Contact Sales',
        ctaHref: '/contact-sales'
      }
    ]
  })
  
  // Final CTA Section
  const finalCTASection = DarkCTASection({
    title: 'Want Marketing That Works For Your App?',
    description: 'Join thousands of businesses that have transformed their customer relationships with Risivo. Start your free trial today.',
    primaryCTA: {
      text: 'Get Started Free',
      href: 'https://app.risivo.com/signup'
    },
    secondaryCTA: {
      text: 'Schedule Demo',
      href: '/demo'
    }
  })
  
  // Combine all sections
  const pageContent = `
    ${heroSection}
    ${statsSection}
    ${featuresSection}
    ${campaignEditorSection}
    ${analyticsSection}
    ${pricingSection}
    ${finalCTASection}
  `
  
  // Return full page with BaseLayout
  return BaseLayout({
    title: 'Risivo - Powerful Marketing Meets Seamless Design',
    description: 'Risivo empowers agencies and businesses to rise above the competition through intelligent automation and seamless customer relationship management.',
    children: pageContent,
    navigation: {
      logo: {
        src: '/images/risivo-logo.png',
        alt: 'Risivo',
        href: '/'
      },
      items: navigationItems
    },
    footer: {
      logo: {
        src: '/images/risivo-logo.png',
        alt: 'Risivo'
      },
      columns: footerColumns,
      socialLinks,
    },
  })
}
