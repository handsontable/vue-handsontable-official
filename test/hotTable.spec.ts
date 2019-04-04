import HotTable from '../src/HotTable.vue';
import { mount } from '@vue/test-utils';
import { createSampleData } from './_helpers';

describe('hotInit', () => {
  it('should initialize Handsontable and assign it to the `hotInstace` property of the provided object', () => {
    let testWrapper = mount(HotTable, {
      propsData: {
        data: createSampleData(1, 1),
        licenseKey: 'non-commercial-and-evaluation'
      }
    });

    expect(typeof testWrapper.vm.hotInstance).toEqual('object');
    expect(testWrapper.vm.hotInstance.getDataAtCell(0, 0)).toEqual('0-0');
  });
});

describe('updateHotSettings', () => {
  it('should update the previously initialized Handsontable instance with a single changed property', () => {
    let updateSettingsCalls = 0;
    let testWrapper = mount(HotTable, {
      propsData: {
        data: createSampleData(1, 1),
        licenseKey: 'non-commercial-and-evaluation',
        rowHeaders: true,
        afterUpdateSettings: function () {
          updateSettingsCalls++;
        }
      }
    });

    expect(testWrapper.vm.hotInstance.getSettings().rowHeaders).toEqual(true);

    testWrapper.setProps({
      rowHeaders: false
    });

    expect(updateSettingsCalls).toEqual(1);
    expect(testWrapper.vm.hotInstance.getSettings().rowHeaders).toEqual(false);
  });
});
