import HotTable from '../src/HotTable.vue';
import BaseEditorComponent from '../src/BaseEditorComponent.vue';
import { mount } from '@vue/test-utils';
import { createSampleData, mockClientDimensions } from './_helpers';
import { LRUMap } from "../src/lib/lru/lru";
import Vue from 'vue';

describe('hotInit', () => {
  it('should initialize Handsontable and assign it to the `hotInstace` property of the provided object', () => {
    let testWrapper = mount(HotTable, {
      propsData: {
        data: createSampleData(1, 1),
        licenseKey: 'non-commercial-and-evaluation'
      }
    });

    expect(typeof testWrapper.vm.hotInstance).toEqual('object');
    expect(testWrapper.vm.hotInstance.getDataAtCell(0, 0)).toEqual('0-0');
  });
});

describe('Updating the Handsontable settings', () => {
  it('should update the previously initialized Handsontable instance with a single changed property', () => {
    let updateSettingsCalls = 0;
    let testWrapper = mount(HotTable, {
      propsData: {
        data: createSampleData(1, 1),
        licenseKey: 'non-commercial-and-evaluation',
        rowHeaders: true,
        afterUpdateSettings: function () {
          updateSettingsCalls++;
        }
      }
    });

    expect(testWrapper.vm.hotInstance.getSettings().rowHeaders).toEqual(true);

    testWrapper.setProps({
      rowHeaders: false
    });

    expect(updateSettingsCalls).toEqual(1);
    expect(testWrapper.vm.hotInstance.getSettings().rowHeaders).toEqual(false);
  });

  it('should update the previously initialized Handsontable instance only once with multiple changed properties', async() => {
    let App = Vue.extend({
      data: function () {
        return {
          rowHeaders: true,
          colHeaders: true,
          readOnly: true,
        }
      },
      methods: {
        updateData: function () {
          this.rowHeaders = false;
          this.colHeaders = false;
          this.readOnly = false;
        }
      },
      render(h) {
        // HotTable
        return h(HotTable, {
          ref: 'hotInstance',
          props: {
            rowHeaders: this.rowHeaders,
            colHeaders: this.colHeaders,
            readOnly: this.readOnly,
            afterUpdateSettings: function () {
              updateSettingsCalls++;
            }
          }
        })
      }
    });

    let testWrapper = mount(App, {
      sync: false
    });

    let updateSettingsCalls = 0;

    const hotTableComponent = testWrapper.vm.$children[0];

    expect(hotTableComponent.hotInstance.getSettings().rowHeaders).toEqual(true);
    expect(hotTableComponent.hotInstance.getSettings().colHeaders).toEqual(true);
    expect(hotTableComponent.hotInstance.getSettings().readOnly).toEqual(true);

    testWrapper.vm.updateData();

    await Vue.nextTick();
    expect(updateSettingsCalls).toEqual(1);
    expect(hotTableComponent.hotInstance.getSettings().rowHeaders).toEqual(false);
    expect(hotTableComponent.hotInstance.getSettings().colHeaders).toEqual(false);
    expect(hotTableComponent.hotInstance.getSettings().readOnly).toEqual(false);
  });

  it('should update the previously initialized Handsontable instance with only the options that are passed to the component as props', async() => {
    let newHotSettings = null;
    let App = Vue.extend({
      data: function () {
        return {
          rowHeaders: true,
          colHeaders: true,
          readOnly: true,
        }
      },
      methods: {
        updateData: function () {
          this.rowHeaders = false;
          this.colHeaders = false;
          this.readOnly = false;
        }
      },
      render(h) {
        // HotTable
        return h(HotTable, {
          ref: 'hotInstance',
          props: {
            rowHeaders: this.rowHeaders,
            colHeaders: this.colHeaders,
            readOnly: this.readOnly,
            minSpareRows: 4,
            afterUpdateSettings: function (newSettings) {
              newHotSettings = newSettings
            }
          }
        })
      }
    });

    let testWrapper = mount(App, {
      sync: false
    });

    testWrapper.vm.updateData();

    await Vue.nextTick();

    expect(Object.keys(newHotSettings).length).toBe(5)
  });
});

describe('getRendererWrapper', () => {
  it('should create the wrapper function for the provided renderer child component', () => {
    // mocks
    const mockVNode = {
      componentOptions: {
        Ctor: class {
          $mount() {
            return {
              $data: {},
              $el: document.createElement('TD')
            };
          }
        }
      }
    };
    const mockComponent = {
      editorCache: new Map(),
      rendererCache: new LRUMap(100),
      $parent: {}
    };

    const getRendererWrapper = (HotTable as any).methods.getRendererWrapper;
    const mockTD = document.createElement('TD');

    expect(typeof getRendererWrapper.call(mockComponent, mockVNode, mockComponent)).toEqual('function');
    expect(getRendererWrapper.call(mockComponent, mockVNode, mockComponent)({}, mockTD, 0, 0, 0, '', {})).toEqual(mockTD);
  });
});

