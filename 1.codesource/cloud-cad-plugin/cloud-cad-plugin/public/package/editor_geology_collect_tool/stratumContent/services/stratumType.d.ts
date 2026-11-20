import type { StratumTypeOption } from '../../types';
/**
 * 获取地层类型下拉选项并复用进行中的请求。
 * 请求失败会清除缓存，确保后续打开弹框时可以重试。
 *
 * @returns 已过滤、排序并映射的地层类型选项。
 */
export declare const getStratumTypeOptions: () => Promise<StratumTypeOption[]>;
