var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'handsontable': path.resolve(__dirname, 'node_modules/handsontable-pro')
    }
  },
  output: {
    path: './dist/',
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
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // },

      {
        test: require.resolve('numbro'),
        loader: 'expose-loader?numbro'
      },
      {
        test: require.resolve('moment'),
        loader: 'expose-loader?moment'
      },
      {
        test: require.resolve('pikaday'),
        loader: 'expose-loader?Pikaday'
      },
      {
        test: require.resolve('zeroclipboard'),
        loader: 'expose-loader?ZeroClipboard'
      },
      {
        test: require.resolve('hot-formula-parser/dist/formula-parser.js'),
        loader: 'expose-loader?formulaParser'
      },
    ]
  }
};
