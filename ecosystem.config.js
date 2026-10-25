module.exports = {
  apps: [
    {
      name: "anviable-web",
      cwd: "./findmycompetition",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "anviable-crawler-api",
      cwd: "./crawler_service",
      script: "python3",
      args: "-m uvicorn crawler.api.main:app --host 0.0.0.0 --port 8000",
      instances: 1,
      exec_mode: "fork",
      env: {
        PYTHONUNBUFFERED: "1",
      },
    },
    {
      name: "anviable-crawler-scheduler",
      cwd: "./crawler_service",
      script: "python3",
      args: "-m crawler.schedulers.runner",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      env: {
        PYTHONUNBUFFERED: "1",
      },
    },
  ],
};
