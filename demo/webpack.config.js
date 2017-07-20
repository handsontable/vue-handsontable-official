var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  output: {
    path: path.resolve('./dist/'),
    filename: 'bundle.js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
