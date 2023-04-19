const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProductionMode ? 'production' : 'development', // режим
  entry: './src/index.tsx', // путь к головному или входному файлу проекта
  output: {
    path: path.resolve(__dirname, '/dist'), // что и в какой папке будет у нас собираться
    filename: './bundle.js', // что и в какой папке будет у нас собираться
    publicPath: '/',
    clean: true,
  },
  devtool: 'inline-source-map', // будет показывать не в bundle а в консоли ошибки и в какой строке ошибки
  devServer: {
    port: 9002,
    historyApiFallback: true,
  }, //будет пересобираться приложение автоматически после каждого его изменения
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      fs: false,
      crypto: false,
    }, // для выгрузки xl
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
    }), // для того, чтобы написать один шаблон html документа и использовать его как enterPoint
    // new MiniCssExtractPlugin(), //прямо в js файл импортировать css

    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),

    new FaviconsWebpackPlugin(path.join(__dirname, 'public', 'favicon.ico')),
    new MiniCssExtractPlugin({
      filename: isProductionMode ? '[name].[contenthash].css' : '[name].css',
    }),
  ],
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          isProductionMode ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },

          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/i,
        use: [isProductionMode ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },

      {
        test: /\.png|jpg|gif|ico|jpeg|svg/,
        type: 'asset/resource', //файлы
      },
      {
        test: /\.woff|woff2|eot|ttf|otf/,
        type: 'asset/resource', //шрифты
      },
      {
        test: /\.svg$/, // загружает файл SVG в виде строки
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};
