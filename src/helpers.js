import Handsontable from 'handsontable';
import SettingsMapper from './settingsMapper';

/**
 * Rewrite the settings object passed to the watchers to be a clean array/object prepared to use withing Handsontable config.
 *
 * @param {Object} observerSettingsObject Watcher object containing the changed data.
 * @param {Boolean} needArray Flag defining wheter to return the result as an object or an array.
 * @returns {Object|Array}
 */
function rewriteSettings(observerSettingsObject, needArray) {
  let settings;

  if (needArray) {
    settings = [];
  } else {
    settings = {};
  }

  for (const p in observerSettingsObject) {
    if (observerSettingsObject.hasOwnProperty(p)) {
      settings[p] = observerSettingsObject[p];
    }
  }

  return settings;
}

/**
 * Initialize Handsontable.
 *
 * @param {Object} vueInstance The Vue component instance object.
 */
export function hotInit(vueInstance) {
  const settingsMapper = new SettingsMapper();
  let settings = {};

  if (vueInstance.settings) {
    settings = vueInstance.settings;

  } else {
    for (let prop in vueInstance._props) {
      if (vueInstance._props.hasOwnProperty(prop)) {
        if (vueInstance[prop]) {
          settings[prop] = vueInstance[prop];
        }
      }
    }
  }

  vueInstance.table = new Handsontable(vueInstance.$el, settingsMapper.prepare(settings));
}

/**
 * Destroy the Handsontable instance.
 *
 * @param {Object} vueInstance The Vue component instance object.
 */
export function hotDestroy(vueInstance) {
  vueInstance.table.destroy();
}

/**
 * Generate an object containing all the available Handsontable properties and plugin hooks.

 * @returns {Object}
 */
export function propFactory() {
  const settingsMapper = new SettingsMapper();
  const currentSettings = Handsontable.helper.clone(Handsontable.DefaultSettings.prototype);
  const registeredHooks = Handsontable.hooks.getRegistered();

  for (let prop in currentSettings) {
    if (currentSettings.hasOwnProperty(prop)) {
      currentSettings[prop] = {};
    }
  }

  for (let i = 0; i < registeredHooks.length; i++) {
    currentSettings[settingsMapper.addHookPrefix(registeredHooks[i])] = {};
  }

  currentSettings.root = {
    'type': String,
    'default': 'hot-' + new Date().getTime()
  };

  currentSettings.settings = {
    'type': Object
  };

  return currentSettings;
}

/**
 * Generate and object containing all the available Handsontable properties and hooks tied to the Handsontable updating function.
 *
 * @param {Function} updateFunction Function used to update a single changed property.
 * @param {Function} bulkUpdateFunction Function used to update the whole `settings` object.
 * @returns {Object}
 */
export function propWatchFactory(updateFunction, bulkUpdateFunction) {
  const props = propFactory();

  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (prop === 'settings') {
        props[prop] = function(...args) { return bulkUpdateFunction.call(this, prop, ...args); };

      } else {
        props[prop] = function(...args) { return updateFunction.call(this, prop, ...args); };
      }
    }
  }

  return props;
}

// The `this` value in the functions below points to the Vue component instance. They're not meant to used anywhere but in the context of the component.

/**
 * Update the Handsontable instance with a single changed property.
 *
 * @param {String} updatedProperty Updated property name.
 * @param {Object} updatedValue Watcher-generated updated value object.
 * @param {Object} oldValue Watcher-generated old value object.
 */
export function updateHotSettings(updatedProperty, updatedValue, oldValue) {
  const newSettings = {};
  newSettings[updatedProperty] = rewriteSettings(updatedValue, true);

  this.table.updateSettings(newSettings);
}

/**
 * Update the Handsontable instance with a whole changed `settings` property.
 *
 * @param {String} updatedProperty Updated property name.
 * @param {Object} updatedValue Watcher-generated updated value object.
 * @param {Object} oldValue Watcher-generated old value object.
 */
export function updateBulkHotSettings(updatedProperty, updatedValue, oldValue) {
  this.table.updateSettings(rewriteSettings(updatedValue));
}