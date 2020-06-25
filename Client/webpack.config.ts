import * as path from "path";

// Adds devServer field to webpack Configuration interface
import "webpack-dev-server";

import { Configuration, EnvironmentPlugin, RuleSetQuery } from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";

dotenv.config();

function cssLoaderOptions(modules: boolean, development: boolean): RuleSetQuery {
  const options: RuleSetQuery = {
    sourceMap: development,

    importLoaders: 2,
    localsConvention: "camelCaseOnly",
  };

  if (modules) {
    options.modules = (development ?
        {
          localIdentName: "[path][name]__[local]",
        }
        : true
    );
  }

  return options;
}

function sassLoaderOptions(sourceMap: boolean): RuleSetQuery {
  return {
    sourceMap,
  };
}

const development: boolean = process.env.NODE_ENV === "development";

const config: Configuration = {
  mode: (development ? "development" : "production"),
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
            options: cssLoaderOptions(false, development),
          },
          {
            loader: "sass-loader",
            options: sassLoaderOptions(development),
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: cssLoaderOptions(true, development),
          },
          {
            loader: "sass-loader",
            options: sassLoaderOptions(development),
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
    }),
    new EnvironmentPlugin({
      NODE_ENV: "production",
    }),
  ],

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
};

export default config;
