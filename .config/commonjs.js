import { baseConfig } from './base';
import unifyHotTableExports from './helpers/rollup-plugin-unify-hot-table-exports';

const env = process.env.NODE_ENV;
const filename = 'vue-handsontable.js';

export const cjsConfig = {
  output: {
    format: env,
    indent: false,
    file: `./commonjs/${filename}`,
    exports: 'named'
  },
  plugins: baseConfig.plugins
    .concat([
    unifyHotTableExports('commonjs')
  ]),
};
