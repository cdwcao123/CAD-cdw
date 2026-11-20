import { McColor } from 'McCore';
import { McDbTunnelDrawStylePropertyEvent, McDbTunnelDrawStylePropertyType } from './enum';
/** 巷道绘制样式属性 */
type McDbTunnelDrawStyleProperty = {
    propertyType: McDbTunnelDrawStylePropertyType;
    enable?: boolean;
    value?: string | number | boolean | McColor | undefined;
};
/** 巷道绘制样式改变事件 */
type McDbTunnelDrawStyleChangeFun = (propertyType: McDbTunnelDrawStyleProperty) => void;
/** 巷道绘制样式初始化事件，用于通知UI更新属性显示值或状态 */
type McDbTunnelDrawStyleInitFun = (properties: McDbTunnelDrawStyleProperty[]) => void;
/** 巷道绘制样式面板事件 */
type McDbTunnelDrawStylePanelFun = (event: McDbTunnelDrawStylePropertyEvent) => void;
export type { McDbTunnelDrawStyleProperty, McDbTunnelDrawStyleChangeFun, McDbTunnelDrawStyleInitFun, McDbTunnelDrawStylePanelFun, };
