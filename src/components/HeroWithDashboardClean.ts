/**
 * HeroWithDashboard - Clean version without inline handlers
 */

export const HeroWithDashboardClean = () => {
  return `
    <style>
      .hero-section {
        background: linear-gradient(135deg, #683FE9 0%, #7C3AED 100%);
        padding: 140px 20px 60px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .hero-badge {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 20px;
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        display: inline-block;
        margin-bottom: 24px;
      }
      
      .hero-title {
        font-size: 3.5rem;
        font-weight: 700;
        color: white;
        margin-bottom: 24px;
        line-height: 1.2;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 48px;
        line-height: 1.6;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .hero-cta-container {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 80px;
        flex-wrap: wrap;
      }
      
      .hero-dashboard {
        margin-top: 80px;
        position: relative;
        max-width: 1100px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .hero-dashboard-inner {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .hero-dashboard-content {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 8px;
        height: 500px;
        padding: 32px;
        overflow: hidden;
      }
      
      .hero-dashboard-grid {
        display: flex;
        gap: 24px;
        height: 100%;
      }
      
      .hero-dashboard-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      /* Mobile Responsive */
      @media (max-width: 768px) {
        .hero-section {
          padding: 100px 16px 40px;
        }
        
        .hero-badge {
          font-size: 0.75rem;
          padding: 6px 16px;
          margin-bottom: 20px;
        }
        
        .hero-title {
          font-size: 1.875rem;
          margin-bottom: 16px;
          padding: 0 8px;
        }
        
        .hero-subtitle {
          font-size: 1rem;
          margin-bottom: 32px;
          padding: 0 8px;
        }
        
        .hero-cta-container {
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
          padding: 0 16px;
        }
        
        .hero-cta-primary,
        .hero-cta-secondary {
          width: 100%;
          padding: 14px 24px !important;
          font-size: 1rem !important;
        }
        
        .hero-dashboard {
          margin-top: 40px;
        }
        
        .hero-dashboard-inner {
          padding: 12px;
          border-radius: 8px;
        }
        
        .hero-dashboard-content {
          height: auto;
          min-height: 400px;
          padding: 16px;
        }
        
        .hero-dashboard-grid {
          flex-direction: column;
          gap: 12px;
        }
        
        .hero-dashboard-column {
          gap: 12px;
        }
      }
      
      @media (max-width: 480px) {
        .hero-title {
          font-size: 1.5rem;
        }
        
        .hero-subtitle {
          font-size: 0.9375rem;
        }
        
        .hero-dashboard-content {
          min-height: 350px;
          padding: 12px;
        }
      }
    </style>
    
    <section class="hero-section">
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        
        <!-- Badge -->
        <div>
          <span class="hero-badge">
            🚀 AI-POWERED CRM
          </span>
        </div>

        <!-- Headline -->
        <h1 class="hero-title">
          Powerful Marketing Meets<br/>Seamless Design
        </h1>

        <!-- Subheadline -->
        <p class="hero-subtitle">
          Transform how you manage customer relationships with intelligent automation that accelerates growth
        </p>

        <!-- CTA Buttons -->
        <div class="hero-cta-container">
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
        <div class="hero-dashboard">
          <div class="hero-dashboard-inner">
            <!-- Dashboard Content -->
            <div class="hero-dashboard-content">
              <div class="hero-dashboard-grid">
                
                <!-- Left Side - Charts -->
                <div class="hero-dashboard-column">
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
                <div class="hero-dashboard-column">
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
