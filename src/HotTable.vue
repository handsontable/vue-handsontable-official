<template>
  <div :id="this.root"></div>
</template>

<script>
  import Handsontable from 'handsontable';
  import SettingsMapper from './settingsMapper';
  import {
    hotInit,
    hotDestroy,
    propFactory,
    propWatchFactory,
    updateHotSettings,
    updateBulkHotSettings
  } from './helpers';

  export default {
    name: 'HotTable',
    props: propFactory.call(this),
    watch: propWatchFactory.call(this, updateHotSettings, updateBulkHotSettings),
    mounted: function() { return hotInit.call(this); },
    beforeDestroy: function() { return hotDestroy.call(this); },
  };
</script>

<style>
  @import "handsontable/dist/handsontable.full.css";
</style>
