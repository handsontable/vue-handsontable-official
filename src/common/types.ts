import Handsontable from 'handsontable';

export interface HotTableData {
  __internalEdit: boolean,
  hotInstance?: Handsontable
}

export interface HotTableMethods {
  hotInit: () => void
}

export interface HotTableProps extends Handsontable.DefaultSettings {
  id?: string,
  settings?: Handsontable.DefaultSettings
}

export type VueProps<T> = { [P in keyof T]: any };
