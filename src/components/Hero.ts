/**
 * Hero Section Component
 * Large hero banner with CTA
 */

import { designSystem } from '../styles/design-system'
import { Button } from './Button'

const { colors, spacing } = designSystem

export interface HeroProps {
  title: string
  subtitle?: string
  description: string
  primaryCTA: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  backgroundImage?: string
  badges?: Array<{ text: string; icon?: string }>
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  badges = [],
}: HeroProps): string {
  return `
    <style>
      .hero {
        position: relative;
        background: ${colors.heroGradient};
        color: ${colors.white};
        padding: ${spacing['4xl']} 0;
        overflow: hidden;
        min-height: 600px;
        display: flex;
        align-items: center;
      }

      .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        ${backgroundImage ? `background-image: url('${backgroundImage}');` : ''}
        background-size: cover;
        background-position: center;
        opacity: 0.1;
      }

      .hero-container {
        position: relative;
        z-index: 1;
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 ${spacing.lg};
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${spacing['3xl']};
        align-items: center;
      }

      .hero-content {
        max-width: 600px;
      }

      .hero-subtitle {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: ${spacing.md};
        opacity: 0.9;
      }

      .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: ${spacing.lg};
        color: ${colors.white};
      }

      .hero-description {
        font-size: 1.25rem;
        line-height: 1.6;
        margin-bottom: ${spacing['2xl']};
        opacity: 0.95;
      }

      .hero-actions {
        display: flex;
        gap: ${spacing.md};
        flex-wrap: wrap;
      }

      .hero-badges {
        display: flex;
        gap: ${spacing.lg};
        margin-top: ${spacing['2xl']};
        flex-wrap: wrap;
      }

      .hero-badge {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .hero-visual {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-image {
        max-width: 100%;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      /* Animated background shapes */
      .hero-shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 20s infinite ease-in-out;
      }

      .hero-shape:nth-child(1) {
        width: 300px;
        height: 300px;
        top: -150px;
        right: -100px;
        animation-delay: 0s;
      }

      .hero-shape:nth-child(2) {
        width: 200px;
        height: 200px;
        bottom: -100px;
        left: -50px;
        animation-delay: 5s;
      }

      .hero-shape:nth-child(3) {
        width: 150px;
        height: 150px;
        top: 50%;
        right: 10%;
        animation-delay: 10s;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        33% {
          transform: translateY(-30px) rotate(120deg);
        }
        66% {
          transform: translateY(30px) rotate(240deg);
        }
      }

      @media (max-width: 768px) {
        .hero {
          min-height: auto;
          padding: ${spacing['3xl']} 0;
        }

        .hero-container {
          grid-template-columns: 1fr;
          gap: ${spacing.xl};
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
        }

        .hero-description {
          font-size: 1.1rem;
        }

        .hero-actions {
          justify-content: center;
        }

        .hero-badges {
          justify-content: center;
        }

        .hero-visual {
          order: -1;
        }
      }
    </style>

    <section class="hero">
      <div class="hero-shape"></div>
      <div class="hero-shape"></div>
      <div class="hero-shape"></div>
      
      <div class="hero-container">
        <div class="hero-content">
          ${subtitle ? `<div class="hero-subtitle">${subtitle}</div>` : ''}
          
          <h1 class="hero-title">${title}</h1>
          
          <p class="hero-description">${description}</p>
          
          <div class="hero-actions">
            ${Button({ 
              text: primaryCTA.text, 
              href: primaryCTA.href, 
              variant: 'primary',
              size: 'lg'
            })}
            
            ${secondaryCTA ? Button({
              text: secondaryCTA.text,
              href: secondaryCTA.href,
              variant: 'outline',
              size: 'lg'
            }) : ''}
          </div>
          
          ${badges.length > 0 ? `
            <div class="hero-badges">
              ${badges.map(badge => `
                <div class="hero-badge">
                  ${badge.icon ? `<span>${badge.icon}</span>` : ''}
                  <span>${badge.text}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="hero-visual">
          <img 
            src="/images/hero-dashboard.png" 
            alt="Risivo CRM Dashboard"
            class="hero-image"
            onerror="this.style.display='none'"
          />
        </div>
      </div>
    </section>
  `
}
