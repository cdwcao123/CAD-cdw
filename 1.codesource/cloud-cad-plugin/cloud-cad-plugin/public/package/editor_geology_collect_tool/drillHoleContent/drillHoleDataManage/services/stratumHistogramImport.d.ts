import type { HistogramTemplateType } from '../../columnTemplateDataConfig/types';
import type { DrillHoleFeatureColumn } from '../types';
export type HistogramPickedRow = Record<string, string | number>;
/** 根据服务端要素类代码和名称确定其使用的 Core 柱状图模板类型。 */
export declare function resolveHistogramTemplateType(className: string, classLabel: string): HistogramTemplateType | undefined;
/**
 * 将 Core 拾取结果写入 SourceQuery 要素字段。
 * 未参与模板采集或无法对应的字段统一为空，拾取行不携带额外状态。
 */
export declare function mapHistogramRowsToFeatureFields(rows: HistogramPickedRow[], columns: DrillHoleFeatureColumn[]): Record<string, unknown>[];
