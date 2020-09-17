/**
 * A rollup plugin made to replace the named export of HotTable with the same object that is used for the default
 * export.
 *
 * @param {string} moduleType `es` or `commonjs`.
 * @returns {object} The rollup plugin configuration object.
 */
export default function unifyHotTableExports (moduleType) {
  let defaultExportPattern = null;
  let namedExportsPattern = null;
  let replaceFunction = null;

  switch (moduleType) {
    case 'es':
      defaultExportPattern = /(export default )(.*);/;
      namedExportsPattern = /export {(.*)HotTable(.*)};/;
      replaceFunction = (defaultExport) => (match, p1, p2) => {
        return `export {${p1}${defaultExport} as HotTable${p2}};`;
      };

      break;
    case 'commonjs':
      defaultExportPattern = /(exports.default = )(.*);/;
      namedExportsPattern = /exports.HotTable = (.*);/;
      replaceFunction = (defaultExport) => () => {
        return `exports.HotTable = ${defaultExport};`;
      };

      break;
    default:
      return null;
  }

  return {
    name: 'unify-hot-table-exports',
    generateBundle ( options, bundle, isWrite ) {
      const filename = 'vue-handsontable.js';
      let bundleCode = bundle[filename].code;
      const defaultExport = bundleCode.match(defaultExportPattern)[2];

      if (defaultExport) {
        // Replace the HotTable component in the named export with the default export HotTable. (#188)
        bundleCode = bundleCode.replace(namedExportsPattern, replaceFunction(defaultExport));
      }

      bundle[filename].code = bundleCode;

      return null;
    }
  };
}
