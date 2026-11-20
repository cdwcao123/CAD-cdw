import { McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillCoalQuality } from '../types/interface';
/**
 * 煤质信息数据类
 */
export declare class McGeoDrillCoalQuality implements IMcGeoDrillCoalQuality {
    /** 唯一标识 */
    id: string;
    /** 煤层 */
    coalSeamCode: string;
    /** 采样编号 */
    samplingId: string;
    /** 采样起深 */
    samplingStartDepth: number;
    /** 采样止深 */
    samplingEndDepth: number;
    /** 采样长度 */
    samplingLength: number;
    /** 采样芯长 */
    samplingCoreLength: number;
    /** 采取率 */
    collectRate: number;
    /** 夹矸删除 */
    clipLiveDelete: number;
    /** 煤质指标 */
    coalQuality: string;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillCoalQuality>);
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
