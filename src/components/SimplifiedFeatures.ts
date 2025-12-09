import { designSystem } from '../styles/design-system';

const { colors, spacing, typography } = designSystem;

export const SimplifiedFeatures = () => {
  const features = [
    {
      icon: '📊',
      title: 'Email Marketing That Converts',
      description: 'Create stunning email campaigns with our intuitive drag-and-drop editor. Track opens, clicks, and conversions in real-time.'
    },
    {
      icon: '🎯',
      title: 'Smart Automation Workflows',
      description: 'Set up intelligent automation that nurtures leads, follows up with customers, and saves you hours every day.'
    },
    {
      icon: '📈',
      title: 'Data-Driven Insights',
      description: 'Make better decisions with powerful analytics. See what works, optimize campaigns, and grow faster.'
    }
  ];

  return `
    <section style="
      background: white;
      padding: ${spacing['4xl']} ${spacing.xl};
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- Section Header -->
        <div style="text-align: center; margin-bottom: ${spacing['3xl']};">
          <span style="
            color: ${colors.primary};
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">
            OUR MARKETING SOLUTIONS
          </span>
          <h2 style="
            font-family: ${typography.fontFamily};
            font-size: ${typography.h2};
            font-weight: ${typography.semibold};
            color: ${colors.darkGray};
            margin-top: ${spacing.md};
            margin-bottom: ${spacing.lg};
          ">
            Smart Marketing Tools, $250/yr For Everyone
          </h2>
          <p style="
            font-size: 1.125rem;
            color: ${colors.mediumGray};
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
          ">
            Everything you need to automate marketing, nurture leads, and close more deals
          </p>
        </div>

        <!-- Features Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: ${spacing['2xl']};
          margin-top: ${spacing['3xl']};
        ">
          ${features.map(feature => `
            <div style="
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: ${spacing['2xl']};
              transition: all 0.3s ease;
              text-align: center;
            " onmouseover="this.style.borderColor='${colors.primary}'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(104, 63, 233, 0.12)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              
              <!-- Icon -->
              <div style="
                font-size: 3rem;
                margin-bottom: ${spacing.lg};
              ">
                ${feature.icon}
              </div>

              <!-- Title -->
              <h3 style="
                font-family: ${typography.fontFamily};
                font-size: ${typography.h3};
                font-weight: ${typography.medium};
                color: ${colors.darkGray};
                margin-bottom: ${spacing.md};
              ">
                ${feature.title}
              </h3>

              <!-- Description -->
              <p style="
                font-size: 1rem;
                color: ${colors.mediumGray};
                line-height: 1.6;
                margin-bottom: ${spacing.lg};
              ">
                ${feature.description}
              </p>

              <!-- Learn More Link -->
              <a href="#" style="
                color: ${colors.primary};
                text-decoration: none;
                font-weight: 600;
                font-size: 0.938rem;
                display: inline-flex;
                align-items: center;
                gap: ${spacing.xs};
              " onmouseover="this.style.gap='${spacing.sm}'" onmouseout="this.style.gap='${spacing.xs}'">
                Learn More →
              </a>

            </div>
          `).join('')}
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: ${spacing['3xl']};">
          <a href="/features" style="
            background: ${colors.primary};
            color: white;
            padding: ${spacing.md} ${spacing['2xl']};
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='${colors.lightPurple}'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='${colors.primary}'; this.style.transform='translateY(0)'">
            Explore All Features
          </a>
        </div>

      </div>
    </section>
  `;
};
