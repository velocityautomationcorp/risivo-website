// Simple Contact Page - No complex imports
export const ContactPageSimple = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Us - Risivo</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f9fafb;
          padding: 2rem;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #683FE9; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1.5rem; }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        textarea { min-height: 120px; resize: vertical; }
        button {
          width: 100%;
          padding: 1rem;
          background: #683FE9;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover { background: #5a35c7; }
        button:disabled { background: #9ca3af; cursor: not-allowed; }
        .message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: none;
        }
        .message.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
          display: block;
        }
        .message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
          display: block;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 1rem;
          color: #683FE9;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="/" class="back-link">← Back to Home</a>
        <h1>Contact Us</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">Send us a message and we'll respond as soon as possible.</p>
        
        <div id="formMessage" class="message"></div>
        
        <form id="contactForm">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input type="text" id="firstName" name="firstName" required>
          </div>
          
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input type="text" id="lastName" name="lastName" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone (Optional)</label>
            <input type="tel" id="phone" name="phone">
          </div>
          
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          
          <button type="submit" id="submitBtn">Send Message</button>
        </form>
      </div>
      
      <script>
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('formMessage');
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
          messageDiv.style.display = 'none';
          
          const data = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value || null,
            message: form.message.value,
            source: 'contact_page'
          };
          
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
              messageDiv.textContent = result.message || "Thank you! We'll be in touch soon.";
              messageDiv.className = 'message success';
              form.reset();
            } else {
              throw new Error(result.error || 'Failed to send message');
            }
          } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = error.message || 'Failed to send message. Please try again.';
            messageDiv.className = 'message error';
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        });
      </script>
    </body>
    </html>
  `
}
