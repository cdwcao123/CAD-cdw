import { McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillCompletionStructure } from '../types/interface';
/**
 * 完井结构信息数据类
 */
export declare class McGeoDrillCompletionStructure implements IMcGeoDrillCompletionStructure {
    /** 唯一标识 */
    id: string;
    /** 一开孔径 */
    diameterFirst: number;
    /** 一开孔深 */
    depthFirst: number;
    /** 二开孔径 */
    diameterSecond: number;
    /** 二开孔深 */
    depthSecond: number;
    /** 表层套管直径 */
    surfaceCasingDiameter: number;
    /** 表层套管下入深度 */
    surfaceCasingDepth: number;
    /** 生产套管直径 */
    productCasingDiameter: number;
    /** 生产套管下入深度 */
    productCasingDepth: number;
    /** 水泥返高 */
    cementHeight: number;
    /** 遇阻深度 */
    stopDepth: number;
    /** 阻位 */
    stopPosition: number;
    /** 备注 */
    remark: string;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillCompletionStructure>);
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
