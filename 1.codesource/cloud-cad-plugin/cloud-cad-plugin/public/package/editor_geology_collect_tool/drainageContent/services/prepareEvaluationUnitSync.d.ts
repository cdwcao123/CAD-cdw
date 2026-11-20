import type { DrainageSyncRow } from '../types/interface';
import type { McCore } from 'McCore';
/**
 * 提交前查询关联钻孔的真实服务端记录，所有评价单元预检通过后才返回待保存数据。
 * @param core 发起同步时的图纸内核；调用方须在异步返回后复核图纸与矿井未切换。
 * @param rows 本次选中的评价单元行。
 * @param mineCode 当前同步矿井编码，所有钻孔查询均限定在此矿井。
 * @returns 附带去重后的服务端钻孔 ID 的行副本；不写图纸或服务器。
 * @throws 查询失败、关联实体失效、钻孔未同步或匹配不唯一时阻止整批提交。
 */
export declare function prepareEvaluationUnitSync(core: McCore, rows: DrainageSyncRow[], mineCode: string): Promise<DrainageSyncRow[]>;
