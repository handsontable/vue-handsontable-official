<script lang="ts">
  import Vue from 'vue';
  import Handsontable from 'handsontable';
  import Component from 'vue-class-component';

  @Component({})
  class BaseVueHotEditor extends Vue implements Handsontable._editors.Base {
    name = 'BaseVueHotEditor';
    instance = null;
    row = 34;
    col = null;
    prop = null;
    TD = null;
    originalValue = null;
    cellProperties = null;
    state = null;
    isEditor = true;

    mounted() {
      const _this = this;

      this.$data.hotCustomEditorClass = function () {
        const customEditorClass = class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
          constructor(hotInstance, row, col, prop, TD, cellProperties) {
            super(hotInstance, row, col, prop, TD, cellProperties);

            _this.$data.hotCustomEditorInstance = this;
          }

          focus() {
          }

          getValue() {
          }

          setValue() {
          }

          open() {
          }

          close() {
          }
        } as any;

        // Fill with the rest of the BaseEditor methods
        Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(propName => {
          if (propName === 'constructor') {
            return;
          }

          customEditorClass.prototype[propName] = function (...args) {
            return _this[propName].call(this, ...args);
          }
        });

        return customEditorClass;
      }();
    }

    render() {
      return null;
    }

    // BaseEditor methods:
    private _fireCallbacks(...args) {
      (Handsontable.editors.BaseEditor.prototype as any)._fireCallbacks.call(this.$data.hotCustomEditorInstance, ...args);
    }

    beginEditing(...args) {
      return Handsontable.editors.BaseEditor.prototype.beginEditing.call(this.$data.hotCustomEditorInstance, ...args);
    }

    cancelChanges(...args) {
      return Handsontable.editors.BaseEditor.prototype.cancelChanges.call(this.$data.hotCustomEditorInstance, ...args);
    }

    checkEditorSection(...args) {
      return Handsontable.editors.BaseEditor.prototype.checkEditorSection.call(this.$data.hotCustomEditorInstance, ...args);
    }

    close(...args) {
      return Handsontable.editors.BaseEditor.prototype.close.call(this.$data.hotCustomEditorInstance, ...args);
    }

    discardEditor(...args) {
      return Handsontable.editors.BaseEditor.prototype.discardEditor.call(this.$data.hotCustomEditorInstance, ...args);
    }

    enableFullEditMode(...args) {
      return Handsontable.editors.BaseEditor.prototype.enableFullEditMode.call(this.$data.hotCustomEditorInstance, ...args);
    }

    extend(...args) {
      return Handsontable.editors.BaseEditor.prototype.extend.call(this.$data.hotCustomEditorInstance, ...args);
    }

    finishEditing(...args) {
      return Handsontable.editors.BaseEditor.prototype.finishEditing.call(this.$data.hotCustomEditorInstance, ...args);
    }

    focus(...args) {
      return Handsontable.editors.BaseEditor.prototype.focus.call(this.$data.hotCustomEditorInstance, ...args);
    }

    getValue(...args) {
      return Handsontable.editors.BaseEditor.prototype.getValue.call(this.$data.hotCustomEditorInstance, ...args);
    }

    init(...args) {
      return Handsontable.editors.BaseEditor.prototype.init.call(this.$data.hotCustomEditorInstance, ...args);
    }

    isInFullEditMode(...args) {
      return Handsontable.editors.BaseEditor.prototype.isInFullEditMode.call(this.$data.hotCustomEditorInstance, ...args);
    }

    isOpened(...args) {
      return Handsontable.editors.BaseEditor.prototype.isOpened.call(this.$data.hotCustomEditorInstance, ...args);
    }

    isWaiting(...args) {
      return Handsontable.editors.BaseEditor.prototype.isWaiting.call(this.$data.hotCustomEditorInstance, ...args);
    }

    open(...args) {
      return Handsontable.editors.BaseEditor.prototype.open.call(this.$data.hotCustomEditorInstance, ...args);
    }

    prepare(row, col, prop, TD, originalValue, cellProperties) {
      this.$data.hotInstance = cellProperties.instance;
      this.$data.row = row;
      this.$data.column = col;
      this.$data.columnProp = prop;
      this.$data.td = TD;
      this.$data.originalValue = originalValue;
      this.$data.cellProperties = cellProperties;

      return Handsontable.editors.BaseEditor.prototype.prepare.call(this.$data.hotCustomEditorInstance, row, col, prop, TD, originalValue, cellProperties);
    }

    saveValue(...args) {
      return Handsontable.editors.BaseEditor.prototype.saveValue.call(this.$data.hotCustomEditorInstance, ...args);
    }

    setValue(...args) {
      return Handsontable.editors.BaseEditor.prototype.setValue.call(this.$data.hotCustomEditorInstance, ...args);
    }
  }

  export default BaseVueHotEditor;
  export { BaseVueHotEditor };
</script>
