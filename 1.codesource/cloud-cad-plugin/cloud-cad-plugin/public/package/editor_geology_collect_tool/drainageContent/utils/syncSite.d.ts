import type { DrainageServerContext, DrainageServerDrillSite } from '../types/interface';
/**
 * 将钻孔的钻场引用解析为服务端记录，优先使用服务端 ID 或设计来源 objectId。
 * @param siteID 本地钻场实体 ID；旧版同步导入的数据可能保存钻场编号。
 * @param tunnelID 钻孔所属巷道编码，限定关联范围。
 * @param context 当前矿井已读取的钻场关联表。
 * @returns 唯一对应的钻场；没有关联、尚未上传或关联重复时返回 undefined。
 */
export declare function resolveDrainageServerSite(siteID: string, tunnelID: string, context: DrainageServerContext): DrainageServerDrillSite | undefined;
