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
        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        select {
          background: white;
          cursor: pointer;
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
            <div style="display: flex; gap: 0.75rem; align-items: stretch;">
              <select id="countryCode" name="countryCode" required style="width: 180px; font-size: 0.95rem; padding: 0.75rem 0.5rem;">
                <option value="+1">🇺🇸 United States (+1)</option>
                <option value="+44">🇬🇧 United Kingdom (+44)</option>
                <option value="+213">🇩🇿 Algeria (+213)</option>
                <option value="+376">🇦🇩 Andorra (+376)</option>
                <option value="+244">🇦🇴 Angola (+244)</option>
                <option value="+54">🇦🇷 Argentina (+54)</option>
                <option value="+374">🇦🇲 Armenia (+374)</option>
                <option value="+61">🇦🇺 Australia (+61)</option>
                <option value="+43">🇦🇹 Austria (+43)</option>
                <option value="+994">🇦🇿 Azerbaijan (+994)</option>
                <option value="+973">🇧🇭 Bahrain (+973)</option>
                <option value="+880">🇧🇩 Bangladesh (+880)</option>
                <option value="+375">🇧🇾 Belarus (+375)</option>
                <option value="+32">🇧🇪 Belgium (+32)</option>
                <option value="+501">🇧🇿 Belize (+501)</option>
                <option value="+229">🇧🇯 Benin (+229)</option>
                <option value="+975">🇧🇹 Bhutan (+975)</option>
                <option value="+591">🇧🇴 Bolivia (+591)</option>
                <option value="+387">🇧🇦 Bosnia (+387)</option>
                <option value="+267">🇧🇼 Botswana (+267)</option>
                <option value="+55">🇧🇷 Brazil (+55)</option>
                <option value="+673">🇧🇳 Brunei (+673)</option>
                <option value="+359">🇧🇬 Bulgaria (+359)</option>
                <option value="+226">🇧🇫 Burkina Faso (+226)</option>
                <option value="+257">🇧🇮 Burundi (+257)</option>
                <option value="+855">🇰🇭 Cambodia (+855)</option>
                <option value="+237">🇨🇲 Cameroon (+237)</option>
                <option value="+1">🇨🇦 Canada (+1)</option>
                <option value="+238">🇨🇻 Cape Verde (+238)</option>
                <option value="+236">🇨🇫 Central African Rep (+236)</option>
                <option value="+235">🇹🇩 Chad (+235)</option>
                <option value="+56">🇨🇱 Chile (+56)</option>
                <option value="+86">🇨🇳 China (+86)</option>
                <option value="+57">🇨🇴 Colombia (+57)</option>
                <option value="+269">🇰🇲 Comoros (+269)</option>
                <option value="+242">🇨🇬 Congo (+242)</option>
                <option value="+506">🇨🇷 Costa Rica (+506)</option>
                <option value="+385">🇭🇷 Croatia (+385)</option>
                <option value="+53">🇨🇺 Cuba (+53)</option>
                <option value="+357">🇨🇾 Cyprus (+357)</option>
                <option value="+420">🇨🇿 Czech Republic (+420)</option>
                <option value="+45">🇩🇰 Denmark (+45)</option>
                <option value="+253">🇩🇯 Djibouti (+253)</option>
                <option value="+593">🇪🇨 Ecuador (+593)</option>
                <option value="+20">🇪🇬 Egypt (+20)</option>
                <option value="+503">🇸🇻 El Salvador (+503)</option>
                <option value="+240">🇬🇶 Equatorial Guinea (+240)</option>
                <option value="+291">🇪🇷 Eritrea (+291)</option>
                <option value="+372">🇪🇪 Estonia (+372)</option>
                <option value="+251">🇪🇹 Ethiopia (+251)</option>
                <option value="+679">🇫🇯 Fiji (+679)</option>
                <option value="+358">🇫🇮 Finland (+358)</option>
                <option value="+33">🇫🇷 France (+33)</option>
                <option value="+241">🇬🇦 Gabon (+241)</option>
                <option value="+220">🇬🇲 Gambia (+220)</option>
                <option value="+995">🇬🇪 Georgia (+995)</option>
                <option value="+49">🇩🇪 Germany (+49)</option>
                <option value="+233">🇬🇭 Ghana (+233)</option>
                <option value="+30">🇬🇷 Greece (+30)</option>
                <option value="+502">🇬🇹 Guatemala (+502)</option>
                <option value="+224">🇬🇳 Guinea (+224)</option>
                <option value="+245">🇬🇼 Guinea-Bissau (+245)</option>
                <option value="+509">🇭🇹 Haiti (+509)</option>
                <option value="+504">🇭🇳 Honduras (+504)</option>
                <option value="+852">🇭🇰 Hong Kong (+852)</option>
                <option value="+36">🇭🇺 Hungary (+36)</option>
                <option value="+354">🇮🇸 Iceland (+354)</option>
                <option value="+91">🇮🇳 India (+91)</option>
                <option value="+62">🇮🇩 Indonesia (+62)</option>
                <option value="+98">🇮🇷 Iran (+98)</option>
                <option value="+964">🇮🇶 Iraq (+964)</option>
                <option value="+353">🇮🇪 Ireland (+353)</option>
                <option value="+972">🇮🇱 Israel (+972)</option>
                <option value="+39">🇮🇹 Italy (+39)</option>
                <option value="+225">🇨🇮 Ivory Coast (+225)</option>
                <option value="+81">🇯🇵 Japan (+81)</option>
                <option value="+962">🇯🇴 Jordan (+962)</option>
                <option value="+7">🇰🇿 Kazakhstan (+7)</option>
                <option value="+254">🇰🇪 Kenya (+254)</option>
                <option value="+965">🇰🇼 Kuwait (+965)</option>
                <option value="+996">🇰🇬 Kyrgyzstan (+996)</option>
                <option value="+856">🇱🇦 Laos (+856)</option>
                <option value="+371">🇱🇻 Latvia (+371)</option>
                <option value="+961">🇱🇧 Lebanon (+961)</option>
                <option value="+266">🇱🇸 Lesotho (+266)</option>
                <option value="+231">🇱🇷 Liberia (+231)</option>
                <option value="+218">🇱🇾 Libya (+218)</option>
                <option value="+423">🇱🇮 Liechtenstein (+423)</option>
                <option value="+370">🇱🇹 Lithuania (+370)</option>
                <option value="+352">🇱🇺 Luxembourg (+352)</option>
                <option value="+853">🇲🇴 Macau (+853)</option>
                <option value="+389">🇲🇰 Macedonia (+389)</option>
                <option value="+261">🇲🇬 Madagascar (+261)</option>
                <option value="+265">🇲🇼 Malawi (+265)</option>
                <option value="+60">🇲🇾 Malaysia (+60)</option>
                <option value="+960">🇲🇻 Maldives (+960)</option>
                <option value="+223">🇲🇱 Mali (+223)</option>
                <option value="+356">🇲🇹 Malta (+356)</option>
                <option value="+222">🇲🇷 Mauritania (+222)</option>
                <option value="+230">🇲🇺 Mauritius (+230)</option>
                <option value="+52">🇲🇽 Mexico (+52)</option>
                <option value="+373">🇲🇩 Moldova (+373)</option>
                <option value="+377">🇲🇨 Monaco (+377)</option>
                <option value="+976">🇲🇳 Mongolia (+976)</option>
                <option value="+382">🇲🇪 Montenegro (+382)</option>
                <option value="+212">🇲🇦 Morocco (+212)</option>
                <option value="+258">🇲🇿 Mozambique (+258)</option>
                <option value="+95">🇲🇲 Myanmar (+95)</option>
                <option value="+264">🇳🇦 Namibia (+264)</option>
                <option value="+977">🇳🇵 Nepal (+977)</option>
                <option value="+31">🇳🇱 Netherlands (+31)</option>
                <option value="+64">🇳🇿 New Zealand (+64)</option>
                <option value="+505">🇳🇮 Nicaragua (+505)</option>
                <option value="+227">🇳🇪 Niger (+227)</option>
                <option value="+234">🇳🇬 Nigeria (+234)</option>
                <option value="+850">🇰🇵 North Korea (+850)</option>
                <option value="+47">🇳🇴 Norway (+47)</option>
                <option value="+968">🇴🇲 Oman (+968)</option>
                <option value="+92">🇵🇰 Pakistan (+92)</option>
                <option value="+970">🇵🇸 Palestine (+970)</option>
                <option value="+507">🇵🇦 Panama (+507)</option>
                <option value="+675">🇵🇬 Papua New Guinea (+675)</option>
                <option value="+595">🇵🇾 Paraguay (+595)</option>
                <option value="+51">🇵🇪 Peru (+51)</option>
                <option value="+63">🇵🇭 Philippines (+63)</option>
                <option value="+48">🇵🇱 Poland (+48)</option>
                <option value="+351">🇵🇹 Portugal (+351)</option>
                <option value="+974">🇶🇦 Qatar (+974)</option>
                <option value="+40">🇷🇴 Romania (+40)</option>
                <option value="+7">🇷🇺 Russia (+7)</option>
                <option value="+250">🇷🇼 Rwanda (+250)</option>
                <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                <option value="+221">🇸🇳 Senegal (+221)</option>
                <option value="+381">🇷🇸 Serbia (+381)</option>
                <option value="+248">🇸🇨 Seychelles (+248)</option>
                <option value="+232">🇸🇱 Sierra Leone (+232)</option>
                <option value="+65">🇸🇬 Singapore (+65)</option>
                <option value="+421">🇸🇰 Slovakia (+421)</option>
                <option value="+386">🇸🇮 Slovenia (+386)</option>
                <option value="+252">🇸🇴 Somalia (+252)</option>
                <option value="+27">🇿🇦 South Africa (+27)</option>
                <option value="+82">🇰🇷 South Korea (+82)</option>
                <option value="+211">🇸🇸 South Sudan (+211)</option>
                <option value="+34">🇪🇸 Spain (+34)</option>
                <option value="+94">🇱🇰 Sri Lanka (+94)</option>
                <option value="+249">🇸🇩 Sudan (+249)</option>
                <option value="+597">🇸🇷 Suriname (+597)</option>
                <option value="+268">🇸🇿 Swaziland (+268)</option>
                <option value="+46">🇸🇪 Sweden (+46)</option>
                <option value="+41">🇨🇭 Switzerland (+41)</option>
                <option value="+963">🇸🇾 Syria (+963)</option>
                <option value="+886">🇹🇼 Taiwan (+886)</option>
                <option value="+992">🇹🇯 Tajikistan (+992)</option>
                <option value="+255">🇹🇿 Tanzania (+255)</option>
                <option value="+66">🇹🇭 Thailand (+66)</option>
                <option value="+228">🇹🇬 Togo (+228)</option>
                <option value="+216">🇹🇳 Tunisia (+216)</option>
                <option value="+90">🇹🇷 Turkey (+90)</option>
                <option value="+993">🇹🇲 Turkmenistan (+993)</option>
                <option value="+256">🇺🇬 Uganda (+256)</option>
                <option value="+380">🇺🇦 Ukraine (+380)</option>
                <option value="+971">🇦🇪 UAE (+971)</option>
                <option value="+598">🇺🇾 Uruguay (+598)</option>
                <option value="+998">🇺🇿 Uzbekistan (+998)</option>
                <option value="+58">🇻🇪 Venezuela (+58)</option>
                <option value="+84">🇻🇳 Vietnam (+84)</option>
                <option value="+967">🇾🇪 Yemen (+967)</option>
                <option value="+260">🇿🇲 Zambia (+260)</option>
                <option value="+263">🇿🇼 Zimbabwe (+263)</option>
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
            console.log('Submitting form data:', data);
            
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);
            
            if (response.ok && result.success) {
              messageDiv.textContent = result.message || "Thank you! We'll be in touch soon.";
              messageDiv.className = 'message success';
              form.reset();
            } else {
              throw new Error(result.error || 'Failed to send message');
            }
          } catch (error) {
            console.error('Submission error:', error);
            messageDiv.textContent = 'Error: ' + (error.message || 'Failed to send message. Please try again.');
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
