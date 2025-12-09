import { designSystem } from '../styles/design-system';

const { colors, spacing, typography, gradients } = designSystem;

export const HeroWithDashboard = () => {
  return `
    <section style="
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.lightPurple} 100%);
      padding: ${spacing['4xl']} ${spacing.xl} ${spacing['3xl']};
      text-align: center;
      position: relative;
      overflow: hidden;
    ">
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        
        <!-- Headline -->
        <div style="margin-bottom: ${spacing.lg};">
          <span style="
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: ${spacing.xs} ${spacing.md};
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: inline-block;
          ">
            🚀 AI-POWERED CRM
          </span>
        </div>

        <h1 style="
          font-family: ${typography.fontFamily.heading};
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: ${spacing.lg};
          line-height: 1.2;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        ">
          Powerful Marketing Meets<br/>Seamless Design
        </h1>

        <p style="
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: ${spacing['2xl']};
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        ">
          Transform how you manage customer relationships with intelligent automation that accelerates growth
        </p>

        <!-- CTA Buttons -->
        <div style="
          display: flex;
          gap: ${spacing.md};
          justify-content: center;
          margin-bottom: ${spacing['3xl']};
          flex-wrap: wrap;
        ">
          <a href="/pricing" style="
            background: white;
            color: ${colors.primary};
            padding: ${spacing.md} ${spacing['2xl']};
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(0,0,0,0.15)'">
            Start Free Trial
          </a>
          <a href="#demo" style="
            background: transparent;
            color: white;
            padding: ${spacing.md} ${spacing['2xl']};
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
            Watch Demo
          </a>
        </div>

        <!-- Dashboard Preview Image -->
        <div style="
          margin-top: ${spacing['3xl']};
          position: relative;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        ">
          <div style="
            background: white;
            border-radius: 12px;
            padding: ${spacing.md};
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: perspective(1000px) rotateX(2deg);
          ">
            <!-- Placeholder for dashboard mockup -->
            <div style="
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 8px;
              height: 500px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              overflow: hidden;
            ">
              <!-- Simulated Dashboard Content -->
              <div style="width: 100%; height: 100%; padding: ${spacing.xl};">
                <!-- Chart placeholder -->
                <div style="display: flex; gap: ${spacing.lg}; height: 100%;">
                  <!-- Left side - Charts -->
                  <div style="flex: 1; display: flex; flex-direction: column; gap: ${spacing.md};">
                    <div style="background: white; border-radius: 8px; padding: ${spacing.md}; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="height: 100%; background: linear-gradient(to top, ${colors.primary} 0%, ${colors.lightPurple} 100%); border-radius: 4px; opacity: 0.6;"></div>
                    </div>
                    <div style="background: white; border-radius: 8px; padding: ${spacing.md}; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="height: 100%; background: linear-gradient(135deg, ${colors.accent} 0%, #ff8a65 100%); border-radius: 4px; opacity: 0.6;"></div>
                    </div>
                  </div>
                  <!-- Right side - Metrics -->
                  <div style="flex: 1; display: flex; flex-direction: column; gap: ${spacing.md};">
                    <div style="background: white; border-radius: 8px; padding: ${spacing.lg}; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="color: ${colors.textGray}; font-size: 0.875rem; margin-bottom: ${spacing.xs};">Total Revenue</div>
                      <div style="color: ${colors.primary}; font-size: 2rem; font-weight: 700;">$127,500</div>
                      <div style="color: #10b981; font-size: 0.875rem; margin-top: ${spacing.xs};">↑ 23.5%</div>
                    </div>
                    <div style="background: white; border-radius: 8px; padding: ${spacing.lg}; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="color: ${colors.textGray}; font-size: 0.875rem; margin-bottom: ${spacing.xs};">Active Campaigns</div>
                      <div style="color: ${colors.primary}; font-size: 2rem; font-weight: 700;">42</div>
                      <div style="color: #10b981; font-size: 0.875rem; margin-top: ${spacing.xs};">↑ 12.3%</div>
                    </div>
                    <div style="background: white; border-radius: 8px; padding: ${spacing.lg}; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                      <div style="color: ${colors.textGray}; font-size: 0.875rem; margin-bottom: ${spacing.xs};">Conversion Rate</div>
                      <div style="color: ${colors.primary}; font-size: 2rem; font-weight: 700;">8.4%</div>
                      <div style="color: #10b981; font-size: 0.875rem; margin-top: ${spacing.xs};">↑ 5.2%</div>
                    </div>
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
