import { baseConfig } from './base';
import { addLicenseBanner } from './helpers/licenseBanner';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const minFilename = 'vue-handsontable.min.js';

const minConfig = {
  output: {
    format: 'umd',
    name: 'Handsontable.vue',
    indent: false,
    sourcemap: true,
    file: `./dist/${envHotType}/${minFilename}`,
    exports: 'named'
  },
  plugins: baseConfig.plugins.concat([
    commonjs({
      include: [
        'node_modules/**'
      ]
    }),
    uglify({
      output: {
        comments: /^!/
      },
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ])
};

addLicenseBanner(minConfig);

export { minConfig };
