/**
 * Modern Hero Component
 * Based on template design with purple gradient and dashboard image
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius } = designSystem

export interface ModernHeroProps {
  headline: string
  subheadline?: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  dashboardImage?: string
  trustedByLogos?: string[]
}

export function ModernHero({
  headline,
  subheadline,
  description,
  primaryCTA,
  secondaryCTA,
  dashboardImage = '/images/dashboard-preview.png',
  trustedByLogos = []
}: ModernHeroProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  const spacing4xl = spacing['4xl']
  
  return `
    <!-- Modern Hero Section -->
    <section class="modern-hero" style="
      background: ${colors.heroGradient};
      padding: ${spacing4xl} ${spacing.lg};
      text-align: center;
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
      <!-- Hero Content -->
      <div class="hero-content" style="
        max-width: 900px;
        margin: 0 auto ${spacing3xl};
        z-index: 2;
        position: relative;
      ">
        ${subheadline ? `
          <div class="hero-badge" style="
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: ${spacing.sm} ${spacing.lg};
            border-radius: ${borderRadius.full};
            color: ${colors.white};
            font-size: ${typography.small};
            font-weight: ${typography.semibold};
            margin-bottom: ${spacing.lg};
            border: 1px solid rgba(255, 255, 255, 0.2);
          ">
            ${subheadline}
          </div>
        ` : ''}
        
        <h1 class="hero-headline" style="
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: ${typography.bold};
          color: ${colors.white};
          margin-bottom: ${spacing.lg};
          line-height: ${typography.tight};
          letter-spacing: -0.02em;
        ">
          ${headline}
        </h1>
        
        <p class="hero-description" style="
          font-size: ${typography.h5};
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: ${spacing2xl};
          line-height: ${typography.relaxed};
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        ">
          ${description}
        </p>
        
        <!-- CTA Buttons -->
        <div class="hero-cta-buttons" style="
          display: flex;
          gap: ${spacing.lg};
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: ${spacing3xl};
        ">
          <a href="${primaryCTA.href}" class="hero-btn-primary" style="
            display: inline-flex;
            align-items: center;
            gap: ${spacing.sm};
            background: ${colors.white};
            color: ${colors.primary};
            padding: ${spacing.lg} ${spacing2xl};
            border-radius: ${borderRadius.lg};
            text-decoration: none;
            font-weight: ${typography.semibold};
            font-size: ${typography.body};
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.3)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)'">
            ${primaryCTA.text}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-left: 4px;">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          
          ${secondaryCTA ? `
            <a href="${secondaryCTA.href}" class="hero-btn-secondary" style="
              display: inline-flex;
              align-items: center;
              gap: ${spacing.sm};
              background: transparent;
              color: ${colors.white};
              padding: ${spacing.lg} ${spacing2xl};
              border-radius: ${borderRadius.lg};
              text-decoration: none;
              font-weight: ${typography.semibold};
              font-size: ${typography.body};
              border: 2px solid rgba(255, 255, 255, 0.3);
              transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='rgba(255,255,255,0.6)'; this.style.background='rgba(255,255,255,0.1)'"
               onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.background='transparent'">
              ${secondaryCTA.text}
            </a>
          ` : ''}
        </div>
      </div>
      
      <!-- Dashboard/Product Image -->
      <div class="hero-dashboard-image" style="
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      ">
        <div style="
          background: white;
          border-radius: ${borderRadius.xl};
          padding: ${spacing.md};
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          transform: perspective(1000px) rotateX(5deg);
        ">
          <img src="${dashboardImage}" alt="Risivo Dashboard" style="
            width: 100%;
            height: auto;
            border-radius: ${borderRadius.lg};
            display: block;
          " />
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="hero-decoration" style="
        position: absolute;
        top: -50%;
        right: -10%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      "></div>
      
      <div class="hero-decoration" style="
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      "></div>
    </section>
    
    ${trustedByLogos.length > 0 ? `
    <!-- Trusted By Logos Section -->
    <section class="trusted-by-section" style="
      background: ${colors.white};
      padding: ${spacing2xl} ${spacing.lg};
      text-align: center;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <p style="
          font-size: ${typography.small};
          color: ${colors.mediumGray};
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: ${typography.semibold};
          margin-bottom: ${spacing.lg};
        ">
          Trusted by leading companies
        </p>
        <div class="logo-grid" style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: ${spacing2xl};
          flex-wrap: wrap;
          opacity: 0.6;
        ">
          ${trustedByLogos.map(logo => `
            <img src="${logo}" alt="Partner logo" style="
              height: 40px;
              width: auto;
              filter: grayscale(100%);
              transition: all 0.3s ease;
            " onmouseover="this.style.filter='grayscale(0)'; this.style.opacity='1'"
               onmouseout="this.style.filter='grayscale(100%)'"/>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}
    
    <style>
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .hero-headline {
          font-size: 2rem !important;
        }
        .hero-cta-buttons {
          flex-direction: column;
          align-items: stretch;
        }
        .hero-btn-primary, .hero-btn-secondary {
          width: 100%;
          justify-content: center;
        }
        .hero-dashboard-image {
          transform: none !important;
        }
      }
      
      /* Smooth animations */
      .modern-hero {
        animation: fadeIn 0.8s ease-out;
      }
      
      .hero-content {
        animation: slideUp 1s ease-out;
      }
      
      .hero-dashboard-image {
        animation: fadeInUp 1.2s ease-out 0.3s both;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(60px) perspective(1000px) rotateX(5deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) perspective(1000px) rotateX(5deg);
        }
      }
    </style>
  `
}
