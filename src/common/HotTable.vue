<template>
  <div :id="this.root"></div>
</template>

<script>
  import Handsontable from 'hot-alias';
  import {
    hotInit,
    hotDestroy,
    propFactory,
    propWatchFactory,
    updateHotSettings,
    updateBulkHotSettings
  } from '../common/helpers';

  export default {
    name: 'HotTable',
    props: propFactory.call(this, Handsontable),
    watch: propWatchFactory.call(this, updateHotSettings, updateBulkHotSettings),
    mounted: function() { return hotInit.call(this, Handsontable); },
    beforeDestroy: function() { return hotDestroy.call(this); },
  };
</script>

<style>
</style>
