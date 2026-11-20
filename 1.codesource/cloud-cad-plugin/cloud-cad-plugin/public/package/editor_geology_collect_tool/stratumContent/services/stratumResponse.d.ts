import type { StratumLinkVertexData, StratumListResponse, StratumModel } from '../../types';
import type { responseType } from 'McCore';
/**
 * 校验地层列表的双层响应并提取包装项数组。
 *
 * @param response 地层列表接口原始响应。
 * @returns 服务端列表；非数组数据按空列表处理。
 * @throws 外层业务码不是 200 时抛出服务端错误信息。
 */
export declare const getStratumResponseData: (response: responseType<responseType<StratumListResponse>>) => StratumListResponse[];
/**
 * 校验关联顶点响应并提取顶点数组。
 *
 * @param response 关联顶点接口原始响应。
 * @returns 顶点数组；非数组数据按空列表处理。
 * @throws 业务码不是 0 时抛出服务端错误信息。
 */
export declare const getStratumLinkVertexResponseData: (response: responseType<StratumLinkVertexData[]>) => StratumLinkVertexData[];
/**
 * 将单个列表包装项转换为地层模型。
 * 外层 Id 是列表项标识；configinfo 未携带 Id 时必须回填，保证选择和更新逻辑稳定。
 *
 * @param item 服务端地层列表包装项。
 * @returns 已补齐 Id 的地层模型。
 */
export declare const getStratumModel: (item: StratumListResponse) => StratumModel;
/**
 * @param items 服务端地层列表包装项。
 * @returns 批量映射得到的地层模型。
 */
export declare const getStratumModels: (items: StratumListResponse[]) => StratumModel[];
