import type { DrainageCloudCadResponse, DrainageContextLoader, DrainageServerContext, DrainageServerDrillSite, DrainageTunnelLookup } from '../types/interface';
import type { DrainageSyncType } from '../types/type';
/**
 * 按同步界面类型请求服务器数据，复用 package 的 token 和错误拦截器。
 * @param type 同步面板当前选择的数据类别。
 * @param mineCode 当前工作区矿井编码，由调用方读取 AreaCode 后传入。
 * @returns 业务成功响应中的真实数据数组；“钻孔”合并穿层、顺层、定向及高位四类结果。
 * @throws 矿井编码为空时抛错；任一孔型请求失败时整次读取失败，避免用不完整数据判断同步状态。
 */
export declare function fetchServerDrainageData(type: DrainageSyncType, mineCode: string): Promise<NonNullable<DrainageCloudCadResponse['data']>>;
/**
 * 并行读取当前类型和关联数据；钻场类型的 records/sites 共用一份请求结果。
 * 巷道关联用于显示名称及上传时把业务编码转换为 GUID，其查询失败不应吞掉已返回的服务器实体。
 * @param type 当前同步类型，评价单元不加载关联表。
 * @param mineCode 当前工作区矿井编码。
 * @param tunnelsPromise 当前会话已缓存的巷道查询，可不提供。
 * @param sitesPromise 当前会话已缓存的钻场查询，可不提供。
 * @returns 当前类型原始记录及供钻孔关联使用的钻场、巷道表。
 * @throws 当前类型或钻场关联查询失败时向调用方传递错误；巷道关联失败记录在返回上下文中。
 */
export declare function loadServerDrainageContext(type: DrainageSyncType, mineCode: string, tunnelsPromise?: Promise<DrainageTunnelLookup[]>, sitesPromise?: Promise<DrainageServerDrillSite[]>): Promise<DrainageServerContext>;
/**
 * 单个面板会话按矿井复用钻场和巷道关联；矿井变化或请求失败后清除对应缓存。
 * @returns 按矿井缓存关联查询并允许写入钻场后使缓存失效的加载器。
 */
export declare function createDrainageContextLoader(): DrainageContextLoader;
