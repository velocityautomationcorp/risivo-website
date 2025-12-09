import { designSystem } from '../styles/design-system';

const { colors, spacing } = designSystem;

export const TestimonialsSectionSimple = () => {
  return `
    <section style="
      background: white;
      padding: 80px 20px;
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- Section Header -->
        <div style="text-align: center; margin-bottom: 60px;">
          <span style="
            color: ${colors.primary};
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">
            SUCCESS STORIES
          </span>
          <h2 style="
            font-size: 2.5rem;
            font-weight: 700;
            color: ${colors.darkGray};
            margin-top: 16px;
          ">
            Success Stories From Our Users
          </h2>
        </div>

        <!-- Testimonials Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
        ">
          <!-- Testimonial 1 -->
          <div class="testimonial-card" style="
            background: #f8fafc;
            border-radius: 12px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          ">
            <div style="color: #fbbf24; font-size: 1.25rem; margin-bottom: 16px;">
              ★★★★★
            </div>
            <p style="
              font-size: 1.125rem;
              color: ${colors.darkGray};
              line-height: 1.7;
              margin-bottom: 24px;
              font-style: italic;
            ">
              "Risivo transformed how we manage our campaigns. We've seen a 200% increase in conversions and cut our marketing time in half."
            </p>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${colors.primary};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 1.25rem;
              ">
                S
              </div>
              <div>
                <div style="font-weight: 600; color: ${colors.darkGray};">
                  Sarah Chen
                </div>
                <div style="font-size: 0.875rem; color: ${colors.mediumGray};">
                  Marketing Director, TechStart Inc
                </div>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="testimonial-card" style="
            background: #f8fafc;
            border-radius: 12px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          ">
            <div style="color: #fbbf24; font-size: 1.25rem; margin-bottom: 16px;">
              ★★★★★
            </div>
            <p style="
              font-size: 1.125rem;
              color: ${colors.darkGray};
              line-height: 1.7;
              margin-bottom: 24px;
              font-style: italic;
            ">
              "The automation features are incredible. What used to take us hours now happens automatically. It's like having an extra team member."
            </p>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${colors.primary};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 1.25rem;
              ">
                M
              </div>
              <div>
                <div style="font-weight: 600; color: ${colors.darkGray};">
                  Michael Rodriguez
                </div>
                <div style="font-size: 0.875rem; color: ${colors.mediumGray};">
                  CEO, GrowthLabs
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
};
