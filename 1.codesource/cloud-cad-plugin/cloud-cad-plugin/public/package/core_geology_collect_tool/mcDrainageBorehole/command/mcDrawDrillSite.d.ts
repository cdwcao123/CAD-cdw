import { McCore } from 'McCore';
import { McDbDrillSite } from '../entity/mcDbDrillSite';
export declare function drawDrillSite(core: McCore, siteID: string | undefined): Promise<McDbDrillSite | null>;
/**
 * 选择钻场位置
 * @param core 核心对象
 * @returns 钻场实体
 */
export declare function pickDrillSite(core: McCore): Promise<McDbDrillSite | null>;
