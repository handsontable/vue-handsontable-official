<template>
  <div :id="id">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {
    propFactory,
    propWatchFactory,
    updateHotSettings,
    preventInternalEditWatch,
    prepareSettings,
    filterPassedProps
  } from './helpers';
  import Vue from 'vue';
  import { HotTableData, HotTableMethods, HotTableProps, HotTableComponent, VueProps } from './types';
  import * as packageJson from '../package.json';
  import { LRUMap } from './lib/lru/lru';
  import Handsontable from 'handsontable';

  const HotTable: HotTableComponent<Vue, HotTableData, HotTableMethods, {}, HotTableProps> = {
    name: 'HotTable',
    props: propFactory('HotTable'),
    watch: propWatchFactory(updateHotSettings),
    data: function () {
      const rendererCache = new LRUMap(this.wrapperRendererCacheSize);

      // Make the LRU cache destroy each removed component
      rendererCache.shift = function () {
        let entry = LRUMap.prototype.shift.call(this);
        entry[1].$destroy();

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
    methods: {
      /**
       * Initialize Handsontable.
       */
      hotInit: function (): void {
        const assignedProps: VueProps<HotTableProps> = filterPassedProps(this.$props);
        const unmappedSettings: any[] = [
          this.settings ? this.settings : assignedProps,
        ];

        if (this.settings) {
          unmappedSettings.push(assignedProps)
        }

        const newSettings: Handsontable.GridSettings = prepareSettings(unmappedSettings[0], unmappedSettings[1]);

        newSettings.columns = this.columnSettings ? this.columnSettings : newSettings.columns;

        this.hotInstance = new Handsontable(this.$el, newSettings);

        preventInternalEditWatch(this);
      },
      /**
       * Get settings for the columns provided in the `hot-column` components.
       */
      getColumnSettings: function (): HotTableProps[] | void {
        const columnSettings: HotTableProps[] = [];
        let usesRendererComponent = false;

        if (this.$children.length > 0) {
          this.$children.forEach((elem, i) => {
            columnSettings.push({});

            columnSettings[columnSettings.length - 1] = {...elem.columnSettings};

            if (!usesRendererComponent && elem.usesRendererComponent) {
              usesRendererComponent = true;
            }
          });
        }

        if (usesRendererComponent &&
          (this.settings && (this.settings.autoColumnSize !== false || this.settings.autoRowSize)) &&
          (this.autoColumnSize !== false || this.autoRowSize)) {
          console.warn('Your `hot-table` configuration includes both `hot-column` and `autoRowSize`/`autoColumnSize`, which are not compatible with each other ' +
            'in this version of `@handsontable/vue`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.')
        }

        return columnSettings.length ? columnSettings : void 0;
      },
      updateHotSettings: updateHotSettings
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
