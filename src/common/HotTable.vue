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
    PropSchema
  } from './helpers';
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    watch: propWatchFactory(updateHotSettings),
    props: propFactory(),
    name: 'HotTable'
  })
  export default class HotTable extends Vue {
    __internalEdit: boolean = false;

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
