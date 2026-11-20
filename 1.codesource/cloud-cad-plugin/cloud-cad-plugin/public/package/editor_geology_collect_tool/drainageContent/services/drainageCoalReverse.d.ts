import type { DrainageCoalSegment, DrainageCoalStratum, DrainageDrawingContext, DrainageReverseCoalSegment, DrainageReversePlan } from '../types/interface';
/**
 * 每批钻孔反演前读取当前矿井地层，保留地层列表顺序并仅取煤层。
 * @returns 按 stratum_sort 升序排列的煤层资料；同序号保持接口顺序。
 * @throws 矿井上下文缺失、接口失败或字典缺少煤层类型时抛出错误，禁止使用旧列表继续反演。
 */
export declare function loadDrainageCoalStrata(): Promise<DrainageCoalStratum[]>;
/**
 * 沿用原项目数字/岩性拆分及两位小数长度算法，仅返回名称为“煤”的段。
 * @param text Excel 岩性原文，例如“0砂岩10煤20泥岩30煤60”。
 * @returns 按钻孔深度出现顺序排列的煤段；没有完整煤段时为空。
 */
export declare function parseDrainageCoalSegments(text: string): DrainageCoalSegment[];
/**
 * 为煤段匹配名称和编码；最长煤段对应工作面煤层，其他煤段按相对位置匹配。
 * @param strata 已按地层顺序筛出的煤层列表，不含岩层。
 * @param mainCode 工作面关联煤层编码，未配置时为空。
 * @param segments 从岩性提取、按深度顺序排列的完整煤段。
 * @returns 保留全部煤段及原始深度差，主煤层未匹配或前后越界时仅将名称、编码留空。
 */
export declare function matchDrainageCoalSegments(strata: DrainageCoalStratum[], mainCode: string, segments: DrainageCoalSegment[]): DrainageReverseCoalSegment[];
/**
 * 将煤层反演接入本批有效钻孔计划；单行异常不影响其他行，失败行禁止写入。
 * @param context 当前图纸上下文。
 * @param plans 坐标、轨迹反演后待写入的全部计划，可能包含原有错误行。
 * @param strata 本批次已加载的有序煤层资料。
 * @returns 无返回值，更新计划的煤层数据、显示结果或行错误。
 */
export declare function applyDrainageCoalReverse(context: DrainageDrawingContext, plans: DrainageReversePlan[], strata: DrainageCoalStratum[]): void;
