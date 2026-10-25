import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
    "pseudoporphyritic-myrtle-previgilantly.ngrok-free.dev",
    "localhost:3000",
  ],
};

export default nextConfig;
