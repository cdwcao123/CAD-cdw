import { McGeoStyle } from '../style/mcGeoStyle';
import { McGeoViewType } from '../types/enum';
import type { McGeoFeatureClassSchema, McGeoFeatureClassStyleMap, McGeoModelSchema, McGeoModelUIExchangeInfo, McGeoStyleOptionNode } from '../types/interface';
import type { McGeoFieldMap } from '../types/type';
/**
 * 将样式选项节点名称映射为 McGeoStyle 内部属性名（绘制与特性面板共用同一映射表）
 * @param nodeName 样式选项节点名称（如 StrokeColor / fillColor）
 * @returns 内部属性名（如 lineColor / fillColor）；未匹配时返回空字符串
 */
export declare const mapStyleNodeNameToProperty: (nodeName: string) => string;
/**
 * 统一推断样式类型名称（与 GeoModelStyleType 枚举 key 一致）
 * @description 内核样式创建与特性面板绑定共用同一套推断逻辑，保证 binding.styleType
 * 与实际 McGeoStyle.type 严格对应，避免面填充色与文字填充色等同名属性互串。
 *   1. 优先按 SLD 标准命名（PolygonSymbolizer / TextSymbolizer 等）识别；
 *   2. 回退按中文 label 识别（面/线/点/文字/栅格），兼容后端数据命名习惯。
 * @param node 样式选项节点
 * @returns GeoModelStyleType 枚举名称（Point / Line / Polygon / Raster / Text），无法识别时返回空串
 */
export declare const inferStyleTypeName: (node: McGeoStyleOptionNode) => string;
/**
 * 将样式选项树转换为内核 McGeoStyle 列表
 * @param options 样式选项树
 * @param viewType 视图类型（CAD=二维 / 3D=三维）
 * @returns McGeoStyle 列表
 */
export declare const convertStyleOptionsToMcGeoStyles: (options: McGeoStyleOptionNode[], viewType: McGeoViewType) => McGeoStyle[];
/**
 * 组装模型基础属性字段
 * @param modelSchema 模型基础 Schema
 * @returns 模型基础属性字段映射
 */
export declare const buildMetaDataFields: (modelSchema: McGeoModelSchema | null) => McGeoFieldMap;
/**
 * 组装要素类样式映射（classID -> McGeoStyle[]）
 * @param featureClassStyles 样式分类结果
 * @returns classID -> McGeoStyle[] 映射
 */
export declare const buildFeatureClassStyles: (featureClassStyles: Map<string, McGeoFeatureClassStyleMap>) => Map<string, McGeoStyle[]>;
/**
 * 组装要素类字段映射（classID -> 要素字段默认值映射）
 * @description 直接使用要素类 Schema 的属性字段与几何字段，
 * 供绘制新要素时作为初始 fields 使用。
 * @param featureClasses 要素类 Schema 列表
 * @returns classID -> McGeoFieldMap 映射
 */
export declare const buildFeatureClassFields: (featureClasses: McGeoFeatureClassSchema[]) => Map<string, McGeoFieldMap>;
/**
 * 组装 UI 交互信息（exchangeInfo）
 * @param modelSchema 模型基础 Schema
 * @param featureClasses 要素类 Schema 列表
 * @param featureClassStyles 样式分类结果
 * @returns UI 交互信息
 */
export declare const buildExchangeInfo: (modelSchema: McGeoModelSchema | null, featureClasses: McGeoFeatureClassSchema[], featureClassStyles: Map<string, McGeoFeatureClassStyleMap>) => McGeoModelUIExchangeInfo;
