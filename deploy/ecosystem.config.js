module.exports = {
  apps: [
    {
      name: "goamrit-backend",
      script: "npm",
      args: "run start",
      cwd: "/var/www/goamrit/backend", // Update with your actual path
      env: {
        NODE_ENV: "production",
        // Add other environment variables here or in an .env file
      },
    },
  ],
};
