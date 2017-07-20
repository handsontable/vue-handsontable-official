# vue-handsontable-official  [![Build Status](https://travis-ci.org/handsontable/vue-handsontable-official.png?branch=master)](https://travis-ci.org/handsontable/vue-handsontable-official)
A Vue.js wrapper for the the [Handsontable](https://github.com/handsontable/handsontable) spreadsheet component.

## Table of contents
1. [Installation](#installation)
2. [Basic usage](#basic-usage)
3. [Examples](#examples)
4. [License](#license)
5. [Contact](#contact)
6. [Other wrappers](#other-wrappers)

## Installation

For detailed installation instructions, please take a look at our wiki under ["Installation guide"](https://github.com/handsontable/vue-handsontable-official/wiki/Installation-guide).

## Basic usage
`vue-handsontable-official` creates a `<HotTable>` component. You can use it just like any other Vue component. For example:

```
<template>
  <div id="hot-preview">
    <HotTable :root="root" :settings="hotSettings"></HotTable>
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
          data: [['sample', 'data']],
          colHeaders: true
        }
      };
    },
    components: {
      HotTable
    }
  }
</script>

<style>
  #test-hot {
    width: 600px;
    height: 400px;
    overflow: hidden;
  }
</style>
```

Note, that you can pass options to Handsontable either as:
* individual component properties
```jsx
<HotTable root="hot-example" :data="hotData" :rowHeaders="true"/>
```
* an object passed to a single `settings` property
```jsx
<HotTable root="hot-example" :settings="settingsObject" />
```

The `root` property declares the `id` of the root element for the table. It is optional - if it isn't provided, the table will get a randomly generated `id`.

## Examples
Please see the [/demo](https://github.com/handsontable/vue-handsontable-official/tree/master/demo) directory for a sample app using `vue-handsontable-official`. 

You can check out a live version of this example at [handsontable.github.io/vue-handsontable-official/demo](https://handsontable.github.io/vue-handsontable-official/demo).

## License
`vue-handsontable-official` is released under the [MIT license](https://github.com/handsontable/vue-handsontable-official/blob/master/LICENSE).
Copyrights belong to Handsoncode sp. z o.o.

## Contact
Feel free to give us feedback on this wrapper using this [contact form](https://handsontable.com/contact.html) or write directly at hello@handsontable.com.

## Other Wrappers
Handsontable comes with more wrappers and directives for popular frameworks:

- [hot-table](https://github.com/handsontable/hot-table) (Polymer - WebComponents)
- [ngHandsontable](https://github.com/handsontable/ngHandsontable) (Angular 1)
- [react-handsontable](https://github.com/handsontable/react-handsontable) (React)