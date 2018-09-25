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
  import {ThisTypedComponentOptionsWithRecordProps} from 'vue/types/options';
  import {HotTableData, HotTableMethods, HotTableProps} from './types';

  const HotTable: ThisTypedComponentOptionsWithRecordProps<Vue, HotTableData, HotTableMethods, {}, HotTableProps> = {
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
    }
  };

  export default HotTable;
  export {HotTable};
</script>
