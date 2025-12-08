/**
 * Navigation and Footer Configuration
 */

import type { NavItem } from '../components/Navigation'
import type { FooterColumn } from '../components/Footer'

export const navigationItems: NavItem[] = [
  {
    label: 'Features',
    href: '/features',
    children: [
      { label: 'Contact Management', href: '/features#contacts' },
      { label: 'Sales Pipeline', href: '/features#pipeline' },
      { label: 'Email Integration', href: '/features#email' },
      { label: 'Task Automation', href: '/features#automation' },
      { label: 'Reporting & Analytics', href: '/features#analytics' },
      { label: 'Mobile App', href: '/features#mobile' },
    ]
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/customers' },
      { label: 'Help Center', href: '/help' },
      { label: 'API Documentation', href: '/docs' },
    ]
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ]
  },
]

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Demo', href: '/demo' },
      { label: 'Mobile App', href: '/mobile' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/customers' },
      { label: 'Help Center', href: '/help' },
      { label: 'API Docs', href: '/docs' },
      { label: 'Status', href: 'https://status.risivo.com' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press Kit', href: '/press' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Cookie Policy', href: '/cookies' },
    ]
  },
]

export const socialLinks = [
  {
    platform: 'Twitter',
    url: 'https://twitter.com/risivo',
    icon: '𝕏'
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/company/risivo',
    icon: '💼'
  },
  {
    platform: 'Facebook',
    url: 'https://facebook.com/risivo',
    icon: '📘'
  },
  {
    platform: 'YouTube',
    url: 'https://youtube.com/risivo',
    icon: '▶️'
  },
]
