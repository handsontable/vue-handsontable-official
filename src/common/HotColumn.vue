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
    propFactory
  } from './helpers';
  import {
    createVueComponent,
    CustomEditor,
    getColumnVNode
  } from './helpers/hotColumn';
  import {
    HotTableProps,
    HotColumnMethods
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

        const hotColumnSlots: VNode[] = this.$slots.default;
        const rendererVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-renderer');
        const editorVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-editor');

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
              const mountedComponent: CombinedVueInstance = createVueComponent(VNode, $vm, {});

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
       * @param {Object} VNode VNode for the editor child component.
       * @returns {Class} The class used as an editor in Handsontable.
       */
      getEditorClass: function (VNode: VNode): typeof CustomEditor {
        const requiredMethods: string[] = ['focus', 'open', 'close', 'getValue', 'setValue'];
        const componentName: string = (VNode.componentOptions.Ctor as any).options.name;
        let mountedComponent: object = null;
        let customEditorClass: typeof CustomEditor = null;

        if (!editorCache.has(componentName)) {
          mountedComponent = createVueComponent(VNode, this, {});

          editorCache.set(componentName, mountedComponent);

        } else {
          mountedComponent = editorCache.get(componentName);
        }

        customEditorClass = CustomEditor;
        customEditorClass.prototype.mountedComponent = mountedComponent;

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
