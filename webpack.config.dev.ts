import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

const WebpackConfig: webpack.Configuration = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  devtool: "eval-cheap-module-source-map",
  entry: path.resolve(__dirname, "src/index"),
  target: "web",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // Create HTML file that includes references to bundled JS
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inject: true
    }),
    new MomentLocalesPlugin({
      localesToKeep: ["sr"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: ["file-loader"]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "application/font-woff"
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
              mimetype: "application/octet-stream"
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
              mimetype: "image/svg+xml"
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