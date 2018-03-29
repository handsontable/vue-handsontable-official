'use strict';

const path = require('path');

module.exports.create = function create(hotType) {
  const getConfig = function() {
    return {
      devtool: 'source-map',
      output: {
        path: path.resolve(__dirname, './../test/dist/'),
        filename: '[name].js',
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
        ]
      },
      externals: {
        'hot-alias': {
          root: 'Handsontable',
          commonjs2: 'handsontable',
          commonjs: 'handsontable',
          amd: 'handsontable',
          umd: 'handsontable'
        },
      },
    };
  };

  const configHelpers = getConfig();
  configHelpers.entry = {
    'helpers': './src/common/helpers.js',
  };
  configHelpers.output.library = 'Helpers';
  configHelpers.output.libraryTarget = 'umd';

  const configSettingsMapper = getConfig();
  configSettingsMapper.entry = {
    'settingsMapper': './src/common/settingsMapper.js',
  };
  configSettingsMapper.output.library = 'SettingsMapper';
  configSettingsMapper.output.libraryTarget = 'umd';
  configSettingsMapper.output.libraryExport = 'default';

  return [configHelpers, configSettingsMapper];
};
