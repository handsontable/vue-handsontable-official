import Handsontable, {DefaultSettings} from 'hot-alias';
import SettingsMapper from './settingsMapper';
import { PropOptions } from 'vue';

export interface PropSchema extends Handsontable.DefaultSettings {
  root?: PropOptions,
  settings?: PropOptions,
  hotInstance: Handsontable
}

/**
 * Rewrite the settings object passed to the watchers to be a clean array/object prepared to use within Handsontable config.
 *
 * @param {*} observerSettings Watcher object containing the changed data.
 * @returns {Object|Array}
 */
export function rewriteSettings(observerSettings): Handsontable.DefaultSettings {
  let settings: Handsontable.DefaultSettings = null;
  let isObserverObjectLike: boolean = false;

  if (typeof observerSettings === 'object' || Object.prototype.toString.call(observerSettings).indexOf('Array') > -1) {
    settings = {};
    isObserverObjectLike = true;
  }

  if (isObserverObjectLike) {
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
 * Initialize Handsontable.
 */
export function hotInit(): void {
  const settingsMapper: SettingsMapper = new SettingsMapper();
  const unmappedSettings: PropSchema[] = [
    this.settings ? this.settings : this._props,
  ];

  if (this.settings) {
    unmappedSettings.push(this._props)
  }

  this.table = new Handsontable(this.$el, settingsMapper.prepare(unmappedSettings[0], unmappedSettings[1]));
}

/**
 * Destroy the Handsontable instance.
 */
export function hotDestroy(): void {
  this.table.destroy();
}

/**
 * Generate an object containing all the available Handsontable properties and plugin hooks (with the `on`-prefixes added).
 *
 * @returns {Object}
 */
export function propFactory() {
  const settingsMapper: SettingsMapper = new SettingsMapper();
  const registeredHooks: string[] = Handsontable.hooks.getRegistered();

  //TODO: workaround for `DefaultSettings` being an interface and not a class in `handsontable.ts`
  const hotTemp: any = Handsontable;
  const propSchema = new hotTemp.DefaultSettings();

  for (let prop in propSchema) {
    if (propSchema.hasOwnProperty(prop)) {
      propSchema[prop] = {};
    }
  }

  for (let i = 0; i < registeredHooks.length; i++) {
    propSchema[settingsMapper.addHookPrefix(registeredHooks[i])] = {
      type: Function
    };
  }

  propSchema.root = {
    type: String,
    default: 'hot-' + new Date().getTime()
  };

  propSchema.settings = {
    type: Object as () => Handsontable.DefaultSettings
  };

  if (this) {
    propSchema.hotInstance = this.table;
  }

  return propSchema;


  // const settingsMapper: SettingsMapper = new SettingsMapper();
  // const registeredHooks: string[] = Handsontable.hooks.getRegistered();
  //
  // //TODO: workaround for `DefaultSettings` being an interface and not a class in `handsontable.ts`
  // const hotTemp: any = Handsontable;
  // const propSchema: PropSchema = new hotTemp.DefaultSettings();
  //
  // for (let prop in propSchema) {
  //   if (propSchema.hasOwnProperty(prop)) {
  //     propSchema[prop] = {};
  //   }
  // }
  //
  // for (let i = 0; i < registeredHooks.length; i++) {
  //   propSchema[settingsMapper.addHookPrefix(registeredHooks[i])] = {
  //     type: Function
  //   };
  // }
  //
  // propSchema.root = {
  //   type: String,
  //   default: 'hot-' + new Date().getTime()
  // };
  //
  // propSchema.settings = {
  //   type: Object as () => Handsontable.DefaultSettings
  // };
  //
  // if (this) {
  //   propSchema.hotInstance = this.table;
  // }
  //
  // return propSchema;
}

/**
 * Generate and object containing all the available Handsontable properties and hooks tied to the Handsontable updating function.
 *
 * @param {Function} updateFunction Function used to update a single changed property.
 * @param {Function} bulkUpdateFunction Function used to update the whole `settings` object.
 * @returns {Object}
 */
export function propWatchFactory(updateFunction: Function, bulkUpdateFunction: Function): object {
  const props: object = propFactory();
  const watchList: object = {};

  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (prop === 'settings') {
        watchList[prop] = {
          handler: function(...args) { return bulkUpdateFunction.call(this, prop, ...args); },
          deep: true
        };

      } else {
        watchList[prop] = {
          handler: function(...args) { return updateFunction.call(this, prop, ...args); },
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

  newSettings[updatedProperty] = rewriteSettings(updatedValue);
  this.table.updateSettings(newSettings);
}

/**
 * Update the Handsontable instance with a whole changed `settings` property.
 *
 * @param {String} updatedProperty Updated property name.
 * @param {Object} updatedValue Watcher-generated updated value object.
 * @param {Object} oldValue Watcher-generated old value object.
 */
export function updateBulkHotSettings(updatedProperty: string, updatedValue: object, oldValue: object) {
  this.table.updateSettings(rewriteSettings(updatedValue));
}
