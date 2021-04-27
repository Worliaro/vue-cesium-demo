const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/cesium-demo",
  outputDir: "./cesiumDemo",
  filenameHashing: true,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== "production",
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    amd: {
      // cesium 2
      toUrlUndefined: true,
    },
    module: {
      // cesium 3 不加这个配置会报require引入警告
      unknownContextCritical: false,
    },
    // cesium 4
    plugins: [
      new CopyWebpackPlugin([
        {
          from: "node_modules/cesium/Build/Cesium/Workers",
          to: "cesium/Workers",
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: "node_modules/cesium/Build/Cesium/ThirdParty",
          to: "cesium/ThirdParty",
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: "node_modules/cesium/Build/Cesium/Assets",
          to: "cesium/Assets",
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: "node_modules/cesium/Build/Cesium/Widgets",
          to: "cesium/Widgets",
        },
      ]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify("./cesium"),
      }),
    ],
    optimization: {
      minimize: process.env.NODE_ENV === "production" ? true : false,
    },
  },
};
