<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import Vue, { VNode } from 'vue';
  import CombinedVueInstance from 'vue';
  import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
  import {
    propFactory,
    createVueComponent,
    getColumnVNode
  } from './helpers';
  import {
    HotTableProps,
    HotColumnMethods
  } from './types';
  import Handsontable from 'handsontable';

  const HotColumn: ThisTypedComponentOptionsWithRecordProps<Vue, {}, HotColumnMethods, {}, HotTableProps> = {
    name: 'HotColumn',
    props: propFactory(),
    methods: {
      /**
       * Create the column settings based on the data provided to the `hot-column` component and it's child components.
       */
      createColumnSettings: function (): void {
        const hotColumnSlots: VNode[] | any[] = this.$slots.default || [];

        const rendererVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-renderer');
        const editorVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-editor');

        this.columnSettings = {...this.$props};

        if (rendererVNode !== null) {
          this.columnSettings.renderer = this.getRendererWrapper(rendererVNode);

        } else if (this.hasProp('renderer')) {
          this.columnSettings.renderer = this.$props.renderer;
        }

        if (editorVNode !== null) {
          this.columnSettings.editor = this.getEditorClass(editorVNode);

        } else if (this.hasProp('editor')) {
          this.columnSettings.editor = this.$props.editor;
        }
      },
      /**
       * Check if the `hot-column` component has the defined prop defined.
       *
       * @param {String} type Type of the prop to check. (Either `renderer` or `editor`)
       * @returns {Boolean} `true` if the `hot-column` component has the prop defined, `false` otherwise.
       */
      hasProp: function (type: string): boolean {
        return !!this.$props[type];
      },
      /**
       * Create the wrapper function for the provided renderer child component.
       *
       * @param {Object} vNode VNode of the renderer child component.
       * @returns {Function} The wrapper function used as the renderer.
       */
      getRendererWrapper: function (vNode: VNode): (...args) => HTMLElement {
        const $vm = this;

        return function (instance, TD, row, col, prop, value, cellProperties) {
          if (TD) {
            const rendererCache = $vm.$parent.$data.rendererCache;

            if (rendererCache && !rendererCache.has(TD)) {
              const mountedComponent: CombinedVueInstance = createVueComponent(vNode, $vm, {});

              rendererCache.set(TD, mountedComponent);
            }

            const cachedComponent: CombinedVueInstance = rendererCache.get(TD);
            const rendererArgs: object = {
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
       * @param {Object} vNode VNode for the editor child component.
       * @returns {Class} The class used as an editor in Handsontable.
       */
      getEditorClass: function (vNode: VNode): typeof Handsontable.editors.BaseEditor {
        const requiredMethods: string[] = ['focus', 'open', 'close', 'getValue', 'setValue'];
        const componentName: string = (vNode.componentOptions.Ctor as any).options.name;
        const editorCache = this.$parent.$data.editorCache;
        let mountedComponent: any = null;

        class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
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

          focus() {}
          getValue() {
            Handsontable.editors.BaseEditor.prototype.getValue();
          }
          setValue() {
            Handsontable.editors.BaseEditor.prototype.setValue();
          }
          open() {
            Handsontable.editors.BaseEditor.prototype.open();
          }
          close() {
            Handsontable.editors.BaseEditor.prototype.close();
          }
        }

        if (editorCache && !editorCache.has(componentName)) {
          mountedComponent = createVueComponent(vNode, this, {});

          editorCache.set(componentName, mountedComponent);

        } else {
          mountedComponent = editorCache.get(componentName);
        }

        Object.entries(Handsontable.editors.BaseEditor.prototype).forEach(entry => {
          const methodName: string = entry[0];

          if ((requiredMethods.includes(methodName) || methodName !== 'prepare') && mountedComponent[methodName]) {
            CustomEditor.prototype[methodName] = function () {
              return mountedComponent[methodName](...arguments);
            }

          } else if (methodName === 'prepare') {
            const defaultPrepare: (...args: any[]) => any = CustomEditor.prototype[methodName];

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
