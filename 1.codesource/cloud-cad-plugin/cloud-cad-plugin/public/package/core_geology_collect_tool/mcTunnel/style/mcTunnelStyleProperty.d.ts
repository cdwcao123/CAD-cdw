import { McColor, McMcdFiler, McMctfFiler } from 'McCore';
import { TunnelNodeAnnotationDirect, TunnelNodeAnnotationAttachment, TunnelNodeElevationSymbol, TunnelNodeElevationType, TunnelNodeCoalType } from '../types/enum';
import { IMcTunnelProperty } from '../types/interface';
/**
 * 巷道样式属性类
 * @description 该类包含巷道样式的所有属性，提供默认值初始化方法，方便创建样式实例
 */
export declare class McTunnelStyleProperty implements IMcTunnelProperty {
    showCenterLine: boolean;
    tunnelCenterLineColor: McColor;
    showBorderLine: boolean;
    tunnelBorderLineColor: McColor;
    showTunnelName: boolean;
    showNodeLine: boolean;
    tunnelNodeLineColor: McColor;
    tunnelNodeNameTextStyle: string;
    tunnelNodeNameTextColor: McColor;
    tunnelNodeNameTextHeight: number;
    tunnelNodeNameTextOffset: number;
    tunnelNodeNameEnable: boolean;
    tunnelNodeNameDirection: TunnelNodeAnnotationDirect;
    tunnelNodeNameTextAttachment: TunnelNodeAnnotationAttachment;
    tunnelNodeElevationTextStyle: string;
    tunnelNodeElevationTextColor: McColor;
    tunnelNodeElevationTextHeight: number;
    tunnelNodeElevationTextOffset: number;
    tunnelNodeElevationTextDecimalCount: number;
    tunnelNodeElevationEnable: boolean;
    tunnelNodeElevationDirection: TunnelNodeAnnotationDirect;
    tunnelNodeElevationTextAttachment: TunnelNodeAnnotationAttachment;
    tunnelNodeElevationSymbol: TunnelNodeElevationSymbol;
    tunnelNodeElevationType: TunnelNodeElevationType;
    tunnelNodeCoalTextStyle: string;
    tunnelNodeCoalTextColor: McColor;
    tunnelNodeCoalTextHeight: number;
    tunnelNodeCoalTextOffset: number;
    tunnelNodeCoalTextLineSpace: number;
    tunnelNodeCoalEnable: boolean;
    tunnelNodeCoalDirection: TunnelNodeAnnotationDirect;
    tunnelNodeCoalTextAttachment: TunnelNodeAnnotationAttachment;
    tunnelNodeCoalType: TunnelNodeCoalType;
    tunnelNodeSymbolName: string;
    tunnelNodeSymbolWidth: number;
    tunnelNodeSymbolHeight: number;
    tunnelNodeSymbolColor: McColor;
    tunnelVirtualNodeSymbolName: string;
    tunnelVirtualNodeSymbolWidth: number;
    tunnelVirtualNodeSymbolHeight: number;
    tunnelVirtualNodeSymbolColor: McColor;
    shaftTunnelSymbolName: string;
    /**
     * 构造函数
     * @description 当init为true时，所有属性将被初始化为默认值；当init为false时，所有属性将保持undefined，用户需要手动设置属性值
     */
    constructor();
    /**
     * 复制样式属性
     * @param property 要复制的样式属性对象，将该对象的属性值复制到当前对象中，覆盖当前对象的属性值
     */
    copy(property: McTunnelStyleProperty): void;
    /**
     * 克隆当前样式属性对象，返回一个新的对象实例，属性值与当前对象相同
     * @returns 克隆当前样式属性对象，返回一个新的对象实例，属性值与当前对象相同
     */
    clone(): McTunnelStyleProperty;
    /**
     * 从外部mcd导入到当前样式
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
}
