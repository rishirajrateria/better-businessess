import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Common alias URLs → canonical structured URLs
      { source: "/seo", destination: "/services/seo", permanent: true },
      { source: "/lead-generation", destination: "/services/lead-generation", permanent: true },
      { source: "/web-design", destination: "/services/website-development", permanent: true },
      { source: "/web-development", destination: "/services/website-development", permanent: true },
      { source: "/branding", destination: "/services/branding", permanent: true },
      { source: "/logo-design", destination: "/services/logo-design", permanent: true },
      { source: "/graphic-design", destination: "/services/graphic-design", permanent: true },
      { source: "/google-ads", destination: "/services/google-ads", permanent: true },
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/news", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
