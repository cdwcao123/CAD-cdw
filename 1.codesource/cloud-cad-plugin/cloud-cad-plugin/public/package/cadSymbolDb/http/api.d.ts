import { responseType } from 'McCore';
/**
 * 获取符号库分组数据
 */
declare const getSymbolGroupListApi: (param: any) => Promise<responseType<any[]>>;
/**
 * 新建分组
 */
declare const saveSymbolGroupApi: (param: any) => Promise<responseType<any>>;
/**
 * 获取所有的点符号数据
 */
declare const getPointSymbolListApi: (param: any) => Promise<responseType<any[]>>;
/**
 * 新建点符号数据
 */
declare const savePointSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 获取所有的线型符号数据
 */
declare const getLineSymbolListApi: (param: any) => Promise<responseType<any[]>>;
/**
 * 新建线符号数据
 */
declare const saveLineSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 获取所有的填充型符号数据
 */
declare const getInnerSymbolListApi: (param: any) => Promise<responseType<any[]>>;
/**
 * 新建填充符号数据
 */
declare const saveInnerSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 删除点符号数据
 */
declare const deletePointSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 删除线符号数据
 */
declare const deleteLineSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 删除填充符号数据
 */
declare const deleteInnerSymbolApi: (param: any) => Promise<responseType<any>>;
/**
 * 删除分组数据
 */
declare const deleteIGroupApi: (param: any) => Promise<responseType<any>>;
export { getSymbolGroupListApi, saveSymbolGroupApi, getPointSymbolListApi, savePointSymbolApi, getLineSymbolListApi, saveLineSymbolApi, getInnerSymbolListApi, saveInnerSymbolApi, deletePointSymbolApi, deleteLineSymbolApi, deleteInnerSymbolApi, deleteIGroupApi, };
