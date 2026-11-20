import { McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillDrillingSchedule } from '../types/interface';
/**
 * 打钻进度信息数据类
 */
export declare class McGeoDrillDrillingSchedule implements IMcGeoDrillDrillingSchedule {
    /** 唯一标识 */
    id: string;
    /** 打钻深度 */
    drillingDepth: number;
    /** 时间(分钟) */
    drillTime: number;
    /** 备注 */
    remark: string;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillDrillingSchedule>);
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
