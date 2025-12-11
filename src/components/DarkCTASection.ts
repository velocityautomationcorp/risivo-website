/**
 * Dark CTA Section Component
 * Centered content on dark background
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius } = designSystem

export interface DarkCTASectionProps {
  title: string
  subtitle?: string
  description: string
  ctaText: string
  ctaHref: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
  imagePosition?: 'left' | 'right'
  features?: string[]
}

export function DarkCTASection({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  image,
  imagePosition = 'right',
  features
}: DarkCTASectionProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  const spacing4xl = spacing['4xl']
  
  return `
    <section class="dark-cta-section" style="
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: ${spacing4xl} ${spacing.lg};
      position: relative;
      overflow: hidden;
    ">
      <!-- Background decoration -->
      <div style="
        position: absolute;
        top: -50%;
        ${imagePosition === 'left' ? 'right' : 'left'}: -20%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(104,63,233,0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      "></div>
      
      <div class="container" style="
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      ">
        <div style="
          display: grid;
          grid-template-columns: ${image || features ? '1fr 1fr' : '1fr'};
          gap: ${spacing3xl};
          align-items: center;
        ">
          ${imagePosition === 'left' && (image || features) ? `
            <div class="cta-visual">
              ${features ? `
                <div style="
                  background: rgba(255,255,255,0.05);
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 16px;
                  padding: ${spacing['2xl']};
                ">
                  ${features.map(feature => `
                    <div style="
                      display: flex;
                      align-items: start;
                      gap: ${spacing.md};
                      margin-bottom: ${spacing.lg};
                    ">
                      <div style="
                        background: ${colors.primary};
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-size: 14px;
                      ">✓</div>
                      <span style="color: rgba(255,255,255,0.9); line-height: 1.6;">
                        ${feature}
                      </span>
                    </div>
                  `).join('')}
                </div>
              ` : image ? `
                <img src="${image}" alt="Feature preview" style="
                  width: 100%;
                  height: auto;
                  border-radius: ${borderRadius.xl};
                  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                " />
              ` : ''}
            </div>
          ` : ''}
          
          <div class="cta-content" style="
            ${!image && !features ? 'text-align: center; max-width: 700px; margin: 0 auto;' : ''}
          ">
            ${subtitle ? `
              <span style="
                color: ${colors.primary};
                font-size: 0.875rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                display: block;
                margin-bottom: ${spacing.md};
              ">
                ${subtitle}
              </span>
            ` : ''}
            
            <h2 style="
              font-size: clamp(2rem, 4vw, 3rem);
              font-weight: 700;
              color: ${colors.white};
              margin-bottom: ${spacing.lg};
              line-height: 1.2;
            ">
              ${title}
            </h2>
            
            <p style="
              font-size: 1.125rem;
              color: rgba(255,255,255,0.8);
              margin-bottom: ${spacing2xl};
              line-height: 1.7;
            ">
              ${description}
            </p>
            
            <div class="cta-buttons" style="
              display: flex;
              gap: ${spacing.lg};
              ${!image && !features ? 'justify-content: center;' : ''}
              flex-wrap: wrap;
            ">
              <a href="${ctaHref}" style="
                display: inline-flex;
                align-items: center;
                gap: ${spacing.sm};
                background: ${colors.primary};
                color: ${colors.white};
                padding: ${spacing.lg} ${spacing2xl};
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(104,63,233,0.4);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(104,63,233,0.5)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(104,63,233,0.4)'">
                ${ctaText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              
              ${secondaryCtaText && secondaryCtaHref ? `
                <a href="${secondaryCtaHref}" style="
                  display: inline-flex;
                  align-items: center;
                  gap: ${spacing.sm};
                  background: transparent;
                  color: ${colors.white};
                  padding: ${spacing.lg} ${spacing2xl};
                  border-radius: 8px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 1rem;
                  border: 2px solid rgba(255,255,255,0.3);
                  transition: all 0.3s ease;
                " onmouseover="this.style.borderColor='${colors.white}'; this.style.background='rgba(255,255,255,0.1)'"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.background='transparent'">
                  ${secondaryCtaText}
                </a>
              ` : ''}
            </div>
          </div>
          
          ${imagePosition === 'right' && (image || features) ? `
            <div class="cta-visual">
              ${features ? `
                <div style="
                  background: rgba(255,255,255,0.05);
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 16px;
                  padding: ${spacing['2xl']};
                ">
                  ${features.map(feature => `
                    <div style="
                      display: flex;
                      align-items: start;
                      gap: ${spacing.md};
                      margin-bottom: ${spacing.lg};
                    ">
                      <div style="
                        background: ${colors.primary};
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-size: 14px;
                      ">✓</div>
                      <span style="color: rgba(255,255,255,0.9); line-height: 1.6;">
                        ${feature}
                      </span>
                    </div>
                  `).join('')}
                </div>
              ` : image ? `
                <img src="${image}" alt="Feature preview" style="
                  width: 100%;
                  height: auto;
                  border-radius: ${borderRadius.xl};
                  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                " />
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </section>
    
    <style>
      @media (max-width: 968px) {
        .dark-cta-section > .container > div {
          grid-template-columns: 1fr !important;
        }
        .cta-visual {
          order: -1;
        }
        .cta-content {
          text-align: center !important;
        }
        .cta-buttons {
          justify-content: center !important;
          flex-direction: column;
        }
        .cta-buttons a {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
  `
}
