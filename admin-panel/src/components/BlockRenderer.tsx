import { CMSContentBlock } from '../types'

interface BlockRendererProps {
  block: CMSContentBlock
  isPreview?: boolean
}

export function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
  const { block_type, content, settings } = block

  // Apply styles from settings
  const styles = {
    backgroundColor: settings?.backgroundColor || 'transparent',
    color: settings?.textColor || '#000000',
    padding: settings?.padding || '3rem 1rem',
    textAlign: settings?.textAlign || 'center',
    ...(settings?.backgroundImage && {
      backgroundImage: `url(${settings.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  } as React.CSSProperties

  // Render different block types
  switch (block_type) {
    case 'hero':
      return (
        <section style={styles} className="relative min-h-[500px] flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 
              className="font-bold mb-6"
              style={{ 
                fontSize: settings?.titleSize || '3rem',
                color: settings?.titleColor || settings?.textColor || '#000000'
              }}
            >
              {content.title || 'Hero Title'}
            </h1>
            <p 
              className="mb-8"
              style={{ 
                fontSize: settings?.subtitleSize || '1.25rem',
                color: settings?.subtitleColor || settings?.textColor || '#666666'
              }}
            >
              {content.subtitle || 'Hero subtitle goes here'}
            </p>
            {content.buttonText && (
              <a
                href={content.buttonUrl || '#'}
                className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: settings?.buttonColor || '#3B82F6',
                  color: settings?.buttonTextColor || '#FFFFFF',
                  fontSize: settings?.buttonSize || '1rem',
                }}
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </section>
      )

    case 'text':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            {content.title && (
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontSize: settings?.titleSize || '2rem',
                  color: settings?.titleColor || settings?.textColor || '#000000'
                }}
              >
                {content.title}
              </h2>
            )}
            <div 
              className="prose max-w-none"
              style={{ color: settings?.textColor || '#374151' }}
              dangerouslySetInnerHTML={{ __html: content.text || '<p>Add your text content here</p>' }}
            />
          </div>
        </section>
      )

    case 'features':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {content.title && (
              <h2 
                className="font-bold mb-12 text-center"
                style={{ 
                  fontSize: settings?.titleSize || '2.5rem',
                  color: settings?.titleColor || settings?.textColor || '#000000'
                }}
              >
                {content.title}
              </h2>
            )}
            <div 
              className={`grid gap-8`}
              style={{ 
                gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)` 
              }}
            >
              {(content.features || []).map((feature: any, index: number) => (
                <div key={index} className="text-center">
                  {feature.icon && (
                    <div className="mb-4 text-4xl">{feature.icon}</div>
                  )}
                  <h3 
                    className="font-semibold mb-2"
                    style={{ 
                      fontSize: settings?.featureTitleSize || '1.25rem',
                      color: settings?.featureTitleColor || settings?.textColor || '#000000'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: settings?.textColor || '#666666' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'cta':
      return (
        <section style={styles} className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 
              className="font-bold mb-4"
              style={{ 
                fontSize: settings?.titleSize || '2.5rem',
                color: settings?.titleColor || settings?.textColor || '#000000'
              }}
            >
              {content.title || 'Call to Action'}
            </h2>
            {content.subtitle && (
              <p 
                className="mb-8"
                style={{ 
                  fontSize: settings?.subtitleSize || '1.25rem',
                  color: settings?.subtitleColor || settings?.textColor || '#666666'
                }}
              >
                {content.subtitle}
              </p>
            )}
            {content.buttonText && (
              <a
                href={content.buttonUrl || '#'}
                className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: settings?.buttonColor || '#3B82F6',
                  color: settings?.buttonTextColor || '#FFFFFF',
                  fontSize: settings?.buttonSize || '1.125rem',
                }}
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </section>
      )

    case 'image':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {content.imageUrl && (
              <img
                src={content.imageUrl}
                alt={content.alt || 'Image'}
                className="w-full rounded-lg"
                style={{
                  maxWidth: settings?.maxWidth || '100%',
                  margin: '0 auto',
                }}
              />
            )}
            {content.caption && (
              <p 
                className="text-center mt-4"
                style={{ color: settings?.textColor || '#666666' }}
              >
                {content.caption}
              </p>
            )}
          </div>
        </section>
      )

    case 'pricing':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {content.title && (
              <h2 
                className="font-bold mb-12 text-center"
                style={{ 
                  fontSize: settings?.titleSize || '2.5rem',
                  color: settings?.titleColor || settings?.textColor || '#000000'
                }}
              >
                {content.title}
              </h2>
            )}
            <div 
              className="grid gap-8"
              style={{ 
                gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)` 
              }}
            >
              {(content.plans || []).map((plan: any, index: number) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-8"
                  style={{
                    borderColor: settings?.borderColor || '#E5E7EB',
                    backgroundColor: settings?.cardBackground || '#FFFFFF',
                  }}
                >
                  <h3 
                    className="font-bold mb-2"
                    style={{ 
                      fontSize: '1.5rem',
                      color: settings?.textColor || '#000000'
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span 
                      className="text-4xl font-bold"
                      style={{ color: settings?.priceColor || '#3B82F6' }}
                    >
                      {plan.price}
                    </span>
                    <span style={{ color: settings?.textColor || '#666666' }}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {(plan.features || []).map((feature: string, i: number) => (
                      <li key={i} style={{ color: settings?.textColor || '#666666' }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: settings?.buttonColor || '#3B82F6',
                      color: settings?.buttonTextColor || '#FFFFFF',
                    }}
                  >
                    {plan.buttonText || 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'testimonials':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {content.title && (
              <h2 
                className="font-bold mb-12 text-center"
                style={{ 
                  fontSize: settings?.titleSize || '2.5rem',
                  color: settings?.titleColor || settings?.textColor || '#000000'
                }}
              >
                {content.title}
              </h2>
            )}
            <div 
              className="grid gap-8"
              style={{ 
                gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)` 
              }}
            >
              {(content.testimonials || []).map((testimonial: any, index: number) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-6"
                  style={{
                    borderColor: settings?.borderColor || '#E5E7EB',
                    backgroundColor: settings?.cardBackground || '#FFFFFF',
                  }}
                >
                  <p 
                    className="mb-4 italic"
                    style={{ color: settings?.textColor || '#374151' }}
                  >
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <p 
                        className="font-semibold"
                        style={{ color: settings?.textColor || '#000000' }}
                      >
                        {testimonial.name}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: settings?.textColor || '#666666' }}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'faq':
      return (
        <section style={styles} className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            {content.title && (
              <h2 
                className="font-bold mb-12 text-center"
                style={{ 
                  fontSize: settings?.titleSize || '2.5rem',
                  color: settings?.titleColor || settings?.textColor || '#000000'
                }}
              >
                {content.title}
              </h2>
            )}
            <div className="space-y-4">
              {(content.faqs || []).map((faq: any, index: number) => (
                <details 
                  key={index}
                  className="border rounded-lg p-4"
                  style={{
                    borderColor: settings?.borderColor || '#E5E7EB',
                    backgroundColor: settings?.cardBackground || '#FFFFFF',
                  }}
                >
                  <summary 
                    className="font-semibold cursor-pointer"
                    style={{ color: settings?.textColor || '#000000' }}
                  >
                    {faq.question}
                  </summary>
                  <p 
                    className="mt-2"
                    style={{ color: settings?.textColor || '#666666' }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )

    case 'divider':
      return (
        <div style={styles} className="py-8">
          <hr 
            style={{
              borderColor: settings?.dividerColor || '#E5E7EB',
              borderWidth: settings?.dividerWidth || '1px',
              maxWidth: settings?.maxWidth || '100%',
              margin: '0 auto',
            }}
          />
        </div>
      )

    default:
      return (
        <section style={styles} className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
            <p>Block type "{block_type}" not yet supported in preview</p>
          </div>
        </section>
      )
  }
}
