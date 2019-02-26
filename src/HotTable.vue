<template>
  <div :id="id"></div>
</template>

<script lang="ts">
  import {
    propFactory,
    propWatchFactory,
    updateHotSettings,
    hotInit
  } from './helpers';
  import Vue from 'vue';
  import {HotTableData, HotTableMethods, HotTableProps, HotTableComponent} from './types';
  import * as packageJson from '../package.json';

  const HotTable: HotTableComponent<Vue, HotTableData, HotTableMethods, {}, HotTableProps> = {
    name: 'HotTable',
    props: propFactory(),
    watch: propWatchFactory(updateHotSettings),
    data: function () {
      return {
        __internalEdit: false,
        hotInstance: null
      }
    },
    methods: {
      hotInit: hotInit
    },
    mounted: function () {
      return this.hotInit();
    },
    beforeDestroy: function () {
      this.hotInstance.destroy();
    },
    version: (packageJson as any).version
  };

  export default HotTable;
  export {HotTable};
</script>
