/**
 * Statistics Section Component
 * Displays key metrics with numbers and percentages
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius } = designSystem

export interface Stat {
  number: string
  label: string
  suffix?: string
}

export interface StatsSectionProps {
  title: string
  description: string
  stats: Stat[]
  ctaText?: string
  ctaHref?: string
}

export function StatsSection({
  title,
  description,
  stats,
  ctaText,
  ctaHref
}: StatsSectionProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  
  return `
    <section class="stats-section" style="
      background: ${colors.white};
      padding: ${spacing3xl} ${spacing.lg};
    ">
      <div class="container" style="
        max-width: 1200px;
        margin: 0 auto;
      ">
        <!-- Section Header -->
        <div class="stats-header" style="
          text-align: center;
          margin-bottom: ${spacing3xl};
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        ">
          <h2 style="
            font-size: ${typography.h1};
            font-weight: ${typography.bold};
            color: ${colors.darkGray};
            margin-bottom: ${spacing.lg};
            line-height: ${typography.tight};
          ">
            ${title}
          </h2>
          <p style="
            font-size: ${typography.h5};
            color: ${colors.mediumGray};
            line-height: ${typography.relaxed};
          ">
            ${description}
          </p>
        </div>
        
        <!-- Stats Grid -->
        <div class="stats-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: ${spacing2xl};
          margin-bottom: ${spacing2xl};
        ">
          ${stats.map(stat => `
            <div class="stat-card" style="
              text-align: center;
              padding: ${spacing2xl};
              background: ${colors.lightGray};
              border-radius: ${borderRadius.lg};
              transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(104,63,233,0.1)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              <div class="stat-number" style="
                font-size: 3rem;
                font-weight: ${typography.bold};
                background: ${colors.heroGradient};
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: ${spacing.sm};
                line-height: 1;
              ">
                ${stat.number}${stat.suffix || ''}
              </div>
              <div class="stat-label" style="
                font-size: ${typography.body};
                color: ${colors.darkGray};
                font-weight: ${typography.medium};
              ">
                ${stat.label}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${ctaText && ctaHref ? `
          <div style="text-align: center; margin-top: ${spacing2xl};">
            <a href="${ctaHref}" class="stats-cta" style="
              display: inline-flex;
              align-items: center;
              gap: ${spacing.sm};
              background: ${colors.primary};
              color: ${colors.white};
              padding: ${spacing.lg} ${spacing2xl};
              border-radius: ${borderRadius.lg};
              text-decoration: none;
              font-weight: ${typography.semibold};
              font-size: ${typography.body};
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(104,63,233,0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(104,63,233,0.4)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(104,63,233,0.3)'">
              ${ctaText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        ` : ''}
      </div>
    </section>
    
    <style>
      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr !important;
        }
        .stat-number {
          font-size: 2.5rem !important;
        }
      }
    </style>
  `
}
