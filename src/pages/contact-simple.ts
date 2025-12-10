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
            <label for="phone">Phone Number *</label>
            <div style="display: flex; gap: 0.5rem;">
              <select id="countryCode" name="countryCode" required style="width: 140px;">
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+61">🇦🇺 +61 (Australia)</option>
                <option value="+86">🇨🇳 +86 (China)</option>
                <option value="+81">🇯🇵 +81 (Japan)</option>
                <option value="+82">🇰🇷 +82 (S. Korea)</option>
                <option value="+49">🇩🇪 +49 (Germany)</option>
                <option value="+33">🇫🇷 +33 (France)</option>
                <option value="+39">🇮🇹 +39 (Italy)</option>
                <option value="+34">🇪🇸 +34 (Spain)</option>
                <option value="+7">🇷🇺 +7 (Russia)</option>
                <option value="+55">🇧🇷 +55 (Brazil)</option>
                <option value="+52">🇲🇽 +52 (Mexico)</option>
                <option value="+27">🇿🇦 +27 (S. Africa)</option>
                <option value="+234">🇳🇬 +234 (Nigeria)</option>
                <option value="+20">🇪🇬 +20 (Egypt)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+966">🇸🇦 +966 (Saudi)</option>
                <option value="+65">🇸🇬 +65 (Singapore)</option>
                <option value="+60">🇲🇾 +60 (Malaysia)</option>
                <option value="+63">🇵🇭 +63 (Philippines)</option>
                <option value="+84">🇻🇳 +84 (Vietnam)</option>
                <option value="+62">🇮🇩 +62 (Indonesia)</option>
                <option value="+92">🇵🇰 +92 (Pakistan)</option>
                <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                <option value="+90">🇹🇷 +90 (Turkey)</option>
                <option value="+351">🇵🇹 +351 (Portugal)</option>
                <option value="+31">🇳🇱 +31 (Netherlands)</option>
                <option value="+46">🇸🇪 +46 (Sweden)</option>
                <option value="+47">🇳🇴 +47 (Norway)</option>
                <option value="+45">🇩🇰 +45 (Denmark)</option>
                <option value="+358">🇫🇮 +358 (Finland)</option>
                <option value="+48">🇵🇱 +48 (Poland)</option>
                <option value="+30">🇬🇷 +30 (Greece)</option>
                <option value="+64">🇳🇿 +64 (New Zealand)</option>
                <option value="+353">🇮🇪 +353 (Ireland)</option>
                <option value="+32">🇧🇪 +32 (Belgium)</option>
                <option value="+41">🇨🇭 +41 (Switzerland)</option>
                <option value="+43">🇦🇹 +43 (Austria)</option>
              </select>
              <input type="tel" id="phone" name="phone" placeholder="Enter phone number" required style="flex: 1;">
            </div>
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
          
          const countryCode = form.countryCode.value;
          const phoneNumber = form.phone.value.trim();
          const fullPhone = phoneNumber ? \`\${countryCode} \${phoneNumber}\` : null;
          
          const data = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: fullPhone,
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
