import SettingsMapper from '../src/settingsMapper';

describe('Settings Mapper', () => {
  describe('prepareProp', () => {
    it('should trim the `on`-prefixed property name and return it with a proper casing', () => {
      const settingsMapper = new SettingsMapper();
      const prepareProp = settingsMapper.prepareProp.bind(settingsMapper);

      expect(prepareProp('onAfterChange')).toEqual('afterChange');
      expect(prepareProp('onBeforeChange')).toEqual('beforeChange');
      expect(prepareProp('onAfterSetCellMeta')).toEqual('afterSetCellMeta');
    });
  });

  describe('prepare', () => {
    it('should prepare the settings object containing the `on`-properties and return an object with the `on`-properties trimmed', () => {
      const settingsMapper = new SettingsMapper();
      const prepare = settingsMapper.prepare.bind(settingsMapper);

      const onPrefixedPropObj = {
        'onAfterChange': {},
        'onAfterCellMetaReset': {},
        'onAfterChangesObserved': {},
        'onAfterContextMenuDefaultOptions': {},
        'onBeforeContextMenuSetItems': {},
        'onAfterDropdownMenuDefaultOptions': {},
        'onBeforeDropdownMenuSetItems': {},
        'onAfterContextMenuHide': {},
        'onAfterContextMenuShow': {},
        'onAfterCopyLimit': {},
        'onBeforeCreateCol': {},
        'onAfterCreateCol': {},
        'onBeforeCreateRow': {},
        'onAfterCreateRow': {}
      };

      const result = prepare(onPrefixedPropObj);

      expect(typeof result.afterChange).toEqual('object');
      expect(typeof result.afterCellMetaReset).toEqual('object');
      expect(typeof result.afterChangesObserved).toEqual('object');
      expect(typeof result.afterContextMenuDefaultOptions).toEqual('object');
      expect(typeof result.beforeContextMenuSetItems).toEqual('object');
      expect(typeof result.afterDropdownMenuDefaultOptions).toEqual('object');
      expect(typeof result.beforeDropdownMenuSetItems).toEqual('object');
      expect(typeof result.afterContextMenuHide).toEqual('object');
      expect(typeof result.afterContextMenuShow).toEqual('object');
      expect(typeof result.afterCopyLimit).toEqual('object');
      expect(typeof result.beforeCreateCol).toEqual('object');
      expect(typeof result.afterCreateCol).toEqual('object');
      expect(typeof result.beforeCreateRow).toEqual('object');
      expect(typeof result.afterCreateRow).toEqual('object');

      expect(typeof result.randomPropName).toEqual('undefined');
      expect(typeof result.onAfterChange).toEqual('undefined');
    });

    it('should prepare the settings object containing the `on`-properties and return an object with the `on`-properties trimmed (when two objects are provided)', () => {
      const settingsMapper = new SettingsMapper();
      const prepare = settingsMapper.prepare.bind(settingsMapper);

      const onPrefixedPropObj = {
        'onAfterChange': {},
        'onAfterCellMetaReset': {},
        'onAfterChangesObserved': {},
        'onAfterContextMenuDefaultOptions': {},
        'onBeforeContextMenuSetItems': {},
        'onAfterDropdownMenuDefaultOptions': {},
        'onBeforeDropdownMenuSetItems': {},
        'onAfterContextMenuHide': {}
      };

      const secondOnPrefixedPropObj = {
        'onAfterContextMenuHide': {},
        'onAfterContextMenuShow': {},
        'onAfterCopyLimit': {},
        'onBeforeCreateCol': {},
        'onAfterCreateCol': {},
        'onBeforeCreateRow': {},
        'onAfterCreateRow': {}
      };

      const result = prepare(onPrefixedPropObj, secondOnPrefixedPropObj);

      expect(typeof result.afterChange).toEqual('object');
      expect(typeof result.afterCellMetaReset).toEqual('object');
      expect(typeof result.afterChangesObserved).toEqual('object');
      expect(typeof result.afterContextMenuDefaultOptions).toEqual('object');
      expect(typeof result.beforeContextMenuSetItems).toEqual('object');
      expect(typeof result.afterDropdownMenuDefaultOptions).toEqual('object');
      expect(typeof result.beforeDropdownMenuSetItems).toEqual('object');
      expect(typeof result.afterContextMenuHide).toEqual('object');
      expect(typeof result.afterContextMenuShow).toEqual('object');
      expect(typeof result.afterCopyLimit).toEqual('object');
      expect(typeof result.beforeCreateCol).toEqual('object');
      expect(typeof result.afterCreateCol).toEqual('object');
      expect(typeof result.beforeCreateRow).toEqual('object');
      expect(typeof result.afterCreateRow).toEqual('object');

      expect(typeof result.randomPropName).toEqual('undefined');
      expect(typeof result.onAfterChange).toEqual('undefined');
    });
  });

  describe('addHookPrefix', () => {
    it('Should add the `on` prefix to the provided hook name', () => {
      const settingsMapper = new SettingsMapper();
      const addHookPrefix = settingsMapper.addHookPrefix.bind(settingsMapper);

      expect(addHookPrefix('afterChange')).toEqual('onAfterChange');
      expect(addHookPrefix('afterCellMetaReset')).toEqual('onAfterCellMetaReset');
      expect(addHookPrefix('afterChangesObserved')).toEqual('onAfterChangesObserved');
      expect(addHookPrefix('afterContextMenuDefaultOptions')).toEqual('onAfterContextMenuDefaultOptions');
      expect(addHookPrefix('beforeContextMenuSetItems')).toEqual('onBeforeContextMenuSetItems');

      // should not work for non-hook names
      expect(addHookPrefix('randomString')).toEqual('randomString');
    });
  });

  describe('trimHookPrefix', () => {
    it('Should add the `on` prefix to the provided hook name', () => {
      const settingsMapper = new SettingsMapper();
      const trimHookPrefix = settingsMapper.trimHookPrefix.bind(settingsMapper);

      expect(trimHookPrefix('onAfterChange')).toEqual('afterChange');
      expect(trimHookPrefix('onAfterCellMetaReset')).toEqual('afterCellMetaReset');
      expect(trimHookPrefix('onAfterChangesObserved')).toEqual('afterChangesObserved');
      expect(trimHookPrefix('onAfterContextMenuDefaultOptions')).toEqual('afterContextMenuDefaultOptions');
      expect(trimHookPrefix('onbeforeContextMenuSetItems')).toEqual('beforeContextMenuSetItems');

      // should not work for non-hook names
      expect(trimHookPrefix('onRandomString')).toEqual('onRandomString');
    });
  });
});