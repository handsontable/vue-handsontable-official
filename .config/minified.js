import { baseConfig } from './base';
import { addLicenseBanner } from './helpers/licenseBanner';
import { uglify } from 'rollup-plugin-uglify';

const minFilename = 'vue-handsontable.min.js';

const minConfig = {
  output: {
    format: 'umd',
    name: 'Handsontable.vue',
    indent: false,
    sourcemap: true,
    file: `./dist/${minFilename}`,
    exports: 'named',
    globals: {
      vue: 'Vue',
      handsontable: 'Handsontable'
    }
  },
  plugins: baseConfig.plugins.concat([
    uglify({
      output: {
        comments: /^!/
      },
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      }
    })
  ])
};

addLicenseBanner(minConfig);

export { minConfig };
