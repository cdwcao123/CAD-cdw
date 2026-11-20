import type { DrainageServerContext, DrainageSyncGroup, DrainageSyncResult, DrainageSyncRow } from '../types/interface';
import type { DrainageSyncDetail, DrainageSyncType } from '../types/type';
/**
 * 生成新增上传的批量业务键；巷道编码限定重号范围，不参与本地与服务端的 ID 配对。
 * @param detail 优先使用本地快照的钻场或钻孔详情。
 * @returns 包含巷道编码及业务编号的键；必要编号缺失时返回 undefined。
 */
export declare function getDrainageMatchKey(detail: DrainageSyncDetail): string | undefined;
/**
 * 将当前类型的服务端记录转换成统一详情快照，保留原始对象用于覆盖。
 * @param type 当前查询类型，决定钻场、钻孔或评价单元的快照转换规则。
 * @param context 当前矿井的服务端记录、钻场表与巷道关联表。
 * @returns 排除已删除记录的同步行，钻场和钻孔同 ID 保留最后一条；转换失败以行 issue 展示。
 */
export declare function createServerSyncRows(type: DrainageSyncType, context: DrainageServerContext): DrainageSyncRow[];
/**
 * 优先按服务端 ID 配对，再使用设计来源 objectId；评价单元新增由服务端生成 ID，按名称和边界唯一匹配。
 * @param localRows 当前图纸的钻场或钻孔同步行。
 * @param serverRows 同类型的服务端同步行。
 * @returns 四组：服务器全量数据、已关联实体的属性冲突及未关联的本地/服务器新增。
 */
export declare function compareDrainageRows(localRows: DrainageSyncRow[], serverRows: DrainageSyncRow[]): DrainageSyncGroup[];
/**
 * 将查询结果转换并与本地快照比较，供刷新和本地命令完成后复用。
 * @param type 当前同步类型，决定本地与服务器详情快照的业务结构。
 * @param local 当前图纸同类型的本地实体同步行。
 * @param context 当前矿井的服务端数据及关联映射。
 * @returns 按冲突、服务器全量、本地新增和服务器新增分类的结果。
 */
export declare function buildDrainageSyncResult(type: DrainageSyncType, local: DrainageSyncRow[], context: DrainageServerContext): DrainageSyncResult;
