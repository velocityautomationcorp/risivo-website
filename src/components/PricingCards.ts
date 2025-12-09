/**
 * Modern Pricing Cards Component
 * Pricing plans with dark background
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius, shadows } = designSystem

export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: PricingFeature[]
  ctaText: string
  ctaHref: string
  highlighted?: boolean
}

export interface PricingCardsProps {
  title: string
  description: string
  plans: PricingPlan[]
  showAnnualToggle?: boolean
}

export function PricingCards({
  title,
  description,
  plans,
  showAnnualToggle = false
}: PricingCardsProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  const spacing4xl = spacing['4xl']
  
  return `
    <section class="pricing-section" style="
      background: ${colors.darkGray};
      padding: ${spacing4xl} ${spacing.lg};
      position: relative;
      overflow: hidden;
    ">
      <!-- Background decoration -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 400px;
        background: radial-gradient(ellipse at top, rgba(104,63,233,0.15) 0%, transparent 60%);
        pointer-events: none;
      "></div>
      
      <div class="container" style="
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      ">
        <!-- Section Header -->
        <div class="pricing-header" style="
          text-align: center;
          margin-bottom: ${spacing3xl};
        ">
          <h2 style="
            font-size: ${typography.h1};
            font-weight: ${typography.bold};
            color: ${colors.white};
            margin-bottom: ${spacing.lg};
            line-height: ${typography.tight};
          ">
            ${title}
          </h2>
          <p style="
            font-size: ${typography.h5};
            color: rgba(255,255,255,0.7);
            max-width: 600px;
            margin: 0 auto ${spacing.lg};
            line-height: ${typography.relaxed};
          ">
            ${description}
          </p>
          
          ${showAnnualToggle ? `
            <div class="toggle-wrapper" style="
              display: inline-flex;
              background: rgba(255,255,255,0.1);
              border-radius: ${borderRadius.full};
              padding: 4px;
              gap: 4px;
            ">
              <button style="
                padding: ${spacing.sm} ${spacing.lg};
                border-radius: ${borderRadius.full};
                background: ${colors.primary};
                color: ${colors.white};
                border: none;
                font-weight: ${typography.semibold};
                cursor: pointer;
              ">Monthly</button>
              <button style="
                padding: ${spacing.sm} ${spacing.lg};
                border-radius: ${borderRadius.full};
                background: transparent;
                color: rgba(255,255,255,0.7);
                border: none;
                font-weight: ${typography.semibold};
                cursor: pointer;
              ">Yearly <span style="
                background: ${colors.secondary};
                color: white;
                padding: 2px 8px;
                border-radius: ${borderRadius.sm};
                font-size: ${typography.tiny};
                margin-left: 4px;
              ">Save 20%</span></button>
            </div>
          ` : ''}
        </div>
        
        <!-- Pricing Cards Grid -->
        <div class="pricing-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: ${spacing2xl};
          max-width: 1000px;
          margin: 0 auto;
        ">
          ${plans.map(plan => `
            <div class="pricing-card" style="
              background: ${plan.highlighted ? colors.white : 'rgba(255,255,255,0.05)'};
              border: 2px solid ${plan.highlighted ? colors.primary : 'rgba(255,255,255,0.1)'};
              border-radius: ${borderRadius.xl};
              padding: ${spacing2xl};
              position: relative;
              transition: all 0.3s ease;
              ${plan.highlighted ? `transform: scale(1.05); box-shadow: 0 20px 40px rgba(104,63,233,0.3);` : ''}
            " onmouseover="
              this.style.transform='${plan.highlighted ? 'scale(1.08)' : 'translateY(-8px)'}'${!plan.highlighted ? '; this.style.background=\'rgba(255,255,255,0.08)\'' : ''};
            " onmouseout="
              this.style.transform='${plan.highlighted ? 'scale(1.05)' : 'translateY(0)'}'${!plan.highlighted ? '; this.style.background=\'rgba(255,255,255,0.05)\'' : ''};
            ">
              ${plan.highlighted ? `
                <div class="popular-badge" style="
                  position: absolute;
                  top: ${spacing.lg};
                  right: ${spacing.lg};
                  background: ${colors.primary};
                  color: ${colors.white};
                  padding: ${spacing.sm} ${spacing.md};
                  border-radius: ${borderRadius.full};
                  font-size: ${typography.small};
                  font-weight: ${typography.semibold};
                ">
                  Most Popular
                </div>
              ` : ''}
              
              <div class="plan-name" style="
                font-size: ${typography.h5};
                font-weight: ${typography.bold};
                color: ${plan.highlighted ? colors.darkGray : colors.white};
                margin-bottom: ${spacing.md};
              ">
                ${plan.name}
              </div>
              
              <div class="plan-price" style="
                display: flex;
                align-items: baseline;
                gap: ${spacing.sm};
                margin-bottom: ${spacing.sm};
              ">
                <span style="
                  font-size: 3rem;
                  font-weight: ${typography.bold};
                  color: ${plan.highlighted ? colors.primary : colors.white};
                  line-height: 1;
                ">
                  ${plan.price}
                </span>
                <span style="
                  font-size: ${typography.body};
                  color: ${plan.highlighted ? colors.mediumGray : 'rgba(255,255,255,0.6)'};
                ">
                  ${plan.period}
                </span>
              </div>
              
              <p class="plan-description" style="
                font-size: ${typography.body};
                color: ${plan.highlighted ? colors.mediumGray : 'rgba(255,255,255,0.7)'};
                margin-bottom: ${spacing2xl};
                line-height: ${typography.relaxed};
              ">
                ${plan.description}
              </p>
              
              <ul class="features-list" style="
                list-style: none;
                padding: 0;
                margin: 0 0 ${spacing2xl} 0;
              ">
                ${plan.features.map(feature => `
                  <li style="
                    display: flex;
                    align-items: center;
                    gap: ${spacing.md};
                    margin-bottom: ${spacing.md};
                    color: ${plan.highlighted ? colors.darkGray : 'rgba(255,255,255,0.9)'};
                  ">
                    ${feature.included ? `
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="flex-shrink: 0;">
                        <circle cx="10" cy="10" r="10" fill="${colors.primary}"/>
                        <path d="M6 10L9 13L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    ` : `
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="flex-shrink: 0;">
                        <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.1)"/>
                        <path d="M7 10H13" stroke="${plan.highlighted ? colors.mediumGray : 'rgba(255,255,255,0.4)'}" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    `}
                    <span style="font-size: ${typography.body};">
                      ${feature.text}
                    </span>
                  </li>
                `).join('')}
              </ul>
              
              <a href="${plan.ctaHref}" style="
                display: block;
                width: 100%;
                text-align: center;
                padding: ${spacing.lg};
                border-radius: ${borderRadius.lg};
                text-decoration: none;
                font-weight: ${typography.semibold};
                font-size: ${typography.body};
                transition: all 0.3s ease;
                ${plan.highlighted 
                  ? `background: ${colors.primary}; color: ${colors.white}; box-shadow: 0 4px 15px rgba(104,63,233,0.3);`
                  : `background: transparent; color: ${colors.white}; border: 2px solid rgba(255,255,255,0.2);`
                }
              " onmouseover="
                this.style.transform='translateY(-2px)';
                ${plan.highlighted 
                  ? `this.style.boxShadow='0 8px 25px rgba(104,63,233,0.4)';`
                  : `this.style.background='rgba(255,255,255,0.05)';`
                }
              " onmouseout="
                this.style.transform='translateY(0)';
                ${plan.highlighted 
                  ? `this.style.boxShadow='0 4px 15px rgba(104,63,233,0.3)';`
                  : `this.style.background='transparent';`
                }
              ">
                ${plan.ctaText}
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <style>
      @media (max-width: 968px) {
        .pricing-grid {
          grid-template-columns: 1fr !important;
        }
        .pricing-card {
          transform: none !important;
        }
      }
    </style>
  `
}
