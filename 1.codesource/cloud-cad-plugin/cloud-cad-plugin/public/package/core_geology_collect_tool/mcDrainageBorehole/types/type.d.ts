import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McGasAreaParameter, McAlongParameter, McSingleParameter, McThroughParameter, McSingleDirectionalParameter } from '../types/interface';
/** 钻孔空参数事件 */
type McBoreholeCallbackEvent = () => void;
/** 绘制单个钻孔事件 */
type McDrawSingleBoreholeEvent = (parameter: McSingleParameter) => void;
/** 绘制顺层钻孔事件 */
type McDrawAlongBoreholeEvent = (parameter: McAlongParameter) => void;
/** 绘制穿层钻孔事件 */
type McDrawThroughBoreholeEvent = (parameter: McThroughParameter) => void;
/** 绘制钻孔结束事件 */
type McFinishDrawBoreholeEvent = (drills: McDbDrainageBorehole[]) => void;
/** 绘制评价单元事件 */
type McDrawGasAreaEvent = (parameter: McGasAreaParameter) => void;
/** 参数改变事件 */
type McParameterChangeEvent = (key: string, value: any) => void;
/** 绘制单个定向钻孔事件 */
type McDrawSingleDirectionalBoreholeEvent = (parameter: McSingleDirectionalParameter) => void;
export type { McDrawSingleBoreholeEvent, McDrawAlongBoreholeEvent, McFinishDrawBoreholeEvent, McBoreholeCallbackEvent, McDrawThroughBoreholeEvent, McDrawGasAreaEvent, McParameterChangeEvent, McDrawSingleDirectionalBoreholeEvent, };
