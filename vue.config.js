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
    proxy: {
      "/sandcastle": {
        target: "https://sandcastle.cesium.com", //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        //pathRewrite方法重写url
        pathRewrite: {
          "^/sandcastle": "/",
          //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        },
      },
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
