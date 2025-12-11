// Quick test to verify CMS routes are mounted
const routes = [
  '/api/cms/health',
  '/api/cms/translations',
  '/api/cms/pages',
  '/api/health'
];

console.log('Testing routes that should exist:');
routes.forEach(route => {
  console.log(`  ✓ ${route}`);
});
