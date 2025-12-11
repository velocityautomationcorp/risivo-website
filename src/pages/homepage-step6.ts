/**
 * SAFE HOMEPAGE VERSION - Guaranteed to work
 * Use this if homepage-step6.ts causes 500 errors
 */

import { BaseLayout } from "../layouts/BaseLayout";
import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

export const HomepageStep6 = () => {
  // Inline hero content to avoid dependency issues
  const heroContent = `
    <style>
      .hero-section-safe {
        background: linear-gradient(135deg, #683FE9 0%, #7C3AED 100%);
        padding: 140px 20px 60px;
        text-align: center;
        color: white;
      }
      .hero-title-safe {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 700;
        margin-bottom: 24px;
      }
      .hero-subtitle-safe {
        font-size: 1.25rem;
        opacity: 0.95;
        max-width: 700px;
        margin: 0 auto 40px;
        line-height: 1.6;
      }
      .hero-cta-safe {
        background: white;
        color: #683FE9;
        padding: 18px 40px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        display: inline-block;
      }
    </style>
    
    <div class="hero-section-safe">
      <h1 class="hero-title-safe">Transform Your Marketing with Risivo CRM</h1>
      <p class="hero-subtitle-safe">
        Powerful marketing automation made simple for everyone. 
        Streamline your campaigns, engage customers, and grow your business.
      </p>
      <a href="https://app.risivo.com/signup" class="hero-cta-safe">
        Start Free Trial
      </a>
    </div>
  `;

  const featuresContent = `
    <section style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 60px;">
          Everything You Need
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📊</div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Campaign Management</h3>
            <p style="color: #666; line-height: 1.6;">Create and track campaigns with ease</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">🎯</div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Lead Scoring</h3>
            <p style="color: #666; line-height: 1.6;">Prioritize leads automatically</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📧</div>
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Email Automation</h3>
            <p style="color: #666; line-height: 1.6;">Build sophisticated workflows</p>
          </div>
        </div>
      </div>
    </section>
  `;

  const pricingContent = `
    <section style="padding: 100px 20px; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);">
      <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 24px;">Simple Pricing</h2>
        <p style="font-size: 1.25rem; color: #666; margin-bottom: 60px;">Choose the perfect plan for your business</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 900px; margin: 0 auto;">
          <div style="background: white; padding: 40px; border-radius: 12px; border: 2px solid #e5e7eb;">
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Starter</h3>
            <div style="font-size: 3rem; font-weight: 700; color: ${colors.primary}; margin-bottom: 24px;">$29<span style="font-size: 1rem; font-weight: 400; color: #666;">/mo</span></div>
            <a href="https://app.risivo.com/signup" style="display: block; background: ${colors.primary}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Get Started</a>
          </div>
          <div style="background: white; padding: 40px; border-radius: 12px; border: 2px solid ${colors.primary};">
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Professional</h3>
            <div style="font-size: 3rem; font-weight: 700; color: ${colors.primary}; margin-bottom: 24px;">$99<span style="font-size: 1rem; font-weight: 400; color: #666;">/mo</span></div>
            <a href="https://app.risivo.com/signup" style="display: block; background: ${colors.primary}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Get Started</a>
          </div>
        </div>
      </div>
    </section>
  `;

  const ctaContent = `
    <section style="padding: 100px 20px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); text-align: center; color: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 24px; color: white;">
          Ready to Transform Your Marketing?
        </h2>
        <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.95; line-height: 1.6;">
          Join thousands of businesses already using Risivo to streamline their marketing operations and drive growth.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <a href="https://app.risivo.com/signup" style="background: white; color: ${colors.primary}; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.1rem; display: inline-block;">
            Start Free Trial
          </a>
          <a href="/contact" style="background: rgba(255, 255, 255, 0.2); color: white; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.1rem; display: inline-block; border: 2px solid white;">
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  `;

  const pageContent =
    heroContent + featuresContent + pricingContent + ctaContent;

  return BaseLayout({
    title: "Risivo - Marketing CRM Platform",
    description:
      "Powerful marketing automation made simple for everyone. Streamline your campaigns, engage customers, and grow your business with Risivo.",
    children: pageContent,
    includeFooter: true,
  });
};
