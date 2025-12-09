/**
 * Dark CTA Section Component
 * Centered content on dark background
 */

import { designSystem } from '../styles/design-system'

const { colors, typography, spacing, borderRadius } = designSystem

export interface DarkCTASectionProps {
  title: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  image?: string
  imagePosition?: 'left' | 'right'
}

export function DarkCTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  imagePosition = 'right'
}: DarkCTASectionProps): string {
  
  const spacing2xl = spacing['2xl']
  const spacing3xl = spacing['3xl']
  const spacing4xl = spacing['4xl']
  
  return `
    <section class="dark-cta-section" style="
      background: ${colors.darkGray};
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
        background: radial-gradient(circle, rgba(104,63,233,0.1) 0%, transparent 70%);
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
          grid-template-columns: ${image ? '1fr 1fr' : '1fr'};
          gap: ${spacing3xl};
          align-items: center;
        ">
          ${imagePosition === 'left' && image ? `
            <div class="cta-image">
              <img src="${image}" alt="Feature preview" style="
                width: 100%;
                height: auto;
                border-radius: ${borderRadius.xl};
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
              " />
            </div>
          ` : ''}
          
          <div class="cta-content" style="
            ${!image ? 'text-align: center; max-width: 700px; margin: 0 auto;' : ''}
          ">
            <h2 style="
              font-size: clamp(2rem, 4vw, 3rem);
              font-weight: ${typography.bold};
              color: ${colors.white};
              margin-bottom: ${spacing.lg};
              line-height: ${typography.tight};
            ">
              ${title}
            </h2>
            
            <p style="
              font-size: ${typography.h5};
              color: rgba(255,255,255,0.8);
              margin-bottom: ${spacing2xl};
              line-height: ${typography.relaxed};
            ">
              ${description}
            </p>
            
            <div class="cta-buttons" style="
              display: flex;
              gap: ${spacing.lg};
              ${!image ? 'justify-content: center;' : ''}
              flex-wrap: wrap;
            ">
              <a href="${primaryCTA.href}" style="
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
                box-shadow: 0 4px 20px rgba(104,63,233,0.4);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(104,63,233,0.5)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(104,63,233,0.4)'">
                ${primaryCTA.text}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              
              ${secondaryCTA ? `
                <a href="${secondaryCTA.href}" style="
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
                  border: 2px solid rgba(255,255,255,0.3);
                  transition: all 0.3s ease;
                " onmouseover="this.style.borderColor='${colors.white}'; this.style.background='rgba(255,255,255,0.1)'"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.background='transparent'">
                  ${secondaryCTA.text}
                </a>
              ` : ''}
            </div>
          </div>
          
          ${imagePosition === 'right' && image ? `
            <div class="cta-image">
              <img src="${image}" alt="Feature preview" style="
                width: 100%;
                height: auto;
                border-radius: ${borderRadius.xl};
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
              " />
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
        .cta-image {
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
