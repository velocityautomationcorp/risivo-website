/**
 * NO COMPONENTS - Just styles
 * Testing if globalStyles is the issue
 */

import { globalStyles } from '../styles/global.css.ts';

export const HomepageNoComponents = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Risivo - Test</title>
      
      <!-- Fonts - JOST -->
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      
      <!-- Global Styles -->
    </head>
    <body>
      <div style="padding: 40px; text-align: center; font-family: 'Jost', sans-serif;">
        <h1 style="color: #683FE9; font-size: 3rem;">Testing Global Styles</h1>
        <p>If you see this with purple heading, globalStyles works!</p>
        <p>Next: Add Navigation component</p>
      </div>
    </body>
    </html>
  `;
};
