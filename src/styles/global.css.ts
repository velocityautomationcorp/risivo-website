/**
 * Global CSS styles as exportable string
 * This will be injected into the HTML head
 */

import { designSystem } from './design-system'

const { colors, typography, spacing, shadows, borderRadius, animations } = designSystem

export const globalStyles = `
  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Base styles */
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${typography.fontFamily};
    font-size: ${typography.body};
    font-weight: ${typography.regular};
    line-height: ${typography.normal};
    color: ${colors.darkGray};
    background-color: ${colors.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.bold};
    line-height: ${typography.tight};
    color: ${colors.black};
    margin-bottom: ${spacing.md};
  }

  h1 { font-size: ${typography.h1}; }
  h2 { font-size: ${typography.h2}; }
  h3 { font-size: ${typography.h3}; }
  h4 { font-size: ${typography.h4}; }
  h5 { font-size: ${typography.h5}; }

  p {
    margin-bottom: ${spacing.md};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color ${animations.transition.base};
  }

  a:hover {
    color: ${colors.primaryDark};
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${spacing.lg};
  }

  /* Section spacing */
  .section {
    padding: ${spacing['4xl']} 0;
  }

  /* Animations */
  ${animations.keyframes.fadeIn}
  ${animations.keyframes.float}
  ${animations.keyframes.pulse}

  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .mt-sm { margin-top: ${spacing.sm}; }
  .mt-md { margin-top: ${spacing.md}; }
  .mt-lg { margin-top: ${spacing.lg}; }
  .mt-xl { margin-top: ${spacing.xl}; }

  .mb-sm { margin-bottom: ${spacing.sm}; }
  .mb-md { margin-bottom: ${spacing.md}; }
  .mb-lg { margin-bottom: ${spacing.lg}; }
  .mb-xl { margin-bottom: ${spacing.xl}; }

  /* Responsive utilities */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }

    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }

    .container {
      padding: 0 ${spacing.md};
    }

    .section {
      padding: ${spacing['2xl']} 0;
    }
  }

  /* Button base styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 ${spacing.xl};
    height: 48px;
    font-size: ${typography.body};
    font-weight: ${typography.semibold};
    border-radius: ${borderRadius.base};
    border: 2px solid transparent;
    cursor: pointer;
    transition: all ${animations.transition.base};
    text-decoration: none;
    white-space: nowrap;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Button variants */
  .btn-primary {
    background: ${colors.primary};
    color: ${colors.white};
  }

  .btn-primary:hover:not(:disabled) {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  .btn-secondary {
    background: ${colors.white};
    color: ${colors.primary};
    border-color: ${colors.primary};
  }

  .btn-secondary:hover:not(:disabled) {
    background: ${colors.lightGray};
  }

  .btn-outline {
    background: transparent;
    color: ${colors.primary};
    border-color: ${colors.primary};
  }

  .btn-outline:hover:not(:disabled) {
    background: ${colors.primary};
    color: ${colors.white};
  }

  /* Button sizes */
  .btn-sm {
    height: 32px;
    padding: 0 ${spacing.md};
    font-size: ${typography.small};
  }

  .btn-lg {
    height: 56px;
    padding: 0 ${spacing['2xl']};
    font-size: ${typography.h5};
  }

  /* Card styles */
  .card {
    background: ${colors.white};
    border-radius: ${borderRadius.md};
    padding: ${spacing.xl};
    box-shadow: ${shadows.base};
    transition: all ${animations.transition.base};
  }

  .card:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-4px);
  }

  /* Form elements */
  input, textarea, select {
    width: 100%;
    padding: ${spacing.md};
    font-family: ${typography.fontFamily};
    font-size: ${typography.body};
    border: 2px solid ${colors.mediumGray};
    border-radius: ${borderRadius.base};
    transition: border-color ${animations.transition.base};
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  input::placeholder, textarea::placeholder {
    color: ${colors.mediumGray};
  }

  label {
    display: block;
    margin-bottom: ${spacing.sm};
    font-weight: ${typography.semibold};
    color: ${colors.darkGray};
  }

  /* Loading spinner */
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: ${colors.white};
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
