<template>
  <div :id="id">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {
    propFactory,
    preventInternalEditWatch,
    prepareSettings,
    filterPassedProps,
    createVueComponent,
    findVNodeByType,
    getHotColumnComponents
  } from './helpers';
  import Vue, { VNode } from 'vue';
  import {
    HotTableData,
    HotTableMethods,
    HotTableProps,
    HotTableComponent,
    VueProps,
    EditorComponent
  } from './types';
  import * as packageJson from '../package.json';
  import { LRUMap } from './lib/lru/lru';
  import Handsontable from 'handsontable';

  const HotTable: HotTableComponent<Vue, HotTableData, HotTableMethods, {}, HotTableProps> = {
    name: 'HotTable',
    props: propFactory('HotTable'),
    watch: {
      mergedHotSettings: function() {
        this.hotInstance.updateSettings(this.mergedHotSettings);
      }
    },
    data: function () {
      const rendererCache = new LRUMap(this.wrapperRendererCacheSize);

      // Make the LRU cache destroy each removed component
      rendererCache.shift = function () {
        let entry = LRUMap.prototype.shift.call(this);
        entry[1].component.$destroy();

        return entry;
      };

      return {
        __internalEdit: false,
        hotInstance: null,
        columnSettings: null,
        rendererCache: rendererCache,
        editorCache: new Map()
      }
    },
    computed: {
      mergedHotSettings: function(): Handsontable.GridSettings {
        const assignedProps: VueProps<HotTableProps> = filterPassedProps(this.$props);
        const unfilteredSettingsFromProps: any[] = [
          this.settings ? this.settings : assignedProps,
        ];
        if (this.settings) {
          unfilteredSettingsFromProps.push(assignedProps)
        }
        return prepareSettings(unfilteredSettingsFromProps[0], unfilteredSettingsFromProps[1]);
      }
    },
    methods: {
      /**
       * Initialize Handsontable.
       */
      hotInit: function (): void {
        const assignedProps: VueProps<HotTableProps> = filterPassedProps(this.$props);
        const unfilteredSettingsFromProps: any[] = [
          this.settings ? this.settings : assignedProps,
        ];
        const globalRendererVNode = this.getGlobalRendererVNode();
        const globalEditorVNode = this.getGlobalEditorVNode();

        if (this.settings) {
          unfilteredSettingsFromProps.push(assignedProps)
        }

        const newSettings: Handsontable.GridSettings = prepareSettings(unfilteredSettingsFromProps[0], unfilteredSettingsFromProps[1]);

        newSettings.columns = this.columnSettings ? this.columnSettings : newSettings.columns;

        if (globalEditorVNode) {
          newSettings.editor = this.getEditorClass(globalEditorVNode, this);

          globalEditorVNode.child.$destroy();
        }

        if (globalRendererVNode) {
          newSettings.renderer = this.getRendererWrapper(globalRendererVNode, this);

          globalRendererVNode.child.$destroy();
        }

        this.hotInstance = new Handsontable(this.$el, newSettings);

        preventInternalEditWatch(this);
      },
      getGlobalRendererVNode: function (): VNode | null {
        const hotTableSlots: VNode[] = this.$slots.default || [];
        return findVNodeByType(hotTableSlots, 'hot-renderer');
      },
      getGlobalEditorVNode: function (): VNode | null {
        const hotTableSlots: VNode[] = this.$slots.default || [];
        return findVNodeByType(hotTableSlots, 'hot-editor');
      },
      /**
       * Get settings for the columns provided in the `hot-column` components.
       */
      getColumnSettings: function (): HotTableProps[] | void {
        const hotColumns = getHotColumnComponents(this.$children);
        let usesRendererComponent = false;
        let columnSettings: HotTableProps[] = hotColumns.map((elem) => {
          if (elem.usesRendererComponent) {
            usesRendererComponent = true;
          }

          return {...elem.columnSettings};
        });

        if (usesRendererComponent &&
          (this.settings && (this.settings.autoColumnSize !== false || this.settings.autoRowSize)) &&
          (this.autoColumnSize !== false || this.autoRowSize)) {
          console.warn('Your `hot-table` configuration includes both `hot-column` and `autoRowSize`/`autoColumnSize`, which are not compatible with each other ' +
            'in this version of `@handsontable/vue`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.')
        }

        return columnSettings.length ? columnSettings : void 0;
      },
      /**
       * Create the wrapper function for the provided renderer child component.
       *
       * @param {Object} vNode VNode of the renderer child component.
       * @param {Boolean} containerComponent Instance of the component, which will be treated as a parent for the newly created renderer component.
       * @returns {Function} The wrapper function used as the renderer.
       */
      getRendererWrapper: function (vNode: VNode, containerComponent: Vue): (...args) => HTMLElement {
        const $vm = this;

        return function (instance, TD, row, col, prop, value, cellProperties) {
          // Prevent caching and rendering of the GhostTable table cells
          if (TD && !TD.getAttribute('ghost-table')) {
            const rendererCache = $vm.rendererCache;
            const rendererArgs: object = {
              hotInstance: instance,
              TD,
              row,
              col,
              prop,
              value,
              cellProperties,
              isRenderer: true
            };

            if (rendererCache && !rendererCache.has(`${row}-${col}`)) {
              const mountedComponent: Vue = createVueComponent(vNode, containerComponent, {}, rendererArgs);

              rendererCache.set(`${row}-${col}`, {
                component: mountedComponent,
                lastUsedTD: null
              });
            }

            const cachedEntry = rendererCache.get(`${row}-${col}`);
            const cachedComponent: Vue = cachedEntry.component;
            const cachedTD: HTMLTableCellElement = cachedEntry.lastUsedTD;

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
       * @param {Boolean} containerComponent Instance of the component, which will be treated as a parent for the newly created editor component.
       * @returns {Class} The class used as an editor in Handsontable.
       */
      getEditorClass: function (vNode: VNode, containerComponent: Vue): typeof Handsontable.editors.BaseEditor {
        const componentName: string = (vNode.componentOptions.Ctor as any).options.name;
        const editorCache = this.editorCache;
        let mountedComponent: EditorComponent = null;

        if (!editorCache.has(componentName)) {
          mountedComponent = createVueComponent(vNode, containerComponent, {}, {isEditor: true});

          editorCache.set(componentName, mountedComponent);

        } else {
          mountedComponent = editorCache.get(componentName);
        }

        return mountedComponent.$data.hotCustomEditorClass;
      },
    },
    mounted: function () {
      this.columnSettings = this.getColumnSettings();

      return this.hotInit();
    },
    beforeDestroy: function () {
      this.hotInstance.destroy();
    },
    version: (packageJson as any).version
  };

  export default HotTable;
  export { HotTable };
</script>
