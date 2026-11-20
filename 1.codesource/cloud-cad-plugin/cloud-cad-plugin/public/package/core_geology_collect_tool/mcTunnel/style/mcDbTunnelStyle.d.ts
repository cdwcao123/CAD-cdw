import { McColor, McDbSymbolTableRecord, McMctfFiler } from 'McCore';
import { TunnelNodeAnnotationAttachment, TunnelNodeAnnotationDirect, TunnelNodeCoalType, TunnelNodeElevationSymbol, TunnelNodeElevationType } from '../types/enum';
import { McTunnelStyleProperty } from './mcTunnelStyleProperty';
/**
 * 巷道样式类
 */
export declare class McDbTunnelStyle extends McDbSymbolTableRecord {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 巷道样式属性 */
    protected tunnelStyleProperty: McTunnelStyleProperty;
    /**
     * 构造
     * @param name 样式名
     * @param reNameable 是否重命名
     */
    constructor(name?: string, reNameable?: boolean);
    /**
     * 创建默认样式
     * @returns 巷道样式
     */
    static createStandard(): McDbTunnelStyle;
    /**
     * 获取巷道样式属性
     * @returns 巷道样式属性
     */
    getTunnelStyleProperty(): McTunnelStyleProperty;
    /**
     * 是否显示中心线
     */
    getShowCenterLine(): boolean;
    /**
     * 获取巷道中心线颜色
     */
    getTunnelCenterLineColor(): McColor;
    /**
     * 获取是否显示邦线
     */
    getShowBorderLine(): boolean;
    /**
     * 获取巷道邦线颜色
     */
    getTunnelBorderLineColor(): McColor;
    /**
     * 获取是否显示巷道名称
     */
    getShowTunnelName(): boolean;
    /**
     * 获取是否显示导线点连线
     */
    getShowNodeLine(): boolean;
    /**
     * 获取导线点连线颜色
     */
    getTunnelNodeLineColor(): McColor;
    /**
     * 获取导线点名称文字样式
     */
    getTunnelNodeNameTextStyle(): string;
    /**
     * 获取导线点名称文字颜色
     */
    getTunnelNodeNameTextColor(): McColor;
    /**
     * 获取导线点名称文字高度
     */
    getTunnelNodeNameTextHeight(): number;
    /**
     * 获取导线点名称文字偏移距离
     */
    getTunnelNodeNameTextOffset(): number;
    /**
     * 获取是否启用导线点名称注记
     */
    getTunnelNodeNameEnable(): boolean;
    /**
     * 获取导线点名称注记方向
     */
    getTunnelNodeNameDirection(): TunnelNodeAnnotationDirect;
    /**
     * 获取导线点名称注记位置
     */
    getTunnelNodeNameTextAttachment(): TunnelNodeAnnotationAttachment;
    /**
     * 获取导线点高程文字样式
     */
    getTunnelNodeElevationTextStyle(): string;
    /**
     * 获取导线点高程文字颜色
     */
    getTunnelNodeElevationTextColor(): McColor;
    /**
     * 获取导线点高程文字高度
     */
    getTunnelNodeElevationTextHeight(): number;
    /**
     * 获取导线点高程文字偏移距离
     */
    getTunnelNodeElevationTextOffset(): number;
    /**
     * 获取导线点高程文字小数位数
     */
    getTunnelNodeElevationTextDecimalCount(): number;
    /**
     * 获取是否启用导线点高程注记
     */
    getTunnelNodeElevationEnable(): boolean;
    /**
     * 获取导线点高程注记方向
     */
    getTunnelNodeElevationDirection(): TunnelNodeAnnotationDirect;
    /**
     * 获取导线点高程注记位置
     */
    getTunnelNodeElevationTextAttachment(): TunnelNodeAnnotationAttachment;
    /**
     * 获取导线点高程符号
     */
    getTunnelNodeElevationSymbol(): TunnelNodeElevationSymbol;
    /**
     * 获取导线点高程类型
     */
    getTunnelNodeElevationType(): TunnelNodeElevationType;
    /**
     * 获取导线点煤层结构文字样式
     */
    getTunnelNodeCoalTextStyle(): string;
    /**
     * 获取导线点煤层结构文字颜色
     */
    getTunnelNodeCoalTextColor(): McColor;
    /**
     * 获取导线点煤层结构文字高度
     */
    getTunnelNodeCoalTextHeight(): number;
    /**
     * 获取导线点煤层结构文字偏移距离
     */
    getTunnelNodeCoalTextOffset(): number;
    /**
     * 获取导线点煤层结构文字行间距
     */
    getTunnelNodeCoalTextLineSpace(): number;
    /**
     * 获取是否启用导线点煤层结构注记
     */
    getTunnelNodeCoalEnable(): boolean;
    /**
     * 获取导线点煤层结构注记方向
     */
    getTunnelNodeCoalDirection(): TunnelNodeAnnotationDirect;
    /**
     * 获取导线点煤层结构注记位置
     */
    getTunnelNodeCoalTextAttachment(): TunnelNodeAnnotationAttachment;
    /**
     * 获取导线点煤层结构注记方式
     */
    getTunnelNodeCoalType(): TunnelNodeCoalType;
    /**
     * 获取导线点符号名称
     */
    getTunnelNodeSymbolName(): string;
    /**
     * 获取导线点符号宽度
     */
    getTunnelNodeSymbolWidth(): number;
    /**
     * 获取导线点符号高度
     */
    getTunnelNodeSymbolHeight(): number;
    /**
     * 获取导线点符号颜色
     */
    getTunnelNodeSymbolColor(): McColor;
    /**
     * 获取虚拟导线点符号名称
     */
    getTunnelVirtualNodeSymbolName(): string;
    /**
     * 获取虚拟导线点符号宽度
     */
    getTunnelVirtualNodeSymbolWidth(): number;
    /**
     * 获取虚拟导线点符号高度
     */
    getTunnelVirtualNodeSymbolHeight(): number;
    /**
     * 获取虚拟导线点符号颜色
     */
    getTunnelVirtualNodeSymbolColor(): McColor;
    /**
     * 获取竖井符号名称
     */
    getShaftTunnelSymbolName(): string;
    /**
     * 设置是否显示中心线
     */
    setShowCenterLine(value: boolean): void;
    /**
     * 设置巷道中心线颜色
     */
    setTunnelCenterLineColor(value: McColor): void;
    /**
     * 设置是否显示邦线
     */
    setShowBorderLine(value: boolean): void;
    /**
     * 设置巷道邦线颜色
     */
    setTunnelBorderLineColor(value: McColor): void;
    /**
     * 设置是否显示巷道名称
     */
    setShowTunnelName(value: boolean): void;
    /**
     * 设置是否显示导线点连线
     */
    setShowNodeLine(value: boolean): void;
    /**
     * 设置导线点连线颜色
     */
    setTunnelNodeLineColor(value: McColor): void;
    /**
     * 设置导线点<名称>样式
     */
    setTunnelNodeNameTextStyle(value: string): void;
    /**
     * 设置导线点<名称>文字颜色
     */
    setTunnelNodeNameTextColor(value: McColor): void;
    /**
     * 设置导线点<名称>文字高度
     */
    setTunnelNodeNameTextHeight(value: number): void;
    /**
     * 设置导线点<名称>文字偏移距离
     */
    setTunnelNodeNameTextOffset(value: number): void;
    /**
     * 设置启用注记导线点<名称>
     */
    setTunnelNodeNameEnable(value: boolean): void;
    /**
     * 设置导线点<名称>注记方向
     */
    setTunnelNodeNameDirection(value: TunnelNodeAnnotationDirect): void;
    /**
     * 设置导线点<名称>注记位置
     */
    setTunnelNodeNameTextAttachment(value: TunnelNodeAnnotationAttachment): void;
    /**
     * 设置导线点<高程>样式
     */
    setTunnelNodeElevationTextStyle(value: string): void;
    /**
     * 设置导线点<高程>文字颜色
     */
    setTunnelNodeElevationTextColor(value: McColor): void;
    /**
     * 设置导线点<高程>文字高度
     */
    setTunnelNodeElevationTextHeight(value: number): void;
    /**
     * 设置导线点<高程>文字偏移距离
     */
    setTunnelNodeElevationTextOffset(value: number): void;
    /**
     * 设置导线点<高程>文字小数位数
     */
    setTunnelNodeElevationTextDecimalCount(value: number): void;
    /**
     * 设置启用注记导线点<高程>
     */
    setTunnelNodeElevationEnable(value: boolean): void;
    /**
     * 设置导线点<高程>注记方向
     */
    setTunnelNodeElevationDirection(value: TunnelNodeAnnotationDirect): void;
    /**
     * 设置导线点<高程>注记位置
     */
    setTunnelNodeElevationTextAttachment(value: TunnelNodeAnnotationAttachment): void;
    /**
     * 设置导线点<高程>高程符号
     */
    setTunnelNodeElevationSymbol(value: TunnelNodeElevationSymbol): void;
    /**
     * 设置导线点<高程>高程类型
     */
    setTunnelNodeElevationType(value: TunnelNodeElevationType): void;
    /**
     * 设置导线点<煤层结构>样式
     */
    setTunnelNodeCoalTextStyle(value: string): void;
    /**
     * 设置导线点<煤层结构>文字颜色
     */
    setTunnelNodeCoalTextColor(value: McColor): void;
    /**
     * 设置导线点<煤层结构>文字高度
     */
    setTunnelNodeCoalTextHeight(value: number): void;
    /**
     * 设置导线点<煤层结构>文字偏移距离
     */
    setTunnelNodeCoalTextOffset(value: number): void;
    /**
     * 设置导线点<煤层结构>文字行间距
     */
    setTunnelNodeCoalTextLineSpace(value: number): void;
    /**
     * 设置启用注记导线点<煤层结构>
     */
    setTunnelNodeCoalEnable(value: boolean): void;
    /**
     * 设置导线点<煤层结构>注记方向
     */
    setTunnelNodeCoalDirection(value: TunnelNodeAnnotationDirect): void;
    /**
     * 设置导线点<煤层结构>注记位置
     */
    setTunnelNodeCoalTextAttachment(value: TunnelNodeAnnotationAttachment): void;
    /**
     * 设置导线点<煤层结构>注记方式
     */
    setTunnelNodeCoalType(value: TunnelNodeCoalType): void;
    /**
     * 设置导线点<符号>名称
     */
    setTunnelNodeSymbolName(value: string): void;
    /**
     * 设置导线点<符号>宽度
     */
    setTunnelNodeSymbolWidth(value: number): void;
    /**
     * 设置导线点<符号>高度
     */
    setTunnelNodeSymbolHeight(value: number): void;
    /**
     * 设置导线点<符号>颜色
     */
    setTunnelNodeSymbolColor(value: McColor): void;
    /**
     * 设置<虚拟>导线点<符号>名称
     */
    setTunnelVirtualNodeSymbolName(value: string): void;
    /**
     * 设置<虚拟>导线点<符号>宽度
     */
    setTunnelVirtualNodeSymbolWidth(value: number): void;
    /**
     * 设置<虚拟>导线点<符号>高度
     */
    setTunnelVirtualNodeSymbolHeight(value: number): void;
    /**
     * 设置<虚拟>导线点<符号>颜色
     */
    setTunnelVirtualNodeSymbolColor(value: McColor): void;
    /**
     * 设置竖井符号名称
     */
    setShaftTunnelSymbolName(value: string): void;
    /**
     * 更新引用对象的属性值 ,子类需重载该函数
     * @internal
     * @param changedOld 旧值
     * @param _changedNew 新值
     * */
    updateRefEntity(changedOld: Record<string, any>, _changedNew: Record<string, any>): Promise<void>;
    /**
     * 从外部mcd导入到当前样式
     */
    mctfInFields(fields: McMctfFiler): Promise<void>;
    /**
     * 当前实体的属性输出到外部
     */
    mctfOutFields(fields: McMctfFiler): void;
}
