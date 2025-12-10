// Contact Form Component
// Submits to /api/contact endpoint
import { designSystem } from '../styles/design-system'

export const ContactForm = () => {
  return `
    <style>
      .contact-form-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
      }

      .contact-form {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .contact-form h2 {
        font-size: 2rem;
        font-weight: 700;
        color: ${designSystem.colors.text.primary};
        margin-bottom: 0.5rem;
      }

      .contact-form p {
        color: ${designSystem.colors.text.secondary};
        margin-bottom: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        font-weight: 600;
        color: ${designSystem.colors.text.primary};
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.2s;
        box-sizing: border-box;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: ${designSystem.colors.primary};
        box-shadow: 0 0 0 3px rgba(104, 63, 233, 0.1);
      }

      .form-textarea {
        min-height: 120px;
        resize: vertical;
        font-family: inherit;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .submit-button {
        width: 100%;
        padding: 1rem;
        background: ${designSystem.colors.primary};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .submit-button:hover {
        background: #5a35c7;
        transform: translateY(-1px);
      }

      .submit-button:disabled {
        background: #9CA3AF;
        cursor: not-allowed;
        transform: none;
      }

      .form-message {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-weight: 500;
      }

      .form-message.success {
        background: #D1FAE5;
        color: #065F46;
        border: 1px solid #10B981;
      }

      .form-message.error {
        background: #FEE2E2;
        color: #991B1B;
        border: 1px solid #EF4444;
      }

      .form-message.hidden {
        display: none;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .contact-form-container {
          padding: 1rem;
        }

        .contact-form {
          padding: 1.5rem;
        }

        .contact-form h2 {
          font-size: 1.5rem;
        }
      }
    </style>

    <div class="contact-form-container">
      <form class="contact-form" id="contactForm">
        <h2>Get in Touch</h2>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div id="formMessage" class="form-message hidden"></div>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name *</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              class="form-input" 
              required 
              placeholder="John"
            />
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name *</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              class="form-input" 
              required 
              placeholder="Doe"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            class="form-input" 
            required 
            placeholder="john@example.com"
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Phone Number (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            class="form-input" 
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div class="form-group">
          <label for="message" class="form-label">Message *</label>
          <textarea 
            id="message" 
            name="message" 
            class="form-textarea" 
            required 
            placeholder="Tell us about your project or how we can help..."
          ></textarea>
        </div>

        <button type="submit" class="submit-button" id="submitButton">
          Send Message
        </button>
      </form>
    </div>

    <script>
      (function() {
        const form = document.getElementById('contactForm');
        const submitButton = document.getElementById('submitButton');
        const messageDiv = document.getElementById('formMessage');

        if (!form || !submitButton || !messageDiv) return;

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          // Disable submit button
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';

          // Hide previous messages
          messageDiv.classList.add('hidden');

          // Get form data
          const formData = new FormData(form);
          const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || null,
            message: formData.get('message'),
            source: 'contact_page'
          };

          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
              // Success!
              messageDiv.textContent = result.message || "Thank you! We'll be in touch soon.";
              messageDiv.className = 'form-message success';
              messageDiv.classList.remove('hidden');

              // Reset form
              form.reset();

              // Scroll to message
              messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              // Error from API
              throw new Error(result.error || 'Failed to send message');
            }

          } catch (error) {
            console.error('Contact form error:', error);
            messageDiv.textContent = error.message || 'Failed to send message. Please try again.';
            messageDiv.className = 'form-message error';
            messageDiv.classList.remove('hidden');
          } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
          }
        });
      })();
    </script>
  `
}
