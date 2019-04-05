import HotTable from '../src/HotTable.vue';
import HotColumn from '../src/HotColumn.vue';
import { mount } from '@vue/test-utils';
import { LRUMap } from '../src/lib/lru/lru';
import Vue from 'vue';
import { createSampleData, mockClientDimensions } from './_helpers';

describe('createColumnSettings', () => {
  it('should create the column settings based on the data provided to the `hot-column` component and it\'s child components', () => {
    const dummyRendererComponent = {
      render: function (h) {
        return h('DIV', 'test-value');
      }
    };
    const dummyEditorComponent = {
      render: function (h) {
        return h();
      },
      data: function () {
        return {
          getValue: function () {
            return 'test-value-editor';
          }
        }
      }
    };

    let App = Vue.extend({
      render(h) {
        // HotTable
        return h(HotTable, {
          props: {
            data: createSampleData(1, 1),
            licenseKey: 'non-commercial-and-evaluation',
            init: function () {
              mockClientDimensions(this.rootElement, 400, 400);
            }
          }
        }, [
          // HotColumn #1
          h(HotColumn, {
            props: {
              title: 'test-title'
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
          ]),
          // HotColumn #2
          h(HotColumn, {
            props: {
              readOnly: true,
              type: 'numeric',
              renderer: function () {
                return 'test-value2';
              }
            }
          })
        ])
      }
    });

    let testWrapper = mount(App, {
      attachToDocument: true
    });
    const hotTableComponent = testWrapper.vm.$children[0];

    expect(hotTableComponent.columnSettings[0].title).toEqual('test-title');
    expect(hotTableComponent.columnSettings[0].renderer(hotTableComponent.hotInstance, document.createElement('TD')).innerHTML).toEqual('<div>test-value</div>');
    expect((new hotTableComponent.columnSettings[0].editor()).getValue()).toEqual('test-value-editor');
    expect(hotTableComponent.columnSettings[1].title).toEqual(void 0);
    expect(hotTableComponent.columnSettings[1].readOnly).toEqual(true);
    expect(hotTableComponent.columnSettings[1].type).toEqual('numeric');
    expect(hotTableComponent.columnSettings[1].renderer()).toEqual('test-value2');

    expect(hotTableComponent.hotInstance.getSettings().columns[0].title).toEqual('test-title');
    expect(hotTableComponent.hotInstance.getSettings().columns[0].renderer(hotTableComponent.hotInstance, document.createElement('TD')).innerHTML).toEqual('<div>test-value</div>');
    expect((new (hotTableComponent.hotInstance.getSettings().columns[0].editor)()).getValue()).toEqual('test-value-editor');
    expect(hotTableComponent.hotInstance.getSettings().columns[1].title).toEqual(void 0);
    expect(hotTableComponent.hotInstance.getSettings().columns[1].readOnly).toEqual(true);
    expect(hotTableComponent.hotInstance.getSettings().columns[1].type).toEqual('numeric');
    expect(hotTableComponent.hotInstance.getSettings().columns[1].renderer()).toEqual('test-value2');

    testWrapper.destroy();
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
      $parent: {
        $data: {
          editorCache: new Map(),
          rendererCache: new LRUMap(100)
        }
      }
    };

    const getRendererWrapper = (HotColumn as any).methods.getRendererWrapper;
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
              $data: {},
              $el: document.createElement('TD')
            };
          }
        }
      }
    };
    const mockComponent = {
      $parent: {
        $data: {
          editorCache: new Map(),
          rendererCache: new LRUMap(100)
        }
      }
    };

    const getEditorClass = (HotColumn as any).methods.getEditorClass;

    expect(getEditorClass.call(mockComponent, mockVNode).constructor).not.toEqual(void 0);
    expect(getEditorClass.call(mockComponent, mockVNode).prototype.prepare).not.toEqual(void 0);
  });
});

describe('renderer cache', () => {
  it('should cache the same amount of cells, as they are in the table (below LRU limit)', () => {
    const dummyRendererComponent = {
      render: function (h) {
        return h();
      }
    };

    let App = Vue.extend({
      render(h) {
        // HotTable
        return h(HotTable, {
          props: {
            data: createSampleData(20, 2),
            width: 400,
            height: 400,
            licenseKey: 'non-commercial-and-evaluation',
            init: function () {
              mockClientDimensions(this.rootElement, 400, 400);
            }
          }
        }, [
          // HotColumn #1
          h(HotColumn, {
            props: {}
          }, [
            h(dummyRendererComponent, {
              attrs: {
                'hot-renderer': true
              }
            })
          ]),
          // HotColumn #2
          h(HotColumn, {
            props: {}
          }, [
            h(dummyRendererComponent, {
              attrs: {
                'hot-renderer': true
              }
            })
          ])
        ])
      }
    });

    let testWrapper = mount(App, {
      attachToDocument: true
    });
    const hotTableComponent = testWrapper.vm.$children[0];

    expect(hotTableComponent.rendererCache.size).toEqual(40);

    testWrapper.destroy();
  });

  it('should cache the maximum amount of cells possible in the LRU map, if the number of cells exceeds this limit', () => {
    const dummyRendererComponent = {
      render: function (h) {
        return h();
      }
    };

    let App = Vue.extend({
      render(h) {
        // HotTable
        return h(HotTable, {
          props: {
            data: createSampleData(200, 2),
            width: 400,
            height: 400,
            licenseKey: 'non-commercial-and-evaluation',
            init: function () {
              mockClientDimensions(this.rootElement, 400, 400);
            },
            wrapperRendererCacheSize: 100
          }
        }, [
          // HotColumn #1
          h(HotColumn, {
            props: {}
          }, [
            h(dummyRendererComponent, {
              attrs: {
                'hot-renderer': true
              }
            })
          ]),
          // HotColumn #2
          h(HotColumn, {
            props: {}
          }, [
            h(dummyRendererComponent, {
              attrs: {
                'hot-renderer': true
              }
            })
          ])
        ])
      }
    });

    let testWrapper = mount(App, {
      attachToDocument: true
    });
    const hotTableComponent = testWrapper.vm.$children[0];

    expect(hotTableComponent.rendererCache.size).toEqual(100);

    testWrapper.destroy();
  });
});

describe('hot-column children', () => {
  it('should add as many hot-column children as there are cached renderers and editors for that column', () => {
    const dummyRendererComponent = {
      render: function (h) {
        return h();
      }
    };
    const dummyEditorComponent = {
      render: function (h) {
        return h();
      }
    };

    let App = Vue.extend({
      render(h) {
        // HotTable
        return h(HotTable, {
          props: {
            data: createSampleData(50, 2),
            width: 400,
            height: 400,
            licenseKey: 'non-commercial-and-evaluation',
            init: function () {
              mockClientDimensions(this.rootElement, 400, 400);
            }
          }
        }, [
          // HotColumn #1
          h(HotColumn, {
            props: {}
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
          ]),
          // HotColumn #2
          h(HotColumn, {
            props: {}
          }, [
            h(dummyRendererComponent, {
              attrs: {
                'hot-renderer': true
              }
            })
          ])
        ])
      }
    });

    let testWrapper = mount(App, {
      attachToDocument: true
    });
    const hotTableComponent = testWrapper.vm.$children[0];

    expect(hotTableComponent.rendererCache.size).toEqual(100);
    expect(hotTableComponent.$children[0].$children.length).toEqual(51);
    expect(hotTableComponent.$children[1].$children.length).toEqual(50);

    testWrapper.destroy();
  });
});
