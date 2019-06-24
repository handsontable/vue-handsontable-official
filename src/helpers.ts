import { VNode } from 'vue';
import Handsontable from 'handsontable';
import { HotTableProps, VueProps, SubComponentParent, EditorComponent } from './types';

const unassignedPropSymbol = Symbol('unassigned');

/**
 * Rewrite the settings object passed to the watchers to be a clean array/object prepared to use within Handsontable config.
 *
 * @param {*} observerSettings Watcher object containing the changed data.
 * @returns {Object|Array}
 */
export function rewriteSettings(observerSettings): any[] | object {
  const settingsType = Object.prototype.toString.call(observerSettings);
  let settings: any[] | object | null = null;
  let type: { array?: boolean, object?: boolean } = {};

  if (settingsType === '[object Array]') {
    settings = [];
    type.array = true;

  } else if (settingsType === '[object Object]') {
    settings = {};
    type.object = true;
  }

  if (type.array || type.object) {
    for (const p in observerSettings) {
      if (observerSettings.hasOwnProperty(p)) {
        settings[p] = observerSettings[p];
      }
    }

  } else {
    settings = observerSettings;
  }

  return settings;
}

/**
 * Private method to ensure the table is not calling `updateSettings` after editing cells.
 * @private
 */
export function preventInternalEditWatch(component) {
  component.hotInstance.addHook('beforeChange', () => {
    component.__internalEdit = true;
  });

  component.hotInstance.addHook('beforeCreateRow', () => {
    component.__internalEdit = true;
  });

  component.hotInstance.addHook('beforeCreateCol', () => {
    component.__internalEdit = true;
  });

  component.hotInstance.addHook('beforeRemoveRow', () => {
    component.__internalEdit = true;
  });

  component.hotInstance.addHook('beforeRemoveCol', () => {
    component.__internalEdit = true;
  });
}

/**
 * Generate an object containing all the available Handsontable properties and plugin hooks.
 *
 * @param {String} source Source for the factory (either 'HotTable' or 'HotColumn').
 * @returns {Object}
 */
export function propFactory(source): VueProps<HotTableProps> {
  const registeredHooks: string[] = Handsontable.hooks.getRegistered();

  const propSchema: VueProps<HotTableProps> = new Handsontable.DefaultSettings();

  for (let prop in propSchema) {
    propSchema[prop] = {
      default: unassignedPropSymbol
    };
  }

  for (let i = 0; i < registeredHooks.length; i++) {
    propSchema[registeredHooks[i]] = {
      default: unassignedPropSymbol
    };
  }

  propSchema.settings = {
    default: unassignedPropSymbol
  };

  if (source === 'HotTable') {
    propSchema.id = {
      type: String,
      default: 'hot-' + Math.random().toString(36).substring(5)
    };

    propSchema.wrapperRendererCacheSize = {
      type: Number,
      default: 3000
    };
  }

  return propSchema;
}

/**
 * Filter out all of the unassigned props, and return only the one passed to the component.
 *
 * @param {Object} props Object containing all the possible props.
 * @returns {Object} Object containing only used props.
 */
export function filterPassedProps(props) {
  const filteredProps: VueProps<HotTableProps> = {};
  const columnSettingsProp = props['settings'];

  if (columnSettingsProp !== unassignedPropSymbol) {
    for (let propName in columnSettingsProp) {
      if (columnSettingsProp.hasOwnProperty(propName) && columnSettingsProp[propName] !== unassignedPropSymbol) {
        filteredProps[propName] = columnSettingsProp[propName];
      }
    }
  }

  for (let propName in props) {
    if (props.hasOwnProperty(propName) && propName !== 'settings' && props[propName] !== unassignedPropSymbol) {
      filteredProps[propName] = props[propName];
    }
  }

  return filteredProps;
}

/**
 * Generate and object containing all the available Handsontable properties and hooks tied to the Handsontable updating function.
 *
 * @param {Function} updateFunction Function used to update a single changed property.
 * @returns {Object}
 */
