export declare class McGeoDrillRockBaseInfo {
    /** 唯一标识 */
    id?: string;
    /** 岩层名称 */
    name: string;
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
    color?: McColor;
    entity?: McDbEntity;
}
