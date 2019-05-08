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

              rendererCache.set(`${row}-${col}`, {
                component: mountedComponent,
                lastUsedTD: null
              });
            }

            const cachedEntry = rendererCache.get(`${row}-${col}`);
            const cachedComponent: CombinedVueInstance = cachedEntry.component;
            const cachedTD: HTMLTableCellElement = cachedEntry.lastUsedTD;
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

            if (!cachedComponent.$el.parentElement || cachedTD !== TD) {
              // Clear the previous contents of a TD
              while (TD.firstChild) {
                TD.removeChild(TD.firstChild);
              }

              TD.appendChild(cachedComponent.$el);

              cachedEntry.lastUsedTD = TD;
            }
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
        const componentName: string = (vNode.componentOptions.Ctor as any).options.name;
        const editorCache = this.$parent.$data.editorCache;
        let mountedComponent: EditorComponent = null;

        if (editorCache && !editorCache.has(componentName)) {
          mountedComponent = createVueComponent(vNode, this, {});

          editorCache.set(componentName, mountedComponent);

        } else {
          mountedComponent = editorCache.get(componentName);
        }

        return mountedComponent.$data.hotCustomEditorClass;
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
