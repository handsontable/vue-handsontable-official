import {
  getColumnVNode,
  createVueComponent
} from '../src/common/helpers/hotColumn';
import Vue from 'vue';

describe('getColumnVNode', () => {
  it('should get the VNode child of the `hot-column` component.', () => {
    // mocks
    const mockHotRendererVNode = {
      data: {
        attrs: {
          'hot-renderer': true
        }
      }
    };
    const mockHotEditorVNode = {
      data: {
        attrs: {
          'hot-editor': true
        }
      }
    };

    // cast to `any` to use VNode mocks
    const getColumnVNodeAny = getColumnVNode as any;

    expect(getColumnVNodeAny([mockHotEditorVNode, mockHotRendererVNode], 'hot-renderer')).toEqual(mockHotRendererVNode);
    expect(getColumnVNodeAny([mockHotEditorVNode, mockHotRendererVNode], 'hot-editor')).toEqual(mockHotEditorVNode);
    expect(getColumnVNodeAny([mockHotEditorVNode, mockHotRendererVNode], 'hot-whatever')).toEqual(null);
    expect(getColumnVNodeAny([mockHotRendererVNode], 'hot-editor')).toEqual(null);
  });
});

describe('createVueComponent', () => {
  it('should create an instance of the Vue Component based on the provided VNode using its $mount method.', () => {
    const testDiv = document.createElement('DIV');
    testDiv.id = 'vue-test';
    document.body.appendChild(testDiv);

    const mockSubComponent = {
      props: ['testProp'],
      render: (h) => {
        return h(
          "div",
          {},
          []
        );
      }
    };

    const mockComponent = {
      components: {
        'sc': mockSubComponent
      },
      render: (h) => {
        return h(
          "div",
          {},
          [
            h('sc')
          ]
        );
      }
    };

    const vue = new Vue({
      el: '#vue-test',
      components: {
        'mc': mockComponent
      },
      render: (h) => {
        return h(
          "div",
          {},
          [
            h('mc')
          ]
        );
      }
    });

    const sampleVNode = vue.$children[0].$children[0].$vnode;
    const sampleParentComponent = vue.$children[0] as any;

    expect(createVueComponent(sampleVNode, sampleParentComponent, {}).$parent).toEqual(vue.$children[0]);
    expect(createVueComponent(sampleVNode, sampleParentComponent, {'testProp': 'test-prop-value'}).$props['testProp']).toEqual('test-prop-value');
  });
});
