const rollup = require('rollup').rollup;
const vue = require('rollup-plugin-vue');
const resolve = require('path').resolve;
const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const chalk = require('chalk');

function success (text) {
  console.log(chalk.green(`${text} ✔`));
}

function error (text) {
  console.log(chalk.red(`${text} ✘`));
}

rollup({
  input: resolve('src/HotTable.vue'),
  external: ['vue', 'handsontable'],
  plugins: [
    vue({ css: false }),
    buble({
      objectAssign: 'Object.assign'
    }),
    uglify()
  ]
}).then(bundle => {
  bundle.write({
    file: resolve('dist/vue-handsontable-official.js'),
    format: 'cjs'
  });
})
  .then(() => success('commonjs build successful'))
  .catch((err) => {
    error(err);
  })

rollup({
  input: resolve('src/HotTable.vue'),
  external: ['vue', 'handsontable'],
  plugins: [
    vue({ css: false }),
    buble({
      objectAssign: 'Object.assign'
    }),
    nodeResolve(),
    uglify(),
    commonjs()
  ]
}).then(bundle => {
  bundle.write({
    name: 'globals',
    file: resolve('dist/vue-handsontable-official.iife.js'),
    name: 'vueHandsontableOfficial',
    format: 'iife',
    globals: {
      'vue': 'Vue',
      'handsontable': 'Handsontable'
    }
  });
})
  .then(() => success('IIFE build successful'))
  .catch((err) => {
    error(err);
  })

rollup({
  input: resolve('src/HotTable.vue'),
  external: ['vue', 'handsontable'],
  plugins: [
    vue({ css: false }),
    buble({
      objectAssign: 'Object.assign'
    }),
    nodeResolve(),
    uglify(),
    commonjs()
  ]
}).then((bundle) => {
  bundle.write({
    file: resolve('dist/vue-handsontable-official.amd.js'),
    format: 'amd',
    globals: {
      'vue': 'Vue'
    }
  });
})
  .then(() => success('AMD build successful'))
  .catch((err) => {
    error(err)
  });

rollup({
  input: resolve('src/HotTable.vue'),
  external: ['vue', 'handsontable'],
  plugins: [
    vue({ css: false }),
    buble({
      objectAssign: 'Object.assign'
    }),
    nodeResolve(),
    uglify(),
    commonjs()
  ]
}).then((bundle) => {
  bundle.write({
    file: resolve('dist/vue-handsontable-official.umd.js'),
    format: 'umd',
    globals: {
      'vue': 'Vue',
      'handsontable': 'Handsontable'
    },
    name: 'vueHandsontableOfficial'
  });
})
  .then(() => success('UMD build successful'))
  .catch((err) => {
    error(err)
  });