import { McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillInclinometerInfo } from '../types/interface';
/**
 * 测斜信息数据类
 */
export declare class McGeoDrillInclinometerInfo implements IMcGeoDrillInclinometerInfo {
    /** 唯一标识 */
    id: string;
    /** 测点深度 */
    measureDepth: number;
    /** 测点倾角 */
    dipAngle: number;
    /** 测点天顶角 */
    measureZenithAngle: number;
    /** 测点方位角 */
    measureAzimuth: number;
    /** 水平投影距离 */
    projection: number;
    /** 投影累计 */
    projectionSum: number;
    /** 垂距 */
    h: number;
    /** 垂距累计 */
    hSum: number;
    /** X偏移 */
    xOffset: number;
    /** X偏移累计 */
    xOffsetSum: number;
    /** Y偏移 */
    yOffset: number;
    /** Y偏移累计 */
    yOffsetSum: number;
    /** 孔斜累计 */
    dipAngleSum: number;
    /** 方位角累计 */
    measureAzimuthSum: number;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillInclinometerInfo>);
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
