import { McCore } from 'McCore';
import { StratumType } from '../entity/mcDbGeoDrill';
export interface GeoDrillParams {
    /**钻孔名称*/
    name: string;
    /**
     * 平面钻孔模板名称
     */
    planeTemplate: string;
    /**模板参数值*/
    templateValues: Record<string, any>;
    /**钻孔深度(m)*/
    endHoleDepth: number;
    /**孔径(mm) */
    radius: number;
    /**当前要显示层类型，标志层 还是岩层*/
    curStratumType: StratumType;
    /**当前要显示的标志层名称*/
    curShowStratum: string;
}
/**
 * 绘制地质钻孔
 */
export declare function drawGeoDrill(core: McCore, drawParam?: GeoDrillParams): Promise<void>;
export declare function testGeoDrill(core: McCore): Promise<void>;
/**
 * 交互钻孔柱状图中采集岩层数据
 * @param core
 * @param columns 采集的列名
 * @returns
 */
export declare function collectRockStratumFromColumnarSection(core: McCore, histogramCollectTemplateName: string): Promise<Array<Record<string, string | number>>>;
