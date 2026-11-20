import { McGeVector3 } from 'McCore';
import { McFaultClassification, McFaultMode } from './enum';
/**
 * 断层数据结构
 */
interface IMcFaultData {
    /** 断层编码 */
    fault_code: string;
    /** 断层名称 */
    fault_name: string;
    /** 矿井编码*/
    mine_code?: string;
    /** 断层类型*/
    fault_mode?: McFaultMode;
    /** 断层走向延伸长度 */
    fault_length?: number;
    /** 断层走向 */
    fault_towards?: number;
    /**断层倾向*/
    fault_trend?: number;
    /** 断层倾角*/
    fault_angle?: number;
    /** 断层落差-最小值*/
    fault_drop_min?: number;
    /** 断层落差-最大值 */
    fault_drop_max?: number;
    /** 断层类型 */
    fault_type?: McFaultClassification;
    /** 垂直滑动方向 */
    fault_vert_direct?: string;
    /** 平措方向 */
    fault_hor_direct?: string;
    /** 平措距离 */
    fault_hor_dis?: number;
    /** 上盘坐标 */
    fault_hang?: McGeVector3[];
    /** 下盘坐标 */
    fault_bottom?: McGeVector3[];
    /** 边界 */
    fault_bodunary?: McGeVector3[];
    /**断开地层 */
    fault_stratums?: string[];
    /**揭露点 */
    fault_plane?: McGeVector3[];
    /**小断层坐标 */
    fault_point?: McGeVector3;
    /**显示文本 */
    fault_showtext?: boolean;
}
/**
 * 巷道数据类
 */
declare class McFaultData implements IMcFaultData {
    fault_code: string;
    fault_name: string;
    fault_mode?: McFaultMode | undefined;
    mine_code?: string | undefined;
    fault_length?: number;
    fault_towards: number | undefined;
    fault_trend: number | undefined;
    fault_angle: number | undefined;
    fault_drop_min?: number | undefined;
    fault_drop_max?: number | undefined;
    fault_type: McFaultClassification | undefined;
    fault_vert_direct?: string | undefined;
    fault_hor_direct?: string | undefined;
    fault_hor_dis?: number | undefined;
    fault_hang?: McGeVector3[];
    fault_bottom?: McGeVector3[];
    fault_bodunary?: McGeVector3[];
    fault_stratums?: string[];
    fault_plane?: McGeVector3[];
    fault_point?: McGeVector3 | undefined;
    fault_showtext?: boolean;
    constructor(data: IMcFaultData);
}
/**
 * 巷道属性
 */
interface IMcFaultProperty {
    /** 断面性质 */
    fault_type?: McFaultClassification | undefined;
    fault_name: string;
    fault_code: string;
    fault_towards: number | undefined;
    fault_trend: number | undefined;
    fault_angle: number | undefined;
    fault_drop_min?: number;
    fault_drop_max?: number;
    fault_vert_direct?: string;
    fault_hor_direct?: string;
    fault_hor_dis?: number;
    fault_stratums?: string[];
    fault_showtext?: boolean;
    elevation: number;
}
export { IMcFaultData, McFaultData, IMcFaultProperty, };
