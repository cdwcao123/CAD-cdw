import type { McThroughParameter } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 创建穿层孔参数面板的独立初值，供钻场、巷道和修正入口共用。
 * 修正入口使用独立初值，只开放过煤长度、倾向终孔间距和巷道两侧范围。
 * @returns 本次面板独立持有的穿层孔参数对象；长度单位为米，角度单位为度。
 */
export declare function createThroughHoleParameters(): McThroughParameter;
