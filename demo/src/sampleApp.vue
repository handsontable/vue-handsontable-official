<template>
  <div id="example-container" class="wrapper">
    <div id="hot-options">
      <label v-on:click="toggleOption" for="fixed-rows"><input id="fixed-rows" type="checkbox"/>Add fixed
        rows</label><br/>
      <label v-on:click="toggleOption" for="fixed-columns"><input id="fixed-columns" type="checkbox"/>Add fixed columns</label><br/>
      <label v-on:click="toggleOption" for="row-headers"><input id="row-headers" type="checkbox"/>Enable row
        headers</label><br/>
      <label v-on:click="toggleOption" for="column-sorting"><input id="column-sorting"
                                                                   type="checkbox"/>Enable sorting</label><br/>
      <label v-on:click="toggleOption" for="column-resize"><input id="column-resize" type="checkbox"/>Enable column resizing</label><br/>
    </div>
    <div id="hot-preview">
      <HotTable :root="root" :settings="hotSettings"></HotTable>
    </div>
  </div>
</template>

<script>
  import HotTable from 'vue-handsontable-official';
  import Vue from 'vue';

  export default {
    data: function() {
      return {
        root: 'test-hot',
        hotSettings: {
          data: function(rows, columns) {
            const result = [];
            for (let i = 0; i < rows; i++) {
              let row = [];
              for (let j = 0; j < columns; j++) {
                row.push('[' + i + ', ' + j + ']');
              }
              result.push(row);
            }
            return result;
          }(40, 40),
          colHeaders: true
        }
      };
    },
    methods: {
      toggle: function(input, property, onValue, offValue) {
        if (onValue === void 0) {
          onValue = true;
        }
        if (offValue === void 0) {
          offValue = false;
        }


        if (input.checked) {
          Vue.set(this.hotSettings, property, onValue);

        } else {
          Vue.set(this.hotSettings, property, offValue);
        }
      },
      toggleOption: function(event) {
        if (event.target.tagName.toLowerCase() !== 'input') {
          return false;
        }

        switch (event.target.id) {
          case 'fixed-rows':
            this.toggle(event.target, 'fixedRowsTop', 3, 0);
            break;
          case 'fixed-columns':
            this.toggle(event.target, 'fixedColumnsLeft', 3, 0);
            break;
          case 'row-headers':
            this.toggle(event.target, 'rowHeaders');
            break;
          case 'column-sorting':
            this.toggle(event.target, 'columnSorting');
            break;
          case 'column-resize':
            this.toggle(event.target, 'manualColumnResize');
            break;
        }
      }
    },
    name: 'SampleApp',
    components: {
      HotTable
    }
  }
</script>

<style>
  #example-container {
    position: relative;
  }

  #hot-options {
    width: 200px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px;
    font-size: 14px;
  }

  #hot-preview {
    margin-left: 220px;
  }

  #test-hot {
    width: 600px;
    height: 400px;
    overflow: hidden;
  }
</style>