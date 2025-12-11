/**
 * Language Switcher Component
 * Professional dropdown with country flags and auto-detection
 * Supports: EN, ES, FR, DE, IT, PT
 */

import { designSystem } from "../styles/design-system";

const { colors, spacing, shadows } = designSystem;

export interface Language {
  code: string;
  name: string;
  flag: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "EN", name: "English", flag: "🇬🇧", locale: "en" },
  { code: "ES", name: "Español", flag: "🇪🇸", locale: "es" },
  { code: "FR", name: "Français", flag: "🇫🇷", locale: "fr" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪", locale: "de" },
  { code: "IT", name: "Italiano", flag: "🇮🇹", locale: "it" },
  { code: "PT", name: "Português", flag: "🇵🇹", locale: "pt" },
];

export function LanguageSwitcher(): string {
  return `
    <style>
      .language-switcher {
        position: relative;
        display: inline-block;
      }

      .language-switcher-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: ${colors.white};
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.95rem;
        font-weight: 500;
        color: ${colors.darkGray};
        min-width: 90px;
      }

      .language-switcher-button:hover {
        border-color: ${colors.primary};
        background: #f9fafb;
      }

      .language-flag {
        font-size: 1.25rem;
        line-height: 1;
      }

      .language-code {
        font-weight: 600;
        color: ${colors.black};
      }

      .language-dropdown-icon {
        margin-left: auto;
        font-size: 0.75rem;
        transition: transform 0.2s;
      }

      .language-switcher.open .language-dropdown-icon {
        transform: rotate(180deg);
      }

      .language-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: ${colors.white};
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: ${shadows.lg};
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        z-index: 1000;
        overflow: hidden;
      }

      .language-switcher.open .language-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .language-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s;
        text-decoration: none;
        color: ${colors.darkGray};
      }

      .language-option:hover {
        background: #f9fafb;
      }

      .language-option.active {
        background: ${colors.primary}15;
        color: ${colors.primary};
        font-weight: 600;
      }

      .language-option-flag {
        font-size: 1.5rem;
        line-height: 1;
        width: 24px;
        text-align: center;
      }

      .language-option-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
      }

      .language-option-name {
        font-size: 0.95rem;
        font-weight: 500;
      }

      .language-option-code {
        font-size: 0.75rem;
        opacity: 0.7;
        text-transform: uppercase;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .language-dropdown {
          left: 0;
          right: auto;
          min-width: 180px;
        }
      }
    </style>

    <div class="language-switcher" id="languageSwitcher">
      <button 
        class="language-switcher-button" 
        id="languageSwitcherButton"
        aria-label="Select language"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span class="language-flag" id="currentLanguageFlag">🇬🇧</span>
        <span class="language-code" id="currentLanguageCode">EN</span>
        <span class="language-dropdown-icon">▼</span>
      </button>

      <div class="language-dropdown" id="languageDropdown" role="menu">
        ${SUPPORTED_LANGUAGES.map(
          (lang) => `
          <a 
            href="/${lang.locale}" 
            class="language-option" 
            data-lang="${lang.code}" 
            data-locale="${lang.locale}"
            data-flag="${lang.flag}"
            role="menuitem"
            onclick="handleLanguageChange('${lang.code}', '${lang.locale}', '${lang.flag}', event)"
          >
            <span class="language-option-flag">${lang.flag}</span>
            <span class="language-option-text">
              <span class="language-option-name">${lang.name}</span>
              <span class="language-option-code">${lang.code}</span>
            </span>
          </a>
        `
        ).join("")}
      </div>
    </div>

    <script>
      // Language switcher functionality
      (function() {
        const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'it', 'pt'];
        const DEFAULT_LOCALE = 'en';
        const LANGUAGE_STORAGE_KEY = 'risivo_language';

        // Language data
        const LANGUAGES = {
          'en': { code: 'EN', flag: '🇬🇧', name: 'English' },
          'es': { code: 'ES', flag: '🇪🇸', name: 'Español' },
          'fr': { code: 'FR', flag: '🇫🇷', name: 'Français' },
          'de': { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
          'it': { code: 'IT', flag: '🇮🇹', name: 'Italiano' },
          'pt': { code: 'PT', flag: '🇵🇹', name: 'Português' }
        };

        // Get current locale from URL or storage
        function getCurrentLocale() {
          const path = window.location.pathname;
          const urlLocale = path.split('/')[1];
          
          if (SUPPORTED_LOCALES.includes(urlLocale)) {
            return urlLocale;
          }
          
          const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);
          if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
            return storedLocale;
          }
          
          return DEFAULT_LOCALE;
        }

        // Detect browser language
        function detectBrowserLanguage() {
          const browserLang = navigator.language || navigator.userLanguage;
          const langCode = browserLang.split('-')[0].toLowerCase();
          
          if (SUPPORTED_LOCALES.includes(langCode)) {
            return langCode;
          }
          
          return DEFAULT_LOCALE;
        }

        // Auto-redirect on first visit
        function autoRedirectLanguage() {
          const hasVisited = localStorage.getItem('risivo_has_visited');
          const currentPath = window.location.pathname;
          const urlLocale = currentPath.split('/')[1];
          
          // If already on a language-specific page, don't redirect
          if (SUPPORTED_LOCALES.includes(urlLocale)) {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLocale);
            localStorage.setItem('risivo_has_visited', 'true');
            return;
          }
          
          // If not first visit, check stored preference
          if (hasVisited) {
            const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (storedLocale && storedLocale !== DEFAULT_LOCALE) {
              window.location.href = '/' + storedLocale + currentPath;
            }
            return;
          }
          
          // First visit - detect and redirect
          const detectedLang = detectBrowserLanguage();
          localStorage.setItem('risivo_has_visited', 'true');
          localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
          
          if (detectedLang !== DEFAULT_LOCALE) {
            window.location.href = '/' + detectedLang + currentPath;
          }
        }

        // Update UI to show current language
        function updateLanguageUI() {
          const currentLocale = getCurrentLocale();
          const lang = LANGUAGES[currentLocale];
          
          if (lang) {
            document.getElementById('currentLanguageFlag').textContent = lang.flag;
            document.getElementById('currentLanguageCode').textContent = lang.code;
            
            // Mark active language in dropdown
            document.querySelectorAll('.language-option').forEach(option => {
              if (option.dataset.locale === currentLocale) {
                option.classList.add('active');
              } else {
                option.classList.remove('active');
              }
            });
          }
        }

        // Toggle dropdown
        const switcher = document.getElementById('languageSwitcher');
        const button = document.getElementById('languageSwitcherButton');
        
        if (button) {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            switcher.classList.toggle('open');
            const isOpen = switcher.classList.contains('open');
            button.setAttribute('aria-expanded', isOpen);
          });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (switcher && !switcher.contains(e.target)) {
            switcher.classList.remove('open');
            if (button) button.setAttribute('aria-expanded', 'false');
          }
        });

        // Handle language change
        window.handleLanguageChange = function(code, locale, flag, event) {
          event.preventDefault();
          
          // Store preference
          localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
          
          // Update UI immediately
          document.getElementById('currentLanguageFlag').textContent = flag;
          document.getElementById('currentLanguageCode').textContent = code;
          
          // Navigate to new language
          const currentPath = window.location.pathname;
          const currentLocale = currentPath.split('/')[1];
          
          let newPath;
          if (SUPPORTED_LOCALES.includes(currentLocale)) {
            // Replace current locale
            newPath = currentPath.replace('/' + currentLocale, locale === DEFAULT_LOCALE ? '' : '/' + locale);
          } else {
            // Add locale
            newPath = locale === DEFAULT_LOCALE ? currentPath : '/' + locale + currentPath;
          }
          
          window.location.href = newPath;
        };

        // Initialize
        autoRedirectLanguage();
        updateLanguageUI();
      })();
    </script>
  `;
}
