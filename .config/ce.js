'use strict';

const baseConfig = require('./base');

module.exports.create = function create(hotType) {
  const config = baseConfig.create(hotType);

  config.entry = {
    'vue-handsontable-ce': './src/common/HotTable.vue',
    'vue-handsontable-ce.min': './src/common/HotTable.vue',
  };

  config.externals = {
    'hot-alias': {
      root: 'Handsontable',
      commonjs2: 'handsontable',
      commonjs: 'handsontable',
      amd: 'handsontable',
      umd: 'handsontable'
    }
  };

  return [config];
};
