/**
 * Base Layout - Provides consistent header/footer for all pages
 */

import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { globalStyles } from "../styles/global.css";
import {
  navigationItems,
  footerColumns,
  socialLinks,
} from "../data/navigation";

export interface BaseLayoutProps {
  title: string;
  description?: string;
  children: string;
  includeFooter?: boolean;
}

export function BaseLayout({
  title,
  description = "Risivo - Marketing CRM Platform",
  children,
  includeFooter = true,
}: BaseLayoutProps): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${description}">
      <title>${title}</title>
      <link rel="icon" type="image/png" href="/favicon.png">
      <link rel="shortcut icon" type="image/png" href="/favicon.png">
      <link rel="apple-touch-icon" href="/favicon.png">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${globalStyles}</style>
      <style>
        /* Mobile menu button override */
        #fixedMobileMenuBtn {
          display: none;
          position: fixed;
          right: 12px;
          top: 10px;
          width: 44px;
          height: 44px;
          background: #683FE9;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 22px;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          #fixedMobileMenuBtn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            right: 8px !important;
            top: 8px !important;
          }
        }

        /* Prevent horizontal scroll */
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <!-- Fixed Mobile Menu Button -->
      <button 
        id="fixedMobileMenuBtn"
        onclick="document.getElementById('navMenu').classList.toggle('open')"
      >
        ☰
      </button>

      ${Navigation({
        logoSrc: "/risivo-logo.png",
        items: navigationItems,
        ctaText: "Start Free Trial",
        ctaHref: "https://app.risivo.com/signup",
      })}

      <main>
        ${children}
      </main>

      ${
        includeFooter
          ? Footer({
              columns: footerColumns,
              socialLinks: socialLinks,
              copyrightText: `© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.`,
            })
          : ""
      }
    </body>
    </html>
  `;
}
