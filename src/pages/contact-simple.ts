// Contact Page with Header/Footer Layout - 2 Column Design
import { BaseLayout } from '../layouts/BaseLayout'
import { designSystem } from '../styles/design-system'

const { colors, spacing } = designSystem

export const ContactPageSimple = () => {
  const content = `
    <style>
      .contact-page {
        background: #f9fafb;
        padding: ${spacing['3xl']} ${spacing.lg};
        min-height: calc(100vh - 72px);
      }

      .contact-wrapper {
        max-width: 1280px;
        margin: 0 auto;
      }

      .contact-header {
        text-align: center;
        margin-bottom: ${spacing['3xl']};
      }

      .contact-header h1 {
        color: ${colors.primary};
        font-size: 2.5rem;
        margin-bottom: ${spacing.md};
      }

      .contact-header p {
        color: ${colors.darkGray};
        font-size: 1.125rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: ${spacing['2xl']};
        align-items: start;
      }

      /* Left Column - Contact Info */
      .contact-info {
        background: white;
        padding: ${spacing['2xl']};
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        position: sticky;
        top: 100px;
      }

      .contact-info h2 {
        color: ${colors.primary};
        font-size: 1.75rem;
        margin-bottom: ${spacing.lg};
      }

      .contact-info-text {
        color: ${colors.darkGray};
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: ${spacing['2xl']};
      }

      .contact-details {
        margin-bottom: ${spacing['2xl']};
      }

      .contact-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: ${spacing.lg};
        gap: ${spacing.md};
      }

      .contact-icon {
        width: 40px;
        height: 40px;
        background: ${colors.primary};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .contact-item-content h3 {
        font-size: 0.875rem;
        color: ${colors.darkGray};
        font-weight: 600;
        margin-bottom: ${spacing.xs};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .contact-item-content p {
        color: ${colors.black};
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0;
        line-height: 1.5;
      }

      .contact-item-content a {
        color: ${colors.primary};
        text-decoration: none;
        transition: color 0.2s;
      }

      .contact-item-content a:hover {
        color: ${colors.primaryDark};
        text-decoration: underline;
      }

      .map-container {
        width: 100%;
        height: 300px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .map-container iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }

      /* Right Column - Form */
      .contact-form-container {
        background: white;
        padding: ${spacing['2xl']};
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .form-group {
        margin-bottom: ${spacing.lg};
      }

      .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: ${spacing.sm};
        color: ${colors.darkGray};
      }

      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: ${spacing.md};
        border: 2px solid ${colors.lightGray};
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
      }

      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        outline: none;
        border-color: ${colors.primary};
      }

      .form-group select {
        background: white;
        cursor: pointer;
      }

      .form-group textarea {
        min-height: 120px;
        resize: vertical;
      }

      .phone-group {
        display: flex;
        gap: ${spacing.md};
      }

      .country-code {
        flex: 0 0 220px;
      }

      .phone-input {
        flex: 1;
      }

      .submit-btn {
        width: 100%;
        padding: ${spacing.lg};
        background: ${colors.primary};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.125rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .submit-btn:hover {
        background: ${colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(104, 63, 233, 0.3);
      }

      .submit-btn:disabled {
        background: ${colors.lightGray};
        cursor: not-allowed;
        transform: none;
      }

      .message {
        padding: ${spacing.lg};
        border-radius: 8px;
        margin-bottom: ${spacing.lg};
        display: none;
      }

      .message.success {
        background: #d1fae5;
        color: #065f46;
        border: 2px solid #10b981;
        display: block;
      }

      .message.error {
        background: #fee2e2;
        color: #991b1b;
        border: 2px solid #ef4444;
        display: block;
      }

      @media (max-width: 1024px) {
        .contact-grid {
          grid-template-columns: 1fr;
          gap: ${spacing.xl};
        }

        .contact-info {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .contact-page {
          padding: ${spacing.xl} ${spacing.md};
        }

        .contact-header h1 {
          font-size: 2rem;
        }

        .contact-info,
        .contact-form-container {
          padding: ${spacing.xl};
        }

        .phone-group {
          flex-direction: column;
        }

        .country-code {
          flex: 1;
        }

        .map-container {
          height: 250px;
        }
      }
    </style>

    <div class="contact-page">
      <div class="contact-wrapper">
        <div class="contact-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div class="contact-grid">
          <!-- Left Column: Contact Information -->
          <div class="contact-info">
            <h2>Contact Information</h2>
            <p class="contact-info-text">
              Risivo CRM is proudly developed and operated by Velocity Automation Corp. 
              Have questions? We'd love to hear from you.
            </p>

            <div class="contact-details">
              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <div class="contact-item-content">
                  <h3>Phone</h3>
                  <p><a href="tel:+18885607947">+1 888-560-7947</a></p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <div class="contact-item-content">
                  <h3>Address</h3>
                  <p>
                    1111B S Governors Ave<br>
                    STE 40280<br>
                    Dover, DE 19904
                  </p>
                </div>
              </div>
            </div>

            <!-- Google Map -->
            <div class="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3085.8547424772855!2d-75.52080492426895!3d39.15857413246445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c7652f3f3f3f3f%3A0x3f3f3f3f3f3f3f3f!2s1111%20S%20Governors%20Ave%2C%20Dover%2C%20DE%2019904!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <!-- Right Column: Contact Form -->
          <div class="contact-form-container">
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
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" required>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <div class="phone-group">
                  <select id="countryCode" name="countryCode" required class="country-code">
                    <option value="+1">US - United States (+1)</option>
                    <option value="+1">CA - Canada (+1)</option>
                    <option value="+44">UK - United Kingdom (+44)</option>
                    <option value="+93">AF - Afghanistan (+93)</option>
                    <option value="+355">AL - Albania (+355)</option>
                    <option value="+213">DZ - Algeria (+213)</option>
                    <option value="+376">AD - Andorra (+376)</option>
                    <option value="+244">AO - Angola (+244)</option>
                    <option value="+54">AR - Argentina (+54)</option>
                    <option value="+374">AM - Armenia (+374)</option>
                    <option value="+61">AU - Australia (+61)</option>
                    <option value="+43">AT - Austria (+43)</option>
                    <option value="+994">AZ - Azerbaijan (+994)</option>
                    <option value="+973">BH - Bahrain (+973)</option>
                    <option value="+880">BD - Bangladesh (+880)</option>
                    <option value="+375">BY - Belarus (+375)</option>
                    <option value="+32">BE - Belgium (+32)</option>
                    <option value="+501">BZ - Belize (+501)</option>
                    <option value="+229">BJ - Benin (+229)</option>
                    <option value="+975">BT - Bhutan (+975)</option>
                    <option value="+591">BO - Bolivia (+591)</option>
                    <option value="+387">BA - Bosnia & Herzegovina (+387)</option>
                    <option value="+267">BW - Botswana (+267)</option>
                    <option value="+55">BR - Brazil (+55)</option>
                    <option value="+673">BN - Brunei (+673)</option>
                    <option value="+359">BG - Bulgaria (+359)</option>
                    <option value="+226">BF - Burkina Faso (+226)</option>
                    <option value="+257">BI - Burundi (+257)</option>
                    <option value="+855">KH - Cambodia (+855)</option>
                    <option value="+237">CM - Cameroon (+237)</option>
                    <option value="+238">CV - Cape Verde (+238)</option>
                    <option value="+236">CF - Central African Rep (+236)</option>
                    <option value="+235">TD - Chad (+235)</option>
                    <option value="+56">CL - Chile (+56)</option>
                    <option value="+86">CN - China (+86)</option>
                    <option value="+57">CO - Colombia (+57)</option>
                    <option value="+269">KM - Comoros (+269)</option>
                    <option value="+242">CG - Congo (+242)</option>
                    <option value="+506">CR - Costa Rica (+506)</option>
                    <option value="+385">HR - Croatia (+385)</option>
                    <option value="+53">CU - Cuba (+53)</option>
                    <option value="+357">CY - Cyprus (+357)</option>
                    <option value="+420">CZ - Czech Republic (+420)</option>
                    <option value="+45">DK - Denmark (+45)</option>
                    <option value="+253">DJ - Djibouti (+253)</option>
                    <option value="+593">EC - Ecuador (+593)</option>
                    <option value="+20">EG - Egypt (+20)</option>
                    <option value="+503">SV - El Salvador (+503)</option>
                    <option value="+240">GQ - Equatorial Guinea (+240)</option>
                    <option value="+291">ER - Eritrea (+291)</option>
                    <option value="+372">EE - Estonia (+372)</option>
                    <option value="+251">ET - Ethiopia (+251)</option>
                    <option value="+679">FJ - Fiji (+679)</option>
                    <option value="+358">FI - Finland (+358)</option>
                    <option value="+33">FR - France (+33)</option>
                    <option value="+241">GA - Gabon (+241)</option>
                    <option value="+220">GM - Gambia (+220)</option>
                    <option value="+995">GE - Georgia (+995)</option>
                    <option value="+49">DE - Germany (+49)</option>
                    <option value="+233">GH - Ghana (+233)</option>
                    <option value="+30">GR - Greece (+30)</option>
                    <option value="+502">GT - Guatemala (+502)</option>
                    <option value="+224">GN - Guinea (+224)</option>
                    <option value="+245">GW - Guinea-Bissau (+245)</option>
                    <option value="+509">HT - Haiti (+509)</option>
                    <option value="+504">HN - Honduras (+504)</option>
                    <option value="+852">HK - Hong Kong (+852)</option>
                    <option value="+36">HU - Hungary (+36)</option>
                    <option value="+354">IS - Iceland (+354)</option>
                    <option value="+91">IN - India (+91)</option>
                    <option value="+62">ID - Indonesia (+62)</option>
                    <option value="+98">IR - Iran (+98)</option>
                    <option value="+964">IQ - Iraq (+964)</option>
                    <option value="+353">IE - Ireland (+353)</option>
                    <option value="+972">IL - Israel (+972)</option>
                    <option value="+39">IT - Italy (+39)</option>
                    <option value="+225">CI - Ivory Coast (+225)</option>
                    <option value="+81">JP - Japan (+81)</option>
                    <option value="+962">JO - Jordan (+962)</option>
                    <option value="+7">KZ - Kazakhstan (+7)</option>
                    <option value="+254">KE - Kenya (+254)</option>
                    <option value="+965">KW - Kuwait (+965)</option>
                    <option value="+996">KG - Kyrgyzstan (+996)</option>
                    <option value="+856">LA - Laos (+856)</option>
                    <option value="+371">LV - Latvia (+371)</option>
                    <option value="+961">LB - Lebanon (+961)</option>
                    <option value="+266">LS - Lesotho (+266)</option>
                    <option value="+231">LR - Liberia (+231)</option>
                    <option value="+218">LY - Libya (+218)</option>
                    <option value="+423">LI - Liechtenstein (+423)</option>
                    <option value="+370">LT - Lithuania (+370)</option>
                    <option value="+352">LU - Luxembourg (+352)</option>
                    <option value="+853">MO - Macau (+853)</option>
                    <option value="+389">MK - Macedonia (+389)</option>
                    <option value="+261">MG - Madagascar (+261)</option>
                    <option value="+265">MW - Malawi (+265)</option>
                    <option value="+60">MY - Malaysia (+60)</option>
                    <option value="+960">MV - Maldives (+960)</option>
                    <option value="+223">ML - Mali (+223)</option>
                    <option value="+356">MT - Malta (+356)</option>
                    <option value="+222">MR - Mauritania (+222)</option>
                    <option value="+230">MU - Mauritius (+230)</option>
                    <option value="+52">MX - Mexico (+52)</option>
                    <option value="+373">MD - Moldova (+373)</option>
                    <option value="+377">MC - Monaco (+377)</option>
                    <option value="+976">MN - Mongolia (+976)</option>
                    <option value="+382">ME - Montenegro (+382)</option>
                    <option value="+212">MA - Morocco (+212)</option>
                    <option value="+258">MZ - Mozambique (+258)</option>
                    <option value="+95">MM - Myanmar (+95)</option>
                    <option value="+264">NA - Namibia (+264)</option>
                    <option value="+977">NP - Nepal (+977)</option>
                    <option value="+31">NL - Netherlands (+31)</option>
                    <option value="+64">NZ - New Zealand (+64)</option>
                    <option value="+505">NI - Nicaragua (+505)</option>
                    <option value="+227">NE - Niger (+227)</option>
                    <option value="+234">NG - Nigeria (+234)</option>
                    <option value="+850">KP - North Korea (+850)</option>
                    <option value="+47">NO - Norway (+47)</option>
                    <option value="+968">OM - Oman (+968)</option>
                    <option value="+92">PK - Pakistan (+92)</option>
                    <option value="+970">PS - Palestine (+970)</option>
                    <option value="+507">PA - Panama (+507)</option>
                    <option value="+675">PG - Papua New Guinea (+675)</option>
                    <option value="+595">PY - Paraguay (+595)</option>
                    <option value="+51">PE - Peru (+51)</option>
                    <option value="+63">PH - Philippines (+63)</option>
                    <option value="+48">PL - Poland (+48)</option>
                    <option value="+351">PT - Portugal (+351)</option>
                    <option value="+974">QA - Qatar (+974)</option>
                    <option value="+40">RO - Romania (+40)</option>
                    <option value="+7">RU - Russia (+7)</option>
                    <option value="+250">RW - Rwanda (+250)</option>
                    <option value="+966">SA - Saudi Arabia (+966)</option>
                    <option value="+221">SN - Senegal (+221)</option>
                    <option value="+381">RS - Serbia (+381)</option>
                    <option value="+248">SC - Seychelles (+248)</option>
                    <option value="+232">SL - Sierra Leone (+232)</option>
                    <option value="+65">SG - Singapore (+65)</option>
                    <option value="+421">SK - Slovakia (+421)</option>
                    <option value="+386">SI - Slovenia (+386)</option>
                    <option value="+252">SO - Somalia (+252)</option>
                    <option value="+27">ZA - South Africa (+27)</option>
                    <option value="+82">KR - South Korea (+82)</option>
                    <option value="+211">SS - South Sudan (+211)</option>
                    <option value="+34">ES - Spain (+34)</option>
                    <option value="+94">LK - Sri Lanka (+94)</option>
                    <option value="+249">SD - Sudan (+249)</option>
                    <option value="+597">SR - Suriname (+597)</option>
                    <option value="+268">SZ - Swaziland (+268)</option>
                    <option value="+46">SE - Sweden (+46)</option>
                    <option value="+41">CH - Switzerland (+41)</option>
                    <option value="+963">SY - Syria (+963)</option>
                    <option value="+886">TW - Taiwan (+886)</option>
                    <option value="+992">TJ - Tajikistan (+992)</option>
                    <option value="+255">TZ - Tanzania (+255)</option>
                    <option value="+66">TH - Thailand (+66)</option>
                    <option value="+228">TG - Togo (+228)</option>
                    <option value="+216">TN - Tunisia (+216)</option>
                    <option value="+90">TR - Turkey (+90)</option>
                    <option value="+993">TM - Turkmenistan (+993)</option>
                    <option value="+256">UG - Uganda (+256)</option>
                    <option value="+380">UA - Ukraine (+380)</option>
                    <option value="+971">AE - UAE (+971)</option>
                    <option value="+598">UY - Uruguay (+598)</option>
                    <option value="+998">UZ - Uzbekistan (+998)</option>
                    <option value="+58">VE - Venezuela (+58)</option>
                    <option value="+84">VN - Vietnam (+84)</option>
                    <option value="+967">YE - Yemen (+967)</option>
                    <option value="+260">ZM - Zambia (+260)</option>
                    <option value="+263">ZW - Zimbabwe (+263)</option>
                  </select>
                  <input type="tel" id="phone" name="phone" placeholder="Enter phone number" required class="phone-input">
                </div>
              </div>

              <div class="form-group">
                <label for="message">Your Message *</label>
                <textarea id="message" name="message" required placeholder="Tell us how we can help you..."></textarea>
              </div>

              <button type="submit" id="submitBtn" class="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
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
            
            // Scroll to success message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  `

  return BaseLayout({
    title: 'Contact Us - Risivo',
    description: 'Get in touch with Risivo. We\'d love to hear from you and answer any questions about our marketing CRM platform.',
    children: content,
    includeFooter: true
  })
}
