/**
 * STEP 6: Complete Homepage with HeroWithDashboard
 * Final step - enhanced hero section with dashboard preview
 * Updated to use BaseLayout with new footer
 */

import { BaseLayout } from "../layouts/BaseLayout";
import { HeroWithDashboardClean } from "../components/HeroWithDashboardClean";
import { PartnerLogos } from "../components/PartnerLogos";
import { SimplifiedFeatures } from "../components/SimplifiedFeatures";
import { MarketingMadeSimple } from "../components/MarketingMadeSimple";
import { PricingCards } from "../components/PricingCards";
import { designSystem } from "../styles/design-system";

const { colors, spacing } = designSystem;

export const HomepageStep6 = () => {
  const pageContent = `
    <!-- Enhanced Hero with Dashboard -->
    ${HeroWithDashboardClean()}

    <!-- Partner Logos -->
    <section style="
      padding: 60px 20px;
      background: linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        ${PartnerLogos()}
      </div>
    </section>

    <!-- Simplified Features -->
    <section style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        ${SimplifiedFeatures()}
      </div>
    </section>

    <!-- Marketing Made Simple -->
    <section style="
      padding: 100px 20px;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        ${MarketingMadeSimple()}
      </div>
    </section>

    <!-- Pricing Cards -->
    <section style="
      padding: 100px 20px;
      background: white;
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 16px;
          ">
            Simple, Transparent Pricing
          </h2>
          <p style="
            font-size: 1.25rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          ">
            Choose the perfect plan for your business needs
          </p>
        </div>
        ${PricingCards()}
      </div>
    </section>

    <!-- Final CTA Section -->
    <section style="
      padding: 100px 20px;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${
    colors.primaryDark
  } 100%);
      text-align: center;
      color: white;
    ">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          margin-bottom: 24px;
          color: white;
        ">
          Ready to Transform Your Marketing?
        </h2>
        <p style="
          font-size: 1.25rem;
          margin-bottom: 40px;
          opacity: 0.95;
          line-height: 1.6;
        ">
          Join thousands of businesses already using Risivo to streamline their marketing operations and drive growth.
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
            transition: transform 0.2s;
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
            transition: background 0.2s;
            border: 2px solid white;
          ">
            Contact Sales
          </a>
        </div>
      </div>
    </section>

    <!-- Smooth scroll -->
    <script>
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    </script>
  `;

  return BaseLayout({
    title: "Risivo - Marketing CRM Platform",
    description:
      "Powerful marketing automation made simple for everyone. Streamline your campaigns, engage customers, and grow your business with Risivo.",
    children: pageContent,
    includeFooter: true,
  });
};
