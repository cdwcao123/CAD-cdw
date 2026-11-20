import { McColor } from 'McCore';
import { McDbFaultDrawStylePropertyEvent, McDbFaultDrawStylePropertyType } from './enum';
/** 断层绘制样式属性 */
type McDbFaultDrawStyleProperty = {
    propertyType: McDbFaultDrawStylePropertyType;
    enable?: boolean;
    value?: string | number | boolean | McColor | undefined;
};
/** 断层绘制样式改变事件 */
type McDbFaultDrawStyleChangeFun = (propertyType: McDbFaultDrawStyleProperty) => void;
/** 断层绘制样式初始化事件，用于通知UI更新属性显示值或状态 */
type McDbFaultDrawStyleInitFun = (properties: McDbFaultDrawStyleProperty[]) => void;
/** 断层绘制样式面板事件 */
type McDbFaultDrawStylePanelFun = (event: McDbFaultDrawStylePropertyEvent) => void;
export type { McDbFaultDrawStyleProperty, McDbFaultDrawStyleChangeFun, McDbFaultDrawStyleInitFun, McDbFaultDrawStylePanelFun, };
