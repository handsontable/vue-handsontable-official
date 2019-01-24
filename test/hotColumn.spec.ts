import HotColumnConstructor from '../src/common/HotColumn.vue';

describe('createColumnSettings', () => {
  it('should create the column settings based on the data provided to the `hot-column` component and it\'s child components', () => {
    // mocks
    interface MockInstance {
      $slots: object,
      $props: {
        prop1: string,
        prop2: string
      },
      columnSettings?: {
        prop1?: string,
        prop2?: string,
        renderer?: string,
        editor?: string
      },
      hasProp: Function,
      getRendererWrapper: Function,
      getEditorClass: Function
    }

    const mockHotColumnInstance: MockInstance = {
      $slots: {
        'default': [
          {
            data: {
              attrs: {
                'hot-renderer': true
              }
            }
          }, {
            data: {
              attrs: {
                'hot-editor': true
              }
            }
          }
        ]
      },
      $props: {
        prop1: 'prop1',
        prop2: 'prop2'
      },
      hasProp: () => true,
      getRendererWrapper: () => 'renderer',
      getEditorClass: () => 'editor'
    };

    const createColumnSettings = (HotColumnConstructor as any).methods.createColumnSettings;

    createColumnSettings.call(mockHotColumnInstance);

    expect(mockHotColumnInstance.columnSettings.prop1).toEqual('prop1');
    expect(mockHotColumnInstance.columnSettings.prop2).toEqual('prop2');
    expect(mockHotColumnInstance.columnSettings.renderer).toEqual('renderer');
    expect(mockHotColumnInstance.columnSettings.editor).toEqual('editor');
  });

  it('should create the column settings based solely on the data provided to the `hot-column` component', () => {
    // mocks
    interface MockInstance {
      $slots: object,
      $props: {
        prop1: string,
        prop2: string,
        renderer: string,
        editor: string
      },
      columnSettings?: {
        prop1?: string,
        prop2?: string,
        renderer?: string,
        editor?: string
      },
      hasProp: Function
    }

    const mockHotColumnInstance: MockInstance = {
      $slots: {},
      $props: {
        prop1: 'prop1',
        prop2: 'prop2',
        renderer: 'renderer',
        editor: 'editor'
      },
      hasProp: () => true
    };

    const createColumnSettings = (HotColumnConstructor as any).methods.createColumnSettings;

    createColumnSettings.call(mockHotColumnInstance);

    expect(mockHotColumnInstance.columnSettings.prop1).toEqual('prop1');
    expect(mockHotColumnInstance.columnSettings.prop2).toEqual('prop2');
    expect(mockHotColumnInstance.columnSettings.renderer).toEqual('renderer');
    expect(mockHotColumnInstance.columnSettings.editor).toEqual('editor');
  });
});

describe('hasProp', () => {
  it('should check if the `hot-column` component has the defined prop defined.', () => {
    // mocks
    const mockHotColumnInstance: object = {
      $props: {
        prop1: 'prop1',
        prop2: 'prop2',
        renderer: 'renderer'
      }
    };
    const hasProp = (HotColumnConstructor as any).methods.hasProp;

    expect(hasProp.call(mockHotColumnInstance, 'prop1')).toEqual(true);
    expect(hasProp.call(mockHotColumnInstance, 'prop2')).toEqual(true);
    expect(hasProp.call(mockHotColumnInstance, 'renderer')).toEqual(true);
    expect(hasProp.call(mockHotColumnInstance, 'nonexistentProp')).toEqual(false);
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

    const getRendererWrapper = (HotColumnConstructor as any).methods.getRendererWrapper;
    const mockTD = document.createElement('TD');

    expect(typeof getRendererWrapper.call(mockVNode)).toEqual('function');
    expect(getRendererWrapper.call(mockVNode, mockVNode)({}, mockTD, 0, 0, 0, '', {})).toEqual(mockTD);
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

    const getEditorClass = (HotColumnConstructor as any).methods.getEditorClass;

    expect(getEditorClass.call(mockVNode, mockVNode).constructor).not.toEqual(void 0);
    expect(getEditorClass.call(mockVNode, mockVNode).prototype.prepare).not.toEqual(void 0);
  });
});