describe('getEditorClass', () => {
  it('should create a fresh class to be used as an editor, based on the editor component provided.', () => {
    // mocks
    const mockVNode = {
      componentOptions: {
        Ctor: class {
          static get options() {
            return {
              name: 'name'
            };
          }

          $mount() {
            return {
              $data: {
                hotCustomEditorClass: class B {
                  prepare() {
                    return 'not-undefined';
                  }
                }
              },
              $el: document.createElement('TD')
            };
          }
        }
      }
    };
    const mockComponent = {
      editorCache: new Map(),
      rendererCache: new LRUMap(100),
      $parent: {}
    };

    const getEditorClass = (HotTable as any).methods.getEditorClass;
    const editorClass = getEditorClass.call(mockComponent, mockVNode, mockComponent);

    expect(editorClass.constructor).not.toEqual(void 0);
    expect(editorClass.prototype.prepare).not.toEqual(void 0);
  });
});

describe('Global editors and renderers', () => {
  it('should allow defining renderer and editor components to work globally on the entire table', () => {
    const dummyHtmlElement = document.createElement('DIV');
    dummyHtmlElement.id = 'dummy';

    const dummyEditorComponent = Vue.component('renderer-component', {
      name: 'EditorComponent',
      extends: BaseEditorComponent,
      render: function (h) {
        return h('div', {
          'attrs': {
            'id': 'dummy-editor'
          }
        });
      }
    });

    const dummyRendererComponent = Vue.component('renderer-component', {
      name: 'RendererComponent',
      render: function (h) {
        return h('div', {
          'attrs': {
            'id': 'dummy-renderer'
          }
        });
      }
    });

    let App = Vue.extend({
      render(h) {
        // HotTable
        return h(HotTable, {
          props: {
            data: createSampleData(50, 2),
            autoRowSize: false,
            autoColumnSize: false,
            width: 400,
            height: 400,
            init: function () {
              mockClientDimensions(this.rootElement, 400, 400);
            }
          }
        }, [
          h(dummyRendererComponent, {
            attrs: {
              'hot-renderer': true
            }
          }),
          h(dummyEditorComponent, {
            attrs: {
              'hot-editor': true
            }
          })
        ])
      }
    });

    let testWrapper = mount(App, {
      attachToDocument: true
    });
    const hotTableComponent = testWrapper.vm.$children[0];
    const globalEditor = hotTableComponent.hotInstance.getSettings().editor;
    const globalEditorInstance = new globalEditor(hotTableComponent.hotInstance);

    expect(globalEditorInstance._fullEditMode).toEqual(false);
    expect(globalEditorInstance.hot).toEqual(hotTableComponent.hotInstance);
    expect(hotTableComponent.hotInstance.getSettings().renderer(hotTableComponent.hotInstance, document.createElement('DIV'), 555, 0, 0, '0', {}).childNodes[0].id).toEqual('dummy-renderer');

    testWrapper.destroy();
  });
});

it('should inject an `isRenderer` and `isEditor` properties to renderer/editor components', () => {
  const dummyEditorComponent = Vue.component('renderer-component', {
    name: 'EditorComponent',
    extends: BaseEditorComponent,
    render: function (h) {
      return h('div', {
        'attrs': {
          'id': 'dummy-editor'
        }
      });
    }
  });

  const dummyRendererComponent = Vue.component('renderer-component', {
    name: 'RendererComponent',
    render: function (h) {
      return h('div', {
        'attrs': {
          'id': 'dummy-renderer'
        }
      });
    }
  });

  let App = Vue.extend({
    render(h) {
      // HotTable
      return h(HotTable, {
        props: {
          data: createSampleData(50, 2),
          licenseKey: 'non-commercial-and-evaluation',
          autoRowSize: false,
          autoColumnSize: false
        }
      }, [
        h(dummyRendererComponent, {
          attrs: {
            'hot-renderer': true
          }
        }),
        h(dummyEditorComponent, {
          attrs: {
            'hot-editor': true
          }
        })
      ])
    }
  });

  let testWrapper = mount(App, {
    attachToDocument: true
  });
  const hotTableComponent = testWrapper.vm.$children[0];

  expect(hotTableComponent.$data.rendererCache.get('0-0').component.$data.isRenderer).toEqual(true);
  expect(hotTableComponent.$data.editorCache.get('EditorComponent').$data.isEditor).toEqual(true);

  testWrapper.destroy();
});

it('should be possible to access the `hotInstance` property of the HotTable instance from a parent-component', () => {
  let hotInstanceFromRef = 'not-set';
  let App = Vue.extend({
    data: function () {
      return {
        rowHeaders: true,
        colHeaders: true,
        readOnly: true,
      }
    },
    methods: {
      cellsCallback: function() {
        if (hotInstanceFromRef === 'not-set') {
          hotInstanceFromRef = this.$refs.hTable.hotInstance;
        }
      }
    },
    render(h) {
      // HotTable
      return h(HotTable, {
        ref: 'hTable',
        props: {
          rowHeaders: this.rowHeaders,
          colHeaders: this.colHeaders,
          readOnly: this.readOnly,
          cells: this.cellsCallback
        }
      })
    }
  });

  let testWrapper = mount(App, {
    attachToDocument: true
  });

  expect(['not-set', null].includes(hotInstanceFromRef)).toBe(false);

  testWrapper.destroy();
});
