// next.config.js

module.exports = {
    // Target must be serverless
    target: 'serverless',
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.plugins.push(new webpack.IgnorePlugin(/^mongodb-client-encryption$/))
      return config
    },
  };