'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const packageBody = require('./../package.json');
const fs = require('fs');
const webpack = require('webpack');

let licenseBody = fs.readFileSync(path.resolve(__dirname, '../LICENSE'), 'utf8');
licenseBody += '\nVersion: ' + packageBody.version + ' (built at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ')';

module.exports.create = function create(hotType) {
  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, './../dist/' + hotType + '/'),
      filename: '[name].js',
      library: 'HotTable',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    module: {
      loaders: [
        {
          test: /(\.js)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['env'],
          }
        },
        {
          test: /(\.vue)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'vue-loader',
          query: {
            presets: ['vue-style-loader'],

          }
        }
      ]
    },
    plugins: [
      new UglifyJsPlugin({
        include: /\.min\.js$/
      }),
      new webpack.BannerPlugin(licenseBody),
    ],
  };
};
