/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  outputFileTracingExcludes: {
    "*": [
      "./data/imports/**/*",
      "./data/drafts/**/*"
    ]
  }
};

module.exports = nextConfig;
