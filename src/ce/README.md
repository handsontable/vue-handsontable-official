<img src="https://raw.githubusercontent.com/handsontable/static-files/master/Images/Logo/Handsontable/handsontable-vue.png" alt="Handsontable Community Edition for Vue" />

<br/>

**Handsontable Community Edition for Vue** is the official wrapper for [**Handsontable Community Edition**](//github.com/handsontable/handsontable), an open source data grid component with a spreadsheet look & feel. It easily integrates with any data source and comes with lots of useful features like data binding, validation, sorting or powerful context menu.

[![Build status](https://travis-ci.org/handsontable/vue-handsontable-official.png?branch=master)](//travis-ci.org/handsontable/vue-handsontable-official)

<br/>

## Table of contents

 1. [Installation](#installation)
 2. [Getting Started](#getting-started)
 3. [Documentation](#documentation)
 4. [What to use it for?](#what-to-use-it-for)
 5. [Features](#features)
 6. [Screenshot](#screenshot)
 7. [Resources](#resources)
 8. [Support](#support)
 9. [Contributing](#contributing)
 10. [Licensing](#licensing)

<br/>

## Installation
Use npm to download the project.
```bash
npm install handsontable @handsontable/vue
```

<br/>

## Getting Started
Assuming that you have installed the wrapper with npm, now you just need to include Handsontable styles into your build system and use `<HotTable>` just like any other Vue component.

**Vue Component**
```vue
<template>
  <hot-table :settings="settings"></hot-table>
</template>

<script>
  import { HotTable } from '@handsontable/vue';

  export default {
    data: function() {
      return {
        settings: {
          data: [
            ["", "Ford", "Volvo", "Toyota", "Honda"],
            ["2016", 10, 11, 12, 13],
            ["2017", 20, 11, 14, 13],
            ["2018", 30, 15, 12, 13]
          ],
          colHeaders: true,
          rowHeaders: true,
        }
      };
    },
    components: {
      HotTable
    }
  }
</script>

<style src="../node_modules/handsontable/dist/handsontable.full.css"></style>
```

<br/>

## Documentation
Visit [docs.handsontable.com](//docs.handsontable.com/vue) to get more Handsontable for Vue examples and guides.

<br/>

## What to use it for?
The list below gives a rough idea on what you can do with Handsontable, but it shouldn't limit you in any way:

- Database editing
- Configuration controlling
- Data merging
- Team scheduling
- Sales reporting
- Financial analysis

<br/>

## Features

Some of the most popular features include:

- Sorting data
- Data validation
- Conditional formatting
- Freezing rows/columns
- Merging cells
- Defining custom cell types
- Moving rows/columns
- Resizing rows/columns
- Context menu
- Adding comments to cells
- Dragging fill handle to populate data
- Internationalization
- Non-contiguous selection

<br/>

## Screenshot
<div align="center">
<a href="//handsontable.com/examples">
<img src="https://raw.githubusercontent.com/handsontable/static-files/master/Images/Screenshots/handsontable-ce-showcase.png" align="center" alt="Handsontable Community Edition for Vue" />
</a>
</div>

<br/>

## Resources
- [Guides](//docs.handsontable.com/vue)
- [API Reference](//docs.handsontable.com/Core.html)
- [Release notes](//github.com/handsontable/vue-handsontable-official/releases)
- [Roadmap](//trello.com/b/PztR4hpj)
- [Twitter](//twitter.com/handsontable)

<br/>

## Support
You can report your issues here on [GitHub](//github.com/handsontable/vue-handsontable-official/issues).

An open source version of Handsontable doesn't include technical support. You need to purchase the [Handsontable Pro](//handsontable.com/pricing) license or [contact us](//handsontable.com/contact) directly in order to obtain a technical support from the Handsontable team.

<br/>

## Contributing
If you would like to help us to develop this wrapper for Vue, please read the [guide for contributors](//github.com/handsontable/vue-handsontable-official/blob/master/CONTRIBUTING.md) first.

<br/>

## Licensing
This wrapper is released under [the MIT license](//github.com/handsontable/vue-handsontable-official/blob/master/LICENSE).

<br/>

Copyrights belong to Handsoncode sp. z o.o.
