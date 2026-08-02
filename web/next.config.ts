import type { NextConfig } from "next";

import { env } from "./src/config/env";

const nextConfig: NextConfig = {
  typedRoutes: true,
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${env.apiOrigin}/:path*` }];
  },
};

export default nextConfig;
