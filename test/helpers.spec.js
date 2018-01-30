import {
  rewriteSettings,
  hotInit,
  hotDestroy,
  propFactory,
  propWatchFactory,
  updateHotSettings,
  updateBulkHotSettings
} from '../src/helpers';

describe('rewriteSettings', () => {
  it('should rewrite the settings element passed to the watchers to be a clean object prepared to use withing Handsontable config, when the input element is an object', () => {
    const fakeWatcher = () => {};
    fakeWatcher.prototype.sampleMethod = () => {};
    fakeWatcher.prototype.sampleProperty = null;

    const fakeWatcherInstance = new fakeWatcher();
    fakeWatcherInstance.testedProperty = null;
    fakeWatcherInstance.testedMethod = () => {};

    expect(typeof fakeWatcherInstance.sampleMethod).toEqual('function');
    expect(typeof fakeWatcherInstance.testedMethod).toEqual('function');
    expect(fakeWatcherInstance.sampleProperty).toEqual(null);
    expect(fakeWatcherInstance.testedProperty).toEqual(null);

    let cleanObject = rewriteSettings(fakeWatcherInstance);

    expect(typeof cleanObject.sampleMethod).toEqual('undefined');
    expect(typeof cleanObject.testedMethod).toEqual('function');
    expect(cleanObject.sampleProperty).toEqual(void 0);
    expect(cleanObject.testedProperty).toEqual(null);
    expect(Object.prototype.toString.call(cleanObject)).toEqual('[object Object]');
  });

  it('should rewrite the settings element passed to the watchers to be a clean array prepared to use withing Handsontable config, when the input element is an array', () => {
    const fakeWatcher = [];
    let cleanArray = rewriteSettings(fakeWatcher);

    expect(Object.prototype.toString.call(cleanArray)).toEqual('[object Array]');
  });
});

describe('hotInit', () => {
  it('should initialize Handsontable and assign it to the `table` property of the provided object', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent = {
      $el: document.getElementById('hotContainer')
    };

    expect(typeof fakeVueComponent.table).toEqual('undefined');

    hotInit.call(fakeVueComponent);

    expect(typeof fakeVueComponent.table).toEqual('object');
    expect(typeof fakeVueComponent.table.guid).toEqual('string');

    container.parentNode.removeChild(container);
  });
});

describe('hotDestroy', () => {
  it('should destroy the already existing Handsontable instance from the `table` property in the vue component object', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent = {
      $el: document.getElementById('hotContainer')
    };

    expect(typeof fakeVueComponent.table).toEqual('undefined');

    hotInit.call(fakeVueComponent);
    hotDestroy.call(fakeVueComponent);

    expect(typeof fakeVueComponent.table).toEqual('object');
    expect(fakeVueComponent.table.rootElement).toEqual(null);
    expect(fakeVueComponent.table.table).toEqual(null);

    container.parentNode.removeChild(container);
  });
});

describe('propFactory', () => {
  it('should generate an object containing all the available Handsontable properties and plugin hooks (with the `on`-prefixes added)', () => {
    const props = propFactory();

    expect(typeof props.startRows).toEqual('object');
    expect(typeof props.startCols).toEqual('object');
    expect(typeof props.data).toEqual('object');
    expect(typeof props.fixedRowsTop).toEqual('object');
    expect(typeof props.onAfterCreateRow).toEqual('object');
    expect(typeof props.onAfterGetCellMeta).toEqual('object');
    expect(typeof props.onBeforeInit).toEqual('object');
    expect(typeof props.randomProp).toEqual('undefined');
  });
});

describe('propWatchFactory', () => {
  it('should generate and object containing all the available Handsontable properties and hooks tied to the Handsontable updating function', () => {
    const bulkUpdateFunction = () => {};
    const func2 = () => {};
    const props = propWatchFactory(bulkUpdateFunction, func2);

    expect(typeof props.startRows).toEqual('object');
    expect(typeof props.startRows.handler).toEqual('function');
    expect(props.startRows.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.startCols).toEqual('object');
    expect(typeof props.startCols.handler).toEqual('function');
    expect(props.startCols.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.data).toEqual('object');
    expect(typeof props.data.handler).toEqual('function');
    expect(props.data.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.fixedRowsTop).toEqual('object');
    expect(typeof props.fixedRowsTop.handler).toEqual('function');
    expect(props.fixedRowsTop.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.onAfterCreateRow).toEqual('object');
    expect(typeof props.onAfterCreateRow.handler).toEqual('function');
    expect(props.onAfterCreateRow.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.onAfterGetCellMeta).toEqual('object');
    expect(typeof props.onAfterGetCellMeta.handler).toEqual('function');
    expect(props.onAfterGetCellMeta.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.onBeforeInit).toEqual('object');
    expect(typeof props.onBeforeInit.handler).toEqual('function');
    expect(props.onBeforeInit.toString().indexOf('bulkUpdateFunction') > -1).toBe(false);
    expect(typeof props.settings).toEqual('object');
    expect(typeof props.settings.handler).toEqual('function');
    expect(props.settings.handler.toString().indexOf('bulkUpdateFunction') > -1).toBe(true);
    expect(typeof props.randomProp).toEqual('undefined');
  });
});

describe('updateHotSettings', () => {
  it('should update the previously initialized Handsontable instance with a single changed property', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent = {
      $el: document.getElementById('hotContainer')
    };

    expect(typeof fakeVueComponent.table).toEqual('undefined');

    hotInit.call(fakeVueComponent);

    updateHotSettings.call(fakeVueComponent, 'startCols', 19, {});

    expect(fakeVueComponent.table.getSettings().startCols).toEqual(19);

    container.parentNode.removeChild(container);
  });
});

describe('updateBulkHotSettings', () => {
  it('should update the previously initialized Handsontable instance with a bulk `settings` property containing individual options', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent = {
      $el: document.getElementById('hotContainer')
    };

    expect(typeof fakeVueComponent.table).toEqual('undefined');

    hotInit.call(fakeVueComponent);

    updateBulkHotSettings.call(fakeVueComponent, 'settings', {
      startCols: 20,
      maxRows: 50,
      data: [['test']],
      contextMenu: true
    }, {});

    expect(fakeVueComponent.table.getSettings().startCols).toEqual(20);
    expect(fakeVueComponent.table.getSettings().maxRows).toEqual(50);
    expect(JSON.stringify(fakeVueComponent.table.getData())).toEqual('[["test"]]');
    expect(fakeVueComponent.table.getSettings().contextMenu).toEqual(true);

    container.parentNode.removeChild(container);
  });
});
