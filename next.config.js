/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // prevent /dashboard <-> /dashboard/ loops
  async redirects() {
    return [
      // Home -> dashboard (harmless; doesn't touch /dashboard itself)
      { source: '/', destination: '/dashboard', permanent: false },
    ];
  },
};

module.exports = nextConfig;
