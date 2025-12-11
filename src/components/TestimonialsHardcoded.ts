/**
 * Testimonials Section - Fully Hardcoded (No Dependencies)
 * This version has ZERO external dependencies to avoid runtime errors
 */

export const TestimonialsHardcoded = () => {
  return `
    <section style="
      background: white;
      padding: 80px 20px;
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- Section Header -->
        <div style="text-align: center; margin-bottom: 60px;">
          <span style="
            color: #683FE9;
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
            color: #1f2937;
            margin-top: 16px;
            margin-bottom: 0;
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
          
          <!-- Testimonial 1: Sarah Chen -->
          <div class="testimonial-card" style="
            background: #f8fafc;
            border-radius: 12px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          ">
            <!-- Stars -->
            <div style="
              color: #fbbf24;
              font-size: 1.25rem;
              margin-bottom: 16px;
              letter-spacing: 2px;
            ">
              ★★★★★
            </div>
            
            <!-- Quote -->
            <p style="
              font-size: 1.125rem;
              color: #1f2937;
              line-height: 1.7;
              margin-bottom: 24px;
              margin-top: 0;
              font-style: italic;
            ">
              "Risivo transformed how we manage our campaigns. We've seen a 200% increase in conversions and cut our marketing time in half."
            </p>
            
            <!-- Author -->
            <div style="display: flex; align-items: center; gap: 16px;">
              <!-- Avatar -->
              <div style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #683FE9;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 1.25rem;
                flex-shrink: 0;
              ">
                S
              </div>
              
              <!-- Info -->
              <div>
                <div style="
                  font-weight: 600;
                  color: #1f2937;
                  font-size: 1rem;
                  margin-bottom: 4px;
                ">
                  Sarah Chen
                </div>
                <div style="
                  font-size: 0.875rem;
                  color: #6b7280;
                ">
                  Marketing Director, TechStart Inc
                </div>
              </div>
            </div>
          </div>

          <!-- Testimonial 2: Michael Rodriguez -->
          <div class="testimonial-card" style="
            background: #f8fafc;
            border-radius: 12px;
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          ">
            <!-- Stars -->
            <div style="
              color: #fbbf24;
              font-size: 1.25rem;
              margin-bottom: 16px;
              letter-spacing: 2px;
            ">
              ★★★★★
            </div>
            
            <!-- Quote -->
            <p style="
              font-size: 1.125rem;
              color: #1f2937;
              line-height: 1.7;
              margin-bottom: 24px;
              margin-top: 0;
              font-style: italic;
            ">
              "The automation features are incredible. What used to take us hours now happens automatically. It's like having an extra team member."
            </p>
            
            <!-- Author -->
            <div style="display: flex; align-items: center; gap: 16px;">
              <!-- Avatar -->
              <div style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #683FE9;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 1.25rem;
                flex-shrink: 0;
              ">
                M
              </div>
              
              <!-- Info -->
              <div>
                <div style="
                  font-weight: 600;
                  color: #1f2937;
                  font-size: 1rem;
                  margin-bottom: 4px;
                ">
                  Michael Rodriguez
                </div>
                <div style="
                  font-size: 0.875rem;
                  color: #6b7280;
                ">
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
