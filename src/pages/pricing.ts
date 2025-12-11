/**
 * Pricing Page
 * Displays pricing tiers and plans
 */

import { BaseLayout } from "../layouts/BaseLayout";
import { PricingCards } from "../components/PricingCards";
import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

export function PricingPage(): string {
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
            Simple, Transparent Pricing
          </h1>
          <p style="
            font-size: 1.25rem;
            color: #666;
            line-height: 1.6;
            max-width: 700px;
            margin: 0 auto;
          ">
            Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>
      </section>

      <!-- Pricing Cards -->
      <section style="padding: 100px 20px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          ${PricingCards()}
        </div>
      </section>

      <!-- FAQ Section -->
      <section style="
        padding: 100px 20px;
        background: #f9fafb;
      ">
        <div style="max-width: 900px; margin: 0 auto;">
          <h2 style="
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 60px;
          ">
            Frequently Asked Questions
          </h2>
          
          <div style="
            display: flex;
            flex-direction: column;
            gap: 24px;
          ">
            <!-- FAQ 1 -->
            <div style="
              background: white;
              padding: 30px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            ">
              <h3 style="
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 12px;
              ">
                Can I change plans later?
              </h3>
              <p style="color: #666; line-height: 1.6;">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.
              </p>
            </div>

            <!-- FAQ 2 -->
            <div style="
              background: white;
              padding: 30px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            ">
              <h3 style="
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 12px;
              ">
                What payment methods do you accept?
              </h3>
              <p style="color: #666; line-height: 1.6;">
                We accept all major credit cards (Visa, MasterCard, American Express) and bank transfers for annual plans.
              </p>
            </div>

            <!-- FAQ 3 -->
            <div style="
              background: white;
              padding: 30px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            ">
              <h3 style="
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 12px;
              ">
                Is there a setup fee?
              </h3>
              <p style="color: #666; line-height: 1.6;">
                No setup fees! Start using Risivo immediately after signing up. We also provide free onboarding support.
              </p>
            </div>

            <!-- FAQ 4 -->
            <div style="
              background: white;
              padding: 30px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            ">
              <h3 style="
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 12px;
              ">
                Can I cancel anytime?
              </h3>
              <p style="color: #666; line-height: 1.6;">
                Yes, you can cancel your subscription at any time. No questions asked, no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section style="
        padding: 100px 20px;
        background: linear-gradient(135deg, ${colors.primary} 0%, ${
    colors.primaryDark
  } 100%);
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
            Start Your Free Trial Today
          </h2>
          <p style="
            font-size: 1.25rem;
            margin-bottom: 40px;
            opacity: 0.95;
          ">
            No credit card required. Get started in minutes.
          </p>
          <div style="
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
          ">
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
            <a href="/contact" style="
              background: rgba(255, 255, 255, 0.2);
              color: white;
              padding: 18px 40px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 1.1rem;
              display: inline-block;
              border: 2px solid white;
            ">
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  `;

  return BaseLayout({
    title: "Pricing - Risivo CRM",
    description:
      "Choose the perfect plan for your business. Simple, transparent pricing with no hidden fees. 14-day free trial included.",
    children: pageContent,
    includeFooter: true,
  });
}
