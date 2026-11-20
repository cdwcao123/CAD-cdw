import type { McGeoFeatureClassStyleMap, McGeoStyleFeatureClassModel, McGeoStyleModelRecord, McGeoStyleOptionNode } from '../types/interface';
/**
 * 解析样式选项树 JSON 字符串
 * @param val StyleOptions 值（JSON 数组字符串或对象）
 * @returns 样式选项节点数组
 */
export declare const parseStyleOptions: (val: unknown) => McGeoStyleOptionNode[];
/**
 * 解析样式明细列表
 * @param list DataModelStyleFeatureClass/GetList 返回列表
 * @returns 样式明细数组（过滤空项）
 */
export declare const parseStyleFeatureClassList: (list: any[]) => McGeoStyleFeatureClassModel[];
/**
 * 解析 FeatureClassStyleIds 列表
 * @description 兼容数组与 JSON 字符串两种返回；条目标记兼容 ID/id、classID/classId。
 * @param val 原始值
 * @returns 归一化后的样式关联条目
 */
export declare const parseFeatureClassStyleIdList: (val: unknown) => Array<{
    ID?: string;
    classID?: string;
}>;
/**
 * 解析样式分类记录列表
 * @param list DataModelStyleModel/GetList 返回列表
 * @returns 样式分类记录数组
 */
export declare const parseStyleModelRecordList: (list: any[]) => McGeoStyleModelRecord[];
/**
 * 解析并消歧样式分类记录
 * @description 算法步骤：
 * 1. 只保留 ViewType === 'CAD' / '3D' 的记录，'2D' 记录忽略；
 * 2. 按归一化桶（CAD=二维，3D=三维）分组；
 * 3. 每桶内多条记录时取 IsDefault === 1 的记录（无 default 取第一条）。
 * @param records 样式分类记录数组
 * @returns 每桶最终选中的记录（最多 2 条）
 */
export declare const resolveSelectedStyleModelRecords: (records: McGeoStyleModelRecord[]) => McGeoStyleModelRecord[];
/**
 * 收集选中分类记录中出现的全部要素类 ID
 * @param records 选中后的样式分类记录
 * @returns 要素类 ID 列表（去重）
 */
export declare const collectClassIdsFromStyleRecords: (records: McGeoStyleModelRecord[]) => string[];
/**
 * 按要素类 + 二维/三维分组样式明细
 * @description 算法步骤：
 * 1. 以选中记录的 FeatureClassStyleIds 为唯一匹配表；
 * 2. 样式明细按 ID 匹配，匹配上则归入对应 classID 的二维/三维；
 * 3. 匹配不上的样式明细丢弃。
 * @param selectedRecords 选中后的样式分类记录
 * @param detailsByClassId 各要素类的样式明细（classID -> 明细列表）
 * @returns classID -> 二维/三维样式分组
 */
export declare const groupStyleDetails: (selectedRecords: McGeoStyleModelRecord[], detailsByClassId: Map<string, McGeoStyleFeatureClassModel[]>) => Map<string, McGeoFeatureClassStyleMap>;
