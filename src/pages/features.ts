/**
 * Features Page
 * Showcases all Risivo CRM features
 */

import { BaseLayout } from "../layouts/BaseLayout";
import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

export function FeaturesPage(): string {
  const pageContent = `
    <div style="padding-top: 80px;">
      <!-- Hero Section -->
      <section style="
        padding: 80px 20px;
        background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        text-align: center;
      ">
        <div style="max-width: 900px; margin: 0 auto;">
          <h1 style="
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 24px;
          ">
            Powerful Features for Modern Marketing
          </h1>
          <p style="
            font-size: 1.25rem;
            color: #666;
            line-height: 1.6;
            max-width: 700px;
            margin: 0 auto;
          ">
            Everything you need to automate, track, and optimize your marketing campaigns in one powerful platform.
          </p>
        </div>
      </section>

      <!-- Features Grid -->
      <section style="padding: 100px 20px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
          ">
            <!-- Feature 1 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                📊
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Campaign Management</h3>
              <p style="color: #666; line-height: 1.6;">
                Create, launch, and track multi-channel campaigns with ease. Monitor performance in real-time.
              </p>
            </div>

            <!-- Feature 2 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                🎯
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Lead Scoring</h3>
              <p style="color: #666; line-height: 1.6;">
                Automatically prioritize leads based on engagement and behavior. Focus on what matters most.
              </p>
            </div>

            <!-- Feature 3 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                📧
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Email Automation</h3>
              <p style="color: #666; line-height: 1.6;">
                Build sophisticated email workflows that nurture leads and convert customers automatically.
              </p>
            </div>

            <!-- Feature 4 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                📈
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Analytics & Reporting</h3>
              <p style="color: #666; line-height: 1.6;">
                Get detailed insights into campaign performance with customizable dashboards and reports.
              </p>
            </div>

            <!-- Feature 5 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                🔗
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Integrations</h3>
              <p style="color: #666; line-height: 1.6;">
                Connect with your favorite tools and platforms. Seamless integration with 100+ apps.
              </p>
            </div>

            <!-- Feature 6 -->
            <div style="padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="
                width: 60px;
                height: 60px;
                background: ${colors.primary};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
              ">
                👥
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Team Collaboration</h3>
              <p style="color: #666; line-height: 1.6;">
                Work together seamlessly with role-based access and shared workspaces for your entire team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section style="
        padding: 100px 20px;
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
        text-align: center;
        color: white;
      ">
        <div style="max-width: 700px; margin: 0 auto;">
          <h2 style="
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            margin-bottom: 24px;
            color: white;
          ">
            Ready to Get Started?
          </h2>
          <p style="
            font-size: 1.25rem;
            margin-bottom: 40px;
            opacity: 0.95;
          ">
            Start your free trial today. No credit card required.
          </p>
          <a href="https://app.risivo.com/signup" style="
            background: white;
            color: ${colors.primary};
            padding: 18px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            display: inline-block;
          ">
            Start Free Trial
          </a>
        </div>
      </section>
    </div>
  `;

  return BaseLayout({
    title: "Features - Risivo CRM",
    description:
      "Explore powerful marketing automation features including campaign management, lead scoring, email automation, analytics, and integrations.",
    children: pageContent,
    includeFooter: true,
  });
}
