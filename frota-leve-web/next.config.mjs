/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
          source: '/api/:path*',
          destination: 'https://api.frotaleve.com.br/api/:path*',
      }
    ];
  }
};

export default nextConfig;
