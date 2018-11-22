<img src="https://raw.githubusercontent.com/handsontable/static-files/master/Images/Logo/Handsontable/handsontable-pro-vue.png" alt="Handsontable Pro for Vue" />

<br/>

**Handsontable Pro for Vue** is the official wrapper for [**Handsontable Pro**](//github.com/handsontable/handsontable-pro), a commercial data grid component with a spreadsheet look & feel. It easily integrates with any data source and comes with lots of useful features like data binding, validation, sorting or powerful context menu.

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
 8. [License Key](#license-key)
 9. [Support](#support)
 10. [Contributing](#contributing)
 11. [License and Pricing](#license-and-pricing)

<br/>

## Installation
Use npm to download the project.
```bash
npm install handsontable-pro @handsontable-pro/vue
```

<br/>

## Getting Started
Assuming that you have installed the wrapper with npm, now you just need to include Handsontable styles into your build system and use `<HotTable>` just like any other Vue component.

**Vue Component**
```vue
<template>
  <HotTable :settings="settings"></HotTable>
</template>

<script>
  import { HotTable } from '@handsontable-pro/vue';

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

<style src="../node_modules/handsontable-pro/dist/handsontable.full.css"></style>
```

<br/>

## Documentation
Visit [docs.handsontable.com](//docs.handsontable.com/pro/vue) to get more Handsontable for Vue examples and guides.

<br/>

## What to use it for?
The list below gives a rough idea on what you can do with Handsontable Pro, but it shouldn't limit you in any way:

- Database editing
- Configuration controlling
- Data merging
- Team scheduling
- Sales reporting
- Financial analysis

<br/>

## Features

Some of the most popular features include:

- Filtering data **(Pro)**
- Nested headers **(Pro)**
- Export to file **(Pro)**
- Column summary **(Pro)**
- Sorting data
- Data validation
- Conditional formatting
- Context menu
- Adding comments to cells
- Dragging fill handle to populate data
- Internationalization
- Non-contiguous selection

<br/>

## Screenshot
<div align="center">
<a href="//handsontable.com/examples">
<img src="https://raw.githubusercontent.com/handsontable/static-files/master/Images/Screenshots/handsontable-pro-showcase.png" align="center" alt="Handsontable Pro for Vue" />
</a>
</div>

<br/>

## Resources
- [Guides](//docs.handsontable.com/pro/vue)
- [API Reference](//docs.handsontable.com/pro/Core.html)
- [Release notes](//github.com/handsontable/vue-handsontable-official/releases)
- [Roadmap](//trello.com/b/PztR4hpj)
- [Twitter](//twitter.com/handsontable)

<br/>

## License Key

After you buy the license for Handsontable Pro, you should receive a license key of your copy of the software. It will be available in your account at [my.handsontable.com](//my.handsontable.com).

Paste your license key to the configuration section, just like in the example below.

```js
const settings = {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  licenseKey: '00000-00000-00000-00000-00000'
};
```

Note that the license key is passed as a string so you need to wrap it in quotes ('').

<br/>

## Support
If you have a valid license of Handsontable Pro then your primary contact is through support team at [support@handsontable.com](mailto:support@handsontable.com)

You can also report your issues here on [GitHub](//github.com/handsontable/vue-handsontable-official/issues).

<br/>

## Contributing
If you would like to help us to develop this wrapper for Vue, please read the [guide for contributors](//github.com/handsontable/vue-handsontable-official/blob/master/CONTRIBUTING.md) first.

<br/>

## License and Pricing
This wrapper is released under [the MIT license](//github.com/handsontable/vue-handsontable-official/blob/master/LICENSE) but under the hood it uses Handsontable Pro, which is a commercial and paid software. You need to [purchase a license](//handsontable.com/pricing) in order to use it in production environment.

<br/>

Copyrights belong to Handsoncode sp. z o.o.
