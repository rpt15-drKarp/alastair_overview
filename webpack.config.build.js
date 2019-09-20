const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

module.exports = () => {
  const envKeys = Object.keys(process.env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
    return prev;
  }, {});

  return {
    entry: __dirname + '/client/src/index.jsx',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true
              }
            }
          ]
        }]},
    output: {
      filename: 'bundle.js',
      path: __dirname + '/public/dist/'
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    node: {
      fs: 'empty'
    }
  };
};
