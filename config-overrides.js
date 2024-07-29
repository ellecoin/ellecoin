const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    process: require.resolve("process/browser"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
  };

  const isProductionBuild = process.env.NODE_ENV === "production";
  const enableAnalyze = !!process.env.REACT_APP_INTERACTIVE_ANALYZE;

  if (isProductionBuild && !enableAnalyze) {
    config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|scss|css)$/i,
        filename: "[path][name][ext][query]",
        algorithm: "gzip",
        deleteOriginalAssets: true,
      })
    );
  }

  if (isProductionBuild && enableAnalyze) {
    config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "server" }));
  }

  return config;
};
