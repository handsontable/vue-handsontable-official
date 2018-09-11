<template>
  <div :id="id"></div>
</template>

<script lang="ts">
  import Handsontable from 'hot-alias';
  import {
    hotInit,
    hotDestroy,
    propFactory,
    propWatchFactory,
    updateHotSettings,
    HotTableProps
  } from './helpers';
  import Vue from 'vue';
  import {ThisTypedComponentOptionsWithRecordProps} from 'vue/types/options';

  const HotTable: ThisTypedComponentOptionsWithRecordProps<Vue, {}, {}, {}, HotTableProps> = {
    name: 'HotTable',
    props: propFactory(),
    watch: propWatchFactory(updateHotSettings),
    mounted: function () {
      return hotInit.call(this, Handsontable);
    },
    beforeDestroy: function () {
      return hotDestroy.call(this);
    }
  };

  export default HotTable;
  export {HotTable};
</script>

<style>
</style>
