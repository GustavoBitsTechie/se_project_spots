const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: "./src/pages/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "",
  },
  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // serve src files (so /index.css resolves)
      publicPath: '/',
      watch: true
    },
    hot: true,
    historyApiFallback: true,
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif|woff(2)?|eot|ttf|otf)$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: { sources: false } // adjust if you need to process <img src> etc.
      }
    ],
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      assert: require.resolve('assert/'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      fs: false,
      child_process: false,
      net: false,
      tls: false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: "./src/favicon.ico",
      inject: true, // <-- change from false to true
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/images'), to: 'images' } // copies src/images -> dist/images
      ]
    })
  ],
};