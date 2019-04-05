<script lang="ts">
  import Vue, { VNode } from 'vue';
  import CombinedVueInstance from 'vue';
  import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
  import {
    propFactory,
    createVueComponent,
    getColumnVNode,
    filterPassedProps
  } from './helpers';
  import {
    HotTableProps,
    HotColumnMethods,
    EditorComponent
  } from './types';
  import Handsontable from 'handsontable';

  const HotColumn: ThisTypedComponentOptionsWithRecordProps<Vue, {}, HotColumnMethods, {}, HotTableProps> = {
    name: 'HotColumn',
    props: propFactory('HotColumn'),
    methods: {
      /**
       * Create the column settings based on the data provided to the `hot-column` component and it's child components.
       */
      createColumnSettings: function (): void {
        const hotColumnSlots: VNode[] | any[] = this.$slots.default || [];
        const rendererVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-renderer');
        const editorVNode: VNode | null = getColumnVNode(hotColumnSlots, 'hot-editor');
        const assignedProps = filterPassedProps(this.$props);

        if (rendererVNode && this.usesRendererComponent === void 0) {
          this.usesRendererComponent = true;
        }

        this.columnSettings = {...assignedProps};

        if (rendererVNode !== null) {
          this.columnSettings.renderer = this.getRendererWrapper(rendererVNode);

        } else if (assignedProps.renderer) {
          this.columnSettings.renderer = assignedProps.renderer;
        }

        if (editorVNode !== null) {
          this.columnSettings.editor = this.getEditorClass(editorVNode);

        } else if (assignedProps.editor) {
          this.columnSettings.editor = assignedProps.editor;
        }
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
          // Prevent caching and rendering of the GhostTable table cells
          if (TD && !TD.getAttribute('ghost-table')) {
            const rendererCache = $vm.$parent.$data.rendererCache;

            if (rendererCache && !rendererCache.has(`${row}-${col}`)) {
              const mountedComponent: CombinedVueInstance = createVueComponent(vNode, $vm, {});

              rendererCache.set(`${row}-${col}`, mountedComponent);
            }

            const cachedComponent: CombinedVueInstance = rendererCache.get(`${row}-${col}`);
            const rendererArgs: object = {
              instance,
              TD,
              row,
              col,
              prop,
              value,
              cellProperties,
            };

            Object.assign(cachedComponent.$data, rendererArgs);

            // Clear the previous contents of a TD
            while (TD.firstChild) {
              TD.removeChild(TD.firstChild);
            }

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
        let mountedComponent: EditorComponent = null;

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

          focus() {
          }

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

        Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(propName => {
          if (propName === 'constructor') {
            return;
          }

          if ((requiredMethods.includes(propName) || propName !== 'prepare') && mountedComponent[propName]) {
            CustomEditor.prototype[propName] = function () {
              return mountedComponent[propName](...arguments);
            }

          } else if (propName === 'prepare') {
            const defaultPrepare: (...args: any[]) => any = CustomEditor.prototype[propName];

            CustomEditor.prototype[propName] = function () {
              defaultPrepare.call(this, ...arguments);
              return mountedComponent[propName](...arguments);
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
