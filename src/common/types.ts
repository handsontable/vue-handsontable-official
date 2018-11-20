import Handsontable from 'handsontable';
import Vue from 'vue';
import {ThisTypedComponentOptionsWithRecordProps} from 'vue/types/options';
import {HotTableData, HotTableMethods, HotTableProps} from './types';

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

export interface HotTableComponent<V, D, M, C, P> extends ThisTypedComponentOptionsWithRecordProps<Vue, HotTableData, HotTableMethods, {}, HotTableProps> {
  version: string
}

export type VueProps<T> = { [P in keyof T]: any };
