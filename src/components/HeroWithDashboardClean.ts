/**
 * HeroWithDashboard - Clean version without inline handlers
 */

export const HeroWithDashboardClean = () => {
  return `
    <section style="
      background: linear-gradient(135deg, #683FE9 0%, #7C3AED 100%);
      padding: 120px 20px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    ">
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        
        <!-- Badge -->
        <div style="margin-bottom: 24px;">
          <span style="
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: inline-block;
          ">
            🚀 AI-POWERED CRM
          </span>
        </div>

        <!-- Headline -->
        <h1 style="
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          line-height: 1.2;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        ">
          Powerful Marketing Meets<br/>Seamless Design
        </h1>

        <!-- Subheadline -->
        <p style="
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 48px;
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
          gap: 16px;
          justify-content: center;
          margin-bottom: 80px;
          flex-wrap: wrap;
        ">
          <a href="https://app.risivo.com/signup" class="hero-cta-primary" style="
            background: white;
            color: #683FE9;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          ">
            Start Free Trial
          </a>
          <a href="#demo" class="hero-cta-secondary" style="
            background: transparent;
            color: white;
            padding: 16px 40px;
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            display: inline-block;
            transition: all 0.3s ease;
          ">
            Watch Demo
          </a>
        </div>

        <!-- Dashboard Preview -->
        <div style="
          margin-top: 80px;
          position: relative;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        ">
          <div style="
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          ">
            <!-- Dashboard Content -->
            <div style="
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 8px;
              height: 500px;
              padding: 32px;
              overflow: hidden;
            ">
              <div style="display: flex; gap: 24px; height: 100%;">
                
                <!-- Left Side - Charts -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
                  <!-- Chart 1 -->
                  <div style="background: white; border-radius: 8px; padding: 16px; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <div style="height: 100%; background: linear-gradient(to top, #683FE9 0%, #7C3AED 100%); border-radius: 4px; opacity: 0.6;"></div>
                  </div>
                  <!-- Chart 2 -->
                  <div style="background: white; border-radius: 8px; padding: 16px; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <div style="height: 100%; background: linear-gradient(135deg, #ED632F 0%, #ff8a65 100%); border-radius: 4px; opacity: 0.6;"></div>
                  </div>
                </div>
                
                <!-- Right Side - Metrics -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
                  <!-- Metric 1 -->
                  <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 8px;">Total Revenue</div>
                    <div style="color: #683FE9; font-size: 2rem; font-weight: 700;">$127,500</div>
                    <div style="color: #10b981; font-size: 0.875rem; margin-top: 8px;">↑ 23.5%</div>
                  </div>
                  <!-- Metric 2 -->
                  <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 8px;">Active Campaigns</div>
                    <div style="color: #683FE9; font-size: 2rem; font-weight: 700;">42</div>
                    <div style="color: #10b981; font-size: 0.875rem; margin-top: 8px;">↑ 12.3%</div>
                  </div>
                  <!-- Metric 3 -->
                  <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 8px;">Conversion Rate</div>
                    <div style="color: #683FE9; font-size: 2rem; font-weight: 700;">8.4%</div>
                    <div style="color: #10b981; font-size: 0.875rem; margin-top: 8px;">↑ 5.2%</div>
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
