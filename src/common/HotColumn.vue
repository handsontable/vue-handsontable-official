<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import Vue, { VNode } from 'vue';
  import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
  import {
    propFactory
  } from './helpers';
  import {
    createVueComponent,
    getColumnVNode
  } from './helpers/hotColumn';
  import {
    HotTableProps,
    HotColumnMethods, CustomEditorClass
  } from './types';
  import Handsontable from 'hot-alias';

  const rendererCache = new WeakMap();
  const editorCache = new Map();

  const HotColumn: ThisTypedComponentOptionsWithRecordProps<Vue, {}, HotColumnMethods, {}, HotTableProps> = {
    name: 'HotColumn',
    props: propFactory(),
    methods: {
      /**
       * Create the column settings based on the data provided to the `hot-column` component.
       */
      createColumnSettings: function (): void {
        if (!this.$slots.default) {
          return;
        }

        const hotColumnSlots = this.$slots.default;
        const rendererVNode = getColumnVNode(hotColumnSlots, 'hot-renderer');
        const editorVNode = getColumnVNode(hotColumnSlots, 'hot-editor');

        this.columnSettings = {...this.$props};

        if (rendererVNode !== null) {
          this.columnSettings.renderer = this.getRendererWrapper(rendererVNode);

        } else if (this.hasColumnProp('renderer')) {
          this.columnSettings.renderer = this.$props.renderer;
        }

        if (editorVNode !== null) {
          this.columnSettings.editor = this.getEditorClass(editorVNode);

        } else if (this.hasColumnProp('editor')) {
          this.columnSettings.editor = this.$props.editor;
        }
      },
      /**
       * Check if the `hot-column` component has the defined prop defined.
       *
       * @param {String} type Type of the prop to check. (Either `renderer` or `editor`)
       * @returns {Boolean} `true` if the `hot-column` component has the prop defined, `false` otherwise.
       */
      hasColumnProp: function (type: string): boolean {
        return !!this.$props[type];
      },
      /**
       * Create the wrapper function for the provided renderer child component.
       *
       * @param {Object} VNode VNode of the renderer child component.
       * @returns {Function} The wrapper function used as the renderer.
       */
      getRendererWrapper: function (VNode: VNode): (...args) => HTMLElement {
        const $vm = this;

        return function (instance, TD, row, col, prop, value, cellProperties) {
          if (TD) {
            if (!rendererCache.has(TD)) {
              const mountedComponent = createVueComponent(VNode, $vm, {});

              rendererCache.set(TD, mountedComponent);
            }

            const cachedComponent = rendererCache.get(TD);
            const rendererArgs = {
              instance,
              TD,
              row,
              col,
              prop,
              value,
              cellProperties
            };

            Object.assign(cachedComponent.$data, rendererArgs);

            TD.appendChild(cachedComponent.$el);
          }

          return TD;
        };
      },
      /**
       * Create a fresh class to be used as an editor, based on the editor component provided.
       *
       * @param {Object} VNode VNode for the editor child component.
       * @returns {CustomEditorClass} The class used as an editor in Handsontable.
       */
      getEditorClass: function (VNode: VNode): CustomEditorClass {
        const requiredMethods = ['focus', 'open', 'close', 'getValue', 'setValue'];
        const componentName = VNode.componentOptions.Ctor.options.name;
        let mountedComponent = null;

        if (!editorCache.has(componentName)) {
          mountedComponent = createVueComponent(VNode, this, {});

          editorCache.set(componentName, mountedComponent);

        } else {
          mountedComponent = editorCache.get(componentName);
        }

        class CustomEditor extends Handsontable.editors.BaseEditor {
          prepare(row, col, prop, td, originalValue, cellProperties) {
            super.prepare(row, col, prop, td, originalValue, cellProperties);

            mountedComponent.$data.row = row;
            mountedComponent.$data.column = col;
            mountedComponent.$data.columnProp = prop;
            mountedComponent.$data.td = td;
            mountedComponent.$data.originalValue = originalValue;
            mountedComponent.$data.cellProperties = cellProperties;

            mountedComponent.finishEditing = (restoreOriginalValue, ctrlDown, callback) => {
              super.finishEditing(restoreOriginalValue, ctrlDown, callback);
            };
          }

          // TODO: remove `focus` after it's added to the BaseEditor.
          focus() {}
        }

        Object.entries(Handsontable.editors.BaseEditor.prototype).forEach(entry => {
          const methodName = entry[0];

          if ((requiredMethods.includes(methodName) || methodName !== 'prepare') && mountedComponent[methodName]) {
            CustomEditor.prototype[methodName] = function () {
              return mountedComponent[methodName](...arguments);
            }

          } else if (methodName === 'prepare') {
            const defaultPrepare = CustomEditor.prototype[methodName];

            CustomEditor.prototype[methodName] = function () {
              defaultPrepare.call(this, ...arguments);
              return mountedComponent[methodName](...arguments);
            }
          }
        });

        return CustomEditor;
      }
    },
    mounted: function () {
      this.createColumnSettings();
    },
    render: function () {
      return null;
    }
  };

  export default HotColumn;
  export { HotColumn };
</script>
