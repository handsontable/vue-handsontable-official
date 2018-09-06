import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import VuePlugin from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';

const envHotType = process.env.HOT_TYPE;

export const baseConfig = {
  input: 'src/common/index.ts',
  plugins: [
    replace({
      'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    VuePlugin({
      defaultLang: {
        script: 'ts'
      },
      template: {
        isProduction: true
      }
    }),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve()
  ],
  external: [
    (envHotType === 'ce' ? 'handsontable' : 'handsontable-pro'),
    'vue',
    'handsontable',
    'handsontable-pro'
  ]
};

