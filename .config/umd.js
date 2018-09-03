import { addLicenseBanner } from './helpers/licenseBanner';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'vue-handsontable.js';

const umdConfig = {
  output: {
    format: env,
    name: 'Handsontable.vue',
    indent: false,
    // sourcemap: true,
    file: `./dist/${envHotType}/${filename}`,
    exports: 'named'
  }
};

addLicenseBanner(umdConfig);

export { umdConfig };
