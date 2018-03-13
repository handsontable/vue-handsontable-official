const path = require('path');

module.exports = [
  {
    devtool: 'source-map',
    entry: {
      './dist/vue-handsontable-official': './src/HotTable.vue',
    },

    output: {
      path: path.resolve(__dirname, './'),
      filename: '[name].js',
      library: 'HotTable',
      libraryTarget: 'umd',
    },

    externals: {
      'handsontable': {
        root: 'Handsontable',
        commonjs2: 'handsontable',
        commonjs: 'handsontable',
        amd: 'handsontable',
        umd: 'handsontable'
      }
    },

    module: {
      loaders: [
        {
          test: /(\.js)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /(\.vue)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'vue-loader',
          query: {
            presets: ['vue-style-loader']
          }
        }
      ]
    },
  }
];
