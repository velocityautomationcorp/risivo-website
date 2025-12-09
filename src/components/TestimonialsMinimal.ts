/**
 * Minimal Testimonials - Just text, no styling complexity
 */

export const TestimonialsMinimal = () => {
  return `
    <section style="background: white; padding: 80px 20px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2.5rem; color: #683FE9; margin-bottom: 40px;">
          SUCCESS STORIES
        </h2>
        
        <div style="display: flex; gap: 32px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 300px; background: #f8fafc; padding: 32px; border-radius: 12px;">
            <p style="font-size: 1.5rem; margin-bottom: 16px;">⭐⭐⭐⭐⭐</p>
            <p style="font-size: 1.125rem; margin-bottom: 24px; font-style: italic;">
              "Risivo transformed how we manage our campaigns. We've seen a 200% increase in conversions."
            </p>
            <p style="font-weight: 600;">Sarah Chen</p>
            <p style="color: #6b7280;">Marketing Director, TechStart Inc</p>
          </div>
          
          <div style="flex: 1; min-width: 300px; background: #f8fafc; padding: 32px; border-radius: 12px;">
            <p style="font-size: 1.5rem; margin-bottom: 16px;">⭐⭐⭐⭐⭐</p>
            <p style="font-size: 1.125rem; margin-bottom: 24px; font-style: italic;">
              "The automation features are incredible. What used to take hours now happens automatically."
            </p>
            <p style="font-weight: 600;">Michael Rodriguez</p>
            <p style="color: #6b7280;">CEO, GrowthLabs</p>
          </div>
        </div>
      </div>
    </section>
  `;
};
