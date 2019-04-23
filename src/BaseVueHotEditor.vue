<script lang="ts">
  import Vue from 'vue';
  import Handsontable from 'handsontable';
  import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
  import { BaseVueEditorFields, BaseVueEditorMethods } from './types';

  const BaseVueHotEditor: ThisTypedComponentOptionsWithRecordProps<Vue, BaseVueEditorFields, BaseVueEditorMethods, {}, {}> = {
    name: 'HotColumn',
    data: function () {
      const _this: any = this;

      return {
        instance: null,
        row: null,
        col: null,
        prop: null,
        TD: null,
        originalValue: null,
        cellProperties: null,
        state: null,
        hotCustomEditorClass: class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
          constructor(hotInstance, row, col, prop, TD, cellProperties) {
            super(hotInstance, row, col, prop, TD, cellProperties);

            _this.$data.hotCustomEditorInstance = this;
          }

          beginEditing(...args) {
            return _this.beginEditing.call(this, ...args);
          }

          cancelChanges(...args) {
            return _this.cancelChanges.call(this, ...args);
          }

          checkEditorSection(...args) {
            return _this.checkEditorSection.call(this, ...args);
          }

          close(...args) {
            return _this.close.call(this, ...args);
          }

          discardEditor(...args) {
            return _this.discardEditor.call(this, ...args);
          }

          enableFullEditMode(...args) {
            return _this.enableFullEditMode.call(this, ...args);
          }

          extend(...args) {
            return _this.extend.call(this, ...args);
          }

          finishEditing(...args) {
            return _this.finishEditing.call(this, ...args);
          }

          focus(...args) {
            return _this.focus.call(this, ...args);
          }

          getValue(...args) {
            return _this.getValue.call(this, ...args);
          }

          init(...args) {
            return _this.init.call(this, ...args);
          }

          isInFullEditMode(...args) {
            return _this.isInFullEditMode.call(this, ...args);
          }

          isOpened(...args) {
            return _this.isOpened.call(this, ...args);
          }

          isWaiting(...args) {
            return _this.isWaiting.call(this, ...args);
          }

          open(...args) {
            return _this.open.call(this, ...args);
          }

          prepare(...args) {
            return _this.prepare.call(this, ...args);
          }

          saveValue(...args) {
            return _this.saveValue.call(this, ...args);
          }

          setValue(...args) {
            return _this.setValue.call(this, ...args);
          }
        }
      }
    },
    methods: {
      beginEditing: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.beginEditing.call(this.$data.hotCustomEditorInstance, ...args);
      },
      cancelChanges: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.cancelChanges.call(this.$data.hotCustomEditorInstance, ...args);
      },
      checkEditorSection: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.checkEditorSection.call(this.$data.hotCustomEditorInstance, ...args);
      },
      close: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.close.call(this.$data.hotCustomEditorInstance, ...args);
      },
      discardEditor: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.discardEditor.call(this.$data.hotCustomEditorInstance, ...args);
      },
      enableFullEditMode: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.enableFullEditMode.call(this.$data.hotCustomEditorInstance, ...args);
      },
      extend: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.extend.call(this.$data.hotCustomEditorInstance, ...args);
      },
      finishEditing: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.finishEditing.call(this.$data.hotCustomEditorInstance, ...args);
      },
      focus: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.focus.call(this.$data.hotCustomEditorInstance, ...args);
      },
      getValue: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.getValue.call(this.$data.hotCustomEditorInstance, ...args);
      },
      init: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.init.call(this.$data.hotCustomEditorInstance, ...args);
      },
      isInFullEditMode: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.isInFullEditMode.call(this.$data.hotCustomEditorInstance, ...args);
      },
      isOpened: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.isOpened.call(this.$data.hotCustomEditorInstance, ...args);
      },
      isWaiting: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.isWaiting.call(this.$data.hotCustomEditorInstance, ...args);
      },
      open: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.open.call(this.$data.hotCustomEditorInstance, ...args);
      },
      prepare: function (row, col, prop, TD, originalValue, cellProperties) {
        this.$data.hotInstance = cellProperties.instance;
        this.$data.row = row;
        this.$data.column = col;
        this.$data.columnProp = prop;
        this.$data.td = TD;
        this.$data.originalValue = originalValue;
        this.$data.cellProperties = cellProperties;

        return Handsontable.editors.BaseEditor.prototype.prepare.call(this.$data.hotCustomEditorInstance, row, col, prop, TD, originalValue, cellProperties);
      },
      saveValue: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.saveValue.call(this.$data.hotCustomEditorInstance, ...args);
      },
      setValue: function (...args) {
        return Handsontable.editors.BaseEditor.prototype.setValue.call(this.$data.hotCustomEditorInstance, ...args);
      }
    },
    render: function () {
      return null;
    }
  };

  export default BaseVueHotEditor;
  export { BaseVueHotEditor };
</script>
