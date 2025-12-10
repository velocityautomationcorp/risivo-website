/**
 * Navigation Component
 * Sticky header navigation with mobile menu
 */

import { designSystem } from '../styles/design-system'
import { Button } from './Button'

const { colors, spacing, shadows } = designSystem

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface NavigationProps {
  logoSrc?: string
  items: NavItem[]
  ctaText?: string
  ctaHref?: string
}

export function Navigation({
  logoSrc,
  items,
  ctaText = 'Start Free Trial',
  ctaHref = 'https://app.risivo.com/signup',
}: NavigationProps): string {
  return `
    <style>
      .navigation {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: ${colors.white};
        box-shadow: ${shadows.sm};
        z-index: 1000;
        transition: all 0.3s ease;
      }

      .navigation.scrolled {
        box-shadow: ${shadows.md};
      }

      .nav-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 ${spacing.lg};
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
      }

      .nav-logo {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        text-decoration: none;
        color: ${colors.black};
        font-weight: 700;
        font-size: 1.5rem;
      }

      .nav-logo img {
        height: 40px;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: ${spacing.xl};
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      /* Hide nav-actions inside nav-menu on desktop (they're in the nav bar) */
      .nav-menu .nav-actions {
        display: none;
      }

      .nav-item {
        position: relative;
      }

      .nav-link {
        text-decoration: none;
        color: ${colors.darkGray};
        font-weight: 500;
        transition: color 0.2s;
        padding: ${spacing.sm} 0;
      }

      .nav-link:hover {
        color: ${colors.primary};
      }

      .nav-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: ${colors.white};
        box-shadow: ${shadows.lg};
        border-radius: 8px;
        padding: ${spacing.sm} 0;
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s ease;
      }

      .nav-item:hover .nav-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .nav-dropdown a {
        display: block;
        padding: ${spacing.sm} ${spacing.lg};
        color: ${colors.darkGray};
        text-decoration: none;
        transition: background 0.2s;
      }

      .nav-dropdown a:hover {
        background: ${colors.lightGray};
        color: ${colors.primary};
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: ${spacing.md};
      }

      .mobile-menu-toggle {
        display: none !important;
      }

      @media (max-width: 768px) {
        .mobile-menu-toggle {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .nav-container {
          height: 64px;
          position: relative;
        }

        .nav-logo {
          flex: 0 0 auto;
        }

        .nav-logo img {
          height: 32px;
        }

        .nav-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: ${colors.white};
          flex-direction: column;
          align-items: stretch;
          padding: ${spacing.lg};
          box-shadow: ${shadows.lg};
          transform: translateX(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          gap: ${spacing.md};
          max-height: calc(100vh - 64px);
          overflow-y: auto;
        }

        .nav-menu.open {
          transform: translateX(0);
          opacity: 1;
          visibility: visible;
        }

        .nav-link {
          display: block;
          padding: ${spacing.sm};
          font-size: 1.125rem;
        }

        .nav-dropdown {
          position: static;
          opacity: 1;
          visibility: visible;
          transform: none;
          box-shadow: none;
          padding-left: ${spacing.lg};
          margin-top: ${spacing.xs};
        }

        .mobile-menu-toggle {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .nav-actions {
          display: none !important;
        }

        .nav-menu .nav-actions {
          display: flex !important;
          flex-direction: column;
          width: 100%;
          gap: ${spacing.sm};
          margin-top: ${spacing.md};
          padding-top: ${spacing.md};
          border-top: 1px solid ${colors.lightGray};
        }

        .nav-menu .nav-actions a,
        .nav-menu .nav-actions button {
          width: 100%;
          text-align: center;
        }

        .nav-spacer {
          height: 64px;
        }
      }

      /* Spacer to prevent content from going under fixed nav */
      .nav-spacer {
        height: 72px;
      }

      @media (max-width: 768px) {
        .nav-spacer {
          height: 64px;
        }
      }
    </style>

    <nav class="navigation" id="navigation">
      <div class="nav-container">
        <a href="/" class="nav-logo">
          ${logoSrc ? `<img src="${logoSrc}" alt="Risivo" />` : 'RISIVO'}
        </a>

        <div class="nav-actions">
          <a href="https://app.risivo.com/login" class="btn btn-outline btn-sm">Login</a>
          ${Button({ text: ctaText, href: ctaHref, variant: 'primary', size: 'sm' })}
        </div>

        <!-- Mobile menu button removed - using fixed button in page instead -->

        <ul class="nav-menu" id="navMenu">
          ${items.map(item => `
            <li class="nav-item">
              <a href="${item.href}" class="nav-link">${item.label}</a>
              ${item.children ? `
                <div class="nav-dropdown">
                  ${item.children.map(child => `
                    <a href="${child.href}">${child.label}</a>
                  `).join('')}
                </div>
              ` : ''}
            </li>
          `).join('')}
          <li class="nav-item nav-actions">
            <a href="https://app.risivo.com/login" class="btn btn-outline">Login</a>
            ${Button({ text: ctaText, href: ctaHref, variant: 'primary' })}
          </li>
        </ul>

      </div>
    </nav>

    <div class="nav-spacer"></div>

    <script>
      // Sticky navigation on scroll
      window.addEventListener('scroll', () => {
        const nav = document.getElementById('navigation')
        if (window.scrollY > 50) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      })

      // Mobile menu toggle
      function toggleMobileMenu() {
        const menu = document.getElementById('navMenu')
        menu.classList.toggle('open')
      }

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        const menu = document.getElementById('navMenu')
        const toggle = document.querySelector('.mobile-menu-toggle')
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
          menu.classList.remove('open')
        }
      })
    </script>
  `
}
