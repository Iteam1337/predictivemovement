const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const outputDir = path.join(__dirname, "build/");
const Dotenv = require("dotenv-webpack");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  output: {
    path: outputDir,
    filename: "index.js"
  },
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "./public/icons/*"),
        to: "",
        flatten: true
      }
    ]),
    new HtmlWebpackPlugin({
      template: "public/index.html"
    })
  ],
  devServer: {
    compress: true,
    contentBase: outputDir,
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    stats: "minimal"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      }
    ]
  }
};
