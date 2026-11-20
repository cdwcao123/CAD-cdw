import { type McCore } from 'McCore';
import { type McDbGeoDrillInstance } from '@/utils/pluginApi';
import type { BatchDrillHoleDrawingOptions } from './types';
import type { GisDrillRecord } from '../drillHoleDataManage/types';
/** 参照 testGeoDrill 创建单个钻孔实例，使用真实数据赋值，尚不入图。 */
export declare function createDrillHole(record: GisDrillRecord, options: BatchDrillHoleDrawingOptions): McDbGeoDrillInstance;
/** 读取图纸中的钻孔业务代码，供详情加载和入图前去重共用。 */
export declare function getExistingDrillHoleCodes(core: McCore): Set<string>;
/** 跳过已存在和本批重复的代码，再校验并装配新钻孔；不生成命令记录。 */
export declare function prepareBatchDrillHoles(core: McCore, records: GisDrillRecord[], options: BatchDrillHoleDrawingOptions): McDbGeoDrillInstance[];
/** 使用单实体入库接口生成正确的撤销回调，整批仍属于同一次命令。 */
export declare function drawBatchDrillHoles(core: McCore, records: GisDrillRecord[], options: BatchDrillHoleDrawingOptions, assertCurrent: () => void): Promise<number>;
