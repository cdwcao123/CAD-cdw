import { McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillBaseInfo } from '../types/interface';
/**
 * 地质钻孔基本信息数据类
 */
export declare class McGeoDrillBaseInfo implements IMcGeoDrillBaseInfo {
    /** 唯一标识 */
    id: string;
    /** 钻孔名称 */
    name: string;
    /** 钻孔类型 */
    drillType: string;
    /** 第一勘探线 */
    firstExplorationLine: string;
    /** 第二勘探线 */
    secondExplorationLine: string;
    /** 孔口坐标 */
    orificeCoord: McGeVector3;
    /** 见煤点标高(m) */
    coalSeamZ: number;
    /** 煤厚(m) */
    coalSeamThickness: number;
    /** 孔半径(mm) */
    radius: number;
    /** 终孔深度(m) */
    endHoleDepth: number;
    /** 开工日期 */
    startDate: string;
    /** 竣工日期 */
    endDate: string;
    /** 负责人 */
    leader: string;
    /** 地层倾角，单位:度，与水平面的夹角 */
    layerAngle: number;
    /** 终孔层位 */
    endSeam: string;
    /** 测井深度 */
    loggingLength: number;
    /** 测井日期 */
    loggingDate: string;
    /** 最终斜度,单位:度,与铅垂线的夹角，向下为正， 向上为负 */
    endAngle: number;
    /** 是否矿内孔('是'/'否') */
    isInMine: string;
    /** 是否斜孔('是'/'否') */
    isOblique: string;
    /** 施工目的 */
    target: string;
    /** 施工单位 */
    unit: string;
    /** 穿过煤层 */
    crossCoal: string[];
    /** 穿过层位 */
    crossLayer: string[];
    /** 技术员 */
    technician: string;
    /** 记录员 */
    recorder: string;
    /** 水文员 */
    hydrologyStaff: string;
    /** 测井员 */
    loggingPerson: string;
    /** 测井记录员 */
    loggingDescPerson: string;
    /** 说明 */
    remark: string;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillBaseInfo>);
    /**
     * 从 mctf 数据源读取字段值到当前对象
     * @param fields mctf 数据源
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 将当前对象的字段值写入 mctf 数据源
     * @param fields mctf 数据源
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从 mcd 数据流按顺序读取字段值到当前对象
     * @param fields mcd 数据流
     */
    mcdInFields(fields: McMcdFiler): void;
    /**
     * 将当前对象的字段值按顺序写入 mcd 数据流
     * @param fields mcd 数据流
     */
    mcdOutFields(fields: McMcdFiler): void;
}
