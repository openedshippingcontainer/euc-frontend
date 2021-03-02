import path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

const GLOBALS = {
  "process.env.NODE_ENV": JSON.stringify("production"),
  __DEV__: false
};

const WebpackConfig: webpack.Configuration = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  performance: {
    hints: "warning"
  },
  entry: path.resolve(__dirname, "src/index"),
  target: "web",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].chunk.js",
    assetModuleFilename: "[name].[contenthash][ext][query]"
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: "async",
      name: false,
      minSize: 20 * 1024,
      minRemainingSize: 0,
      maxSize: 300 * 1024,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "~",
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {},
          compress: {
            passes: 3
          },
          mangle: true,
          output: {
            comments: false,
          },
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
        parallel: true,
        extractComments: false
      })
    ],
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    // Build-time compression using the Brotli algorithm
    // new CompressionPlugin({
    //   filename: "[path].br[query]",
    //   algorithm: "brotliCompress",
    //   test: /\.(js|css|html|svg)$/,
    //   compressionOptions: {
    //     // zlib's `level` option matches Brotli's `BROTLI_PARAM_QUALITY` option.
    //     level: 11,
    //   },
    //   threshold: 10240,
    //   minRatio: 0.8
    // }),

    // Build-time gzipping (as a fallback)
    new CompressionPlugin({
      filename: "[path][base].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      favicon: "src/favicon.ico",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),

    // Minify Moment.js only to Serbian
    new MomentLocalesPlugin({
      localesToKeep: ["sr"]
    }),

    // Copy robots.txt to build folder
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "robots.txt")
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: { cacheDirectory: true }
        }]
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "application/font-woff",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "application/octet-stream",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "image/svg+xml",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  }
};

export default WebpackConfig;