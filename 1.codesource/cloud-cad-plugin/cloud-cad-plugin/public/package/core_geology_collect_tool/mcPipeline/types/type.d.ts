import { McColor } from 'McCore';
import { McDbPipelineDrawStylePropertyEvent, McDbPipelineDrawStylePropertyType } from './enum';
/** 巷道绘制样式属性 */
type McDbPipelineDrawStyleProperty = {
    propertyType: McDbPipelineDrawStylePropertyType;
    enable?: boolean;
    value?: string | number | boolean | McColor | undefined;
};
/** 巷道绘制样式改变事件 */
type McDbPipelineDrawStyleChangeFun = (propertyType: McDbPipelineDrawStyleProperty) => void;
/** 巷道绘制样式初始化事件，用于通知UI更新属性显示值或状态 */
type McDbPipelineDrawStyleInitFun = (properties: McDbPipelineDrawStyleProperty[]) => void;
/** 巷道绘制样式面板事件 */
type McDbPipelineDrawStylePanelFun = (event: McDbPipelineDrawStylePropertyEvent) => void;
export type { McDbPipelineDrawStyleProperty, McDbPipelineDrawStyleChangeFun, McDbPipelineDrawStyleInitFun, McDbPipelineDrawStylePanelFun, };
