console.log("Hostinger Next.js Storefront Startup Init...");

// Port and Hostname are supplied by Hostinger Node.js panel (via Passenger)
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// Import the server built by Next.js in standalone mode
require('./.next/standalone/server.js');
