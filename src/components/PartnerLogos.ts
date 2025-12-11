import { designSystem } from '../styles/design-system';

const { spacing } = designSystem;

export const PartnerLogos = () => {
  const partners = [
    { name: 'HubSpot', width: '140px' },
    { name: 'Salesforce', width: '160px' },
    { name: 'Mailchimp', width: '150px' },
    { name: 'Intercom', width: '140px' },
    { name: 'Zendesk', width: '150px' }
  ];

  return `
    <section style="
      background: white;
      padding: ${spacing['2xl']} ${spacing.xl};
      border-bottom: 1px solid #e5e7eb;
    ">
      <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        
        <p style="
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: ${spacing.xl};
          font-weight: 500;
        ">
          Trusted by 50,000+ growing businesses
        </p>

        <div style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: ${spacing.xl};
        ">
          ${partners.map(partner => `
            <div style="
              opacity: 0.5;
              transition: opacity 0.3s ease;
              filter: grayscale(100%);
            " onmouseover="this.style.opacity='1'; this.style.filter='grayscale(0%)'" onmouseout="this.style.opacity='0.5'; this.style.filter='grayscale(100%)'">
              <!-- Partner logo placeholder -->
              <div style="
                width: ${partner.width};
                height: 40px;
                background: #e5e7eb;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                color: #6b7280;
                font-weight: 600;
              ">
                ${partner.name}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </section>
  `;
};
