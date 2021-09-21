import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import type { Configuration as WebpackConfig } from 'webpack';

const config: WebpackConfig = {
  plugins: [
    autoprefixer,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
      chunkFilename: '[id].[fullhash].css',
    }),
    new WebpackPwaManifest({
      filename: '[name].[hash].webmanifest',
      name: 'iso8601.date',
      background_color: '#dddddd',
      start_url: '/',
      orientation: 'any',
      display: 'standalone',
      fingerprints: true,
      publicPath: '/',
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff2?|ttf|eot)$/,
        loader: 'base64-inline-loader',
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { minimize: true },
        },
      },
    ],
  },
};

export default config;