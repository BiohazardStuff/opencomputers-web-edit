import * as path from "path";

// Adds devServer field to webpack Configuration interface
import "webpack-dev-server";

import { Configuration, RuleSetQuery } from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

function cssLoaderOptions(modules: boolean, sourceMap: boolean): RuleSetQuery {
  return {
    modules,
    sourceMap,

    importLoaders: 2,
    localsConvention: "camelCaseOnly",
  };
}

function sassLoaderOptions(sourceMap: boolean): RuleSetQuery {
  return {
    sourceMap,
  };
}

const config: Configuration = {
  mode: "development",
  devtool: "inline-source-map",

  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "main.js",
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    historyApiFallback: true,
    compress: true,
    port: 80,
  },

  resolve: {
    extensions: [
      ".html",
      ".js",
      ".ts",
      ".tsx",
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /^(?!.*\.module\.scss).*\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: cssLoaderOptions(false, true),
          },
          {
            loader: "sass-loader",
            options: sassLoaderOptions(true),
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: cssLoaderOptions(true, true),
          },
          {
            loader: "sass-loader",
            options: sassLoaderOptions(true),
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: "file-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "src/favicon.ico",
    })
  ],

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
};

export default config;
