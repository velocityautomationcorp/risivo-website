import { designSystem } from '../styles/design-system';

const { colors, spacing, typography } = designSystem;

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Risivo transformed how we manage our campaigns. We've seen a 200% increase in conversions and cut our marketing time in half.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechStart Inc"
    },
    {
      quote: "The automation features are incredible. What used to take us hours now happens automatically. It's like having an extra team member.",
      author: "Michael Rodriguez",
      role: "CEO",
      company: "GrowthLabs"
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
            SUCCESS STORIES
          </span>
          <h2 style="
            font-family: ${typography.fontFamily.heading};
            font-size: 2.5rem;
            font-weight: 700;
            color: ${colors.textDark};
            margin-top: ${spacing.md};
            margin-bottom: ${spacing.lg};
          ">
            Success Stories From Our Users
          </h2>
        </div>

        <!-- Testimonials Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: ${spacing['2xl']};
        ">
          ${testimonials.map(testimonial => `
            <div style="
              background: #f8fafc;
              border-radius: 12px;
              padding: ${spacing['2xl']};
              border: 1px solid #e5e7eb;
              transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 8px 24px rgba(104, 63, 233, 0.12)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
              
              <!-- Stars -->
              <div style="
                color: #fbbf24;
                font-size: 1.25rem;
                margin-bottom: ${spacing.md};
                letter-spacing: 2px;
              ">
                ★★★★★
              </div>

              <!-- Quote -->
              <p style="
                font-size: 1.125rem;
                color: ${colors.textDark};
                line-height: 1.7;
                margin-bottom: ${spacing.lg};
                font-style: italic;
              ">
                "${testimonial.quote}"
              </p>

              <!-- Author Info -->
              <div style="
                display: flex;
                align-items: center;
                gap: ${spacing.md};
              ">
                <!-- Avatar placeholder -->
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
                  ${testimonial.author.charAt(0)}
                </div>
                <div>
                  <div style="
                    font-weight: 600;
                    color: ${colors.textDark};
                    font-size: 1rem;
                  ">
                    ${testimonial.author}
                  </div>
                  <div style="
                    font-size: 0.875rem;
                    color: ${colors.textGray};
                  ">
                    ${testimonial.role}, ${testimonial.company}
                  </div>
                </div>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    </section>
  `;
};
