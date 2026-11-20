import { responseType } from 'McCore';
import type { IdNameItem, LabelValueItem } from '../types/interface';
/**
 * 获取符号库分组数据
 */
declare const getWorkingFaceApi: (param: any) => Promise<responseType<any[]>>;
declare const getDictsApi: (code: string) => Promise<any[]>;
declare const getDataSourceDataListApi: (code: string) => Promise<any[]>;
/**
 * 获取字典数据
 */
declare const getDataModelBaseInfoApi: (param: any) => Promise<responseType<any[]>>;
/**
 * 根据id获取资源
 */
declare const getResourceModelApi: (id: string) => Promise<responseType<any>>;
declare const getDataModelBaseInfoList: (query?: any) => Promise<any[]>;
declare const getResourceModelData: (modelId: string) => Promise<any[]>;
declare const getDictLabelValueItems: (code: string) => Promise<LabelValueItem[]>;
declare const getDataSourceLabelValueItems: (code: string) => Promise<LabelValueItem[]>;
declare const getWorkingFaceLabelValueItems: (params: any) => Promise<LabelValueItem[]>;
declare const toIdNameItems: (modelData: any[]) => IdNameItem[];
declare const getIdNameItemsByModelNames: (modelNames: string[], query?: any) => Promise<Record<string, IdNameItem[]>>;
declare const getHorizontalAndMiningAreaIdNameItems: (query?: any) => Promise<{
    horizontal: IdNameItem[];
    miningArea: IdNameItem[];
}>;
export { getWorkingFaceApi, getDictsApi, getDataSourceDataListApi, getDataModelBaseInfoApi, getResourceModelApi, getDataModelBaseInfoList, getResourceModelData, getHorizontalAndMiningAreaIdNameItems, getDictLabelValueItems, getDataSourceLabelValueItems, getWorkingFaceLabelValueItems, getIdNameItemsByModelNames, toIdNameItems, };
