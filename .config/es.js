import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import VuePlugin from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'vue-handsontable.js';

export const esConfig = {
  output: {
    format: env,
    indent: false,
    file: `./es/${envHotType}/${filename}`,
    exports: 'named'
  },
  plugins: [
    replace({
      'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
    }),
    VuePlugin({
      defaultLang: {
        script: 'ts'
      },
      template: {
        isProduction: true
      }
    }),
    commonjs({
      include: [
        'node_modules/**'
      ]
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      }
    }),
    nodeResolve(),
  ],
};
