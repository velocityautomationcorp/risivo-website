import { designSystem } from '../styles/design-system';

const { colors, spacing, typography } = designSystem;

export const MarketingMadeSimple = () => {
  const stats = [
    { value: '200%', label: 'Faster Campaign Setup' },
    { value: '50K+', label: 'Active Users' },
    { value: '21%', label: 'Average ROI Increase' }
  ];

  return `
    <section style="
      background: #f8fafc;
      padding: ${spacing['4xl']} ${spacing.xl};
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${spacing['3xl']}; align-items: center;">
          
          <!-- Left Side - Content -->
          <div>
            <span style="
              color: ${colors.primary};
              font-size: 0.875rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              MARKETING MADE SIMPLE
            </span>

            <h2 style="
              font-family: ${typography.fontFamily.heading};
              font-size: 2.75rem;
              font-weight: 700;
              color: ${colors.textDark};
              margin-top: ${spacing.md};
              margin-bottom: ${spacing.lg};
              line-height: 1.2;
            ">
              Intuitive Campaign<br/>Editor
            </h2>

            <p style="
              font-size: 1.125rem;
              color: ${colors.textGray};
              line-height: 1.7;
              margin-bottom: ${spacing['2xl']};
            ">
              Create beautiful campaigns in minutes, not hours. Our drag-and-drop editor makes it simple to design emails, landing pages, and automation workflows that convert.
            </p>

            <!-- Stats Grid -->
            <div style="
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: ${spacing.lg};
              margin-top: ${spacing['2xl']};
            ">
              ${stats.map(stat => `
                <div>
                  <div style="
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: ${colors.primary};
                    font-family: ${typography.fontFamily.heading};
                    margin-bottom: ${spacing.xs};
                  ">
                    ${stat.value}
                  </div>
                  <div style="
                    font-size: 0.875rem;
                    color: ${colors.textGray};
                    line-height: 1.4;
                  ">
                    ${stat.label}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- CTA Button -->
            <div style="margin-top: ${spacing['2xl']};">
              <a href="#demo" style="
                background: ${colors.primary};
                color: white;
                padding: ${spacing.md} ${spacing.xl};
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1rem;
                display: inline-block;
                transition: all 0.3s ease;
              " onmouseover="this.style.background='${colors.lightPurple}'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='${colors.primary}'; this.style.transform='translateY(0)'">
                Try Campaign Editor
              </a>
            </div>

          </div>

          <!-- Right Side - Visual -->
          <div style="position: relative;">
            <!-- Circular progress visualization -->
            <div style="
              background: white;
              border-radius: 12px;
              padding: ${spacing['2xl']};
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
              position: relative;
            ">
              <!-- Circle Chart -->
              <div style="
                width: 280px;
                height: 280px;
                margin: 0 auto;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <!-- Outer ring -->
                <div style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  border: 20px solid #e5e7eb;
                "></div>
                <!-- Progress ring -->
                <div style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  border: 20px solid transparent;
                  border-top-color: ${colors.primary};
                  border-right-color: ${colors.primary};
                  border-bottom-color: ${colors.lightPurple};
                  transform: rotate(-45deg);
                "></div>
                <!-- Center content -->
                <div style="
                  position: relative;
                  text-align: center;
                  z-index: 2;
                ">
                  <div style="
                    font-size: 3rem;
                    font-weight: 700;
                    color: ${colors.primary};
                    font-family: ${typography.fontFamily.heading};
                  ">
                    85%
                  </div>
                  <div style="
                    font-size: 1rem;
                    color: ${colors.textGray};
                    margin-top: ${spacing.xs};
                  ">
                    Time Saved
                  </div>
                </div>
              </div>

              <!-- Bottom metrics -->
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: ${spacing.lg};
                margin-top: ${spacing.xl};
              ">
                <div style="text-align: center;">
                  <div style="
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: ${colors.primary};
                  ">
                    4.8★
                  </div>
                  <div style="
                    font-size: 0.875rem;
                    color: ${colors.textGray};
                    margin-top: ${spacing.xs};
                  ">
                    User Rating
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: ${colors.primary};
                  ">
                    99.9%
                  </div>
                  <div style="
                    font-size: 0.875rem;
                    color: ${colors.textGray};
                    margin-top: ${spacing.xs};
                  ">
                    Uptime
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;
};
