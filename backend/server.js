const { execSync, spawn } = require('child_process');

console.log("Hostinger Node.js Application Startup Init...");

// 1. Run migrations before booting the server
console.log("Checking and running Medusa database migrations...");
try {
  execSync('npx medusa db:migrate', { 
    stdio: 'inherit', 
    env: process.env 
  });
  console.log("Database migrations completed successfully.");
} catch (error) {
  console.error("Database migration check failed/skipped: ", error.message);
}

// 2. Start the Medusa v2 server
console.log("Starting Medusa backend server...");
const port = process.env.PORT || 9000;
const host = process.env.HOST || '0.0.0.0';

const medusaProcess = spawn('npx', ['medusa', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: port,
    HOST: host
  }
});

medusaProcess.on('close', (code) => {
  console.log(`Medusa backend process exited with code ${code}`);
});
