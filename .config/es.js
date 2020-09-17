import typescript from 'rollup-plugin-typescript2';
import { plugins } from './base';
import unifyHotTableExports from './helpers/rollup-plugin-unify-hot-table-exports';

const env = process.env.NODE_ENV;
const filename = 'vue-handsontable.js';

export const esConfig = {
  output: {
    format: env,
    indent: false,
    file: `./es/${filename}`,
    exports: 'named'
  },
  plugins: [
    plugins.json,
    plugins.replace,
    plugins.VuePlugin,
    plugins.commonjs,
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      },
      useTsconfigDeclarationDir: true,
      objectHashIgnoreUnknownHack: true,
      clean: true
    }),
    plugins.babel,
    plugins.nodeResolve,
    unifyHotTableExports('es')
  ]
};
