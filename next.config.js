module.exports = {
  future: {
    webpack5: true,
  },
  target: 'experimental-serverless-trace',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/^mongodb-client-encryption$/))
    return config
  },
};