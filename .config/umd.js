import { addLicenseBanner } from './helpers/licenseBanner';
import {baseConfig} from "./base";
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'vue-handsontable.js';

const umdConfig = {
  output: {
    format: env,
    name: 'Handsontable.vue',
    indent: false,
    sourcemap: true,
    file: `./dist/${envHotType}/${filename}`,
    exports: 'named'
  },
  plugins: baseConfig.plugins.concat([commonjs({
    include: [
      'node_modules/**'
    ]
  })])
};

addLicenseBanner(umdConfig);

export { umdConfig };
