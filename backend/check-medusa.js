
try {
  const pkg = require('@medusajs/medusa/package.json');
  console.log('Medusa version:', pkg.version);
} catch (e) {
  console.error('Medusa not found:', e.message);
}
