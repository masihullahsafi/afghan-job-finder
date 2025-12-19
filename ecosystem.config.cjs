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
        PORT: 5050,
        MONGO_URI: "mongodb+srv://masihshafy_db_user:w0ZRtGgYzyYGnWxl@cluster0.zkamfis.mongodb.net/?appName=Cluster0",
        EMAIL_HOST: "md-plesk-web6.webhostbox.net",
        EMAIL_PORT: 465,
        EMAIL_SECURE: true,
        EMAIL_USER: "noreply@afghanjobfinder.com",
        EMAIL_PASS: "OTPsending55@"
      }
      
    }
  ]
};

