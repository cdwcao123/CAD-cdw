import { McColor, McMcdFiler, McMctfFiler } from 'McCore';
import { IMcGeoDrillDrillStratum } from '../types/interface';
/**
 * 钻探地层信息数据类
 */
export declare class McGeoDrillDrillStratum implements IMcGeoDrillDrillStratum {
    /** 唯一标识 */
    id: string;
    /** 岩层名称 */
    name: string;
    /** 层厚 */
    depth: number;
    /** 累计层厚 */
    sumDepth?: number;
    /** 真厚 */
    trueDepth: number;
    /** 累计真厚 */
    sumTrueDepth?: number;
    /** 岩心长度（采长）（m） */
    coreLength: number;
    /** 岩心采取率 */
    coreCollectRate: number;
    /** 岩心倾角 */
    coreAngle: number;
    /** 界 */
    rockBound: string;
    /** 系 */
    rockSystem: string;
    /** 统 */
    rockSeries: string;
    /** 组 */
    rockGroup: string;
    /** 段 */
    rockPart: string;
    /** 标志层 */
    markBed: string;
    /** 岩性描述 */
    remark: string;
    /** 颜色 */
    color: McColor;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcGeoDrillDrillStratum>);
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
