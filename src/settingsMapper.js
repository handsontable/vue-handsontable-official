import Handsontable from 'handsontable';

export default class SettingsMapper {
  constructor() {
    this.registeredHooks = Handsontable.hooks.getRegistered();
  }

  /**
   * Prepare the `on`-property to be used in the Handsontable configuration.
   *
   * @param {String} property The name of the property, starting with `on`.
   * @returns {String} The proper property name, with the `on` part trimmed.
   */
  prepareProp(property) {
    return this.trimHookPrefix(property);
  }

  /**
   * Prepare the settings object containing the `on`-properties to be used in the Handsontable configuration.
   *
   * @param {Object} settings An object containing the properties, including the `on`-prefixed hook names.
   * @returns {Object} An object containing the properties, with the `on`-prefixes trimmed.
   */
  prepare(settings) {
    const newSettings = {};

    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        newSettings[this.prepareProp(key)] = settings[key];
      }
    }

    return newSettings;
  }

  /**
   * Add the `on` prefix to the provided hook name.
   *
   * @param {String} prop Handsontable plugin hook name.
   * @returns {String}
   */
  addHookPrefix(prop) {
    if (prop.indexOf('after') === 0 || prop.indexOf('before') === 0) {
      let hookName = 'on' + prop.charAt(0).toUpperCase() + prop.slice(1, prop.length);

      return hookName;
    }

    return prop;
  }

  /**
   * Trim the `on` hook prefix.
   *
   * @param {String} prop Settings property.
   * @returns {String} Handsontable-compatible, prefix-less property name.
   */
  trimHookPrefix(prop) {
    if (prop.indexOf('on') === 0) {
      let hookName = prop.charAt(2).toLowerCase() + prop.slice(3, prop.length);
      if (this.registeredHooks.indexOf(hookName)) {
        return hookName;
      }
    }

    // returns the string anyway, when we're sure all the hooks are registered, might be changed
    return prop;
  }
}