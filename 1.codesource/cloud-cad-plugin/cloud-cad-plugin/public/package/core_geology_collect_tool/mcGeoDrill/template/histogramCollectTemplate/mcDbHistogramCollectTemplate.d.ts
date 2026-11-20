import { McDbSymbolTableRecord, McMcdFiler, McMctfFiler } from 'McCore';
import { IColumnInfo } from '../../types/interface';
/**钻探地层属性 */
export declare const DrillStratumPropertyDefs: IColumnInfo[];
/**综合地层属性 */
export declare const ComplexStratumPropertyDefs: IColumnInfo[];
/**测井地层属性 */
export declare const LoggingStratumPropertyDefs: IColumnInfo[];
export declare enum HistogramCollectTemplateType {
    /**钻探地层模板 */
    Drill = "Drill",
    /**综合地层模板 */
    Complex = "Complex",
    /**测井地层模板 */
    Logging = "Logging"
}
/**
 * 钻孔柱状图岩层采集模板
 */
export declare class McDbHistogramCollectTemplate extends McDbSymbolTableRecord {
    /**对象类型*/
    protected readonly _type = "HistogramDbHistogramCollectTemplate";
    /**实体类名 */
    protected static readonly _className = "HistogramDbHistogramCollectTemplate";
    /**模板类型 */
    templateType: HistogramCollectTemplateType;
    /**列信息 */
    columns: IColumnInfo[];
    constructor(templateType: HistogramCollectTemplateType);
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
    createUnValidColumn(): IColumnInfo;
}
