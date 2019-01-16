import Handsontable from 'handsontable';
import Vue, { VNode } from 'vue';
import {ThisTypedComponentOptionsWithRecordProps} from 'vue/types/options';
import {HotTableData, HotTableMethods, HotTableProps} from './types';

export interface HotTableData {
  __internalEdit: boolean,
  hotInstance?: Handsontable,
  columnSettings: any
}

export interface HotTableMethods {
  hotInit: () => void,
  getColumnSettings: () => any
}

export interface HotTableProps extends Handsontable.DefaultSettings {
  id?: string,
  settings?: Handsontable.DefaultSettings
}

export interface HotTableComponent<V extends Vue, D, M, C, P> extends ThisTypedComponentOptionsWithRecordProps<V, D, M, C, P> {
  version: string
}

export interface HotColumnMethods {
  createColumnSettings: () => void,
  hasColumnProp: (type: string) => boolean,
  getRendererWrapper: (VNode: VNode) =>  (...args) => HTMLElement,
  getEditorClass: (VNode: VNode) => CustomEditorClass
}

export interface CustomEditorClass extends Handsontable._editors.Base {

}

export interface SubComponentParent {
  $store?: any;
  $router?: any;
}

export type VueProps<T> = { [P in keyof T]: any };
