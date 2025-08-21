/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Send / to /Dashboard
    return [{ source: "/", destination: "/Dashboard", permanent: false }];
  },
};
module.exports = nextConfig;
