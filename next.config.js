/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/dashboard', permanent: false },
      { source: '/Dashboard', destination: '/dashboard', permanent: true }, // normalize old links
    ];
  },
};
module.exports = nextConfig;
