/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx', 'md'], // Add 'tsx' and 'ts' if not present
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = { layers: true };
    }
    return config;
  },
};

module.exports = nextConfig;

