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
    prepareSettings
  } from './helpers';
  import Vue from 'vue';
  import { HotTableData, HotTableMethods, HotTableProps, HotTableComponent } from './types';
  import * as packageJson from '../package.json';
  import Handsontable from 'handsontable';

  const HotTable: HotTableComponent<Vue, HotTableData, HotTableMethods, {}, HotTableProps> = {
    name: 'HotTable',
    props: propFactory(),
    watch: propWatchFactory(updateHotSettings),
    data: function () {
      return {
        __internalEdit: false,
        hotInstance: null,
        columnSettings: null,
        rendererCache: new WeakMap(),
        editorCache: new Map()
      }
    },
    methods: {
      /**
       * Initialize Handsontable.
       */
      hotInit: function (): void {
        const unmappedSettings: any[] = [
          this.settings ? this.settings : this.$props,
        ];

        if (this.settings) {
          unmappedSettings.push(this.$props)
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

        if (this.$children.length > 0) {
          this.$children.forEach((elem, i) => {
            columnSettings.push({});

            columnSettings[columnSettings.length - 1] = { ...elem.columnSettings };
          });
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
