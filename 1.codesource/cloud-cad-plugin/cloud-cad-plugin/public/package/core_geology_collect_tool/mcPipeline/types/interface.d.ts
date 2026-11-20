import { McColor, IMcGeVector3, McGeVector3, McMctfFiler } from 'McCore';
import { McPipeSection, McPipeType, McPipeSide, McPipeFlow } from './enum';
declare class McComponentDir {
    /**管线编码 */
    pipe_code: string;
    /**元件管径 */
    compnent_radius: number;
    /**连接管线位置 */
    connect_position: McGeVector3;
    mctfOutFields(fields: McMctfFiler): void;
    mctfInFields(fields: McMctfFiler): void;
}
/**
 * 连接信息
 */
interface McCntInfo {
    /**连接的管线编码 */
    cnt_pipecode: string;
    /**连接点位置 */
    cnt_ptcode: string;
}
/**
 * 管线连接点数据结构数据结构
 */
interface McPipePtInfo {
    /**元件编码 */
    pt_code: string;
    /**连接点位置 */
    pt_position: McGeVector3;
    /**元件抬升 */
    pt_preraise: number;
    pt_nextraise: number;
    /**子管路数组 */
    pt_cntinfo: McCntInfo[];
}
/**
 * 管线数据结构
 */
interface IMcPipelineData {
    /** 管线编码 */
    pipeline_code: string;
    /** 管线名称 */
    pipeline_name: string;
    /** 管线路径 */
    pipeline_path?: IMcGeVector3[];
    /** 矿井编码*/
    MineCode?: string;
    /** 管线断面线*/
    pipeline_secpoly?: IMcGeVector3[];
    /** 元件中心点 */
    secenter?: IMcGeVector3;
    /** 管线偏移量 */
    pipeline_offset?: number;
    /** 管线断面类型 */
    pipeline_sectype?: McPipeSection;
    /**管径 （圆）*/
    radius?: number;
    /** 管线断面宽 （正方形，矩形）*/
    pipeline_width?: number;
    /** 管线断面高 （正方形，矩形）*/
    pipeline_height?: number;
    /** 管线颜色 */
    pipeline_color?: McColor;
    /** 管线类型 */
    pipeline_type?: McPipeType;
    /** 管线距离巷道底部间距 */
    pipelinejd?: number;
    /** 管线距巷道侧壁的间距 */
    pipelinejb?: number;
    /** 流向 */
    pipeline_flow?: McPipeFlow;
    /** 管线抬高 */
    pipeline_tg?: number;
    /**偏移向量 */
    offset_direct?: IMcGeVector3;
    /** 管线在巷道左邦还是右邦 */
    pipeline_side?: McPipeSide;
    /**巷道编码 */
    laneway_code?: string;
    /**子管路数组 */
    pipeline_cntpts?: McPipePtInfo[];
    /**元件编码字典 */
    map_cntpts?: Map<string, McPipePtInfo>;
}
/**
 * 巷道数据类
 */
declare class McPipelineData implements IMcPipelineData {
    pipeline_code: string;
    pipeline_name: string;
    pipeline_path?: IMcGeVector3[];
    MineCode?: string | undefined;
    pipeline_secpoly?: IMcGeVector3[] | undefined;
    secenter?: IMcGeVector3 | undefined;
    pipeline_offset?: number | undefined;
    pipeline_sectype?: McPipeSection | undefined;
    radius?: number | undefined;
    pipeline_width?: number | undefined;
    pipeline_height?: number | undefined;
    pipeline_color?: McColor | undefined;
    pipeline_connectstartcode?: string | undefined;
    pipeline_connectendcode?: string | undefined;
    pipeline_type?: McPipeType | undefined;
    pipelinejd?: number | undefined;
    pipelinejb?: number | undefined;
    pipeline_flow?: McPipeFlow | undefined;
    pipeline_tg?: number | undefined;
    offset_direct?: IMcGeVector3 | undefined;
    pipeline_side?: McPipeSide | undefined;
    laneway_code?: string | undefined;
    pipeline_cntpts?: McPipePtInfo[] | undefined;
    map_cntpts?: Map<string, McPipePtInfo> | undefined;
    constructor(data: IMcPipelineData);
}
/**
 * 巷道属性
 */
interface IMcPipelineProperty {
    /** 距底 */
    pipelinejd: number;
    /** 距壁 */
    pipelinejb: number;
    /** 管线断面类型 */
    pipeline_sectype?: McPipeSection;
    /**管径 （圆）*/
    radius?: number;
    /** 管线断面宽 （正方形，矩形）*/
    pipeline_width?: number;
    /** 管线断面高 （正方形，矩形）*/
    pipeline_height?: number;
    /** 管线颜色 */
    pipeline_color?: McColor;
    /** 管线类型 */
    pipeline_type?: McPipeType;
    /** 管线名称 */
    pipeline_name: string;
    /** 流向 */
    pipeline_flow?: McPipeFlow;
    /** 管线抬高 */
    pipeline_tg?: number;
    /**图层 */
    pipeline_layer?: string;
}
export { IMcPipelineData, McPipelineData, McCntInfo, McPipePtInfo, McComponentDir, IMcPipelineProperty, };
