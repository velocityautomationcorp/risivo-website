// Newsletter Form Component
// Submits to /api/newsletter endpoint
import { designSystem } from '../styles/design-system'

interface NewsletterFormProps {
  source?: string
  title?: string
  description?: string
  inline?: boolean
}

export const NewsletterForm = (props: NewsletterFormProps = {}) => {
  const {
    source = 'website',
    title = 'Stay Updated',
    description = 'Subscribe to our newsletter for the latest updates and insights.',
    inline = false
  } = props

  const layoutClass = inline ? 'newsletter-inline' : 'newsletter-stacked'

  return `
    <style>
      .newsletter-container {
        background: linear-gradient(135deg, ${designSystem.colors.primary} 0%, #5a35c7 100%);
        padding: 2rem;
        border-radius: 12px;
        color: white;
      }

      .newsletter-container h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .newsletter-container p {
        opacity: 0.9;
        margin-bottom: 1.5rem;
      }

      .newsletter-form {
        display: flex;
        gap: 0.75rem;
      }

      .newsletter-stacked .newsletter-form {
        flex-direction: column;
      }

      .newsletter-inline .newsletter-form {
        flex-direction: row;
      }

      .newsletter-input {
        flex: 1;
        padding: 0.875rem 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transition: all 0.2s;
      }

      .newsletter-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .newsletter-input:focus {
        outline: none;
        border-color: white;
        background: rgba(255, 255, 255, 0.15);
      }

      .newsletter-button {
        padding: 0.875rem 2rem;
        background: white;
        color: ${designSystem.colors.primary};
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .newsletter-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .newsletter-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .newsletter-message {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 500;
      }

      .newsletter-message.success {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.5);
      }

      .newsletter-message.error {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.5);
      }

      .newsletter-message.hidden {
        display: none;
      }

      @media (max-width: 768px) {
        .newsletter-inline .newsletter-form {
          flex-direction: column;
        }

        .newsletter-container {
          padding: 1.5rem;
        }

        .newsletter-container h3 {
          font-size: 1.25rem;
        }
      }
    </style>

    <div class="newsletter-container ${layoutClass}">
      <h3>${title}</h3>
      <p>${description}</p>

      <form class="newsletter-form" id="newsletterForm-${source}">
        <input 
          type="email" 
          class="newsletter-input" 
          placeholder="Enter your email" 
          name="email"
          required
          id="newsletterEmail-${source}"
        />
        <button 
          type="submit" 
          class="newsletter-button"
          id="newsletterButton-${source}"
        >
          Subscribe
        </button>
      </form>

      <div id="newsletterMessage-${source}" class="newsletter-message hidden"></div>
    </div>

    <script>
      (function() {
        const form = document.getElementById('newsletterForm-${source}');
        const button = document.getElementById('newsletterButton-${source}');
        const messageDiv = document.getElementById('newsletterMessage-${source}');
        const emailInput = document.getElementById('newsletterEmail-${source}');

        if (!form || !button || !messageDiv || !emailInput) return;

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          // Disable button
          button.disabled = true;
          button.textContent = 'Subscribing...';

          // Hide previous messages
          messageDiv.classList.add('hidden');

          const email = emailInput.value.trim();

          try {
            const response = await fetch('/api/newsletter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                source: '${source}'
              })
            });

            const result = await response.json();

            if (response.ok && result.success) {
              // Success!
              messageDiv.textContent = result.message || "You're subscribed! Check your email.";
              messageDiv.className = 'newsletter-message success';
              messageDiv.classList.remove('hidden');

              // Reset form
              form.reset();
            } else {
              // Error from API
              throw new Error(result.error || 'Failed to subscribe');
            }

          } catch (error) {
            console.error('Newsletter subscription error:', error);
            messageDiv.textContent = error.message || 'Failed to subscribe. Please try again.';
            messageDiv.className = 'newsletter-message error';
            messageDiv.classList.remove('hidden');
          } finally {
            // Re-enable button
            button.disabled = false;
            button.textContent = 'Subscribe';
          }
        });
      })();
    </script>
  `
}
