/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = { layers: true };
    }
    return config;
  },
};

module.exports = nextConfig

