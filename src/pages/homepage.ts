/**
 * Homepage - Main landing page
 * Based on requirements document
 */

import { BaseLayout } from '../layouts/BaseLayout'
import { Hero } from '../components/Hero'
import { Button } from '../components/Button'
import { navigationItems, footerColumns, socialLinks } from '../data/navigation'
import { designSystem } from '../styles/design-system'

const { colors, spacing } = designSystem

export function Homepage(): string {
  // Pre-calculate spacing values to avoid bracket notation in template literals
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  const spacing4xl = spacing['4xl']
  
  const heroSection = Hero({
    subtitle: 'Modern CRM Software',
    title: 'Transform How You Manage Customer Relationships',
    description: 'Close more deals, automate your workflow, and grow your business with Risivo - the CRM built for modern teams.',
    primaryCTA: {
      text: 'Start Free Trial',
      href: 'https://app.risivo.com/signup'
    },
    secondaryCTA: {
      text: 'Watch Demo',
      href: '#demo'
    },
    badges: [
      { text: '14-day free trial', icon: '✓' },
      { text: 'No credit card required', icon: '✓' },
      { text: '1,000+ happy customers', icon: '⭐' },
    ]
  })

  const pageContent = `
    ${heroSection}

    <!-- Problem Statement Section -->
    <section class="section">
      <div class="container">
        <div class="text-center" style="max-width: 800px; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg};">
            Tired of juggling multiple tools?
          </h2>
          <p style="font-size: 1.25rem; color: ${colors.mediumGray}; margin-bottom: ${spacing2xl};">
            Most businesses waste time switching between spreadsheets, email, calendars, and separate CRM tools. 
            There's a better way.
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${spacing2xl}; margin-top: ${spacing3xl};">
            <div class="card">
              <h3 style="color: ${colors.error}; margin-bottom: ${spacing.md};">❌ Before Risivo</h3>
              <ul style="text-align: left; color: ${colors.darkGray}; line-height: 1.8;">
                <li>Scattered customer data</li>
                <li>Manual data entry</li>
                <li>Missed follow-ups</li>
                <li>No visibility into pipeline</li>
                <li>Time-consuming reporting</li>
              </ul>
            </div>
            
            <div class="card" style="border: 2px solid ${colors.success};">
              <h3 style="color: ${colors.success}; margin-bottom: ${spacing.md};">✓ After Risivo</h3>
              <ul style="text-align: left; color: ${colors.darkGray}; line-height: 1.8;">
                <li>Centralized customer hub</li>
                <li>Automated workflows</li>
                <li>Never miss a deal</li>
                <li>Visual pipeline management</li>
                <li>Real-time insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Overview -->
    <section class="section" style="background: ${colors.lightGray};">
      <div class="container">
        <div class="text-center" style="margin-bottom: ${spacing3xl};">
          <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg};">
            One Platform for All Your Customer Relationships
          </h2>
          <p style="font-size: 1.25rem; color: ${colors.mediumGray}; max-width: 700px; margin: 0 auto;">
            Everything you need to manage customers, close deals, and grow your business in one powerful CRM.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: ${spacing.xl};">
          ${[
            { icon: '👥', title: 'Contact Management', desc: 'Keep all customer data in one place with custom fields, tags, and smart segmentation' },
            { icon: '📊', title: 'Visual Pipeline', desc: 'Track deals with drag-and-drop stages and never lose sight of your revenue' },
            { icon: '✉️', title: 'Email Integration', desc: 'Connect Gmail and Outlook to track emails and automate follow-ups' },
            { icon: '🤖', title: 'Smart Automation', desc: 'Automate repetitive tasks and focus on what matters most - closing deals' },
          ].map(feature => `
            <div class="card text-center animate-on-scroll">
              <div style="font-size: 3rem; margin-bottom: ${spacing.md};">${feature.icon}</div>
              <h3 style="font-size: 1.5rem; margin-bottom: ${spacing.md};">${feature.title}</h3>
              <p style="color: ${colors.mediumGray}; line-height: 1.6;">${feature.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="text-center" style="margin-top: ${spacing['2xl'}};">
          ${Button({ text: 'Explore All Features', href: '/features', variant: 'primary', size: 'lg' })}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="container">
        <div class="text-center" style="margin-bottom: ${spacing3xl};">
          <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg};">
            Get Started in 3 Simple Steps
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: ${spacing2xl};">
          ${[
            { 
              step: '1', 
              title: 'Import Your Contacts', 
              desc: 'Upload from CSV, connect your email, or sync from existing tools. We support all major platforms.',
              icon: '📥'
            },
            { 
              step: '2', 
              title: 'Build Your Pipeline', 
              desc: 'Customize deal stages, set up your workflow, and configure automation rules that work for you.',
              icon: '🏗️'
            },
            { 
              step: '3', 
              title: 'Close More Deals', 
              desc: 'Track opportunities, automate follow-ups, and get insights that help you win more business.',
              icon: '🎯'
            },
          ].map(step => `
            <div style="text-align: center;" class="animate-on-scroll">
              <div style="
                width: 80px; 
                height: 80px; 
                border-radius: 50%; 
                background: ${colors.primary}; 
                color: white; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 2rem;
                font-weight: 800;
                margin: 0 auto ${spacing.lg};
              ">
                ${step.step}
              </div>
              <div style="font-size: 2rem; margin-bottom: ${spacing.md};">${step.icon}</div>
              <h3 style="font-size: 1.5rem; margin-bottom: ${spacing.md};">${step.title}</h3>
              <p style="color: ${colors.mediumGray}; line-height: 1.6;">${step.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Social Proof / Testimonials -->
    <section class="section" style="background: ${colors.heroGradient}; color: white;">
      <div class="container">
        <div class="text-center" style="margin-bottom: ${spacing['3xl'}};">
          <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg}; color: white;">
            Trusted by Growing Businesses Worldwide
          </h2>
          <p style="font-size: 1.25rem; opacity: 0.9;">
            Join 1,000+ companies that chose Risivo to transform their customer relationships
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: ${spacing.xl};">
          ${[
            {
              quote: "Risivo helped us close 40% more deals in the first quarter. The automation features alone saved our team 10 hours per week.",
              author: "Sarah Johnson",
              role: "Sales Director, TechStart Inc.",
              rating: 5
            },
            {
              quote: "Best CRM we've used. Simple, powerful, and actually enjoyable to use. Our team adoption was 100% in the first week.",
              author: "Michael Chen",
              role: "CEO, GrowthLabs",
              rating: 5
            },
            {
              quote: "The pipeline visibility and reporting features are game-changers. We finally have full control over our sales process.",
              author: "Emily Rodriguez",
              role: "VP of Sales, CloudSync",
              rating: 5
            },
          ].map(testimonial => `
            <div class="card" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
              <div style="color: #ffd700; font-size: 1.5rem; margin-bottom: ${spacing.md};">
                ${'⭐'.repeat(testimonial.rating)}
              </div>
              <p style="font-style: italic; margin-bottom: ${spacing.lg}; line-height: 1.6;">
                "${testimonial.quote}"
              </p>
              <div>
                <div style="font-weight: 600;">${testimonial.author}</div>
                <div style="opacity: 0.8; font-size: 0.875rem;">${testimonial.role}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: ${spacing.xl}; margin-top: ${spacing3xl}; text-align: center;">
          ${[
            { number: '1,000+', label: 'Active Users' },
            { number: '$10M+', label: 'Deals Closed' },
            { number: '98%', label: 'Customer Satisfaction' },
            { number: '24/7', label: 'Support Available' },
          ].map(stat => `
            <div>
              <div style="font-size: 3rem; font-weight: 800; margin-bottom: ${spacing.sm};">
                ${stat.number}
              </div>
              <div style="font-size: 1.1rem; opacity: 0.9;">
                ${stat.label}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Pricing Teaser -->
    <section class="section">
      <div class="container">
        <div class="text-center" style="max-width: 800px; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg};">
            Simple, Transparent Pricing
          </h2>
          <p style="font-size: 1.25rem; color: ${colors.mediumGray}; margin-bottom: ${spacing['2xl'}};">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: ${spacing.xl}; margin: ${spacing2xl} 0;">
            <div class="card">
              <h3 style="font-size: 1.5rem; margin-bottom: ${spacing.md};">Starter</h3>
              <div style="font-size: 3rem; font-weight: 800; color: ${colors.primary}; margin-bottom: ${spacing.md};">
                $29<span style="font-size: 1rem; font-weight: 400; color: ${colors.mediumGray};">/user/mo</span>
              </div>
              <p style="color: ${colors.mediumGray};">Perfect for small teams</p>
            </div>

            <div class="card" style="border: 3px solid ${colors.primary}; position: relative;">
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: ${colors.primary}; color: white; padding: 4px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                MOST POPULAR
              </div>
              <h3 style="font-size: 1.5rem; margin-bottom: ${spacing.md};">Professional</h3>
              <div style="font-size: 3rem; font-weight: 800; color: ${colors.primary}; margin-bottom: ${spacing.md};">
                $49<span style="font-size: 1rem; font-weight: 400; color: ${colors.mediumGray};">/user/mo</span>
              </div>
              <p style="color: ${colors.mediumGray};">For growing teams</p>
            </div>

            <div class="card">
              <h3 style="font-size: 1.5rem; margin-bottom: ${spacing.md};">Business</h3>
              <div style="font-size: 3rem; font-weight: 800; color: ${colors.primary}; margin-bottom: ${spacing.md};">
                $99<span style="font-size: 1rem; font-weight: 400; color: ${colors.mediumGray};">/user/mo</span>
              </div>
              <p style="color: ${colors.mediumGray};">For large organizations</p>
            </div>
          </div>

          ${Button({ text: 'View All Plans', href: '/pricing', variant: 'primary', size: 'lg' })}
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="section" style="background: ${colors.lightGray};">
      <div class="container text-center">
        <h2 style="font-size: 2.5rem; margin-bottom: ${spacing.lg};">
          Ready to Transform Your Business?
        </h2>
        <p style="font-size: 1.25rem; color: ${colors.mediumGray}; margin-bottom: ${spacing['2xl'}}; max-width: 600px; margin-left: auto; margin-right: auto;">
          Join thousands of businesses that chose Risivo to manage customer relationships and close more deals.
        </p>

        <div style="display: flex; gap: ${spacing.md}; justify-content: center; flex-wrap: wrap;">
          ${Button({ text: 'Start Free Trial', href: 'https://app.risivo.com/signup', variant: 'primary', size: 'lg' })}
          ${Button({ text: 'Schedule Demo', href: '/demo', variant: 'secondary', size: 'lg' })}
        </div>

        <div style="margin-top: ${spacing.xl}; color: ${colors.mediumGray};">
          <small>✓ 14-day free trial &nbsp;•&nbsp; ✓ No credit card required &nbsp;•&nbsp; ✓ Cancel anytime</small>
        </div>
      </div>
    </section>

    <style>
      @media (max-width: 768px) {
        .section h2 {
          font-size: 2rem !important;
        }
        
        .section p {
          font-size: 1rem !important;
        }

        [style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
  `

  return BaseLayout({
    title: 'Modern CRM Software for Growing Businesses',
    description: 'Transform how you manage customer relationships, close deals, and grow your business with Risivo - the CRM built for modern teams. Start your free trial today.',
    children: pageContent,
    navigation: {
      logoSrc: '/risivo-logo.png',
      items: navigationItems,
    },
    footer: {
      columns: footerColumns,
      socialLinks,
    },
  })
}

  })
}
