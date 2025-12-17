module.exports = {
  apps: [
    {
      name: "afghan-job-finder-server",
      script: "server/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5050
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5050
      }
    }
  ]
};