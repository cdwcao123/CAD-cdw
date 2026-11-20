import type { DrillHoleFeatureClass, DrillHoleFeatureColumn, DrillHoleSelectOption, DrillHoleFeatureTab, DrillHoleRockDisplayRow, DrillHoleRow } from '../types';
/**
 * 解析一个要素类的 JSON 字段 Schema，仅保留服务端声明为列表可见的字段。
 * @param schemaText JSON 字符串形式的要素类字段配置。
 * @param className 当前要素类代码。
 * @param fieldOptions 要素类字段对应的动态下拉选项。
 * @param includeHidden 是否同时返回未配置为列表显示的字段，导入完整记录时使用。
 * @returns 按服务端配置顺序排列的字段列。
 * @throws Schema 不是合法 JSON 或字段结构不符合接口契约时抛出错误。
 */
export declare function parseDrillHoleFeatureColumns(schemaText: string, className?: string, fieldOptions?: Record<string, DrillHoleSelectOption[]>, includeHidden?: boolean): DrillHoleFeatureColumn[];
/**
 * 将 SourceQuery 详情中的要素类与字段 Schema 转为动态 Tab 数据。
 * 钻探地层由现有岩层表格负责，因此这里只生成其后的业务 Tab。
 * @param row 已加载 SourceQuery 要素详情的钻孔行。
 * @param fieldOptions 要素字段动态下拉选项。
 * @returns 保持服务端 featureClasses 顺序的动态 Tab。
 * @throws 任一业务要素类缺少字段 Schema 或 Schema 解析失败时抛出错误。
 */
export declare function buildDrillHoleFeatureTabs(row: Partial<DrillHoleRow>, fieldOptions?: Record<string, DrillHoleSelectOption[]>): DrillHoleFeatureTab[];
/**
 * 将 SourceQuery 的 rock_stratum 要素映射为现有岩层表格显示行。
 * @param featureClasses 当前钻孔的全部要素类。
 * @param drillHoleCode 当前钻孔主键。
 * @returns 按岩层顺序升序排列的钻探地层显示数据。
 */
export declare function buildDrillHoleRockRows(featureClasses: DrillHoleFeatureClass[], drillHoleCode: string): DrillHoleRockDisplayRow[];
/**
 * 格式化动态要素表格单元格，数组和对象按 JSON 展示以保留接口信息。
 * @param value 要素属性原值。
 * @returns 可直接用于表格单元格的文本。
 */
export declare function formatDrillHoleFeatureValue(value: unknown): string;