export function propWatchFactory(updateFunction: Function) {
  const props: object = propFactory('HotTable');
  const watchList = {};

  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (prop !== 'settings') {
        watchList[prop] = {
          handler: function (...args) {
            return updateFunction.call(this, prop, ...args);
          },
          deep: true
        };

        watchList[`settings.${prop}`] = {
          handler: function (...args) {
            return updateFunction.call(this, prop, ...args);
          },
          deep: true
        };
      }
    }
  }

  return watchList;
}

// The `this` value in the functions below points to the Vue component instance. They're not meant to used anywhere but in the context of the component.

/**
 * Update the Handsontable instance with a single changed property.
 *
 * @param {String} updatedProperty Updated property name.
 * @param {Object} updatedValue Watcher-generated updated value object.
 * @param {Object} oldValue Watcher-generated old value object.
 */
export function updateHotSettings(updatedProperty: string, updatedValue: object, oldValue: object) {
  const newSettings = {};

  if (updatedProperty === 'data' && this.__internalEdit === true) {
    this.__internalEdit = false;
    return;
  }

  newSettings[updatedProperty] = rewriteSettings(updatedValue);
  this.hotInstance.updateSettings(newSettings);
}

/**
 * Prepare the settings object containing the `on`-properties to be used in the Handsontable configuration.
 *
 * @param {Object} settings An object containing the properties, including the `on`-prefixed hook names.
 * @param {Object} [additionalSettings] An additional object containing the properties, including the `on`-prefixed hook names.
 * @returns {Object} An object containing the properties, with the `on`-prefixes trimmed.
 */
export function prepareSettings(settings: object, additionalSettings?: object): Handsontable.GridSettings {
  const newSettings = {};

  for (const key in settings) {
    if (settings.hasOwnProperty(key) && settings[key] !== void 0) {
      newSettings[key] = settings[key];
    }
  }

  for (const key in additionalSettings) {
    if (key !== 'settings' && key !== 'wrapperRendererCacheSize' && additionalSettings.hasOwnProperty(key) && additionalSettings[key] !== void 0) {
      newSettings[key] = additionalSettings[key];
    }
  }

  return newSettings;
}

/**
 * Get the VNode element with the provided type attribute from the component slots.
 *
 * @param {Array} componentSlots Array of slots from a component.
 * @param {String} type Type of the child component. Either `hot-renderer` or `hot-editor`.
 * @returns {Object|null} The VNode of the child component (or `null` when nothing's found).
 */
export function findVNodeByType(componentSlots: VNode[], type: string): VNode {
  let componentVNode: VNode = null;

  componentSlots.every((slot, index) => {
    if (slot.data && slot.data.attrs && slot.data.attrs[type] !== void 0) {
      componentVNode = slot;
      return false;
    }

    return true;
  });

  return componentVNode;
}

/**
 * Get all `hot-column` component instances from the provided children array.
 *
 * @param {Array} children Array of children from a component.
 * @returns {Array} Array of `hot-column` instances.
 */
export function getHotColumnComponents(children) {
  const hotColumns = [];

  children.forEach((child, index) => {
    if (child.$options.name === 'HotColumn') {
      hotColumns.push(child);
    }
  });

  return hotColumns;
}

/**
 * Create an instance of the Vue Component based on the provided VNode.
 *
 * @param {Object} vNode VNode element to be turned into a component instance.
 * @param {Object} parent Instance of the component to be marked as a parent of the newly created instance.
 * @param {Object} rootComponent Instance of the root component (HotTable), owner of the `$router` and `$store` properties.
 * @param {Object} props Props to be passed to the new instance.
 * @param {Object} data Data to be passed to the new instance.
 */
export function createVueComponent(vNode: VNode, parent: object, rootComponent: SubComponentParent, props: object, data: object): EditorComponent {
  const settings: object = {
    propsData: props,
    parent,
    router: rootComponent.$router,
    store: rootComponent.$store,
    data
  };

  if (!document.querySelector('#vueHotEditors')) {
    const builkEditorContainer = document.createElement('DIV');
    builkEditorContainer.id = 'vueHotEditors';

    document.body.appendChild(builkEditorContainer);
  }

  const editorContainer = document.createElement('DIV');
  document.querySelector('#vueHotEditors').appendChild(editorContainer);

  return (new (vNode.componentOptions as any).Ctor(settings)).$mount(editorContainer);
}

