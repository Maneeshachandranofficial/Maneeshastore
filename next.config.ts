import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/bridal',
        destination: '/bride',
        permanent: true,
      },
      {
        source: '/kids',
        destination: '/girls',
        permanent: true,
      },
      {
        source: '/ethnic',
        destination: '/bride',
        permanent: true,
      },
      {
        source: '/semi-party',
        destination: '/bride',
        permanent: true,
      },
      {
        source: '/collections',
        destination: '/collections/signature-couture',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
