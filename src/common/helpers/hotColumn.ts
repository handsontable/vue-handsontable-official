import CombinedVueInstance, { VNode } from 'vue';
import { SubComponentParent } from '../types';
import Handsontable from 'hot-alias';

/**
 * Get the VNode child of the `hot-column` component.
 *
 * @param {Array} hotColumnSlots Array of slots from the `hot-column` component.
 * @param {String} type Type of the child component. Either `hot-renderer` or `hot-editor`.
 * @returns {Object|null} The VNode of the child component (or `null` when nothing's found).
 */
export function getColumnVNode(hotColumnSlots: VNode[], type: string): VNode {
  let componentVNode: VNode = null;

  hotColumnSlots.every((slot, index) => {
    if (slot.data && slot.data.attrs && slot.data.attrs[type] !== void 0) {
      componentVNode = slot;
      return false;
    }

    return true;
  });

  return componentVNode;
}

/**
 * Create an instance of the Vue Component based on the provided VNode.
 *
 * @param {Object} VNode VNode element to be turned into a component instance.
 * @param {Object} parent Instance of the component to be marked as a parent of the newly created instance.
 * @param {Object} props Props to be passed to the new instance.
 */
export function createVueComponent(VNode: VNode, parent: SubComponentParent, props: object): CombinedVueInstance {
  const HotTableComponent: SubComponentParent = parent;
  const settings: object = {
    propsData: props,
    parent: HotTableComponent,
    router: HotTableComponent.$router,
    store: HotTableComponent.$store,
  };

  return (new (VNode.componentOptions as any).Ctor(settings)).$mount();
}

/**
 * A wrapper class for the custom editor. It takes a field of `mountedComponent` (assigned in the HotColumn logic) and uses
 * its methods to create a custom editor to be used in Handsontable.
 */
export class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
  mountedComponent: any;

  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    this.fillWithInitialData(row, col, prop, td, originalValue, cellProperties);
  }

  fillWithInitialData(row, col, prop, td, originalValue, cellProperties) {
    this.mountedComponent.$data.row = row;
    this.mountedComponent.$data.column = col;
    this.mountedComponent.$data.columnProp = prop;
    this.mountedComponent.$data.td = td;
    this.mountedComponent.$data.originalValue = originalValue;
    this.mountedComponent.$data.cellProperties = cellProperties;

    this.mountedComponent.finishEditing = (restoreOriginalValue, ctrlDown, callback) => {
      super.finishEditing(restoreOriginalValue, ctrlDown, callback);
    };
  }

  // TODO: remove `focus` after it's added to the BaseEditor.
  focus() {}
}
