import { initCloudwatch } from "@/util/cloudwatch";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    await initCloudwatch()
    return []
  }
};

export default nextConfig;
