import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // One canonical URL form. We enforce trailing slashes everywhere so the
  // 308 redirect policy is single and consistent (see technical SEO reqs).
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
