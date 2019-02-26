import { baseConfig } from './base';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'vue-handsontable.js';

export const cjsConfig = {
  output: {
    format: env,
    indent: false,
    file: `./commonjs/${filename}`,
    exports: 'named'
  },
  plugins: baseConfig.plugins.concat([commonjs()])
};
