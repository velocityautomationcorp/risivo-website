/**
 * Features Grid Component
 * Modern grid layout with icon cards
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius, shadows } = designSystem

export interface Feature {
  icon: string // SVG or emoji
  title: string
  description: string
}

export interface FeaturesGridProps {
  sectionTitle: string
  sectionSubtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function FeaturesGrid({
  sectionTitle,
  sectionSubtitle,
  features,
  columns = 3
}: FeaturesGridProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  
  return `
    <section class="features-grid-section" style="
      background: ${colors.lightGray};
      padding: ${spacing3xl} ${spacing.lg};
    ">
      <div class="container" style="
        max-width: 1200px;
        margin: 0 auto;
      ">
        <!-- Section Header -->
        <div class="section-header" style="
          text-align: center;
          margin-bottom: ${spacing3xl};
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        ">
          ${sectionSubtitle ? `
            <div class="section-badge" style="
              display: inline-block;
              background: ${colors.primary};
              color: ${colors.white};
              padding: ${spacing.sm} ${spacing.lg};
              border-radius: ${borderRadius.full};
              font-size: ${typography.small};
              font-weight: ${typography.semibold};
              margin-bottom: ${spacing.lg};
              text-transform: uppercase;
              letter-spacing: 0.05em;
            ">
              ${sectionSubtitle}
            </div>
          ` : ''}
          
          <h2 style="
            font-size: ${typography.h1};
            font-weight: ${typography.bold};
            color: ${colors.darkGray};
            margin-bottom: ${spacing.lg};
            line-height: ${typography.tight};
          ">
            ${sectionTitle}
          </h2>
        </div>
        
        <!-- Features Grid -->
        <div class="features-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: ${spacing2xl};
        ">
          ${features.map(feature => `
            <div class="feature-card" style="
              background: ${colors.white};
              padding: ${spacing2xl};
              border-radius: ${borderRadius.lg};
              transition: all 0.3s ease;
              box-shadow: ${shadows.sm};
              border: 1px solid rgba(0,0,0,0.05);
            " onmouseover="
              this.style.transform='translateY(-8px)';
              this.style.boxShadow='${shadows.xl}';
              this.style.borderColor='${colors.primary}';
            " onmouseout="
              this.style.transform='translateY(0)';
              this.style.boxShadow='${shadows.sm}';
              this.style.borderColor='rgba(0,0,0,0.05)';
            ">
              <!-- Icon -->
              <div class="feature-icon" style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
                border-radius: ${borderRadius.lg};
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: ${spacing.lg};
                font-size: 28px;
                box-shadow: 0 4px 15px rgba(104,63,233,0.2);
              ">
                ${feature.icon}
              </div>
              
              <!-- Title -->
              <h3 style="
                font-size: ${typography.h4};
                font-weight: ${typography.bold};
                color: ${colors.darkGray};
                margin-bottom: ${spacing.md};
                line-height: ${typography.tight};
              ">
                ${feature.title}
              </h3>
              
              <!-- Description -->
              <p style="
                font-size: ${typography.body};
                color: ${colors.mediumGray};
                line-height: ${typography.relaxed};
              ">
                ${feature.description}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <style>
      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
  `
}
