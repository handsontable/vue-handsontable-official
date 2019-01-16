import CombinedVueInstance, { VNode } from 'vue';
import { SubComponentParent } from "../types";

/**
 * Get the VNode child of the `hot-column` component.
 *
 * @param {Array} hotColumnSlots Array of slots from the `hot-column` component.
 * @param {String} type Type of the child component. Either `hot-renderer` or `hot-editor`.
 * @returns {Object} The VNode of the child component.
 */
export function getColumnVNode(hotColumnSlots: VNode[], type: string): VNode {
  let componentVNode = null;

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
  const HotTableComponent = parent;
  const settings = {
    propsData: props,
    parent: HotTableComponent,
    router: HotTableComponent.$router,
    store: HotTableComponent.$store,
  };

  return (new VNode.componentOptions.Ctor(settings)).$mount();
}
