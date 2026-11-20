import type { McGeoFeatureClassSchema, McGeoFeatureClassSchemaItem, McGeoFeatureField, McGeoModelSchema } from '../types/interface';
/**
 * 安全去除首尾空白并转为字符串
 * @param value 任意值
 * @returns 规范化字符串
 */
export declare const normalizeText: (value: unknown) => string;
/**
 * 安全解析 JSON 字符串
 * @param val JSON 字符串或对象
 * @returns 解析后的对象，解析失败返回 null
 */
export declare const safeJsonParse: <T>(val: unknown) => T | null;
/**
 * 转为普通对象
 * @param val 任意值
 * @returns 普通对象，非对象时返回空对象
 */
export declare const toRecord: (val: unknown) => Record<string, unknown>;
/**
 * 归一化实体响应
 * @description 兼容 res.data / res.Data / res 多层包裹
 * @param res 接口响应
 * @returns 实体对象
 */
export declare const normalizeEntity: (res: any) => any;
/**
 * 归一化松散列表响应
 * @description 兼容 res.data.data / res.data.rows / res.data.Data 等多种返回结构
 * @param res 接口响应
 * @returns 列表数组
 */
export declare const normalizeLooseList: (res: any) => any[];
/**
 * 规范化字符串数组
 * @param val 字符串数组或字符串
 * @returns 过滤空字符串后的数组
 */
export declare const normalizeStringArray: (val: unknown) => string[];
/**
 * 判断对象是否为 Schema 描述对象（含 label/controlType 等关键字段）
 * @param val 任意值
 * @returns 是否为 Schema 描述对象
 */
export declare const isSchemaDescriptorObject: (val: unknown) => boolean;
/**
 * 从模型基础实体解析模型 Schema
 * @param entity 模型基础实体（GetEntity 响应）
 * @returns 模型 Schema，解析失败返回 null
 */
export declare const parseModelSchema: (entity: any) => McGeoModelSchema | null;
/**
 * 规范化单个要素类字段
 * @param key 字段名
 * @param val 字段值（描述对象或原始值）
 * @returns 规范化后的字段
 */
export declare const parseFeatureField: (key: string, val: unknown, formFieldMap?: Map<string, Record<string, unknown>>) => McGeoFeatureField;
/**
 * 规范化属性字段映射
 * @param schema AttrSchema 对象
 * @returns 属性字段列表
 */
export declare const parseFeatureFieldEntries: (schema: unknown, formFieldMap?: Map<string, Record<string, unknown>>) => McGeoFeatureField[];
/**
 * 规范化几何字段映射
 * @description 兼容 dwgMapId 直出坐标对象、以及 x/y/z 扁平结构
 * @param schema GeoSchema 对象
 * @returns 几何字段列表
 */
export declare const parseGeometryFieldEntries: (schema: unknown, formFieldMap?: Map<string, Record<string, unknown>>) => McGeoFeatureField[];
/**
 * 规范化要素数量关系文本
 * @param val FeatureCount 值
 * @returns 要素数量关系文本（默认 1:1）
 */
export declare const parseFeatureCount: (val: unknown) => string;
/**
 * 判断是否为单要素（1:1）
 * @param val FeatureCount 值
 * @returns 是否为单要素
 */
export declare const isSingleFeatureCount: (val: unknown) => boolean;
/**
 * 规范化要素类只读配置（Field2 中的 isReadOnly 等）
 * @param item 要素类原始项
 * @returns 是否只读
 */
export declare const parseFeatureReadOnly: (item: McGeoFeatureClassSchemaItem) => boolean;
/**
 * 规范化单个要素类 Schema 项
 * @param item 要素类原始项
 * @returns 规范化后的要素类 Schema，无 ClassName 时返回 null
 */
export declare const parseFeatureClassSchemaItem: (item: McGeoFeatureClassSchemaItem) => McGeoFeatureClassSchema | null;
/**
 * 规范化要素类 Schema 列表
 * @param items 要素类原始项列表
 * @returns 规范化后的要素类 Schema 列表
 */
export declare const parseFeatureClassSchemaList: (items: McGeoFeatureClassSchemaItem[]) => McGeoFeatureClassSchema[];
