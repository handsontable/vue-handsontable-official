import BaseVueHotEditor from '../src/BaseVueHotEditor.vue';
import Handsontable from 'handsontable';

describe('BaseVueHotEditor', () => {
  it('should have all of the props that the Handsontable Base Editor assigns in its `prepare` method nulled', () => {
    const baseVueHotEditorInstance = new BaseVueHotEditor();

    expect(baseVueHotEditorInstance.TD).toEqual(null);
    expect(baseVueHotEditorInstance.row).toEqual(null);
    expect(baseVueHotEditorInstance.col).toEqual(null);
    expect(baseVueHotEditorInstance.prop).toEqual(null);
    expect(baseVueHotEditorInstance.originalValue).toEqual(null);
    expect(baseVueHotEditorInstance.cellProperties).toEqual(null);
    expect(baseVueHotEditorInstance.state).toEqual(null);
  });

  it('should have all of the Base Editor\'s method defined', () => {
    const baseVueHotEditorInstance = new BaseVueHotEditor();

    Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(propName => {
      // _hooksStorage is an internal container, not needed on the vue base editor
      if (propName === 'constructor' || propName === '_hooksStorage') {
        return;
      }

      expect(baseVueHotEditorInstance[propName]).not.toEqual(void 0);
    });
  });
});
