<template>
  <div :id="this.root"></div>
</template>

<script lang="ts">
  import Handsontable from 'hot-alias';
  import {
    hotInit,
    hotDestroy,
    propFactory,
    propWatchFactory,
    updateHotSettings,
    updateBulkHotSettings,
    PropSchema
  } from './helpers';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    props: propFactory(),
    name: 'HotTable'
  })
  export default class HotTable extends Vue {
    watch(): object {
      return propWatchFactory(updateHotSettings, updateBulkHotSettings);
    }

    mounted(): void {
      return hotInit.call(this, Handsontable);
    };

    beforeDestroy(): void {
      return hotDestroy.call(this);
    };
  }

  export { HotTable };
</script>

<style>
</style>
