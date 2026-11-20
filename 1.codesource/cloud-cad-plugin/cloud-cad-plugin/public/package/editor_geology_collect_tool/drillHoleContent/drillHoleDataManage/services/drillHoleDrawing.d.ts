import type { GisDrillRecord } from '../types';
import type { GeoDrillBaseInfo, GeoDrillStratum } from '@/utils/pluginApi';
/** Editor 数据源转换结果，与单孔交互命令的模板输入参数独立。 */
export interface DrillHoleDrawingData extends GeoDrillBaseInfo {
    crossCoal: string[];
    crossLayer: string[];
    drillStratums: GeoDrillStratum[];
}
/** 将服务器或文件记录转换为绘制参数，保留业务代码，并按岩层顺序装配。 */
export declare function toGeoDrillParams(record: GisDrillRecord): DrillHoleDrawingData;
