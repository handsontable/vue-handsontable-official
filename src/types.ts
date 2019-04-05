import Handsontable from 'handsontable';
import Vue, { VNode } from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { HotTableData, HotTableMethods, HotTableProps } from './types';

export interface HotTableData {
  __internalEdit: boolean,
  hotInstance?: Handsontable,
  columnSettings: HotTableProps[]
}

export interface HotTableMethods {
  hotInit: () => void,
  getColumnSettings: () => HotTableProps[] | void,
  updateHotSettings: (updatedProperty: string, updatedValue: object, oldValue: object) => void
}

export interface HotTableProps extends Handsontable.GridSettings {
  id?: string,
  settings?: Handsontable.DefaultSettings,
  wrapperRendererCacheSize?: number
}

export interface HotTableComponent<V extends Vue, D, M, C, P> extends ThisTypedComponentOptionsWithRecordProps<V, D, M, C, P> {
  version: string
}

export interface HotColumnMethods {
  createColumnSettings: () => void,
  getRendererWrapper: (vNode: VNode) => (...args) => HTMLElement,
  getEditorClass: (vNode: VNode) => typeof Handsontable.editors.BaseEditor
}

export interface SubComponentParent {
  $store?: any;
  $router?: any;
}

export interface EditorComponent extends Vue {
  focus(): void;
  open(event?: Event): void;
  close(): void;
  getValue(): any;
  setValue(newValue?: any): void;
  [additional: string]: any;
}

export type VueProps<T> = { [P in keyof T]: any };
