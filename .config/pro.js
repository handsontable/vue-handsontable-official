'use strict';

const baseConfig = require('./base');

module.exports.create = function create(hotType) {
  const config = baseConfig.create(hotType);

  config.entry = {
    'vue-handsontable-pro': './src/common/HotTable.vue',
    'vue-handsontable-pro.min': './src/common/HotTable.vue',
  };

  config.externals = {
    'hot-alias': {
      root: 'Handsontable',
      commonjs2: 'handsontable-pro',
      commonjs: 'handsontable-pro',
      amd: 'handsontable-pro',
      umd: 'handsontable-pro'
    }
  };

  return [config];
};
