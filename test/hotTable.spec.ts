import HotTable from '../src/HotTable.vue';
import BaseVueHotEditor from '../src/BaseVueHotEditor.vue';
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

describe('updateHotSettings', () => {
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

    expect(typeof getRendererWrapper.call(mockComponent)).toEqual('function');
    expect(getRendererWrapper.call(mockComponent, mockVNode)({}, mockTD, 0, 0, 0, '', {})).toEqual(mockTD);
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
    const editorClass = getEditorClass.call(mockComponent, mockVNode);

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
      extends: BaseVueHotEditor,
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
