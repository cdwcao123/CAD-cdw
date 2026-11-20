import { McDbCustomEntity, McDbDatabase, MCEntitySnapPoints, MCEntityStretchPoints } from 'McCore';
import { McTunnelNodeData } from '../types/interface';
import { McDbTunnel } from './mcDbTunnel';
/**
 * 巷道导线点实体类（McDbTunnelNode）
 *
 * 该类表示巷道中的导线点实体，继承自 `McDbCustomEntity`，用于在工业互联网操作系统平台的地质采集工具中描述巷道导线点的属性和行为。
 *
 * 主要功能：
 * - 存储导线点的基本属性（如名称、坐标、宽度、高度、煤层结构等）。
 * - 根据导线点类型和巷道配置，动态重构导线点的子实体（如块、线、文本等）。
 * - 支持导线点符号、颜色、文本标注等的自定义和自动布局。
 *
 * 主要属性：
 * - `index`：导线点在巷道中的索引。
 * - `name`：导线点名称。
 * - `leftSide`、`rightSide`：导线点左右邦宽度。
 * - `pointOrder`：导线点序号。
 * - `coalSeamStruct`：煤层结构描述。
 * - `bottomCoalThick`：底煤厚度。
 * - `traversePointType`：导线点类型（如默认、虚拟、停头等）。
 * - `x`、`y`、`z_top`、`z_bottom`：导线点空间坐标及标高。
 * - `tunnel`：所属巷道对象。
 * - `width`、`height`：导线点宽高。
 * - `position`：导线点三维空间位置。
 *
 * 主要方法：
 * - `rebuildChildEntity`：根据当前属性和巷道配置，重构导线点的子实体（如块、线、文本等）。
 * - `getNodeSymbolName`：获取导线点符号名称。
 * - `getNodeColor`：获取导线点颜色。
 * - `getOffsetPosition`：根据偏移和附加方式计算文本等实体的位置。
 *
 * 用法场景：
 * - 巷道导线点的可视化、编辑、标注等场景。
 * - 支持不同类型导线点的符号化和属性展示。
 *
 * @author wangshuaijun
 * @date 2026-04-02
 */
export declare class McDbTunnelNode extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 导线点数据 */
    protected data: McTunnelNodeData;
    /** 所属巷道 */
    protected tunnel: McDbTunnel;
    /**
     * 构造
     * @param tunnel 所在巷道
     * @param data 导线点数据
     * @param index 巷道中的索引
     */
    constructor(tunnel: McDbTunnel, data: McTunnelNodeData);
    /**
     * 获取导线点数据
     * @returns 导线点数据对象
     */
    getNodeData(): McTunnelNodeData;
    /**
     * 重构导线点子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 获取导线点符号名
     * @returns 导线点符号名
     */
    private getNodeSymbolName;
    /**
     * 获取导线点颜色
     * @returns 导线点颜色
     */
    private getNodeColor;
    /**
     * 获取偏移位置
     * @param pos 基准位置
     * @param front 前方向
     * @param offset 偏移量
     * @param attachment 附加方式
     * @returns 偏移后的位置
     */
    private getOffsetPosition;
    /**
     * 获取文本附着方式
     * @returns 文本附着方式
     */
    private getTextAttachment;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    protected createGrips(): void;
}
