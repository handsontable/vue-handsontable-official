import HotTableConstructor from '../src/HotTable.vue';

describe('hotInit', () => {
  it('should initialize Handsontable and assign it to the `table` property of the provided object', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent: any = {
      $el: document.getElementById('hotContainer'),
      settings: {
        licenseKey: 'non-commercial-and-evaluation'
      }
    };

    expect(typeof fakeVueComponent.hotInstance).toEqual('undefined');

    (HotTableConstructor as any).methods.hotInit.call(fakeVueComponent);

    expect(typeof fakeVueComponent.hotInstance).toEqual('object');
    expect(typeof fakeVueComponent.hotInstance.guid).toEqual('string');

    container.parentNode.removeChild(container);
  });
});

describe('updateHotSettings', () => {
  it('should update the previously initialized Handsontable instance with a single changed property', () => {
    const container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);

    const fakeVueComponent: any = {
      $el: document.getElementById('hotContainer'),
      settings: {
        licenseKey: 'non-commercial-and-evaluation'
      }
    };

    expect(typeof fakeVueComponent.hotInstance).toEqual('undefined');

    (HotTableConstructor as any).methods.hotInit.call(fakeVueComponent);

    (HotTableConstructor as any).methods.updateHotSettings.call(fakeVueComponent, 'startCols', 19, {});

    expect(fakeVueComponent.hotInstance.getSettings().startCols).toEqual(19);

    container.parentNode.removeChild(container);
  });
});
