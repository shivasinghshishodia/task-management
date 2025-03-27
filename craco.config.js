module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve.extensions = ['.js', '.jsx', '.json'];
        return webpackConfig;
      },
    },
  };
  